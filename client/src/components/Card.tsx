import { ImageProps } from "@/types";

import CustomLink from "./custom-ui-components/custom-link/custom-link";
import { StrapiImage } from "./StrapiImage";
import { formatDate } from "@/utils/format-date";
import { CARD_PERSON, CURRENCY } from "@/utils/texts";
import { TourDifficultyBadge } from "./TourDifficultyBadge";

export interface CardProps {
  documentId: string;
  title: string;
  description: string;
  slug: string;
  image: ImageProps;
  price?: number;
  startDate?: string;
  createdAt: string;
  basePath: string;
  difficulty?: number;
}

export function Card({
  title,
  description,
  slug,
  image,
  price,
  createdAt,
  startDate,
  basePath,
  difficulty,
}: Readonly<CardProps>) {
  return (
    <CustomLink
      href={`/${basePath}/${slug}`}
      className="content-items__card"
      color="inherit"
      underline="none"
    >
      <div className="content-items__card-img">
        <StrapiImage
          src={image.url}
          alt={image.alternativeText || "No alternative text provided"}
          width={400}
          height={400}
        />
      </div>
      <div className="content-items__card-text">
        <div className="content-items__card-title">
          <h5>{title}</h5>
        </div>
        {difficulty && <TourDifficultyBadge difficulty={difficulty} variant="brown" />}
        <div className="content-items__card-text__card-meta">
          {price && (
            <p>
              {price}
              <span> {CURRENCY}</span>
              <span> / {CARD_PERSON} </span>
            </p>
          )}
          {(startDate ?? createdAt) && <p>{formatDate(startDate ?? createdAt)}</p>}
        </div>
        <hr className="content-items__card-divider" />
        <p>{description.slice(0, 144)}...</p>
      </div>
    </CustomLink>
  );
}
