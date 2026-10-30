import { netlifyTarget, vercelTarget } from "./deployment";

export type EnquiryPayload = {
  name: string;
  email: string;
  business: string;
  businessUrl: string;
  projectType: string;
  brief: string;
  privacyAcknowledged: boolean;
  website: string;
};

export type EnquiryResult = {
  success: true;
  reference?: number;
};

export async function sendEnquiry(
  body: EnquiryPayload,
  useNetlify = netlifyTarget,
  useVercel = vercelTarget
): Promise<EnquiryResult> {
  if (useVercel) {
    const response = await fetch("/api/enquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(25000),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || result.success !== true) {
      throw new Error(
        result.message || "Your enquiry couldn't be sent. Please try again later."
      );
    }
    return { success: true };
  }
  if (useNetlify) {
    const encoded = new URLSearchParams({
      "form-name": "project-enquiry",
      name: body.name,
      email: body.email,
      business: body.business,
      businessUrl: body.businessUrl,
      projectType: body.projectType,
      brief: body.brief,
      privacyAcknowledged: body.privacyAcknowledged ? "on" : "",
      website: body.website,
    });
    const response = await fetch("/__forms.html", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: encoded.toString(),
      signal: AbortSignal.timeout(25000),
    });
    if (!response.ok) {
      throw new Error(
        "Your enquiry couldn't be saved. Please try again later."
      );
    }
    return { success: true };
  }

  const response = await fetch("/api/enquiries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(25000),
  });
  const result = await response.json();
  if (
    !response.ok ||
    result.success !== true ||
    typeof result.reference !== "number"
  ) {
    throw new Error(
      result.message || "Your enquiry couldn't be saved. Please try again."
    );
  }
  return { success: true, reference: result.reference };
}
