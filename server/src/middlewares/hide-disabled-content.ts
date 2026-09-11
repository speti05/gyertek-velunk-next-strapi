/**
 * Hides entries flagged as `disabled` from everyone outside the TestUser role.
 *
 * This is enforced here rather than in the front-end queries, so the REST API itself
 * never hands disabled entries to an unprivileged caller.
 */

import type { Core, UID } from "@strapi/strapi";
import { TEST_USER_ROLE_TYPE } from "../lib/auth/test-user-role";

// Older entries created before the flag existed have no value, so treat null as enabled.
const NOT_DISABLED = {
  $or: [{ disabled: { $null: true } }, { disabled: { $eq: false } }],
};

type Config = { uid: UID.ContentType };

/**
 * A full-access API token is an owner-issued server-to-server credential (the content
 * import/export tooling uses one), so it is trusted with disabled entries. Read-only and
 * custom tokens are not: those are handed out for public-facing reads.
 */
const isFullAccessToken = (ctx: { state?: Record<string, any> }) =>
  ctx.state?.auth?.strategy?.name === "api-token" &&
  ctx.state?.auth?.credentials?.type === "full-access";

const hideDisabledContent = (
  config: Config,
  { strapi }: { strapi: Core.Strapi }
): Core.MiddlewareHandler => {
  return async (ctx, next) => {
    if (ctx.state?.user?.role?.type === TEST_USER_ROLE_TYPE || isFullAccessToken(ctx)) {
      return next();
    }

    // findOne resolves by documentId and ignores query filters, so it needs its own lookup.
    const documentId = ctx.params?.id;
    if (documentId) {
      const entry = await strapi.documents(config.uid).findOne({
        documentId,
        // `fields` is not narrowable against a generic UID, hence the cast.
        fields: ["disabled"] as never,
        status: ctx.query?.status === "draft" ? "draft" : "published",
      });
      if ((entry as { disabled?: boolean } | null)?.disabled === true) {
        return ctx.notFound();
      }
      return next();
    }

    // Combined with $and so a caller cannot widen it by sending its own `disabled` filter.
    const { filters, ...rest } = (ctx.query ?? {}) as Record<string, unknown>;
    ctx.query = {
      ...rest,
      filters: filters ? { $and: [filters, NOT_DISABLED] } : NOT_DISABLED,
    };

    return next();
  };
};

export default hideDisabledContent;
