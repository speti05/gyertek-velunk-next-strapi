import { INTL_LOCALE, type Locale } from "@/i18n/config";
import { getTexts } from "@/i18n/texts";

/**
 * Renders a date in the active locale's convention - month and weekday names included,
 * so the locale is a required argument rather than a default: a missed call site should
 * be a type error, not a Hungarian date on the English site.
 *
 * Server Components pass `await getRequestLocale()`, Client Components `useLocale()`.
 */
export function formatDate(dateString: string, locale: Locale): string {
  try {
    // Parse ISO string to Date object
    const date = dateString ? new Date(dateString) : new Date();

    // Check if date is valid
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date string");
    }

    // Format the date using Intl.DateTimeFormat for more consistent results
    const formatter = new Intl.DateTimeFormat(INTL_LOCALE[locale], {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return formatter.format(date);
  } catch (error) {
    console.error(`Error formatting date: ${dateString}`, error);
    return getTexts(locale).DATE_INVALID;
  }
}

/**
 * The date a blog post shows on its card and page: the editor-set `displayedDate`
 * when there is one, otherwise the publication date.
 */
export function getBlogDate({
  displayedDate,
  publishedAt,
}: {
  displayedDate?: string | null;
  publishedAt?: string | null;
}): string | undefined {
  return displayedDate || publishedAt || undefined;
}

/**
 * Renders an optional start/end date pair. Either end may be missing; when both are,
 * returns undefined so the caller can omit the date entirely.
 */
export function formatDateRange(
  startDate: string | null | undefined,
  endDate: string | null | undefined,
  locale: Locale,
): string | undefined {
  const dates = [startDate, endDate].filter((date): date is string => Boolean(date));
  if (dates.length === 0) return undefined;
  if (dates.length === 2 && dates[0] === dates[1]) return formatDate(dates[0], locale);
  return dates.map((date) => formatDate(date, locale)).join(" – ");
}
