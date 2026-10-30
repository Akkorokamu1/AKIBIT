import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { serveStatic, setupVite } from "./vite";
import { enquiryRouter } from "../enquiries";

async function startServer() {
  const app = express();
  const server = createServer(app);
  app.disable("x-powered-by");
  app.use((_req, res, next) => {
    res.set("X-Content-Type-Options", "nosniff");
    res.set("Referrer-Policy", "strict-origin-when-cross-origin");
    next();
  });
  app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
  app.use("/api/enquiries", enquiryRouter);
  app.use("/api", (_req, res) =>
    res.status(404).json({ message: "Endpoint not found." })
  );
  if (process.env.NODE_ENV === "development") await setupVite(app, server);
  else serveStatic(app);
  const errorHandler: express.ErrorRequestHandler = (
    error,
    _req,
    res,
    _next
  ) => {
    const status =
      error?.type === "entity.too.large"
        ? 413
        : error instanceof SyntaxError
          ? 400
          : 500;
    if (status === 500) console.error("[Request] Unhandled server error");
    res
      .status(status)
      .json({
        message:
          status === 413
            ? "Your enquiry is too large. Please shorten it and try again."
            : status === 400
              ? "Invalid request. Please check your details."
              : "Something went wrong. Please try again later.",
      });
  };
  app.use(errorHandler);
  const port = Number(process.env.PORT || "3000");
  if (!Number.isInteger(port) || port < 1 || port > 65535)
    throw new Error("Invalid PORT");
  server.on("error", error => {
    console.error("Server failed:", error.message);
    process.exit(1);
  });
  server.listen(port, "0.0.0.0", () =>
    console.log(`Server listening on port ${port}`)
  );
}
startServer().catch(error => {
  console.error(error);
  process.exit(1);
});
