"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { LOCALES, switchLocalePath, type Locale } from "@/i18n/config";
import { useLocale, useTexts } from "@/context/locale-context";
import CustomIcon from "../custom-ui-components/custom-icon/custom-icon";
import CustomFlag from "../custom-ui-components/custom-flag/custom-flag";
import CustomTooltip from "../custom-ui-components/custom-tooltip/custom-tooltip";
import { CustomMenu, CustomMenuItem } from "../custom-ui-components/custom-menu/custom-menu";
import CustomRadioGroup from "../custom-ui-components/custom-radio/custom-radio";

interface LanguageSwitcherProps {
  /**
   * Public href per locale for the page currently shown. Pages that display one Strapi
   * entry must pass this, because the entry's slug differs per locale and cannot be
   * derived from the URL. Without it the current path is reused with only the section
   * segment translated, which is correct for every route that carries no slug.
   */
  alternates?: Partial<Record<Locale, string>>;
  onNavigate?: () => void;
  /**
   * How the choice is offered. "menu" is the compact trigger + dropdown used in the
   * header's utility bar; "radio" is the expanded group used inside the mobile menu
   * panel, where there is room to show every language at once and no second layer of
   * overlay is wanted on top of the panel.
   */
  variant?: "menu" | "radio";
}

export function LanguageSwitcher({
  alternates,
  onNavigate,
  variant = "menu",
}: Readonly<LanguageSwitcherProps>) {
  const { LANGUAGE_NAMES, LANGUAGE_SHORT_NAMES, LANGUAGE_SWITCHER_LABEL } = useTexts();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const activeLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const hrefFor = (locale: Locale) => alternates?.[locale] ?? switchLocalePath(pathname, locale);

  const select = (locale: Locale) => {
    setAnchorEl(null);
    onNavigate?.();
    if (locale !== activeLocale) {
      // A full navigation rather than a soft push: the locale changes the whole tree,
      // including the <html lang> attribute rendered by the layout.
      router.push(hrefFor(locale));
      router.refresh();
    }
  };

  if (variant === "radio") {
    return (
      <div className="language-switcher language-switcher--radio">
        <CustomRadioGroup
          name="header-locale"
          reserveHelperSpace={false}
          label={LANGUAGE_SWITCHER_LABEL}
          value={activeLocale}
          onChange={(value) => select(value as Locale)}
          options={LOCALES.map((locale) => ({
            value: locale,
            label: LANGUAGE_NAMES[locale],
            icon: <CustomFlag locale={locale} className="language-switcher__flag" />,
          }))}
        />
      </div>
    );
  }

  return (
    <div className="language-switcher language-switcher--menu">
      <CustomTooltip title={LANGUAGE_SWITCHER_LABEL} placement="bottom">
        <button
          type="button"
          className="language-switcher__trigger"
          onClick={(event) => setAnchorEl(event.currentTarget)}
          aria-label={LANGUAGE_SWITCHER_LABEL}
          aria-haspopup="menu"
          aria-expanded={Boolean(anchorEl)}
          suppressHydrationWarning
        >
          <CustomFlag locale={activeLocale} className="language-switcher__flag" />
          <span className="language-switcher__current">{LANGUAGE_SHORT_NAMES[activeLocale]}</span>
          <CustomIcon name="expandMore" fontSize="inherit" />
        </button>
      </CustomTooltip>

      <CustomMenu
        color="primary"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {LOCALES.map((locale) => (
          <CustomMenuItem
            key={locale}
            className="language-switcher__option"
            selected={locale === activeLocale}
            onClick={() => select(locale)}
            lang={locale}
          >
            <span className="language-switcher__option-inner">
              <CustomFlag locale={locale} className="language-switcher__flag" />
              <span>{LANGUAGE_NAMES[locale]}</span>
            </span>
          </CustomMenuItem>
        ))}
      </CustomMenu>
    </div>
  );
}
