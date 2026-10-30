# Akibit launch notes

The current working identity is Akibit, not a verified registered business name. All showcase projects are fictional speculative concepts; no client relationship, past project authorship, testimonials or conversion results are claimed.

Accessibility foundations follow WCAG 2.2 principles: keyboard operation, semantic landmarks, visible focus, contrast, reduced motion, form labels/error feedback and responsive reflow. No audited conformance or blanket legal compliance is claimed. Source: https://www.w3.org/TR/WCAG22/

The ICO notice guidance identifies controller identity/contact, purposes, lawful basis, recipients, transfers, retention and rights as important notice information under UK rules. It is under review following UK legislation and does not establish the user's jurisdiction. Source: https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/individual-rights/the-right-to-be-informed/what-privacy-information-should-we-provide/

Before public launch, replace the working identity with the owner's name and contact details; confirm jurisdiction, controller details, lawful basis, retention schedule and hosting/subprocessor/transfer information; review the privacy notice with qualified local guidance. No optional analytics or marketing cookies will be added. Hosting/security services can still process technical request data.

Google Maps is described only as a manual discovery source. This project does not scrape listings, create prospect lists, automate outreach or claim Google affiliation. Public directory data is not permission for unsolicited marketing; review directory terms and applicable outreach/privacy rules before contacting a business. Obtain permission to use third-party photos, marks, and business identity in publishable concepts.

Canonical URL and absolute social tags must be set only after the owner chooses the actual public domain. Incoming enquiries are stored in the managed database; owner notifications are best-effort. The platform does not send confirmation email to visitors. Real test submissions would enter the production-shared database, so automated tests use mocks.

## Implementation evidence

TypeScript checks pass. The enquiry migration was applied without inserting test personal data. Mocked enquiry tests cover validation, honeypot, save failure, successful storage and notification failure. Public-page regression tests cover distinct route rendering, escaped metadata, missing-page status and omission of invented canonical origins. Raw Preview responses show meaningful initial home/privacy/accessibility HTML and genuine missing-page 404s; the route manifest returns JSON as declared.

A narrow same-origin browser frame (388 CSS-pixel viewport) has no horizontal overflow, one-column work cards, a working mobile navigation control and 16px form input text. Mobile menu and concept dialog opening/closing were checked without submitting data. This is a responsive simulation, not a real iPhone/Safari test or full accessibility audit.

Managed concept assets use the platform-owned /manus-storage route. The stable Preview and published gateway intercept those paths before Express; a direct localhost-port 404 is not evidence that project-storage assets are broken. No application storage proxy is needed under the current platform contract. Source: /home/ubuntu/skills/webdev/references/storage.md.

## Akibit redesign and Netlify review edition

Akibit is the owner-selected public brand, not a verified registered legal identity. The Netlify edition uses Netlify Forms rather than the Manus Preview database. Final Studio/Arcade hero image bytes were exported once, visually verified and included as portable WebP assets; no generation placeholders are published. The optional persisted dark preference changes the entire art direction. Search indexing remains disabled pending the existing owner/legal review. Theme and enquiry tests use mocks; no real enquiry was submitted in this redesign.
