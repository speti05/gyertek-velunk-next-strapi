'use client'

import CustomButton from "@/components/custom-ui-components/custom-button/custom-button";
import { LinkProps } from '@/types';

interface HeroTextAndButtonsProps {
    headline: string;
    theme: "turquoise" | "brown";
    linkButtons: LinkProps[];
    welcomeText?: string;
}

export const HeroTextAndButtons = ({ headline, theme, linkButtons, welcomeText }: Readonly<HeroTextAndButtonsProps>) => {
    const buttonColor = theme === "turquoise" ? "primary" : "secondary";

    return (
        <>
            {headline && (
                <div className={`hero__headline  hero__headline--${theme}`}>
                    <h1>{headline}</h1>
                </div>
            )}
            {welcomeText && (
                <div className={`hero__welcome-text welcome-text--${theme}`}>
                    <p>{welcomeText}</p>
                </div>
            )}

            {linkButtons && (linkButtons as []).length > 0 && (
                <div className={`hero__button_container`}>
                    {(linkButtons as LinkProps[]).map((l: LinkProps) => (
                        <CustomButton
                            key={l.id}
                            variant="contained"
                            size="large"
                            href={l.href}
                            color={buttonColor}>
                            {l.text}
                        </CustomButton>
                ))}
            </div> 
            )}
        </>
    );
};