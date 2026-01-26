'use server'

import { ContentList } from "@/components/ContentList";
import { Card, type CardProps } from "@/components/Card";
import { EventSignupForm } from "@/components/EventsSignupForm";

import { getContentBySlug } from "@/data/loaders";
import { EventProps } from "@/types";
import { notFound } from "next/navigation";

async function loader(slug: string) {
  const { data } = await getContentBySlug(slug, "/api/events");
  const event = data[0];

  if (!event) throw notFound();
  return { event: event as EventProps, blocks: event?.blocks };
}

interface ParamsProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; query?: string }>;
}

const EventCard = (props: Readonly<CardProps>) => (
  <Card {...props} basePath="turaink" />
);

const eventcalendarDataMapper = (data: EventProps[]) => (data.map((event: EventProps) => ({
  id: event.documentId,
  title: event.title,
  link: `turaink/${event.slug}`,
  description: event.description,
  startDate: new Date(event.startDate),
  endDate: new Date(event.endDate)
})));

export default async function AllEventsRoute({
  params,
  searchParams,
}: ParamsProps) {
  // const slug = (await params).slug;
  const { query, page } = await searchParams;
  const { event, blocks } = await loader("stay-in-touch");
  const ALL_EVENTS_LABEL = "Kiemelt túrák";

  return (
    <div className="container">
      <div className="event-page">
        <EventSignupForm blocks={blocks} eventId={event.documentId} />
      </div>
      <ContentList
        headline={ALL_EVENTS_LABEL}
        path="/api/events"
        query={query}
        page={page}
        showSearch
        showPagination
        component={EventCard}
        calendarMapper={eventcalendarDataMapper}
      />
    </div>
  );
}
