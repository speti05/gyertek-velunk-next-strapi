export interface LinkProps {
  id: number;
  text: string;
  href: string;
  isExternal: boolean;
}

export interface CustomSearchParams {
  page?: string; 
  query?: string;
}

export interface PageParams {
  params?: Promise<{ slug: string }>
  searchParams?: Promise<CustomSearchParams>
}

export interface ImageProps {
  id: number;
  documentId: string;
  url: string;
  alternativeText: string;
}

export interface LogoProps {
  logoText: string;
  image: ImageProps;
}

interface BaseBlogProps {
  id: number;
  documentId: string;
  title: string;
  description: string;
  slug: string;
  image: ImageProps;
  author: string;
  featured: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface ArticleProps extends BaseBlogProps{
}

export interface EventProps extends BaseBlogProps {
  price: string;
  startDate: string;
  endDate: string;
}

export interface EventSignupBlockProps extends Base<"blocks.event-signup-form"> {
  eventId: string;
}

type ComponentType =
  | "blocks.hero-section"
  | "blocks.info-block"
  | "blocks.featured-article"
  | "blocks.subscribe"
  | "blocks.heading"
  | "blocks.paragraph-with-image"
  | "blocks.paragraph"
  | "blocks.full-image"
  | "blocks.searchable-card-list"
  | "blocks.text-content-block"
  | "blocks.hero-with-calendar"
  | "blocks.event-signup-form";

interface Base<T extends ComponentType, D extends object = Record<string, unknown>> {
  id: number;
  __component?: T;
  documentId?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  data?: D;
}

export type Block =
  | HeroSectionProps
  | InfoBlockProps
  | FeaturedArticleProps
  | SubscribeProps
  | HeadingProps
  | ParagraphWithImageProps
  | ParagraphProps
  | FullImageProps
  | SearchableCardListProps
  | TextBlockProps
  | HeroWithCalendarProps
  | EventSignupBlockProps;

export interface HeroSectionProps extends Base<"blocks.hero-section"> {
  theme: "turquoise" | "orange";
  heading: string;
  image: ImageProps;
  cta?: LinkProps;
  logo?: LogoProps;
  author?: string;
  darken?: boolean;
}

export interface InfoBlockProps extends Base<"blocks.info-block"> {
  theme: "turquoise" | "orange";
  reversed?: boolean;
  headline: string;
  content: string;
  image: ImageProps;
  cta?: LinkProps;
}

export interface FeaturedArticleProps extends Base<"blocks.featured-article"> {
  headline: string;
  excerpt: string;
  link: LinkProps;
  image: ImageProps;
}

export interface SubscribeProps extends Base<"blocks.subscribe"> {
  headline: string;
  content: string;
  placeholder: string;
  buttonText: string;
}

export interface HeadingProps extends Base<"blocks.heading"> {
  heading: string;
  linkId?: string;
}

export interface ParagraphWithImageProps extends Base<"blocks.paragraph-with-image"> {
  content: string;
  image: ImageProps;
  reversed?: boolean;
  imageLandscape?: boolean;
}

export interface SearchableCardListProps extends Base<"blocks.searchable-card-list"> {
  searchParams: CustomSearchParams;
  showSearch: boolean
  searchPlaceHolder: string;
  pageSize: number;
  headline: string;
  showPagination: boolean;
  featured: boolean;
  contentCollectionType: string
}

export interface HeroWithCalendarProps extends Base<"blocks.hero-with-calendar">{
  headline: string;
  contentCollectionType: string;
  image: ImageProps;
  logo?: LogoProps;
  theme: "turquoise" | "brown";
  searchParams: CustomSearchParams;
}

export interface ParagraphProps extends Base<"blocks.paragraph"> {
  content: string;
}

export interface FullImageProps extends Base<"blocks.full-image"> {
  id: number;
  __component: "blocks.full-image";
  image: ImageProps;
}

export interface TextBlockProps extends Base<"blocks.text-content-block"> {
  content: string;
}