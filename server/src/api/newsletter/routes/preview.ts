/**
 * Newsletter preview for the Strapi admin's preview panel. The iframe cannot send the admin
 * token, so the route is public and guarded by PREVIEW_SECRET in the controller instead.
 */

export default {
  routes: [
    {
      method: "GET",
      path: "/newsletters/:documentId/preview",
      handler: "newsletter.preview",
      config: { auth: false, middlewares: [] },
    },
  ],
};
