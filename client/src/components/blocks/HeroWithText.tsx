import { HeroWithTextProps } from "@/types";
import { HeroTextAndButtons } from "../HeroTextAndButtons";
import CustomGallery from "@/components/custom-ui-components/custom-gallery/custom-gallery";

export function HeroWithTextBlock({
  headline,
  images,
  link,
  welcomeText,
}: Readonly<HeroWithTextProps>) {
  return (
    <section className="hero hero__with-text">
      <CustomGallery images={images} />

      <div className="hero__container">
        <div className="hero__text_and_button_container">
          <HeroTextAndButtons
            headline={headline}
            linkButtons={link}
            welcomeText={welcomeText}
          />
        </div>
      </div>
    </section>
  );
}
