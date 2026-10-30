import { describe, expect, it } from "vitest";
import { preparePage } from "./page";
import { render } from "../client/src/entry-server";

const template =
  '<title>__PAGE_TITLE__</title><meta name="description" content="__PAGE_DESCRIPTION__">__PAGE_EXTRA__<div id="root">__APP_HTML__</div>';
describe("Public page rendering", () => {
  it("renders distinct content for every public route", () => {
    expect(render("/")).toContain("Akibit");
    expect(render("/privacy")).toContain("What the enquiry form collects");
    expect(render("/accessibility")).toContain("Scope and limitations");
    expect(render("/404")).toContain("A LITTLE DETOUR");
  });
  it("returns route-specific escaped metadata and a true missing-page status", () => {
    const page = preparePage(template, "/privacy", "<h1>Privacy notice</h1>");
    expect(page.status).toBe(200);
    expect(page.html).toContain("Privacy Notice — Akibit");
    expect(page.html).toContain("<h1>Privacy notice</h1>");
    expect(page.html).not.toContain("__APP_HTML__");
    const missing = preparePage(template, "/unknown", "<h1>Not found</h1>");
    expect(missing.status).toBe(404);
    expect(missing.html).toContain('name="robots" content="noindex"');
  });
  it("does not guess a canonical origin", () => {
    const previous = process.env.PUBLIC_SITE_ORIGIN;
    delete process.env.PUBLIC_SITE_ORIGIN;
    expect(preparePage(template, "/", "home").html).not.toContain("canonical");
    if (previous !== undefined) process.env.PUBLIC_SITE_ORIGIN = previous;
  });
});
