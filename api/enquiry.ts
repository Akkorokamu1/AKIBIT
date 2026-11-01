// Vercel serverless function: validates an Akibit enquiry and emails it to the
// owner through Resend. Env vars: RESEND_API_KEY, ENQUIRY_TO, optional ENQUIRY_FROM.
// Self-contained on purpose (no relative imports) so Vercel's ESM runtime resolves it.
// The schema below mirrors shared/enquiry.ts — keep the two in sync.
import { z } from "zod";

const projectTypes = [
  "Landing page",
  "Business website",
  "Managed site",
  "Online store",
  "Platform",
  "Web app",
  "Ecosystem",
  "App design",
  "Not sure yet",
] as const;

function isHttpUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

const enquirySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(100, "Name must be at most 100 characters."),
  email: z
    .string()
    .trim()
    .email("Enter a valid email address.")
    .max(320, "Email must be at most 320 characters."),
  business: z
    .string()
    .trim()
    .min(2, "Business must be at least 2 characters.")
    .max(160, "Business must be at most 160 characters."),
  projectType: z.enum(projectTypes),
  businessUrl: z
    .string()
    .trim()
    .max(2000, "Business URL must be at most 2000 characters.")
    .refine(value => value === "" || isHttpUrl(value), {
      message: "Business URL must be an http(s) URL.",
    })
    .optional(),
  brief: z
    .string()
    .trim()
    .min(15, "Brief must be at least 15 characters.")
    .max(3000, "Brief must be at most 3000 characters."),
  privacyAcknowledged: z.literal(true, {
    error: "Privacy acknowledgement is required.",
  }),
  website: z
    .string()
    .max(200, "Website must be at most 200 characters.")
    .optional()
    .refine(value => value === undefined || value === "", {
      message: "This submission could not be accepted.",
    }),
});




type Req = { method?: string; body?: unknown };
type Res = {
  status(code: number): Res;
  json(body: unknown): void;
  setHeader(name: string, value: string): void;
};

const escape = (value: string) =>
  value.replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
      c
    ]!
  );

export default async function handler(req: Req, res: Res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ success: false, message: "Method not allowed." });
  }

  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      body = undefined;
    }
  }

  // Honeypot: bots fill the hidden "website" field. Pretend success, send nothing.
  if (
    body &&
    typeof body === "object" &&
    typeof (body as { website?: unknown }).website === "string" &&
    (body as { website: string }).website !== ""
  ) {
    return res.status(200).json({ success: true });
  }

  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: parsed.error.issues[0]?.message ?? "Please check the form and try again.",
    });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ENQUIRY_TO;
  if (!apiKey || !to) {
    console.error("Enquiry email is not configured (RESEND_API_KEY / ENQUIRY_TO).");
    return res.status(503).json({
      success: false,
      message: "Enquiries are temporarily unavailable. Please try again later.",
    });
  }

  const e = parsed.data;
  const rows: [string, string][] = [
    ["Name", e.name],
    ["Email", e.email],
    ["Business", e.business],
    ["Project type", e.projectType],
    ["Business / Maps URL", e.businessUrl || "—"],
    ["Brief", e.brief],
  ];
  const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n\n");
  const html = `<h2>New Akibit enquiry</h2><table cellpadding="6">${rows
    .map(
      ([k, v]) =>
        `<tr><td valign="top"><strong>${k}</strong></td><td style="white-space:pre-wrap">${escape(v)}</td></tr>`
    )
    .join("")}</table>`;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.ENQUIRY_FROM || "Akibit <onboarding@resend.dev>",
        to: [to],
        reply_to: e.email,
        subject: `New enquiry: ${e.projectType} — ${e.business}`.slice(0, 200),
        text,
        html,
      }),
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) {
      console.error("Resend rejected the enquiry:", response.status, await response.text());
      throw new Error("send failed");
    }
  } catch (error) {
    console.error("Enquiry send failed:", error);
    return res.status(502).json({
      success: false,
      message: "Your enquiry couldn't be sent. Please try again later.",
    });
  }

  return res.status(200).json({ success: true });
}
