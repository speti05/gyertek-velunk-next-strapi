import { Card, type CardProps } from "@/components/Card";

export const EventCard = (props: Readonly<CardProps>) => (
  <Card {...props} basePath="turaink" />
);