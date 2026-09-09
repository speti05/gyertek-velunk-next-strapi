/**
 * Public URL of the Next.js frontend (e.g. https://gyertekvelunk.eu).
 *
 * Used for the auth redirect targets written into the users-permissions settings, for
 * links and footers in outgoing e-mails, and for the unsubscribe page. This replaces the
 * former SITE_URL variable, which held the same value.
 *
 * Deliberately has no fallback: a silent default sends confirmation and password reset
 * links to the wrong host, so a missing value has to fail loudly instead.
 */
export function getClientUrl(): string {
  return process.env.CLIENT_URL;
}

/**
 * Checks once at boot when CLIENT_URL is missing.
 */
export function throwErrorIfClientUrlMissing(strapi: { log: { warn: (msg: string) => void } }) {
  if (!getClientUrl()) {
    throw new Error(
      `CLIENT_URL is not set, so the links in confirmation and password reset e-mails will point to the wrong host. Please set CLIENT_URL to the public URL of the Next.js frontend.`
    );
  }
}
