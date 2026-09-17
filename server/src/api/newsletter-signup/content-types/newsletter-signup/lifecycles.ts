import { sendNewsletterSignupEmails } from "../../../../lib/email/newsletter-signup";
import { readRequestLocale, DEFAULT_LOCALE } from "../../../../i18n/get-strapi-texts";

export default {
  async afterCreate(event: any) {
    const { email, publishedAt } = event.result ?? {};

    // checking for publishedAt to avoid double email sending
    // create and publish triggers both afterCreate
    if (!email || !publishedAt) return;

    // A lifecycle gets no ctx of its own. Strapi keeps the running request's context in
    // AsyncLocalStorage, which is how the visitor's language reaches us here; a signup
    // created outside a request (admin, seed) has none, so it falls back to the default.
    const ctx = strapi.requestContext.get();
    const locale = ctx ? readRequestLocale(ctx as any) : DEFAULT_LOCALE;

    sendNewsletterSignupEmails(email, locale).catch((err) =>
      console.error("Newsletter signup emails failed:", err)
    );
  },
};
