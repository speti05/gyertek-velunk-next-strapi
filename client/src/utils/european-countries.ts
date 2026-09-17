import { DEFAULT_LOCALE, type Locale } from "@/i18n/config";

/**
 * The countries offered in the billing-address and country-of-birth selects.
 *
 * `value` is the **stored** value: it is what gets saved on the profile and on an event
 * signup, what the admin notification e-mail prints, and what already sits in the
 * database. It therefore stays Hungarian in every locale - only the visible label is
 * translated, the same rule the document-type and "other" options in TourSignupDialog
 * follow.
 *
 * `en` is that label in English. A locale with no column here falls back to the value.
 */
const COUNTRIES = [
  { value: "Albánia", en: "Albania" },
  { value: "Andorra", en: "Andorra" },
  { value: "Ausztria", en: "Austria" },
  { value: "Azerbajdzsán", en: "Azerbaijan" },
  { value: "Belarusz", en: "Belarus" },
  { value: "Belgium", en: "Belgium" },
  { value: "Bosznia-Hercegovina", en: "Bosnia and Herzegovina" },
  { value: "Bulgária", en: "Bulgaria" },
  { value: "Ciprus", en: "Cyprus" },
  { value: "Csehország", en: "Czechia" },
  { value: "Dánia", en: "Denmark" },
  { value: "Észtország", en: "Estonia" },
  { value: "Finnország", en: "Finland" },
  { value: "Franciaország", en: "France" },
  { value: "Görögország", en: "Greece" },
  { value: "Grúzia", en: "Georgia" },
  { value: "Hollandia", en: "Netherlands" },
  { value: "Horvátország", en: "Croatia" },
  { value: "Írország", en: "Ireland" },
  { value: "Izland", en: "Iceland" },
  { value: "Kazahsztán", en: "Kazakhstan" },
  { value: "Koszovó", en: "Kosovo" },
  { value: "Lengyelország", en: "Poland" },
  { value: "Lettország", en: "Latvia" },
  { value: "Liechtenstein", en: "Liechtenstein" },
  { value: "Litvánia", en: "Lithuania" },
  { value: "Luxemburg", en: "Luxembourg" },
  { value: "Macedónia", en: "North Macedonia" },
  { value: "Magyarország", en: "Hungary" },
  { value: "Málta", en: "Malta" },
  { value: "Moldova", en: "Moldova" },
  { value: "Monaco", en: "Monaco" },
  { value: "Montenegró", en: "Montenegro" },
  { value: "Németország", en: "Germany" },
  { value: "Norvégia", en: "Norway" },
  { value: "Olaszország", en: "Italy" },
  { value: "Oroszország", en: "Russia" },
  { value: "Portugália", en: "Portugal" },
  { value: "Románia", en: "Romania" },
  { value: "San Marino", en: "San Marino" },
  { value: "Spanyolország", en: "Spain" },
  { value: "Svájc", en: "Switzerland" },
  { value: "Svédország", en: "Sweden" },
  { value: "Szerbia", en: "Serbia" },
  { value: "Szlovákia", en: "Slovakia" },
  { value: "Szlovénia", en: "Slovenia" },
  { value: "Törökország", en: "Turkey" },
  { value: "Ukrajna", en: "Ukraine" },
  { value: "Vatikán", en: "Vatican City" },
] as const satisfies readonly { value: string; en: string }[];

export interface CountryOption {
  /** Persisted, language independent. */
  value: string;
  /** Shown in the select, translated. */
  name: string;
}

/**
 * The country list for a locale, sorted alphabetically by the visible label - a dropdown
 * that reads in Hungarian order while showing English names is hard to scan.
 */
export function getEuropeanCountries(locale: Locale = DEFAULT_LOCALE): CountryOption[] {
  return COUNTRIES.map((country) => ({
    value: country.value,
    name: locale === "en" ? country.en : country.value,
  })).sort((a, b) => a.name.localeCompare(b.name, locale));
}

/** The default is a stored value, so it is the Hungarian name in every locale. */
export const DEFAULT_COUNTRY = "Magyarország";
