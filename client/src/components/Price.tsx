import { formatPrice } from "@/utils/format-price";

interface PriceProps {
  amount: string | number | null | undefined;
  currency?: string;
  className?: string;
}

/**
 * Every price on the site goes through this component so they all share one format:
 * thousands grouped with a dot, the currency after a non-breaking space.
 */
export function Price({ amount, currency, className }: Readonly<PriceProps>) {
  return (
    <span className={className}>
      {formatPrice(amount)}
      {currency && `\u00A0${currency}`}
    </span>
  );
}
