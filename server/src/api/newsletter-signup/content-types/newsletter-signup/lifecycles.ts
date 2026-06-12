import { sendNewsletterSignupEmails } from "../../../../lib/email/newsletter-signup";

export default {
  async afterCreate(event: any) {
    const { email, publishedAt } = event.result ?? {};

    // checking for publishedAt to avoid double email sending
    // create and publish triggers both afterCreate
    if (!email || !publishedAt) return;
    sendNewsletterSignupEmails(email).catch((err) =>
      console.error("Newsletter signup emails failed:", err)
    );
  },
};
