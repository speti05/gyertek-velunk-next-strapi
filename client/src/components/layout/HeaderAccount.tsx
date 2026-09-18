"use client";

import { useRef, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { useLocalizedPath, useTexts } from "@/context/locale-context";
import { logoutAction } from "@/data/auth-actions";
import { Route } from "@/i18n/config";
import CustomIcon from "../custom-ui-components/custom-icon/custom-icon";
import CustomLink from "../custom-ui-components/custom-link/custom-link";
import CustomTooltip from "../custom-ui-components/custom-tooltip/custom-tooltip";
import { CustomMenu, CustomMenuItem } from "../custom-ui-components/custom-menu/custom-menu";

interface HeaderAccountProps {
  /**
   * "desktop" is the compact pill that opens a two-entry dropdown; "mobile" lays the
   * same two destinations out flat inside the menu panel, where a dropdown on top of an
   * overlay would be a second layer for no gain.
   *
   * Both are rendered at once and one is hidden per breakpoint in CSS - the breakpoint
   * cannot be read during server rendering, and a hidden subtree is out of the
   * accessibility tree, so neither duplicate reaches assistive technology.
   */
  variant: "desktop" | "mobile";
  /** Closes the mobile menu panel when a destination inside it is chosen. */
  onNavigate?: () => void;
}

export function HeaderAccount({ variant, onNavigate }: Readonly<HeaderAccountProps>) {
  const { isLoggedIn, userEmail } = useAuth();
  const {
    AUTH_LOGIN_LABEL,
    AUTH_LOGOUT_LABEL,
    AUTH_PROFILE_NAV_LABEL,
    HEADER_ACCOUNT_MENU_LABEL,
  } = useTexts();
  const localizePath = useLocalizedPath();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const logoutFormRef = useRef<HTMLFormElement>(null);

  const displayName = userEmail ? userEmail.split("@")[0] : "";
  const initial = displayName.charAt(0).toUpperCase();
  const profileHref = localizePath(Route.Profile);
  const loginHref = localizePath(Route.Login);

  const loginButton = (
    <CustomLink
      href={loginHref}
      className={`header-auth-button header-auth-button--${variant}`}
      color="inherit"
      underline="none"
      onClick={onNavigate}
    >
      <span className="header-auth-button__inner">
        <CustomIcon name="login" fontSize="inherit" />
        <span>{AUTH_LOGIN_LABEL}</span>
      </span>
    </CustomLink>
  );

  if (variant === "mobile") {
    return (
      <div className="header-account header-account--mobile">
        {isLoggedIn ? (
          <>
            <CustomLink
              href={profileHref}
              className="header-account__profile-link"
              color="inherit"
              underline="none"
              onClick={onNavigate}
            >
              <span className="header-account__profile-inner">
                <span className="header-account__avatar" aria-hidden="true">
                  {initial}
                </span>
                <span className="header-account__profile-text">
                  <span className="header-account__name">{displayName}</span>
                  <span className="header-account__profile-hint">{AUTH_PROFILE_NAV_LABEL}</span>
                </span>
                <CustomIcon name="chevronRight" fontSize="inherit" />
              </span>
            </CustomLink>

            <form action={logoutAction} className="header-account__logout-form">
              <button
                type="submit"
                className="header-auth-button header-auth-button--mobile"
                suppressHydrationWarning
              >
                <span className="header-auth-button__inner">
                  <CustomIcon name="logout" fontSize="inherit" />
                  <span>{AUTH_LOGOUT_LABEL}</span>
                </span>
              </button>
            </form>
          </>
        ) : (
          loginButton
        )}
      </div>
    );
  }

  if (!isLoggedIn) {
    return <div className="header-account header-account--desktop">{loginButton}</div>;
  }

  return (
    <div className="header-account header-account--desktop">
      <CustomTooltip title={HEADER_ACCOUNT_MENU_LABEL} placement="bottom">
        <button
          type="button"
          className="header-account__trigger"
          onClick={(event) => setAnchorEl(event.currentTarget)}
          aria-label={HEADER_ACCOUNT_MENU_LABEL}
          aria-haspopup="menu"
          aria-expanded={Boolean(anchorEl)}
          suppressHydrationWarning
        >
          <span className="header-account__avatar" aria-hidden="true">
            {initial}
          </span>
          <span className="header-account__name">{displayName}</span>
          <CustomIcon name="expandMore" fontSize="inherit" />
        </button>
      </CustomTooltip>

      {/* The logout server action lives on a form that is never shown: a <form> cannot
          sit inside the menu's <ul>, so the menu entry submits this one instead. */}
      <form ref={logoutFormRef} action={logoutAction} className="header-account__logout-form" />

      <CustomMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <CustomMenuItem className="header-account__item" onClick={() => setAnchorEl(null)}>
          <CustomLink
            href={profileHref}
            className="header-account__item-link"
            color="inherit"
            underline="none"
          >
            <span className="header-account__item-inner">
              <CustomIcon name="person" fontSize="inherit" />
              <span>{AUTH_PROFILE_NAV_LABEL}</span>
            </span>
          </CustomLink>
        </CustomMenuItem>

        <CustomMenuItem
          className="header-account__item header-account__item--logout"
          onClick={() => {
            setAnchorEl(null);
            logoutFormRef.current?.requestSubmit();
          }}
        >
          <span className="header-account__item-inner">
            <CustomIcon name="logout" fontSize="inherit" />
            <span>{AUTH_LOGOUT_LABEL}</span>
          </span>
        </CustomMenuItem>
      </CustomMenu>
    </div>
  );
}
