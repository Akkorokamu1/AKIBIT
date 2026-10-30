import { afterEach, describe, expect, it, vi } from "vitest";
import {
  sendEnquiry,
  type EnquiryPayload,
} from "../client/src/lib/enquiryClient";

const body: EnquiryPayload = {
  name: "Sample Owner",
  email: "owner@example.com",
  business: "Sample Business",
  businessUrl: "https://example.com/?a=1&b=2",
  projectType: "Landing page",
  brief: "A clear website for a local business.",
  privacyAcknowledged: true,
  website: "",
};

afterEach(() => vi.unstubAllGlobals());

describe("deployment-specific enquiry transport", () => {
  it("posts URL-encoded matching fields to the Netlify static skeleton", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);
    const result = await sendEnquiry(body, true);
    const [path, options] = fetchMock.mock.calls[0];
    expect(path).toBe("/__forms.html");
    expect(options.headers["Content-Type"]).toBe(
      "application/x-www-form-urlencoded"
    );
    const encoded = new URLSearchParams(options.body);
    expect(encoded.get("form-name")).toBe("project-enquiry");
    expect(encoded.get("email")).toBe(body.email);
    expect(encoded.get("businessUrl")).toBe(body.businessUrl);
    expect(encoded.get("privacyAcknowledged")).toBe("on");
    expect(encoded.get("website")).toBe("");
    expect(result).toEqual({ success: true });
    expect(result.reference).toBeUndefined();
  });

  it("does not report success when Netlify rejects the request", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));
    await expect(sendEnquiry(body, true)).rejects.toThrow("couldn't be saved");
  });

  it("retains the managed JSON endpoint and its real reference", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, reference: 42 }),
      });
    vi.stubGlobal("fetch", fetchMock);
    expect(await sendEnquiry(body, false)).toEqual({
      success: true,
      reference: 42,
    });
    expect(fetchMock.mock.calls[0][0]).toBe("/api/enquiries");
    expect(fetchMock.mock.calls[0][1].headers["Content-Type"]).toBe(
      "application/json"
    );
  });

  it("rejects a misleading successful HTTP response without a real saved reference", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue({ ok: true, json: async () => ({ success: true }) })
    );
    await expect(sendEnquiry(body, false)).rejects.toThrow("couldn't be saved");
  });
});
