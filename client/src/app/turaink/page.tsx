'use server'

import { ContentList } from "@/components/ContentList";
import { EventSignupForm } from "@/components/EventsSignupForm";

import { getContentBySlug } from "@/data/loaders";
import { EventProps } from "@/types";
import { notFound } from "next/navigation";
import { CalendarWithContent } from "@/components/CalendarWithContent";
import { EventCard } from "@/components/EventCard";
import { EVENTS_LABEL, EVENTS_SEARCH_LABEL, TOUR_CALENDAR_LABEL } from "@/utils/texts";

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

// todo: delete
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

  return (
    <div className="container">
      <CalendarWithContent
        calendarEvents={eventcalendarDataMapper([])}
        theme="turquoise"
        onYearChange={() => Promise.resolve([])}
      />
      <ContentList
        searchParams={await searchParams}
        searchPlaceHolder={EVENTS_SEARCH_LABEL}
        headline={EVENTS_LABEL}
        contentCollectionType="events"
        featured={false}
        pageSize={9}
        showSearch
        showPagination
        component={EventCard}
      />

      <div className="event-page">
        <EventSignupForm blocks={blocks} eventId={event.documentId} />
      </div>
    </div>
  );
}
