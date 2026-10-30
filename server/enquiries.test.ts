import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import express from "express";

const mocks = vi.hoisted(() => ({
  getDb: vi.fn(),
  notifyOwner: vi.fn(),
}));

vi.mock("./db", () => ({ getDb: mocks.getDb }));
vi.mock("./_core/notification", () => ({ notifyOwner: mocks.notifyOwner }));

import { enquiryRouter, resetEnquiryRateLimitForTests } from "./enquiries";

const validEnquiry = {
  name: "  Alex Example  ",
  email: "alex@example.com",
  business: "  Example Studio ",
  projectType: "Business website",
  businessUrl: "https://example.com",
  brief: "We need a focused website for a new product launch.",
  privacyAcknowledged: true,
  website: "",
};

function createDatabase(insertResult: unknown = [{ insertId: 101 }]) {
  const values = vi.fn().mockResolvedValue(insertResult);
  const insert = vi.fn().mockReturnValue({ values });
  const where = vi.fn().mockResolvedValue(undefined);
  const set = vi.fn().mockReturnValue({ where });
  const update = vi.fn().mockReturnValue({ set });

  return {
    db: { insert, update },
    insert,
    values,
    update,
    set,
    where,
  };
}

async function submit(body: unknown) {
  const app = express();
  app.use(enquiryRouter);

  const server = app.listen(0, "127.0.0.1");
  await new Promise<void>(resolve => server.once("listening", resolve));
  const address = server.address();
  if (!address || typeof address === "string") {
    throw new Error("Test server did not provide a TCP address.");
  }

  try {
    const response = await fetch(`http://127.0.0.1:${address.port}/`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    return { response, body: await response.json() };
  } finally {
    await new Promise<void>((resolve, reject) => {
      server.close(error => (error ? reject(error) : resolve()));
    });
  }
}

describe("enquiryRouter", () => {
  beforeEach(() => {
    mocks.getDb.mockReset();
    mocks.notifyOwner.mockReset();
    resetEnquiryRateLimitForTests();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns field errors for invalid enquiry input without touching the database", async () => {
    const result = await submit({
      ...validEnquiry,
      name: " ",
      email: "not-an-email",
    });

    expect(result.response.status).toBe(400);
    expect(result.body).toMatchObject({
      message: "Please correct the highlighted fields.",
      errors: {
        name: expect.any(String),
        email: expect.any(String),
      },
    });
    expect(mocks.getDb).not.toHaveBeenCalled();
  });

  it("rejects a nonempty website honeypot without saving or notifying", async () => {
    const result = await submit({
      ...validEnquiry,
      website: "https://bot.example",
    });

    expect(result.response.status).toBe(400);
    expect(result.body).toMatchObject({
      errors: { website: expect.any(String) },
    });
    expect(mocks.getDb).not.toHaveBeenCalled();
    expect(mocks.notifyOwner).not.toHaveBeenCalled();
  });

  it("persists a valid enquiry and marks its owner notification accepted", async () => {
    const database = createDatabase();
    mocks.getDb.mockResolvedValue(database.db);
    mocks.notifyOwner.mockResolvedValue(true);

    const result = await submit(validEnquiry);

    expect(result.response.status).toBe(201);
    expect(result.body).toEqual({ success: true, reference: 101 });
    expect(database.values).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Alex Example",
        business: "Example Studio",
        privacyNoticeVersion: "2026-10-30",
        notificationStatus: "pending",
      })
    );
    expect(mocks.notifyOwner).toHaveBeenCalledOnce();
    expect(database.set).toHaveBeenCalledWith({
      notificationStatus: "accepted",
    });
  });

  it("returns an error when saving the enquiry fails and does not notify the owner", async () => {
    const database = createDatabase();
    database.values.mockRejectedValue(new Error("database unavailable"));
    mocks.getDb.mockResolvedValue(database.db);

    const result = await submit(validEnquiry);

    expect(result.response.status).toBe(500);
    expect(result.body).toEqual({
      message: "Unable to save your enquiry. Please try again.",
    });
    expect(mocks.notifyOwner).not.toHaveBeenCalled();
    expect(database.update).not.toHaveBeenCalled();
  });

  it("keeps a saved enquiry successful when notification throws and marks it failed", async () => {
    const database = createDatabase();
    mocks.getDb.mockResolvedValue(database.db);
    mocks.notifyOwner.mockRejectedValue(new Error("notification unavailable"));

    const result = await submit(validEnquiry);

    expect(result.response.status).toBe(201);
    expect(result.body).toEqual({ success: true, reference: 101 });
    expect(database.set).toHaveBeenCalledWith({ notificationStatus: "failed" });
  });

  it("marks a saved enquiry failed when owner notification is not accepted", async () => {
    const database = createDatabase();
    mocks.getDb.mockResolvedValue(database.db);
    mocks.notifyOwner.mockResolvedValue(false);

    const result = await submit(validEnquiry);

    expect(result.response.status).toBe(201);
    expect(result.body).toEqual({ success: true, reference: 101 });
    expect(database.set).toHaveBeenCalledWith({ notificationStatus: "failed" });
  });
});
