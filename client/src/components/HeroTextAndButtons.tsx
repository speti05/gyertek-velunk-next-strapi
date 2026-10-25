"use client";

import CustomButton from "@/components/custom-ui-components/custom-button/custom-button";
import { LinkProps } from "@/types";

interface HeroTextAndButtonsProps {
  headline: string;
  theme?: "turquoise" | "brown";
  linkButtons?: LinkProps[];
  welcomeText?: string;
  hideButtonsOnMobile?: boolean;
}

export const HeroTextAndButtons = ({
  headline,
  theme = "turquoise",
  linkButtons,
  welcomeText,
  hideButtonsOnMobile = false,
}: Readonly<HeroTextAndButtonsProps>) => {
  const defaultButtonColor = theme === "turquoise" ? "primary" : "secondary";

  return (
    <>
      {(headline || welcomeText) && (
        <div className={`hero__headline hero__headline--${theme}`}>
          {headline && <h2>{headline}</h2>}
          {welcomeText && (
            <div className={`hero__welcome-text welcome-text--${theme}`}>
              <p>{welcomeText}</p>
            </div>
          )}
        </div>
      )}

      {linkButtons && (linkButtons as []).length > 0 && (
        <div
          className={`hero__button_container${hideButtonsOnMobile ? " hero__button_container--hide-on-mobile" : ""}`}
        >
          {(linkButtons as LinkProps[]).map((l: LinkProps) => (
            <CustomButton
              key={l.id}
              variant="contained"
              size="large"
              href={l.href}
              color={l.buttonColor ?? defaultButtonColor}
            >
              {l.text}
            </CustomButton>
          ))}
        </div>
      )}
    </>
  );
};
