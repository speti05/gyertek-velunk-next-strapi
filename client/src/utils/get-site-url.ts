// Public URL of this site (e.g. https://gyertekvelunk.eu), used wherever an absolute URL
// is needed: metadata base, canonical and Open Graph URLs, links pointing back at the site.
//
// NEXT_PUBLIC_ so it is available in client components too. Like every NEXT_PUBLIC_
// variable it is inlined at build time, so in production it comes from a Docker build arg
// (see client/Dockerfile and .github/workflows/deploy.yml), not from the runtime env.
//
// Deliberately has no fallback: a silent default would bake the wrong host into the
// metadata of every page, so a missing value has to fail loudly instead. Note that a
// missing build arg arrives as an empty string, not as undefined.
export function getSiteURL(): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!siteUrl) {
    throw new Error(
      "NEXT_PUBLIC_SITE_URL is not set. It is baked in at build time: locally from client/.env.local, in production from the NEXT_PUBLIC_SITE_URL build arg (a GitHub Actions repository variable)."
    );
  }

  return siteUrl;
}
