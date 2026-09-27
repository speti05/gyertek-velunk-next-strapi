import CustomLink from "@/components/custom-ui-components/custom-link/custom-link";
import { StrapiImage } from "../StrapiImage";
import { StrapiImageWithSkeleton } from "../StrapiImageWithSkeleton";
import type { HeroSectionProps } from "@/types";
import CustomButton from "@/components/custom-ui-components/custom-button/custom-button";

export interface HeroTableOfContent {
  label: string;
  items: { heading: string; linkId: string }[];
}

interface Props extends HeroSectionProps {
  tableOfContent?: HeroTableOfContent;
}

export function HeroSection({
  theme,
  heading,
  cta,
  image,
  logo,
  author,
  publishedAt,
  darken = false,
  tableOfContent,
}: Readonly<Props>) {
  const hasTableOfContent = Boolean(tableOfContent?.items.length);

  return (
    <section className={`hero${hasTableOfContent ? " hero--with-toc" : ""}`}>
      <div className="hero__background">
        <StrapiImageWithSkeleton
          src={image.url}
          alt={image.alternativeText || "No alternative text provided"}
          className="hero__background-image"
          width={1920}
          height={1080}
        />
        {darken && <div className="hero__background__overlay"></div>}
      </div>
      <div className={`hero__headline hero__headline--${theme}`}>
        <h1>{heading}</h1>
        {author && <p className="hero__author">{author}</p>}
        {publishedAt && <p className="hero__published-at">{publishedAt}</p>}
      </div>
      {hasTableOfContent && tableOfContent && (
        <nav className="hero__toc" aria-label={tableOfContent.label}>
          <div className="container">
            <p className="hero__toc-label">{tableOfContent.label}</p>
            <ol className="hero__toc-list no-list-style">
              {tableOfContent.items.map((item) => (
                <li key={item.linkId} className="hero__toc-item">
                  <CustomLink href={`#${item.linkId}`} className="hero__toc-link" underline="none">
                    <span className="hero__toc-marker" aria-hidden="true" />
                    {item.heading}
                  </CustomLink>
                </li>
              ))}
            </ol>
          </div>
        </nav>
      )}
      {cta && (
        <CustomButton variant="contained" size="large">
          <CustomLink href={cta.href} target={cta.isExternal ? "_blank" : "_self"} color="inherit" underline="none">
            {cta.text}
          </CustomLink>
        </CustomButton>
      )}
      {logo && (
        <StrapiImage
          src={logo.image.url}
          alt={logo.image.alternativeText || "No alternative text provided"}
          className={`hero__logo hero__logo--${theme}`}
          width={120}
          height={120}
        />
      )}
    </section>
  );
}
