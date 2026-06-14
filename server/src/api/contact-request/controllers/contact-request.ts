/**
 * contact-request controller
 */

import { factories } from "@strapi/strapi";
import { sendContactRequestEmail } from "../../../lib/email/contact-request";

export default factories.createCoreController("api::contact-request.contact-request", ({ strapi }) => ({
  async create(ctx) {
    const { phone, email, preferredContact } = (ctx.request.body as any)?.data ?? {};

    const contactField = preferredContact === "phone" ? "phone" : "email";
    const contactValue = preferredContact === "phone" ? phone : email;

    if (contactValue) {
      const existing = await strapi.db
        .query("api::contact-request.contact-request")
        .findOne({ where: { [contactField]: contactValue } });

      if (existing) {
        return ctx.conflict("Ezzel a kapcsolati adattal már érkezett megkeresés.");
      }
    }

    const response = await super.create(ctx);

    const { name, phone: savedPhone, email: savedEmail, preferredContact: savedPreferred } = response.data;

    sendContactRequestEmail({
      name,
      phone: savedPhone ?? null,
      email: savedEmail ?? null,
      preferredContact: savedPreferred,
    }).catch((err) => console.error("Contact request email sending failed:", err));

    return response;
  },
}));
