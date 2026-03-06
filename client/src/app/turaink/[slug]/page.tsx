'use server'

import type { EventProps } from "@/types";
import { ContentList } from "@/components/ContentList";
import { getContentBySlug } from "@/data/loaders";
import { notFound } from "next/navigation";
import { EventSignupForm } from "@/components/EventsSignupForm";
import { EventCard } from "@/components/EventCard";

async function loader(slug: string) {
  const { data } = await getContentBySlug(slug, "/api/events");
  const event = data[0];
  if (!event) throw notFound();
  return { event: event as EventProps, blocks: event?.blocks };
}

interface ParamsProps {
  params: Promise<{ slug: string }>,
  searchParams: Promise<{ page?: string; query?: string }>;
}

export default async function SingleEventRoute({ params, searchParams }: ParamsProps) {
  const slug = (await params).slug;
  const { event, blocks } = await loader(slug);
  //const { page, query } = await searchParams;

  return (
    <>
      <div className="container">
        <div className="event-page">
          <EventSignupForm
            blocks={blocks}
            eventId={event.documentId}
            startDate={event.startDate}
            price={event.price}
            image={{ url: event?.image?.url, alt: event?.image?.alternativeText || "Event image" }}
          />
        </div>

        <ContentList
          contentCollectionType="events"
          searchParams={await searchParams}
          headline="Kiemelt túrák"
          component={EventCard}
          featured={true}
        />
      </div>
    </>
  );
}
