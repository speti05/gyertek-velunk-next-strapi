export function getStrapiURL() {
  return process.env.STRAPI_API_URL ?? "http://localhost:1337";
}

// Media URLs end up in the browser and in Next's image optimizer, so they need a
// publicly reachable host. STRAPI_API_URL is server-only (Next replaces every
// non-NEXT_PUBLIC_ variable with undefined in client bundles) and points at the
// internal Docker hostname, which the optimizer refuses as a private IP.
export function getStrapiMediaURL() {
  return process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";
}
