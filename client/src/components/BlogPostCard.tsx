import { Card, type CardProps } from "@/components/Card";
import { Route } from "@/i18n/config";
export const BlogPostCard = (props: Readonly<Omit<CardProps, "basePath">>) => <Card {...props} basePath={Route.Blog} />;
