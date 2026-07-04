import type { TooltipProps } from "@mui/material/Tooltip";
import type { SocialLinksProps as SocialLinksData } from "@/types";
import {
  FOOTER_FACEBOOK_ARIA,
  FOOTER_INSTAGRAM_ARIA,
  FOOTER_TIKTOK_ARIA,
  FOOTER_YOUTUBE_ARIA,
} from "@/utils/texts";
import CustomLink from "../custom-ui-components/custom-link/custom-link";
import CustomIcon, { type IconName } from "../custom-ui-components/custom-icon/custom-icon";
import CustomTooltip from "../custom-ui-components/custom-tooltip/custom-tooltip";

const ICON_SIZE = "2x" as const;

const SOCIAL_LINKS: {
  key: "facebook" | "instagram" | "tiktok" | "youtube";
  ariaLabel: string;
  iconName: IconName;
}[] = [
  { key: "facebook", ariaLabel: FOOTER_FACEBOOK_ARIA, iconName: "facebook" },
  { key: "instagram", ariaLabel: FOOTER_INSTAGRAM_ARIA, iconName: "instagram" },
  { key: "tiktok", ariaLabel: FOOTER_TIKTOK_ARIA, iconName: "tiktok" },
  { key: "youtube", ariaLabel: FOOTER_YOUTUBE_ARIA, iconName: "youtube" },
];

interface SocialLinksProps {
  socialLinks?: SocialLinksData;
  as: "nav" | "div";
  variant: "header" | "footer";
  tooltipPlacement: TooltipProps["placement"];
}

export function SocialLinks({
  socialLinks,
  as: Wrapper,
  variant,
  tooltipPlacement,
}: SocialLinksProps) {
  const urlMap = {
    facebook: socialLinks?.facebookUrl,
    instagram: socialLinks?.instagramUrl,
    tiktok: socialLinks?.tiktokUrl,
    youtube: socialLinks?.youtubeUrl,
  };
  const activeSocialLinks = SOCIAL_LINKS.filter(({ key }) => urlMap[key]);

  if (activeSocialLinks.length === 0) return null;

  return (
    <Wrapper className={`social-links social-links--${variant}`}>
      <ul className="social-links__list no-list-style">
        {activeSocialLinks.map(({ key, ariaLabel, iconName }) => (
          <li key={key}>
            <CustomTooltip title={key} placement={tooltipPlacement}>
              <span>
                <CustomLink
                  href={urlMap[key]!}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={ariaLabel}
                  className="social-links__link"
                  color="white"
                  underline="none"
                  isHoverScaled
                >
                  <CustomIcon name={iconName} size={ICON_SIZE} />
                </CustomLink>
              </span>
            </CustomTooltip>
          </li>
        ))}
      </ul>
    </Wrapper>
  );
}
