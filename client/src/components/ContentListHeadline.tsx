import { removeAccents } from "@/utils/text-utils";
import { getGlobalSettings } from "@/data/loaders";
import { getStrapiMedia } from "@/components/StrapiImage";

interface ContentListHeadlineProps {
  headline: string;
  alignment?: "center" | "right" | "left";
  isMain?: boolean;
  navigationId?: string;
  /** Page-specific background; falls back to the global default when missing. */
  backgroundImageUrl?: string | null;
}

async function getDefaultHeadlineBackgroundUrl() {
  try {
    const { data } = await getGlobalSettings();
    return getStrapiMedia(data?.defaultPageHeadlineBackground?.url ?? null);
  } catch {
    return null;
  }
}

export async function ContentListHeadline({
  headline,
  alignment = "center",
  isMain = false,
  navigationId,
  backgroundImageUrl,
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

  // A page-specific image wins, then the Strapi global default; with neither, the SVG backdrop shows.
  const backgroundUrl =
    getStrapiMedia(backgroundImageUrl ?? null) ?? (await getDefaultHeadlineBackgroundUrl());

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
