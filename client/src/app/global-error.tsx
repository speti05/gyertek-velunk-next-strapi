"use client";

import { Luckiest_Guy, Source_Sans_3 } from "next/font/google";
// @ts-ignore-next-line
import "../sass/main.scss";
// @ts-ignore-next-line
import "./globals.css";
import Image from "next/image";
import CustomLink from "@/components/custom-ui-components/custom-link/custom-link";
import { ErrorPage } from "@/components/ErrorPage";
import { MuiThemeProvider } from "@/components/providers/theme-provider/theme-provider";
import { ERROR_LABEL, SERVER_SIDE_ERROR_LABEL, SITE_TITLE } from "@/utils/texts";
import { useEffect } from "react";

const luckiestGuy = Luckiest_Guy({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-luckiest-guy",
});

const sourceSans3 = Source_Sans_3({
  variable: "--font-source-sans-3",
  subsets: ["latin"],
});

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${luckiestGuy.variable} ${sourceSans3.variable} error-shell min-h-screen flex flex-col`}
      >
        <MuiThemeProvider>
          <header>
            <nav className="navbar" />
            <span className="header__logo_wrapper">
              <CustomLink href="/" className="navbar__logo-link" color="white" underline="none">
                <Image
                  src="/GYERTEK_V_FH.png"
                  alt={SITE_TITLE}
                  width={220}
                  height={209}
                  className="header__logo"
                  priority
                />
              </CustomLink>
            </span>
          </header>
          <main className="flex flex-col flex-1">
            <ErrorPage title={SERVER_SIDE_ERROR_LABEL} description={ERROR_LABEL} />
          </main>
          <footer className="footer">
            <span className="footer__logo-wrapper">
              <CustomLink href="/" className="navbar__logo-link" color="white" underline="none">
                <Image
                  src="/GYERTEK V_kor_mini.png"
                  alt={SITE_TITLE}
                  width={100}
                  height={95}
                  className="footer__logo"
                />
              </CustomLink>
            </span>
            <p className="copy error-shell__footer-copy">
              &copy; {new Date().getFullYear()} {SITE_TITLE}
            </p>
          </footer>
        </MuiThemeProvider>
      </body>
    </html>
  );
}
