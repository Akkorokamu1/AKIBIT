declare const __NETLIFY_TARGET__: boolean;
declare const __VERCEL_TARGET__: boolean;

/** True for every static-host edition (Netlify and Vercel). */
export const netlifyTarget =
  typeof __NETLIFY_TARGET__ !== "undefined" && __NETLIFY_TARGET__;

/** True only for the Vercel edition, where enquiries go to /api/enquiry (Resend). */
export const vercelTarget =
  typeof __VERCEL_TARGET__ !== "undefined" && __VERCEL_TARGET__;
