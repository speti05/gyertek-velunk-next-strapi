'use server'

import { StrapiImage } from "../StrapiImage";
import { HeroWithTextProps } from "@/types";
import { HeroTextAndButtons } from "../HeroTextAndButtons";

export async function HeroWithTextBlock({
    headline,
    image,
    theme,
    link,
    welcomeText
}: Readonly<HeroWithTextProps>) {

    return (
        <section className="hero hero__with-text">
            <div className="hero__background">
                <StrapiImage
                    src={image?.url}
                    alt={image?.alternativeText || "No alternative text provided"}
                    className="hero__background-image"
                    width={1920}
                    height={1080}
                />
                <div className="hero__background__overlay"></div>
            </div>
            <div className={`hero__container`}>
                <div className={`hero__text_and_button_container`}>
                    <HeroTextAndButtons headline={headline} theme={theme} linkButtons={link} welcomeText={welcomeText} />
                </div>
            </div>
        </section>
    );
}
