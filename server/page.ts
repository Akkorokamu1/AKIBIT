const publicPages: Record<string, { title: string; description: string }> = {
  "/": {
    title: "Akibit — Freelance Web Design, Apps & Business Websites",
    description:
      "Thoughtful websites, landing pages and app experiences for businesses with potential. Explore original design concepts and start a project conversation.",
  },
  "/privacy": {
    title: "Privacy Notice — Akibit Freelance Web & App Design",
    description:
      "Learn how the Akibit project enquiry form handles your information, what is stored and which privacy details need owner review before launch.",
  },
  "/accessibility": {
    title: "Accessibility — Akibit Freelance Web & App Design",
    description:
      "Read about Akibit's accessibility foundations, including keyboard navigation, optional Studio and Arcade themes, clear forms, responsive layouts and known evaluation limitations.",
  },
};
const escapeAttribute = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
export function preparePage(template: string, pathname: string, html: string) {
  const path = pathname.split("?")[0];
  const page = publicPages[path];
  const status = page ? 200 : 404;
  let extra = page ? "" : '<meta name="robots" content="noindex" />';
  const configured = process.env.PUBLIC_SITE_ORIGIN;
  if (configured && page) {
    try {
      const origin = new URL(configured);
      if (
        origin.protocol === "https:" &&
        origin.pathname === "/" &&
        !origin.username &&
        !origin.password &&
        !origin.search &&
        !origin.hash
      ) {
        const canonical = escapeAttribute(new URL(path, origin).href);
        extra += `<link rel="canonical" href="${canonical}" /><meta property="og:url" content="${canonical}" />`;
      }
    } catch {
      /* No guessed public origin. */
    }
  }
  return {
    status,
    html: template
      .replaceAll(
        "__PAGE_TITLE__",
        escapeAttribute(page?.title || "Page not found — Akibit"),
      )
      .replaceAll(
        "__PAGE_DESCRIPTION__",
        escapeAttribute(
          page?.description ||
            "This page could not be found. Return to the Akibit portfolio.",
        ),
      )
      .replace("__PAGE_EXTRA__", extra)
      .replace("__APP_HTML__", html),
  };
}
