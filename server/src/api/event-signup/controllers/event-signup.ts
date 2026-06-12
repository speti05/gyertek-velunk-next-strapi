/**
 * event-signup controller
 */

// src/api/event-signup/controllers/event-signup.ts
import { factories } from "@strapi/strapi";
import { sendSignupEmails } from "../../../lib/email/event-signup";

export default factories.createCoreController("api::event-signup.event-signup", ({ strapi }) => ({
  async find(ctx) {
    const userId = ctx.state.user?.id;
    if (!userId) {
      return ctx.unauthorized();
    }

    const entries = await strapi.db.query("api::event-signup.event-signup").findMany({
      where: { user: { id: userId } },
      populate: {
        event: {
          select: ["title", "startDate", "price", "slug", "documentId"],
        },
      },
    });

    return { data: entries };
  },

  async create(ctx) {
    // Populate the event relation to include event details in the response
    ctx.query = { ...ctx.query, populate: ["event"] };
    // Let Strapi handle the DB save as normal
    const response = await super.create(ctx);

    // Grab the data that was just saved, including the populated event
    const { email, firstName, lastName, event, telephone } = response.data;
    const eventName = event?.title || "Unknown Event";

    // Send emails — non-blocking, won't affect the API response
    sendSignupEmails({ userEmail: email, firstName, lastName, eventName, telephone }).catch((err) =>
      console.error("Email sending failed:", err)
    );

    // Return the original Strapi response untouched
    return response;
  },
}));
