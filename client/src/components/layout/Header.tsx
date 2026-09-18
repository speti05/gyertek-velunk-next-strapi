"use client";
import type { LinkProps, LogoProps, SocialLinksProps } from "@/types";
import { useLocalizedPath, useTexts } from "@/context/locale-context";
import CustomTooltip from "../custom-ui-components/custom-tooltip/custom-tooltip";
import CustomLink from "../custom-ui-components/custom-link/custom-link";
import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { StrapiImage } from "../StrapiImage";
import { SocialLinks } from "./SocialLinks";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { HeaderAccount } from "./HeaderAccount";
import { Route } from "@/i18n/config";

/** Matches the nav-collapse breakpoint in sass/base/_mixins.scss - above it the menu
 *  panel is laid out into the header grid, below it the hamburger owns it. */
const NAV_COLLAPSE_QUERY = "(max-width: 78.125em)";

/** How far the page has to move before the utility bar slides out of the way. */
const SCROLL_THRESHOLD = 8;

interface HeaderProps {
  data: {
    logo: LogoProps;
    navigation: LinkProps[];
  };
  socialLinks?: SocialLinksProps;
  /** `showLanguageSwitcher` on the Strapi global settings - the site-wide switch for
   *  whether visitors are offered a language at all. */
  showLanguageSwitcher?: boolean;
}

export function Header({ data, socialLinks, showLanguageSwitcher = false }: HeaderProps) {
  const [isActive, setIsActive] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { HEADER_MENU_TOGGLE_LABEL, HEADER_NAV_LABEL, LOGO_ALT_FALLBACK, SITE_TITLE } = useTexts();
  const localizePath = useLocalizedPath();
  const pathname = usePathname();

  const closeMenu = useCallback(() => setIsActive(false), []);

  // Lock page scroll while the mobile menu overlay is open. The class goes on
  // both <html> and <body> because <html> is the scrolling element here.
  useEffect(() => {
    const { documentElement, body } = document;
    documentElement.classList.toggle("nav-menu-open", isActive);
    body.classList.toggle("nav-menu-open", isActive);
    return () => {
      documentElement.classList.remove("nav-menu-open");
      body.classList.remove("nav-menu-open");
    };
  }, [isActive]);

  useEffect(() => {
    if (!isActive) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isActive, closeMenu]);

  // Widening past the breakpoint hides the panel in CSS but would leave the scroll lock
  // behind, so the open state has to follow the breakpoint too.
  useEffect(() => {
    const query = window.matchMedia(NAV_COLLAPSE_QUERY);
    const sync = () => {
      if (!query.matches) closeMenu();
    };
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, [closeMenu]);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!data) return null;

  const { logo, navigation } = data;

  /**
   * A menu entry is current for its own page and for anything below it, so a tour's
   * detail page keeps its section marked. A fragment is ignored: entries that point at
   * a section of the home page ("/#turaink") count as current while that page is open.
   */
  const isCurrent = (href: string) => {
    const target = href.split("#")[0].split("?")[0] || "/";
    if (target === "/") return pathname === "/";
    return pathname === target || pathname.startsWith(`${target}/`);
  };

  // Nothing to put in the utility bar means it should not take up a band of its own.
  const hasSocialLinks = Boolean(
    socialLinks?.facebookUrl ||
      socialLinks?.instagramUrl ||
      socialLinks?.tiktokUrl ||
      socialLinks?.youtubeUrl
  );

  const hasUtilityBar = hasSocialLinks || showLanguageSwitcher;

  const headerClassName = [
    "site-header",
    // MUI pads the body by the scrollbar's width while a modal holds the scroll lock;
    // "mui-fixed" tells it to pad this fixed header too, so it does not shift sideways
    "mui-fixed",
    isActive ? "site-header--menu-open" : "",
    isScrolled && !isActive ? "site-header--scrolled" : "",
    hasUtilityBar ? "" : "site-header--no-utility",
  ]
    .filter(Boolean)
    .join(" ");

  // The spacer stands in for the fixed header's height and paints the same green behind
  // it, so it carries the same modifier - it reserves the height the header actually has.
  const spacerClassName = [
    "site-header__spacer",
    hasUtilityBar ? "" : "site-header__spacer--no-utility",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <header className={headerClassName}>
        <div className="site-header__inner">
          <CustomTooltip title={logo.image.alternativeText || LOGO_ALT_FALLBACK} placement="right">
            <span className="site-header__logo header__logo_wrapper">
              <CustomLink
                href={localizePath(Route.Home)}
                className="navbar__logo-link"
                color="white"
                underline="none"
                onClick={closeMenu}
              >
                <StrapiImage
                  src={logo.image.url}
                  alt={logo.image.alternativeText || LOGO_ALT_FALLBACK}
                  className="header__logo"
                  width={256}
                  height={174}
                />
              </CustomLink>
            </span>
          </CustomTooltip>

          {/* Only shown once the menu panel is open - closed, the badge carries the
              brand on its own and the row needs the width for the social links. */}
          <span className="site-header__brand">{SITE_TITLE}</span>

          {/* Left untouched on purpose: the bars and their transform into an X are the
              existing animation. The attributes below only name the control. */}
          <div
            className={`hamburger ${isActive ? "active" : ""}`}
            role="button"
            tabIndex={0}
            aria-label={HEADER_MENU_TOGGLE_LABEL}
            aria-expanded={isActive}
            aria-controls="site-header-panel"
            onClick={() => setIsActive(!isActive)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setIsActive(!isActive);
              }
            }}
          >
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>

          {/* display: contents above the breakpoint, so navigation, language and account
              drop straight into the header grid; a sliding overlay below it. */}
          <div className="site-header__panel" id="site-header-panel">
            {/* Lives in the panel so it can sit at the foot of the mobile menu. Above the
                breakpoint the panel is display: contents, so this still lands in the
                header grid's utility bar. */}
            <div className="site-header__socials">
              <SocialLinks
                socialLinks={socialLinks}
                as="div"
                variant="header"
                tooltipPlacement="bottom"
              />
            </div>

            <nav className="site-header__nav-wrap" aria-label={HEADER_NAV_LABEL}>
              <ul className="site-header__nav no-list-style">
                {navigation.map((item) => {
                  const href = localizePath(item.href);
                  const current = !item.isExternal && isCurrent(href);
                  return (
                    <li key={item.id}>
                      <CustomLink
                        href={href}
                        target={item.isExternal ? "_blank" : "_self"}
                        className="site-header__nav-link"
                        color="inherit"
                        underline="none"
                        aria-current={current ? "page" : undefined}
                        onClick={closeMenu}
                      >
                        <span className="site-header__nav-label">{item.text}</span>
                        <span className="site-header__nav-underline" aria-hidden="true"></span>
                      </CustomLink>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {showLanguageSwitcher && (
              <div className="site-header__language">
                <LanguageSwitcher onNavigate={closeMenu} variant="menu" />
                <LanguageSwitcher onNavigate={closeMenu} variant="radio" />
              </div>
            )}

            <div className="site-header__account">
              <HeaderAccount variant="desktop" />
              <HeaderAccount variant="mobile" onNavigate={closeMenu} />
            </div>
          </div>
        </div>
      </header>

      {/* The header is fixed, so the page needs its height back - and the same green
          behind it, so nothing pale shows through while the header slides. */}
      <div className={spacerClassName} aria-hidden="true"></div>
    </>
  );
}
