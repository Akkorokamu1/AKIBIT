import { Header, Footer } from "./Home";
import { ArrowUpRight } from "lucide-react";
import { netlifyTarget, vercelTarget } from "@/lib/deployment";

export default function Policy({
  kind,
}: {
  kind: "privacy" | "accessibility";
}) {
  const privacy = kind === "privacy";
  return (
    <>
      <Header home={false} />
      <main id="main" className="page-width policy-page">
        <span className="eyebrow">
          AKIBIT / {privacy ? "YOUR INFORMATION" : "DESIGNED FOR PEOPLE"}
        </span>
        <h1>{privacy ? "Privacy notice" : "Accessibility statement"}</h1>
        {privacy ? (
          <>
            <div className="policy-warning">
              <strong>
                {netlifyTarget
                  ? "Review deployment · business and privacy details require owner review"
                  : "Preview notice · owner review required before public launch"}
              </strong>
              <p>
                Akibit is a working brand for this portfolio. The owner's legal
                identity, direct privacy contact, jurisdiction, retention
                schedule and hosting transfer arrangements have not yet been
                confirmed. This notice explains the implemented form, but is not
                a finalized jurisdiction-specific legal notice.
              </p>
            </div>
            <h2>What the enquiry form collects</h2>
            <p>
              Your name, email address, business or project name, chosen project
              type and brief are required to review your enquiry. A website or
              Google Maps link is optional. Please do not submit passwords,
              payment details, health information or other sensitive personal
              data.
            </p>
            <h2>What happens to your enquiry</h2>
            <p>
              {vercelTarget
                ? "On this Vercel-hosted edition, your enquiry is sent by email to the site owner through Resend, an email delivery service, so the owner can review and respond to your request. It is not stored in a database by this site."
                : netlifyTarget
                ? "On this Netlify-hosted edition, your enquiry is submitted to Netlify Forms and stored for the authorized site owner to review and respond to your request. Netlify applies spam filtering; notifications depend on the owner's Netlify settings."
                : "Your enquiry is saved in this project's managed database and used to review and respond to your request. A compact notification may be sent to the project owner through Manus."}{" "}
              It is not a newsletter signup, and the application does not send a
              confirmation email to you. No automated decision-making or
              profiling is implemented by this application.
            </p>
            <h2>Access and service providers</h2>
            <p>
              The project owner and authorized infrastructure providers can
              process the information needed to run this service. There is no
              public endpoint for viewing enquiry records.{" "}
              {vercelTarget
                ? "Vercel provides hosting and Resend delivers the enquiry email for this edition. No protected Manus database or API credentials are used."
                : netlifyTarget
                ? "Netlify provides hosting and form-processing services for this edition. No protected Manus database or API credentials are copied to Netlify."
                : "Hosting, database and notification services are provided through the managed project infrastructure."}{" "}
              Specific provider, location, transfer and safeguard details must
              be confirmed by the owner before the business launch.
            </p>
            <h2>Cookies, scripts and technical data</h2>
            <p>
              No marketing cookies or visitor-tracking scripts have been added
              to this application. If you choose Studio or Arcade mode, a local
              browser-storage preference named <code>akibit-theme</code> records
              that interface choice on this device. It is not used for analytics
              or tracking.{" "}
              {vercelTarget
                ? "Vercel hosting and security infrastructure may process technical request data, such as IP addresses, to deliver and protect the site and handle form submissions."
                : netlifyTarget
                ? "Netlify hosting, security and spam-prevention infrastructure may process technical request data, such as IP addresses, to deliver and protect the site and handle form submissions."
                : "Optional platform site analytics and the platform badge are disabled in project settings. Hosting and security infrastructure may still process technical request data, such as IP addresses, to deliver and protect the site. The enquiry endpoint uses temporary per-instance rate limits for abuse prevention; it does not store an IP address in your enquiry record."}
            </p>
            <h2>Retention, rights and contact</h2>
            <p>
              A retention schedule, applicable lawful basis, direct contact for
              privacy requests and relevant supervisory authority must be
              specified by the owner before public launch. Your available rights
              depend on the applicable law and processing basis. In this review
              version, you can identify a privacy-related enquiry through the{" "}
              <a href="/#contact">project enquiry form</a>, without including
              sensitive information. This temporary route is not a substitute
              for the owner's finalized privacy contact.
            </p>
            <h2>Public concepts and third-party links</h2>
            <p>
              The portfolio brands are fictional concepts, not clients or
              endorsements. Any Google Maps link you submit is stored as text;
              the application does not fetch or scrape that link. Third-party
              services have their own policies. This site is not affiliated with
              Google.
            </p>
          </>
        ) : (
          <>
            <p>
              This portfolio is built with accessibility as a design foundation.
              It is intended to support clear reading and navigation on desktop
              and mobile, including keyboard use and text resizing.
            </p>
            <h2>Features included</h2>
            <p>
              Semantic headings and landmarks, a skip-to-content link, visible
              keyboard focus, labeled form controls, textual validation errors,
              responsive layouts and meaningful image alternatives are included.
              Concept dialogs support keyboard interaction and closing with
              Escape. The optional Studio and Arcade themes keep controls and
              text readable in both modes; the theme switch is keyboard and
              touch operable and exposes its current state. Optional movement
              respects the device's reduced-motion preference.
            </p>
            <h2>Scope and limitations</h2>
            <p>
              WCAG 2.2 informed the implementation, but no independent
              accessibility audit, complete conformance evaluation or legal
              certification has been performed. The small interface
              illustrations in the concept showcase are visual design examples
              rather than operational applications; their purpose and decisions
              are available in readable text through the concept details.
            </p>
            <h2>Report a difficulty</h2>
            <p>
              Use the <a href="/#contact">enquiry form</a> and describe the
              affected page, device or browser and the action you were trying to
              complete. Avoid including sensitive information. A direct
              accessibility contact and response process should be set by the
              owner before launch.
            </p>
            <p>
              Reference standard:{" "}
              <a
                href="https://www.w3.org/TR/WCAG22/"
                target="_blank"
                rel="noopener noreferrer"
              >
                W3C Web Content Accessibility Guidelines 2.2 (opens a new tab)
              </a>
              .
            </p>
          </>
        )}
        <p>Last updated: 30 October 2026.</p>
        <a href="/#contact" className="button button-dark">
          Start a conversation <ArrowUpRight size={18} />
        </a>
      </main>
      <Footer />
    </>
  );
}
