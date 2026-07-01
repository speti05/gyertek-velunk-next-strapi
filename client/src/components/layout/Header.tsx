"use client";
import type { LinkProps, LogoProps, SocialLinksProps } from "@/types";
import {
  AUTH_LOGIN_LABEL,
  AUTH_LOGOUT_LABEL,
  AUTH_PROFILE_NAV_LABEL,
  FOOTER_FACEBOOK_ARIA,
  FOOTER_INSTAGRAM_ARIA,
  FOOTER_TIKTOK_ARIA,
  LOGO_ALT_FALLBACK,
} from "@/utils/texts";
import { logoutAction } from "@/data/auth-actions";
import { useAuth } from "@/context/auth-context";
import CustomIcon, { type IconName } from "../custom-ui-components/custom-icon/custom-icon";
import CustomTooltip from "../custom-ui-components/custom-tooltip/custom-tooltip";
import CustomLink from "../custom-ui-components/custom-link/custom-link";
import { useState } from "react";
import { StrapiImage } from "../StrapiImage";

interface HeaderProps {
  data: {
    logo: LogoProps;
    navigation: LinkProps[];
    cta: LinkProps;
  };
  socialLinks?: SocialLinksProps;
}

const SOCIAL_LINKS: {
  key: "facebook" | "instagram" | "tiktok";
  ariaLabel: string;
  iconName: IconName;
}[] = [
  { key: "facebook", ariaLabel: FOOTER_FACEBOOK_ARIA, iconName: "facebook" },
  { key: "instagram", ariaLabel: FOOTER_INSTAGRAM_ARIA, iconName: "instagram" },
  { key: "tiktok", ariaLabel: FOOTER_TIKTOK_ARIA, iconName: "tiktok" },
];

export function Header({ data, socialLinks }: HeaderProps) {
  const [isActive, setIsActive] = useState(false);
  const { isLoggedIn, userEmail } = useAuth();
  if (!data) return null;

  const { logo, navigation } = data;
  const displayName = userEmail ? userEmail.split("@")[0] : "";

  const urlMap = {
    facebook: socialLinks?.facebookUrl,
    instagram: socialLinks?.instagramUrl,
    tiktok: socialLinks?.tiktokUrl,
  };
  const activeSocialLinks = SOCIAL_LINKS.filter(({ key }) => urlMap[key]);

  return (
    <>
      <header>
        <nav className="navbar">
          <ul className={`nav-menu ${isActive ? "active" : ""} no-list-style`}>
            {navigation.map((item) => (
              <li key={item.id}>
                <CustomLink
                  href={item.href}
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
            {isLoggedIn ? (
              <li className="navbar__auth-group">
                <CustomTooltip title={AUTH_PROFILE_NAV_LABEL} placement="bottom">
                  <span>
                    <CustomLink
                      href="/profile"
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
                      href="/login"
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
        {activeSocialLinks.length > 0 && (
          <>
            <CustomTooltip title={logo.image.alternativeText || LOGO_ALT_FALLBACK} placement="top">
              <span className="header__logo_wrapper">
                <CustomLink href="/" className="navbar__logo-link" color="white" underline="none">
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
            <div className="header__social-bar">
              <ul className="header__social no-list-style">
                {activeSocialLinks.map(({ key, ariaLabel, iconName }) => (
                  <li key={key}>
                    <CustomTooltip title={key} placement="bottom">
                      <span>
                        <CustomLink
                          href={urlMap[key]!}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={ariaLabel}
                          className="header__social-link"
                          color="white"
                          underline="none"
                          isHoverScaled
                        >
                          <CustomIcon name={iconName} size="3x" />
                        </CustomLink>
                      </span>
                    </CustomTooltip>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </header>
    </>
  );
}
