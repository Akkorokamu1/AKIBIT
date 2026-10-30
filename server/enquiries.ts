import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { eq } from "drizzle-orm";
import type { ZodError } from "zod";
import { enquiries } from "../drizzle/schema";
import { enquirySchema, type EnquiryInput } from "../shared/enquiry";
import { getDb } from "./db";
import { notifyOwner } from "./_core/notification";

const ENQUIRY_BODY_LIMIT = "16kb";
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const RATE_LIMIT_MAX_CLIENTS = 5_000;
const NOTIFICATION_TIMEOUT_MS = 5_000;
const PRIVACY_NOTICE_VERSION = "2026-10-30";

type RateLimitBucket = {
  count: number;
  resetAt: number;
};

type NotificationStatus = "accepted" | "failed";

const rateLimitBuckets = new Map<string, RateLimitBucket>();

function evictExpiredRateLimitBuckets(now: number): void {
  for (const [ip, bucket] of rateLimitBuckets) {
    if (bucket.resetAt <= now) {
      rateLimitBuckets.delete(ip);
    }
  }
}

function consumeRateLimit(
  ip: string,
  now = Date.now()
): RateLimitBucket | null {
  evictExpiredRateLimitBuckets(now);

  const existingBucket = rateLimitBuckets.get(ip);
  if (existingBucket) {
    if (existingBucket.count >= RATE_LIMIT_MAX_REQUESTS) {
      return existingBucket;
    }

    existingBucket.count += 1;
    return null;
  }

  if (rateLimitBuckets.size >= RATE_LIMIT_MAX_CLIENTS) {
    const oldestIp = rateLimitBuckets.keys().next().value;
    if (oldestIp) {
      rateLimitBuckets.delete(oldestIp);
    }
  }

  rateLimitBuckets.set(ip, {
    count: 1,
    resetAt: now + RATE_LIMIT_WINDOW_MS,
  });
  return null;
}

function validationErrors(error: ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};

  for (const issue of error.issues) {
    const field = typeof issue.path[0] === "string" ? issue.path[0] : "form";
    if (!fieldErrors[field]) {
      fieldErrors[field] = issue.message;
    }
  }

  return fieldErrors;
}

function buildOwnerNotification(reference: number, enquiry: EnquiryInput) {
  return {
    title: `New project enquiry #${reference}`,
    content: [
      `Reference: ${reference}`,
      `Name: ${enquiry.name}`,
      `Email: ${enquiry.email}`,
      `Business: ${enquiry.business}`,
      `Project type: ${enquiry.projectType}`,
      `Business URL: ${enquiry.businessUrl || "Not provided"}`,
      "",
      "Brief:",
      enquiry.brief,
    ].join("\n"),
  };
}

async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number
): Promise<T> {
  let timeout: NodeJS.Timeout | undefined;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeout = setTimeout(
      () => reject(new Error("Owner notification timed out.")),
      timeoutMs
    );
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    if (timeout) {
      clearTimeout(timeout);
    }
  }
}

function handleBodyParserError(
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
): void {
  const bodyParserError = error as { type?: string; status?: number };

  if (bodyParserError.type === "entity.too.large") {
    res.status(413).json({ message: "Enquiry payload must not exceed 16 KB." });
    return;
  }

  if (bodyParserError.status === 400) {
    res.status(400).json({ message: "Invalid JSON payload.", errors: {} });
    return;
  }

  next(error);
}

export const enquiryRouter = express.Router();

// This applies when this router reads the request body itself. The parent server will
// reduce its global parser limit as well, because an earlier global parser takes precedence.
enquiryRouter.use(express.json({ limit: ENQUIRY_BODY_LIMIT, strict: true }));

enquiryRouter.post("/", async (req, res) => {
  // Express defaults to trust proxy disabled, so req.ip is socket-derived unless the host
  // explicitly configures trusted proxy addresses. Do not read X-Forwarded-For directly.
  const clientIp = req.ip ?? req.socket.remoteAddress ?? "unknown";
  const limit = consumeRateLimit(clientIp);
  if (limit) {
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((limit.resetAt - Date.now()) / 1000)
    );
    res.set("Retry-After", String(retryAfterSeconds));
    res.status(429).json({
      message: "Too many enquiry submissions. Please try again shortly.",
      retryAfterSeconds,
    });
    return;
  }

  const parsed = enquirySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      message: "Please correct the highlighted fields.",
      errors: validationErrors(parsed.error),
    });
    return;
  }

  const db = await getDb();
  if (!db) {
    res.status(503).json({
      message: "Enquiries are temporarily unavailable. Please try again later.",
    });
    return;
  }

  let reference: number;
  try {
    const [insertResult] = await db.insert(enquiries).values({
      name: parsed.data.name,
      email: parsed.data.email,
      business: parsed.data.business,
      projectType: parsed.data.projectType,
      businessUrl: parsed.data.businessUrl || null,
      brief: parsed.data.brief,
      privacyNoticeVersion: PRIVACY_NOTICE_VERSION,
      notificationStatus: "pending",
    });
    reference = insertResult.insertId;
  } catch {
    res
      .status(500)
      .json({ message: "Unable to save your enquiry. Please try again." });
    return;
  }

  let notificationStatus: NotificationStatus = "failed";
  try {
    const accepted = await withTimeout(
      notifyOwner(buildOwnerNotification(reference, parsed.data)),
      NOTIFICATION_TIMEOUT_MS
    );
    notificationStatus = accepted ? "accepted" : "failed";
  } catch {
    notificationStatus = "failed";
  }

  try {
    await db
      .update(enquiries)
      .set({ notificationStatus })
      .where(eq(enquiries.id, reference));
  } catch {
    // The enquiry is already durable. Leave its initial pending status for operational follow-up.
  }

  res.status(201).json({ success: true, reference });
});

enquiryRouter.use(handleBodyParserError);

/** Reset only the in-memory limiter state between isolated unit tests. */
export function resetEnquiryRateLimitForTests(): void {
  rateLimitBuckets.clear();
}
