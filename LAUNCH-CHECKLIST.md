# Akibit launch checklist

This checklist applies the supplied Websitecreationfromzerotolaunch.docx: reduce scope before reducing reliability. The site is deployed as a Netlify review version at https://akibit.netlify.app; technical deployment is not a finalized business-launch approval.

## Owner decisions before launch

- [ ] Akibit is the approved public brand; confirm the legal business name, personal/about copy and a direct contact address.
- [ ] Confirm the target market and jurisdiction. Finalize the privacy controller/contact, purposes and lawful basis, retention period, providers, transfers/safeguards and applicable rights. Review policy needs with qualified local guidance.
- [ ] Approve all copy and concept labels. Replace speculative examples only with authentic work and licensed assets; never imply fictional brands are clients.
- [ ] Confirm scope, budget, review window, approver and backup approver. Agree who receives/responds to enquiries and expected follow-up timing.
- [ ] Choose the business-controlled domain and verify access to DNS, hosting and business email. Keep MFA on administrative accounts; preserve existing email/verification DNS records.
- [ ] Review hosting costs, limits, maintenance and export/backup responsibilities. Choose GitHub saving and/or a Google Drive handover if wanted.

## Before go-live

- [ ] Verify the finished Studio/Arcade hero artwork on the target domain. The old concept photography is intentionally excluded from Netlify; the fictional concepts use complete typography-led layouts.
- [ ] Set PUBLIC_SITE_ORIGIN to the real HTTPS origin. Add verified absolute social preview image/URL metadata and check the platform sitemap/robots output on the canonical domain. Never use an internal Preview origin as canonical.
- [ ] Test the essential journey on a real iPhone/Safari and desktop: main CTA → enquiry → actual storage → owner notification. Obtain owner approval before inserting test personal data; this managed database is shared by Preview and production.
- [ ] Check valid, invalid, empty and repeated submissions, clear errors and notification failure follow-up. The Manus Preview backend uses temporary in-memory rate limits; the Netlify edition uses Netlify Forms spam filtering and a honeypot. Review the actual production destination and notification settings.
- [ ] Verify keyboard navigation, focus visibility/return, dialog closing, form labels/errors, text zoom and narrow layouts. Automated/source checks do not replace manual or independent accessibility review.
- [ ] Check missing assets, 404s and runtime errors. Measure performance under representative conditions; LCP ≤2.5s, INP ≤200ms and CLS ≤0.1 are goals, not measured claims.
- [ ] Confirm no secrets or enquiry data enter client bundles, public pages, logs or analytics. Optional site/badge analytics are disabled; infrastructure may still process technical request data.
- [ ] Freeze features and record go/no-go approval. Do not launch a broken enquiry journey or unresolved privacy/security exposure.

## Release and fallback

- [ ] Record the intended Manus checkpoint and retain the last known-good release. Keep a safe maintenance fallback for the first launch.
- [ ] Back up relevant content and data with an approved export. A code rollback does not reverse database changes; the current enquiry migration is additive.
- [ ] Publish only after owner go/no-go and during a window when someone can respond. Verify HTTPS, canonical domain, route status and a real approved enquiry receipt immediately afterwards.
- [ ] Confirm notification recipient, failure review and maintenance ownership. If an essential action fails or data is exposed, contain the issue and restore the known-good version where safe.

## Handover

- [ ] Deliver business-controlled domain/hosting/code access, source, final copy, assets and their licences, policy review notes, release reference and rollback instructions.
- [ ] Agree a retention/deletion workflow and backups for stored enquiries. No public admin dashboard, background maintenance or recurring monitoring is created by this project.
- [ ] Review improvement opportunities after reliable launch. A CMS, booking integrations, real case studies and consent-reviewed analytics belong to later scope unless agreed otherwise.
