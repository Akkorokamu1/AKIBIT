import { z } from "zod";

export const projectTypes = [
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

export const enquirySchema = z.object({
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

export type EnquiryInput = z.infer<typeof enquirySchema>;
