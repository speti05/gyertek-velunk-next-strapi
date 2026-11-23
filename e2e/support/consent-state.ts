import path from "node:path";

/**
 * The browser state (the `cc_cookie` consent cookie) saved by setup/cookie-consent.setup.ts.
 * Kept apart from the other support files so playwright.config.ts can import it cheaply.
 */
export const CONSENT_STATE = path.resolve(__dirname, "../.state/consent.json");
