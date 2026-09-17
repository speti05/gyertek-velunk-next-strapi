"use client";

import { createContext, useContext, useMemo } from "react";
import { DEFAULT_LOCALE, toPublicPath, type Locale } from "@/i18n/config";
import { getTexts, type Texts } from "@/i18n/texts";

interface LocaleContextType {
  locale: Locale;
}

const LocaleContext = createContext<LocaleContextType>({ locale: DEFAULT_LOCALE });

/**
 * Carries the active locale from the route params down to Client Components, which
 * cannot read params themselves. Mounted once in app/[locale]/layout.tsx.
 */
export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  const value = useMemo(() => ({ locale }), [locale]);
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): Locale {
  return useContext(LocaleContext).locale;
}

/** The Client Component counterpart of getTexts(params.locale). */
export function useTexts(): Texts {
  return getTexts(useLocale());
}

/**
 * Turns an internal href written in physical (English) form into the public href for
 * the active locale: "/tours" -> "/turaink" in Hungarian, "/en/tours" in English.
 */
export function useLocalizedPath(): (href: string) => string {
  const locale = useLocale();
  return useMemo(() => (href: string) => toPublicPath(href, locale), [locale]);
}
