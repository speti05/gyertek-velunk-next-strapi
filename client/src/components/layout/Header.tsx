"use client";
import type { LinkProps, LogoProps } from "@/types";
import { AUTH_LOGIN_LABEL, AUTH_LOGOUT_LABEL, AUTH_PROFILE_NAV_LABEL } from "@/utils/texts";
import { logoutAction } from "@/data/auth-actions";
import { useAuth } from "@/context/auth-context";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import { Tooltip } from "@mui/material";
import Link from "next/link";
import { useState } from "react";
import { StrapiImage } from "../StrapiImage";

interface HeaderProps {
  data: {
    logo: LogoProps;
    navigation: LinkProps[];
    cta: LinkProps;
  };
}

export function Header({ data }: HeaderProps) {
  const [isActive, setIsActive] = useState(false);
  const { isLoggedIn, userEmail } = useAuth();
  if (!data) return null;

  const { logo, navigation } = data;
  const displayName = userEmail ? userEmail.split("@")[0] : "";

  return (
    <>
      <header>
        <nav className="navbar">
          <Link href="/" className="navbar__logo-link">
            <StrapiImage
              src={logo.image.url}
              alt={logo.image.alternativeText || "Gyertek velünk"}
              className={`header__logo `}
              width={256}
              height={174}
            />
          </Link>
          <ul className={`nav-menu ${isActive ? "active" : ""} no-list-style`}>
            {navigation.map((item) => (
              <li key={item.id}>
                <Link href={item.href} target={item.isExternal ? "_blank" : "_self"}>
                  <span className="nav-link" onClick={() => setIsActive(false)}>
                    {item.text}
                  </span>
                </Link>
              </li>
            ))}
            {isLoggedIn ? (
              <li className="navbar__auth-group">
                <Tooltip title={AUTH_PROFILE_NAV_LABEL} placement="bottom">
                  <Link
                    href="/profile"
                    className="navbar__auth-link"
                    onClick={() => setIsActive(false)}
                  >
                    <PersonIcon fontSize="inherit" />
                    <span className="navbar__auth-name">{displayName}</span>
                  </Link>
                </Tooltip>
                <form action={logoutAction}>
                  <Tooltip title={AUTH_LOGOUT_LABEL} placement="bottom">
                    <button
                      type="submit"
                      className="navbar__auth-btn"
                      aria-label={AUTH_LOGOUT_LABEL}
                    >
                      <LogoutIcon fontSize="inherit" />
                    </button>
                  </Tooltip>
                </form>
              </li>
            ) : (
              <li>
                <Tooltip title={AUTH_LOGIN_LABEL} placement="bottom">
                  <Link
                    href="/login"
                    className="navbar__auth-link"
                    onClick={() => setIsActive(false)}
                  >
                    <LoginIcon fontSize="inherit" />
                  </Link>
                </Tooltip>
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
      </header>
    </>
  );
}
