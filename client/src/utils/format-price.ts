/**
 * Prices are stored in Strapi as a digits-only string. Anything else is stripped so an
 * older entry typed as "90 000" or "90.000" still reads as 90000 rather than 90.
 */
export function parsePrice(price: string | number | null | undefined): number {
  if (typeof price === "number") return price;
  if (!price) return 0;
  const digits = price.replace(/\D/g, "");
  return digits ? Number(digits) : 0;
}

/**
 * Groups the thousands with a dot (90000 -> "90.000") in every language. This is done by
 * hand rather than through Intl, because hu-HU groups with a space and en with a comma.
 */
export function formatPrice(price: string | number | null | undefined): string {
  return Math.round(parsePrice(price))
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
