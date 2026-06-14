import type { LinkProps, LogoProps, SocialLinksProps } from "@/types";
import { FOOTER_FACEBOOK_ARIA, FOOTER_INSTAGRAM_ARIA, FOOTER_TIKTOK_ARIA } from "@/utils/texts";
import CustomLink from "../custom-ui-components/custom-link/custom-link";
import { StrapiImage } from "../StrapiImage";
import CustomIcon, { type IconName } from "../custom-ui-components/custom-icon/custom-icon";
import CustomTooltip from "../custom-ui-components/custom-tooltip/custom-tooltip";

interface FooterProps {
  data: {
    logo: LogoProps;
    navigation: LinkProps[];
    policies: LinkProps[];
    copy: string;
  } & SocialLinksProps;
}

const SOCIAL_LINKS: {
  key: "facebook" | "instagram" | "tiktok";
  ariaLabel: string;
  iconName: IconName;
}[] = [
  { key: "facebook", ariaLabel: FOOTER_FACEBOOK_ARIA, iconName: "facebook" },
  { key: "instagram", ariaLabel: FOOTER_INSTAGRAM_ARIA, iconName: "instagram" },
  { key: "tiktok", ariaLabel: FOOTER_TIKTOK_ARIA, iconName: "tiktok" },
];

const socialUrlMap = (data: SocialLinksProps) => ({
  facebook: data.facebookUrl,
  instagram: data.instagramUrl,
  tiktok: data.tiktokUrl,
});

export function Footer({ data }: FooterProps) {
  if (!data) return null;

  const { logo, navigation, policies, copy } = data;
  const urlMap = socialUrlMap(data);
  const activeSocialLinks = SOCIAL_LINKS.filter(({ key }) => urlMap[key]);

  return (
    <footer className="footer">
      <CustomTooltip title={logo.image.alternativeText || "Gyertek velünk"} placement="top">
        <span className="footer__logo-wrapper">
          <CustomLink href="/" className="navbar__logo-link" color="white" underline="none">
            <StrapiImage
              src={logo.image.url}
              alt={logo.image.alternativeText || "Gyertek velünk"}
              width={100}
              height={100}
              className="footer__logo"
            />
          </CustomLink>
        </span>
      </CustomTooltip>
      <nav className="footer__social_nav">
        {activeSocialLinks.length > 0 && (
          <ul className="footer__social no-list-style">
            {activeSocialLinks.map(({ key, ariaLabel, iconName }) => (
              <li key={key}>
                <CustomTooltip title={key} placement="top">
                  <span>
                    <CustomLink
                      href={urlMap[key]!}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={ariaLabel}
                      className="footer__social-link"
                      color="white"
                      underline="none"
                      isHoverScaled
                    >
                      <CustomIcon name={iconName} size="2x" />
                    </CustomLink>
                  </span>
                </CustomTooltip>
              </li>
            ))}
          </ul>
        )}
      </nav>
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
