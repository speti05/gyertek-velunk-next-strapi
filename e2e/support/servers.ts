/**
 * Where the e2e apps listen - next to, not instead of, a running `yarn dev` (1337 / 3000).
 * Read by playwright.config.ts and by the tests that talk to Strapi directly.
 */
export const STRAPI_PORT = 1338;
export const CLIENT_PORT = 3001;
export const STRAPI_URL = `http://localhost:${STRAPI_PORT}`;
export const CLIENT_URL = `http://localhost:${CLIENT_PORT}`;
