import type { Core } from "@strapi/strapi";
import { errors } from "@strapi/utils";
import { getSiteSettings } from "../email/get-site-settings";
import {
  NEWSLETTER_UID,
  buildNewsletterEmail,
  loadNewsletter,
} from "../email/newsletter/build-newsletter";
import { NewsletterBuildError } from "../email/newsletter/newsletter-limits";

/**
 * Publishing a newsletter sends it (see the lifecycle in src/index.ts). This builds the
 * e-mail from the draft first, so a newsletter that is too large, empty, or has an image
 * that cannot be processed is rejected in the admin panel with a readable message instead
 * of failing silently in the server log after publishing.
 */
export function applyNewsletterPublishCheck(strapi: Core.Strapi) {
  strapi.documents.use(async (context, next) => {
    if (context.uid !== NEWSLETTER_UID || context.action !== "publish") return next();

    const { documentId } = context.params as { documentId?: string };
    const draft = documentId ? await loadNewsletter(documentId, "draft") : null;

    if (draft) {
      try {
        const { organizationName } = await getSiteSettings();
        await buildNewsletterEmail(draft, organizationName);
      } catch (err) {
        if (err instanceof NewsletterBuildError) throw new errors.ValidationError(err.message);
        throw err;
      }
    }

    return next();
  });
}
