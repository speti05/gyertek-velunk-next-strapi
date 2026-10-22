import { Card, type CardProps } from "@/components/Card";
import { Route } from "@/i18n/config";
import { getBlogDate } from "@/utils/format-date";

export const BlogPostCard = (props: Readonly<Omit<CardProps, "basePath">>) => (
  <Card {...props} date={getBlogDate(props)} basePath={Route.Blog} />
);
