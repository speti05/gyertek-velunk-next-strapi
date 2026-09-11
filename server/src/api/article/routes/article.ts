/**
 * article router
 */

import { factories } from "@strapi/strapi";

const hideDisabled = {
  name: "global::hide-disabled-content",
  config: { uid: "api::article.article" },
};

export default factories.createCoreRouter("api::article.article", {
  config: {
    find: { middlewares: [hideDisabled] },
    findOne: { middlewares: [hideDisabled] },
  },
});
