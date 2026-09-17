/**
 * contact-request controller
 */

import { factories } from "@strapi/strapi";
import { sendContactRequestEmails } from "../../../lib/email/contact-request";
import { getStrapiTexts, readRequestLocale } from "../../../i18n/get-strapi-texts";

// How long the same phone number / email address is blocked from sending
// another request. Without a window a visitor could never reach us twice.
const DUPLICATE_WINDOW_HOURS = 24;

export default factories.createCoreController("api::contact-request.contact-request", ({ strapi }) => ({
  async create(ctx) {
    const locale = readRequestLocale(ctx);
    const texts = getStrapiTexts(locale);
    const { phone, email, preferredContact } = (ctx.request.body as any)?.data ?? {};

    const contactField = preferredContact === "phone" ? "phone" : "email";
    const contactValue = preferredContact === "phone" ? phone : email;

    if (contactValue) {
      const since = new Date(Date.now() - DUPLICATE_WINDOW_HOURS * 60 * 60 * 1000);

      const existing = await strapi.db
        .query("api::contact-request.contact-request")
        .findOne({ where: { [contactField]: contactValue, createdAt: { $gte: since } } });

      if (existing) {
        return ctx.conflict(texts.CONTACT_REQUEST_DUPLICATE_ERROR(DUPLICATE_WINDOW_HOURS));
      }
    }

    const response = await super.create(ctx);

    const { name, phone: savedPhone, email: savedEmail, preferredContact: savedPreferred } = response.data;

    // Deliberately not awaited: a mail problem must not fail the saved request.
    sendContactRequestEmails(
      {
        name,
        phone: savedPhone ?? null,
        email: savedEmail ?? null,
        preferredContact: savedPreferred,
      },
      locale
    ).catch((err) => {
      strapi.log.error(
        `Contact request email sending failed for "${name}" (${savedPreferred}: ${
          savedPhone ?? savedEmail ?? "n/a"
        }): ${err.message}`
      );
    });

    return response;
  },
}));
