import type { LinkProps, LogoProps, SocialLinksProps } from "@/types";
import { LOGO_ALT_FALLBACK } from "@/utils/texts";
import CustomLink from "../custom-ui-components/custom-link/custom-link";
import { StrapiImage } from "../StrapiImage";
import CustomTooltip from "../custom-ui-components/custom-tooltip/custom-tooltip";
import { SocialLinks } from "./SocialLinks";

interface FooterProps {
  data: {
    logo: LogoProps;
    navigation: LinkProps[];
    policies: LinkProps[];
    copy: string;
  } & SocialLinksProps;
}

export function Footer({ data }: FooterProps) {
  if (!data) return null;

  const { logo, navigation, policies, copy } = data;

  return (
    <footer className="footer">
      <span className="footer__logo-wrapper">
        <CustomTooltip title={logo.image.alternativeText || LOGO_ALT_FALLBACK} placement="top">
          <CustomLink href="/" className="navbar__logo-link" color="white" underline="none">
            <StrapiImage
              src={logo.image.url}
              alt={logo.image.alternativeText || LOGO_ALT_FALLBACK}
              width={100}
              height={100}
              className="footer__logo"
            />
          </CustomLink>
        </CustomTooltip>
      </span>
      <SocialLinks socialLinks={data} as="nav" variant="footer" tooltipPlacement="top" />
      <nav className="footer__nav">
        <ul className="footer__links no-list-style">
          {navigation.map((item) => (
            <li key={item.id}>
              <CustomLink
                href={item.href}
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
                href={item.href}
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
