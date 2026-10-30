import { spawnSync } from "node:child_process";
import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { build as esbuild } from "esbuild";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(projectRoot, "dist");
const publicDir = path.join(distDir, "public");
const vercel = process.env.STATIC_HOST === "vercel";
const defaultOrigin = vercel ? "https://akibit.vercel.app" : "https://akibit.netlify.app";
const publicRoutes = ["/", "/privacy", "/accessibility"];

function httpsRootOrigin(value) {
  if (!value) return null;

  try {
    const url = new URL(value);
    if (
      url.protocol !== "https:" ||
      url.pathname !== "/" ||
      url.username ||
      url.password ||
      url.search ||
      url.hash
    ) {
      return null;
    }
    return url.origin;
  } catch {
    return null;
  }
}

function selectedPublicOrigin() {
  if (vercel) return httpsRootOrigin(process.env.PUBLIC_SITE_ORIGIN) || defaultOrigin;
  return (
    httpsRootOrigin(process.env.PUBLIC_SITE_ORIGIN) ||
    httpsRootOrigin(process.env.URL) ||
    defaultOrigin
  );
}

function run(command, args, env = process.env) {
  const result = spawnSync(command, args, {
    cwd: projectRoot,
    env,
    stdio: "inherit",
  });

  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} exited with status ${result.status}`);
  }
}

function destinationForRoute(route) {
  if (route === "/") return path.join(publicDir, "index.html");
  return path.join(publicDir, route.slice(1), "index.html");
}

function withNoindex(html) {
  if (/\<meta\s+name=["']robots["'][^>]*\bnoindex\b/i.test(html)) return html;
  if (!html.includes("</head>")) {
    throw new Error("Cannot add the required noindex directive: rendered HTML has no closing head tag.");
  }
  return html.replace("</head>", '    <meta name="robots" content="noindex" />\n  </head>');
}

function assertRenderedHtml(filePath, html) {
  const unresolved = [
    "__APP_HTML__",
    "__PAGE_TITLE__",
    "__PAGE_DESCRIPTION__",
    "__PAGE_EXTRA__",
  ].filter((placeholder) => html.includes(placeholder));

  if (unresolved.length > 0) {
    throw new Error(
      `${path.relative(projectRoot, filePath)} contains unresolved metadata placeholders: ${unresolved.join(", ")}`
    );
  }

  if (/\/manus-storage\//i.test(html)) {
    throw new Error(
      `${path.relative(projectRoot, filePath)} contains a forbidden /manus-storage/ image reference.`
    );
  }
}

async function htmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await htmlFiles(entryPath)));
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      files.push(entryPath);
    }
  }
  return files;
}

function formSkeleton() {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="robots" content="noindex" />
    <title>Project enquiry</title>
  </head>
  <body>
    <form
      name="project-enquiry"
      method="POST"
      hidden
      action="/__forms.html"
      data-netlify="true"
      netlify-honeypot="website"
    >
      <input type="hidden" name="form-name" value="project-enquiry" />
      <p hidden><label>Do not fill this out: <input name="website" /></label></p>
      <label>Name <input type="text" name="name" /></label>
      <label>Email <input type="email" name="email" /></label>
      <label>Business <input type="text" name="business" /></label>
      <label>Business URL <input type="url" name="businessUrl" /></label>
      <label>Project type <input type="text" name="projectType" /></label>
      <label>Brief <textarea name="brief"></textarea></label>
      <label><input type="checkbox" name="privacyAcknowledged" /> I acknowledge the privacy notice.</label>
    </form>
  </body>
</html>
`;
}

function sitemap(origin) {
  const locations = publicRoutes
    .map((route) => `  <url><loc>${new URL(route, `${origin}/`).href}</loc></url>`)
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${locations}
</urlset>
`;
}

async function main() {
  const publicOrigin = selectedPublicOrigin();
  process.env.PUBLIC_SITE_ORIGIN = publicOrigin;
  process.env.VITE_DEPLOY_TARGET = "netlify";

  run("pnpm", ["exec", "vite", "build"], process.env);

  const rendererBundle = path.join(distDir, "netlify-renderer.mjs");
  const pageBundle = path.join(distDir, "netlify-page.mjs");
  const bundleOptions = {
    absWorkingDir: projectRoot,
    bundle: true,
    format: "esm",
    platform: "node",
    packages: "external",
    jsx: "automatic",
    define: { __NETLIFY_TARGET__: "true", __VERCEL_TARGET__: vercel ? "true" : "false" },
    logLevel: "info",
  };

  await esbuild({
    ...bundleOptions,
    entryPoints: [path.join(projectRoot, "client", "src", "entry-server.tsx")],
    outfile: rendererBundle,
  });
  await esbuild({
    ...bundleOptions,
    entryPoints: [path.join(projectRoot, "server", "page.ts")],
    outfile: pageBundle,
  });

  const template = await readFile(path.join(publicDir, "index.html"), "utf8");
  const { render } = await import(`${pathToFileURL(rendererBundle).href}?build=${Date.now()}`);
  const { preparePage } = await import(`${pathToFileURL(pageBundle).href}?build=${Date.now()}`);

  for (const route of publicRoutes) {
    const destination = destinationForRoute(route);
    const rendered = preparePage(template, route, render(route));
    if (rendered.status !== 200) {
      throw new Error(`Expected a 200 page for ${route}, received ${rendered.status}.`);
    }
    const html = withNoindex(rendered.html);
    assertRenderedHtml(destination, html);
    await mkdir(path.dirname(destination), { recursive: true });
    await writeFile(destination, html, "utf8");
  }

  const notFoundDestination = path.join(publicDir, "404.html");
  const notFound = preparePage(template, "/404", render("/404"));
  if (notFound.status !== 404) {
    throw new Error(`Expected a 404 page for /404, received ${notFound.status}.`);
  }
  const notFoundHtml = withNoindex(notFound.html);
  assertRenderedHtml(notFoundDestination, notFoundHtml);
  await writeFile(notFoundDestination, notFoundHtml, "utf8");

  if (vercel) await rm(path.join(publicDir, "__forms.html"), { force: true });
  else await writeFile(path.join(publicDir, "__forms.html"), formSkeleton(), "utf8");
  await writeFile(path.join(publicDir, "sitemap.xml"), sitemap(publicOrigin), "utf8");
  await writeFile(
    path.join(publicDir, "robots.txt"),
    `User-agent: *\nDisallow: /\nDisallow: /__forms.html\nDisallow: /api\nSitemap: ${new URL("/sitemap.xml", `${publicOrigin}/`).href}\n`,
    "utf8"
  );

  // The static Netlify target has no runtime platform-config endpoint.
  await rm(path.join(publicDir, "api"), { recursive: true, force: true });

  for (const filePath of await htmlFiles(publicDir)) {
    assertRenderedHtml(filePath, await readFile(filePath, "utf8"));
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
