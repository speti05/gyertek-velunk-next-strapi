// Config files receive Strapi's env helper as a parameter - that is why this exports a
// function instead of a plain array. It must not be imported from "process": that is the

import { getClientUrl } from "../src/lib/config/client-url";

// process.env object, not a callable helper.
export default ( () => [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'frame-src': ["'self'", getClientUrl()],
        },
      },
    },
  },
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
