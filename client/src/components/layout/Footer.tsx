import { getTexts } from "@/i18n/texts";
import { getRequestLocale } from "@/data/locale";
import { toPublicPath } from "@/i18n/config";
import type { FooterData } from "@/types";
import CustomLink from "../custom-ui-components/custom-link/custom-link";
import { SocialLinks } from "./SocialLinks";
import { StrapiImage, heightForWidth } from "../StrapiImage";

interface FooterProps {
  data: FooterData | null;
}

export async function Footer({ data }: FooterProps) {
  const locale = await getRequestLocale();
  const { LOGO_ALT_FALLBACK } = getTexts(locale);
  const localizePath = (href: string) => toPublicPath(href, locale);
  if (!data) return null;

  const { logo, navigation, policies, copy } = data;

  return (
    <footer className="footer">
      <span className="footer__logo-wrapper">
        <StrapiImage
          src={logo.image.url}
          alt={logo.image.alternativeText || LOGO_ALT_FALLBACK}
          width={100}
          height={heightForWidth(logo.image, 100, 100)}
          className="footer__logo"
        />
      </span>
      <SocialLinks socialLinks={data} as="nav" variant="footer" tooltipPlacement="top" />
      <nav className="footer__nav">
        <ul className="footer__links no-list-style">
          {navigation.map((item) => (
            <li key={item.id}>
              <CustomLink
                href={localizePath(item.href)}
                target={item.isExternal ? "_blank" : "_self"}
                color="white"
                underline="none"
              >
                {<h5>{item.text}</h5>}
              </CustomLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="footer__policies">
        <ul className="footer__policies-nav no-list-style">
          {policies.map((item) => (
            <li key={item.id}>
              <CustomLink
                href={localizePath(item.href)}
                target={item.isExternal ? "_blank" : "_self"}
                className="copy"
                color="white"
                underline="none"
                isHoverScaled
              >
                {item.text}
              </CustomLink>
            </li>
          ))}
        </ul>
        <p className="copy">
          &copy; {new Date().getFullYear()} {copy}
        </p>
      </div>
    </footer>
  );
}
