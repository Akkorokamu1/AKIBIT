import express, { type Express } from "express";
import fs from "fs";
import { type Server } from "http";
import { pathToFileURL } from "url";
import path from "path";
import { createServer as createViteServer } from "vite";
import viteConfig from "../../vite.config";
import { preparePage } from "../page";

export async function setupVite(app: Express, server: Server) {
  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: { middlewareMode: true, hmr: { server }, allowedHosts: true },
    appType: "custom",
  });
  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    if (req.method !== "GET" && req.method !== "HEAD")
      return res.status(404).json({ message: "Not found" });
    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html"
      );
      const template = await fs.promises.readFile(clientTemplate, "utf-8");
      const transformed = await vite.transformIndexHtml(
        req.originalUrl,
        template
      );
      const renderer = await vite.ssrLoadModule("/src/entry-server.tsx");
      const pathname = req.originalUrl.split("?")[0];
      const page = preparePage(
        transformed,
        pathname,
        renderer.render(pathname)
      );
      res
        .status(page.status)
        .set({ "Content-Type": "text/html" })
        .end(page.html);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(import.meta.dirname, "public");
  app.use(express.static(distPath, { index: false }));
  app.use("*", async (req, res, next) => {
    if (req.method !== "GET" && req.method !== "HEAD")
      return res.status(404).json({ message: "Not found" });
    try {
      const template = await fs.promises.readFile(
        path.join(distPath, "index.html"),
        "utf-8"
      );
      const renderer = await import(
        pathToFileURL(path.join(import.meta.dirname, "renderer.js")).href
      );
      const pathname = req.originalUrl.split("?")[0];
      const page = preparePage(template, pathname, renderer.render(pathname));
      res.status(page.status).type("html").send(page.html);
    } catch (error) {
      next(error);
    }
  });
}
