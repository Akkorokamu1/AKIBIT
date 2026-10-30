import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowUpRight, Check, Loader2 } from "lucide-react";
import { netlifyTarget } from "@/lib/deployment";
import { sendEnquiry, type EnquiryResult } from "@/lib/enquiryClient";

const projectTypes = [
  "Landing page",
  "Business website",
  "Web app",
  "App design",
  "Not sure yet",
];
export default function Contact({ projectType }: { projectType: string }) {
  const [type, setType] = useState(projectType || "Not sure yet");
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState<EnquiryResult | null>(null);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const resultRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (projectType) setType(projectType);
  }, [projectType]);
  useEffect(() => {
    if (success !== null || message) resultRef.current?.focus();
  }, [success, message]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const body = {
      name: String(data.get("name") || "").trim(),
      email: String(data.get("email") || "").trim(),
      business: String(data.get("business") || "").trim(),
      businessUrl: String(data.get("businessUrl") || "").trim(),
      projectType: type,
      brief: String(data.get("brief") || "").trim(),
      privacyAcknowledged: data.get("privacyAcknowledged") === "on",
      website: String(data.get("website") || ""),
    };
    const validation: Record<string, string> = {};
    if (body.name.length < 2)
      validation.name = "Please enter your name (at least 2 characters).";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email))
      validation.email = "Please enter a valid email address.";
    if (body.business.length < 2)
      validation.business = "Please enter a business or project name.";
    if (body.brief.length < 15)
      validation.brief = "Tell me a little more (at least 15 characters).";
    if (body.businessUrl) {
      try {
        const url = new URL(body.businessUrl);
        if (!["http:", "https:"].includes(url.protocol)) throw new Error();
      } catch {
        validation.businessUrl =
          "Use a full link beginning with https:// or http://.";
      }
    }
    if (!body.privacyAcknowledged)
      validation.privacyAcknowledged = "Please acknowledge the privacy notice.";
    setErrors(validation);
    setMessage("");
    if (Object.keys(validation).length) {
      (
        form.elements.namedItem(Object.keys(validation)[0]) as HTMLElement
      )?.focus();
      return;
    }
    setBusy(true);
    try {
      const result = await sendEnquiry(body);
      setSuccess(result);
      form.reset();
    } catch (error) {
      setMessage(
        error instanceof Error && error.name !== "TimeoutError"
          ? error.message
          : "The connection timed out. Your enquiry may have been saved. Please wait before trying again to avoid a duplicate."
      );
    } finally {
      setBusy(false);
    }
  }
  const fieldError = (name: string) =>
    errors[name] && (
      <span className="field-error" id={`${name}-error`}>
        {errors[name]}
      </span>
    );
  const invalidProps = (name: string) => ({
    "aria-invalid": !!errors[name],
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  });

  return (
    <section
      className="contact-section"
      id="contact"
      aria-labelledby="contact-title"
    >
      <div className="page-width contact-layout">
        <div className="contact-intro">
          <span className="eyebrow">
            <span className="tiny-square" /> LET'S MAKE IT HAPPEN
          </span>
          <h2 id="contact-title">
            Your next chapter
            <br />
            starts with
            <br />
            <em>a conversation.</em>
          </h2>
          <p>
            A new business, a better website, or an idea you've been sitting on.
            Tell me what you're imagining.
          </p>
          <div className="contact-note">
            <span className="asterisk-mark" aria-hidden="true">
              ✳
            </span>
            <p>
              No perfect brief needed.
              <br />
              <strong>Just a business with potential.</strong>
            </p>
          </div>
          <p className="contact-fine">
            This is a project enquiry, not a commitment to buy. Scope, budget
            and timing are agreed together.
          </p>
        </div>
        <div className="contact-form-wrap">
          {success !== null ? (
            <div
              className="form-success"
              ref={resultRef}
              tabIndex={-1}
              role="status"
            >
              <span className="success-icon">
                <Check size={27} />
              </span>
              <span className="eyebrow">ENQUIRY SAVED</span>
              <h3>A good place to start.</h3>
              <p>
                Your project enquiry has been saved for review.{" "}
                {typeof success.reference === "number" && (
                  <>
                    Keep reference{" "}
                    <strong>
                      F{String(success.reference).padStart(4, "0")}
                    </strong>
                    .{" "}
                  </>
                )}
                No confirmation email has been sent.
              </p>
              <button
                className="text-link"
                onClick={() => {
                  setSuccess(null);
                  setMessage("");
                  setErrors({});
                }}
              >
                Send another enquiry <ArrowUpRight size={18} />
              </button>
            </div>
          ) : (
            <form
              className="enquiry-form"
              onSubmit={submit}
              name={netlifyTarget ? "project-enquiry" : undefined}
              method="post"
              data-netlify={netlifyTarget ? "true" : undefined}
              netlify-honeypot={netlifyTarget ? "website" : undefined}
              noValidate
              aria-busy={busy}
            >
              {netlifyTarget && (
                <input type="hidden" name="form-name" value="project-enquiry" />
              )}
              <div className="form-heading">
                <h3>Tell me about your project</h3>
                <span>Required fields marked *</span>
              </div>
              <div className="form-two">
                <label>
                  Your name *
                  <input
                    name="name"
                    autoComplete="name"
                    maxLength={100}
                    required
                    placeholder="Alex Taylor"
                    {...invalidProps("name")}
                  />
                  {fieldError("name")}
                </label>
                <label>
                  Email address *
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    maxLength={320}
                    required
                    placeholder="alex@yourbusiness.com"
                    {...invalidProps("email")}
                  />
                  {fieldError("email")}
                </label>
              </div>
              <label>
                Business or project name *
                <input
                  name="business"
                  autoComplete="organization"
                  required
                  maxLength={160}
                  placeholder="What are you building?"
                  {...invalidProps("business")}
                />
                {fieldError("business")}
              </label>
              <label>
                What do you have in mind? *
                <select
                  name="projectType"
                  value={type}
                  onChange={e => setType(e.target.value)}
                >
                  {projectTypes.map(p => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </label>
              <label>
                Website or Google Maps link{" "}
                <span className="optional">(optional)</span>
                <input
                  name="businessUrl"
                  type="url"
                  maxLength={2000}
                  placeholder="https:// — or leave blank if you don't have one"
                  {...invalidProps("businessUrl")}
                />
                {fieldError("businessUrl")}
              </label>
              <label>
                A little about your idea *
                <textarea
                  name="brief"
                  rows={3}
                  minLength={15}
                  maxLength={3000}
                  required
                  placeholder="What do you offer, who are your customers, and what would you like the website or app to do?"
                  {...invalidProps("brief")}
                />
                {fieldError("brief")}
              </label>
              <div className="honeypot" aria-hidden="true">
                <label>
                  Leave this empty
                  <input name="website" tabIndex={-1} autoComplete="off" />
                </label>
              </div>
              <label className="privacy-check">
                <input
                  name="privacyAcknowledged"
                  type="checkbox"
                  required
                  {...invalidProps("privacyAcknowledged")}
                />
                <span>
                  I have read the <a href="/privacy">privacy notice</a>. My
                  details will be used to review and respond to this enquiry,
                  not to subscribe me to marketing. *
                </span>
              </label>
              {fieldError("privacyAcknowledged")}
              {message && (
                <div
                  className="form-error"
                  role="alert"
                  tabIndex={-1}
                  ref={resultRef}
                >
                  {message}
                </div>
              )}
              <button
                className="button button-dark submit-button"
                disabled={busy}
                type="submit"
              >
                {busy ? (
                  <>
                    Saving your enquiry <Loader2 size={19} className="spin" />
                  </>
                ) : (
                  <>
                    Let's talk about your project <ArrowUpRight size={20} />
                  </>
                )}
              </button>
              <p className="form-footnote">
                A real conversation. A considered plan. No pressure.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
