import { HeroWithTextProps } from "@/types";
import { HeroTextAndButtons } from "../HeroTextAndButtons";
import CustomGallery from "@/components/custom-ui-components/custom-gallery/custom-gallery";
import { EmptyContent } from "@/components/EmptyContent";
import {
  HERO_WITH_TEXT_EMPTY_TITLE,
  HERO_WITH_TEXT_EMPTY_DESCRIPTION,
} from "@/utils/texts";

export function HeroWithTextBlock({
  headline,
  images,
  link,
  welcomeText,
}: Readonly<HeroWithTextProps>) {
  return (
    <section className="hero hero__with-text">
      {images?.length ? (
        <CustomGallery images={images} />
      ) : (
        <EmptyContent
          title={HERO_WITH_TEXT_EMPTY_TITLE}
          description={HERO_WITH_TEXT_EMPTY_DESCRIPTION}
        />
      )}

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
