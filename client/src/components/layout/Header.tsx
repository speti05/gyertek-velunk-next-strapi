"use client";
import type { LinkProps, LogoProps, SocialLinksProps } from "@/types";
import { useLocalizedPath, useTexts } from "@/context/locale-context";
import { logoutAction } from "@/data/auth-actions";
import { useAuth } from "@/context/auth-context";
import CustomIcon from "../custom-ui-components/custom-icon/custom-icon";
import CustomTooltip from "../custom-ui-components/custom-tooltip/custom-tooltip";
import CustomLink from "../custom-ui-components/custom-link/custom-link";
import { useEffect, useState } from "react";
import { StrapiImage } from "../StrapiImage";
import { SocialLinks } from "./SocialLinks";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Route } from "@/i18n/config";

interface HeaderProps {
  data: {
    logo: LogoProps;
    navigation: LinkProps[];
    cta: LinkProps;
  };
  socialLinks?: SocialLinksProps;
  /** `showLanguageSwitcher` on the Strapi global settings - the site-wide switch for
   *  whether visitors are offered a language at all. */
  showLanguageSwitcher?: boolean;
}

export function Header({ data, socialLinks, showLanguageSwitcher = false }: HeaderProps) {
  const [isActive, setIsActive] = useState(false);
  const { isLoggedIn, userEmail } = useAuth();
  const { AUTH_LOGIN_LABEL, AUTH_LOGOUT_LABEL, AUTH_PROFILE_NAV_LABEL, LOGO_ALT_FALLBACK } =
    useTexts();
  const localizePath = useLocalizedPath();

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

  if (!data) return null;

  const { logo, navigation } = data;
  const displayName = userEmail ? userEmail.split("@")[0] : "";

  return (
    <>
      <header>
        <nav className="navbar">
          <SocialLinks socialLinks={socialLinks} as="div" variant="header" tooltipPlacement="bottom" />
          <ul className={`nav-menu ${isActive ? "active" : ""} no-list-style`}>
            {navigation.map((item) => (
              <li key={item.id}>
                <CustomLink
                  href={localizePath(item.href)}
                  target={item.isExternal ? "_blank" : "_self"}
                  color="white"
                  underline="none"
                  isHoverScaled
                >
                  <span className="nav-link" onClick={() => setIsActive(false)}>
                    {item.text}
                  </span>
                </CustomLink>
              </li>
            ))}
            {showLanguageSwitcher && (
              <li className="navbar__language">
                <LanguageSwitcher onNavigate={() => setIsActive(false)} />
              </li>
            )}
            {isLoggedIn ? (
              <li className="navbar__auth-group">
                <CustomTooltip title={AUTH_PROFILE_NAV_LABEL} placement="bottom">
                  <span>
                    <CustomLink
                      href={localizePath(Route.Profile)}
                      className="navbar__auth-link"
                      onClick={() => setIsActive(false)}
                      color="white"
                      underline="none"
                    >
                      <CustomIcon name="person" fontSize="inherit" />
                      <span className="navbar__auth-name">{displayName}</span>
                    </CustomLink>
                  </span>
                </CustomTooltip>
                <form action={logoutAction}>
                  <CustomTooltip title={AUTH_LOGOUT_LABEL} placement="bottom">
                    <button
                      type="submit"
                      className="navbar__auth-btn"
                      aria-label={AUTH_LOGOUT_LABEL}
                      suppressHydrationWarning
                    >
                      <CustomIcon name="logout" fontSize="inherit" />
                    </button>
                  </CustomTooltip>
                </form>
              </li>
            ) : (
              <li>
                <CustomTooltip title={AUTH_LOGIN_LABEL} placement="bottom">
                  <span>
                    <CustomLink
                      href={localizePath(Route.Login)}
                      className="navbar__auth-link"
                      onClick={() => setIsActive(false)}
                      color="white"
                      underline="none"
                      isHoverScaled
                    >
                      <CustomIcon name="login" fontSize="inherit" />
                    </CustomLink>
                  </span>
                </CustomTooltip>
              </li>
            )}
          </ul>
          <div
            className={`hamburger ${isActive ? "active" : ""}`}
            onClick={() => setIsActive(!isActive)}
          >
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
        </nav>
        <CustomTooltip title={logo.image.alternativeText || LOGO_ALT_FALLBACK} placement="top">
          <span className="header__logo_wrapper">
            <CustomLink href={localizePath(Route.Home)} className="navbar__logo-link" color="white" underline="none">
              <StrapiImage
                src={logo.image.url}
                alt={logo.image.alternativeText || LOGO_ALT_FALLBACK}
                className={`header__logo `}
                width={256}
                height={174}
              />
            </CustomLink>
          </span>
        </CustomTooltip>
      </header>
    </>
  );
}
