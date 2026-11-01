/** Full Studio → Arcade portal film: the desk, the door, the dark room, the torii. */
export const PORTAL_VIDEO_URL =
  "https://d2ol7oe51mr4n9.cloudfront.net/user_3IzqVDu6iik7Uy5sNzX4UHwI5is/de2ee37a-9faf-446c-b362-90671a453e41.mp4";

/** The full film plays once per visit; later flips use the quick iris. */
export const PORTAL_SEEN_KEY = "akibit-portal-seen";

export function portalSeen(): boolean {
  try {
    return window.sessionStorage.getItem(PORTAL_SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

export function markPortalSeen() {
  try {
    window.sessionStorage.setItem(PORTAL_SEEN_KEY, "1");
  } catch {
    /* storage unavailable: the film simply plays again next time */
  }
}

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true
  );
}
