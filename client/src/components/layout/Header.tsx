"use client";
import type { LinkProps, LogoProps } from "@/types";
import Link from "next/link";
import { StrapiImage } from "../StrapiImage";
import { useState } from "react";
import { AUTH_PROFILE_NAV_LABEL, AUTH_LOGIN_LABEL } from "@/utils/texts";
import { useAuth } from "@/context/auth-context";

interface HeaderProps {
  data: {
    logo: LogoProps;
    navigation: LinkProps[];
    cta: LinkProps;
  };
}

export function Header({ data }: HeaderProps) {
  const [isActive, setIsActive] = useState(false);
  const { isLoggedIn } = useAuth();
  if (!data) return null;

  const { logo, navigation } = data;
  const authHref = isLoggedIn ? "/profile" : "/login";
  const authLabel = isLoggedIn ? AUTH_PROFILE_NAV_LABEL : AUTH_LOGIN_LABEL;

  return (
    <>
      <header>
        <nav className="navbar">
          <Link href="/">
            <StrapiImage
              src={logo.image.url}
              alt={logo.image.alternativeText || "Gyertek velünk"}
              className={`header__logo `}
              width={256}
              height={174}
            />
          </Link>
          <ul className={`nav-menu ${isActive ? "active" : ""}`}>
            {navigation.map((item) => (
              <li key={item.id}>
                <Link href={item.href} target={item.isExternal ? "_blank" : "_self"}>
                  <span className="nav-link" onClick={() => setIsActive(false)}>
                    {item.text}
                  </span>
                </Link>
              </li>
            ))}
            <li>
              <Link href={authHref} target="_self">
                <span className="nav-link" onClick={() => setIsActive(false)}>
                  {authLabel}
                </span>
              </Link>
            </li>
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
