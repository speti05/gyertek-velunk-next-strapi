import type { Core } from "@strapi/strapi";

/** The Koa context Strapi hands to controllers and middlewares. */
export type StrapiContext = Parameters<Core.MiddlewareHandler>[0];
