import { removeAccents } from "@/utils/text-utils";

interface ContentListHeadlineProps {
  headline: string;
  alignment?: "center" | "right" | "left";
  isMain?: boolean;
  navigationId?: string;
}

export function ContentListHeadline({
  headline,
  alignment = "center",
  isMain = false,
  navigationId,
}: Readonly<ContentListHeadlineProps>) {
  const id = navigationId ?? removeAccents(headline);

  if (!isMain) {
    return (
      <h2 className={`content-items__headline content-items--${alignment}`} id={id}>
        {headline}
      </h2>
    );
  }

  return (
    <section
      className={`content-list-headline content-list-headline--${alignment}`}
      aria-labelledby={id}
    >
      <div className="content-list-headline__backdrop" />
      <h1 className="content-list-headline__title" id={id}>
        {headline}
      </h1>
    </section>
  );
}
