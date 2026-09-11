/**
 * blog router
 */

import { factories } from "@strapi/strapi";

const hideDisabled = {
  name: "global::hide-disabled-content",
  config: { uid: "api::blog.blog" },
};

export default factories.createCoreRouter("api::blog.blog", {
  config: {
    find: { middlewares: [hideDisabled] },
    findOne: { middlewares: [hideDisabled] },
  },
});
