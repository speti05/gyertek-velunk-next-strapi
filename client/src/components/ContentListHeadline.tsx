import { removeAccents } from "@/utils/text-utils";
import { getGlobalSettings } from "@/data/loaders";
import { getStrapiMedia } from "@/components/StrapiImage";

interface ContentListHeadlineProps {
  headline: string;
  alignment?: "center" | "right" | "left";
  isMain?: boolean;
  navigationId?: string;
}

async function getHeadlineBackgroundUrl() {
  try {
    const { data } = await getGlobalSettings();
    return getStrapiMedia(data?.pageHeadlineBackground?.url ?? null);
  } catch {
    return null;
  }
}

export async function ContentListHeadline({
  headline,
  alignment = "center",
  isMain = false,
  navigationId,
}: Readonly<ContentListHeadlineProps>) {
  const id = navigationId ?? removeAccents(headline);

  if (!isMain) {
    return (
      <h2
        className={`section-headline section-headline--${alignment} content-items__headline content-items--${alignment}`}
        id={id}
      >
        {headline}
      </h2>
    );
  }

  // The image set on the Strapi global settings overrides the default SVG backdrop.
  const backgroundUrl = await getHeadlineBackgroundUrl();

  return (
    <section
      className={`content-list-headline content-list-headline--${alignment}`}
      style={backgroundUrl ? { backgroundImage: `url(${backgroundUrl})` } : undefined}
      aria-labelledby={id}
    >
      <div className="content-list-headline__backdrop" />
      <h1 className="content-list-headline__title" id={id}>
        {headline}
      </h1>
    </section>
  );
}
