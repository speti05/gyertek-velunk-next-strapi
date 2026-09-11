/**
 * event router
 */

import { factories } from "@strapi/strapi";

const hideDisabled = {
  name: "global::hide-disabled-content",
  config: { uid: "api::event.event" },
};

export default factories.createCoreRouter("api::event.event", {
  config: {
    find: { middlewares: [hideDisabled] },
    findOne: { middlewares: [hideDisabled] },
  },
});
