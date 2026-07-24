import CustomLink from "@/components/custom-ui-components/custom-link/custom-link";
import CustomIcon, { type IconName } from "@/components/custom-ui-components/custom-icon/custom-icon";

export function SocialBoxTitle({
  url,
  iconName,
  label,
}: Readonly<{ url: string; iconName: IconName; label: string }>) {
  return (
    <h2 className="socials-block__item-title">
      <CustomLink href={url} target="_blank" rel="noopener noreferrer" underline="none" color="inherit">
        <CustomIcon name={iconName} size="1x" />
        {label}
      </CustomLink>
    </h2>
  );
}
