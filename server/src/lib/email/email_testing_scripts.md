# Email testing scripts

PowerShell scripts that generate HTML files from email templates — open them in a browser to preview the rendered output.

All scripts invoke `ts-node` from the `server/` root.

---

## System emails (non-Strapi)

### `email-previews/generate_all_email_previews.ps1`

Generates HTML previews for all transactional (non-newsletter, non-Strapi) emails at once.
Output directory: `email-previews/output/`

| Generated file | Email |
|---|---|
| `newsletter-signup-user.html` | Newsletter subscription confirmation (to subscriber) |
| `newsletter-signup-admin.html` | Newsletter subscription notification (to admin) |
| `contact-request/contact-request-admin-both.html` | Contact request — phone + email provided |
| `contact-request/contact-request-admin-email-only.html` | Contact request — email only |
| `contact-request/contact-request-admin-phone-only.html` | Contact request — phone only |
| `event-signup-user.html` | Event signup confirmation (to user) |
| `event-signup-admin/event-signup-admin-full.html` | Event signup (to admin) — full data with companion and invoice |
| `event-signup-admin/event-signup-admin-minimal.html` | Event signup (to admin) — minimal data |

---

## Newsletter

### `newsletter/generate_newsletter_preview.ps1`

Generates a sample newsletter HTML from `newsletter/newsletter-preview-template.ts`.
Output: `newsletter/newsletter-preview.html`

---

## Strapi system emails

These are pasted into the Strapi admin panel under the email plugin settings.

### `templates-of-strapi-emails/email-address-confirmaition/generate_emai_confirmation_html_template_for_strapi_admin.ps1`

Generates the email address confirmation HTML.
Output: `templates-of-strapi-emails/email-address-confirmaition/email-address-confirmation.html`

### `templates-of-strapi-emails/reset-password/generate_reset_password_html_template_for_strapi_admin.ps1`

Generates the forgot password email HTML.
Output: `templates-of-strapi-emails/reset-password/reset-password.html`
