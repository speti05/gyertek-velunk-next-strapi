"use server";

import type { EventProps } from "@/types";
import { ContentList } from "@/components/ContentList";
import { getContentBySlug } from "@/data/loaders";
import { notFound } from "next/navigation";
import { EventSignupForm } from "@/components/EventsSignupForm";
import { EventCard } from "@/components/EventCard";
import { cookies } from "next/headers";
import { getUserProfileService } from "@/data/auth-service";
import { getUserEventSignupsLoader } from "@/data/loaders";

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

export default async function SingleEventRoute({ params, searchParams }: ParamsProps) {
  const slug = (await params).slug;
  const { event, blocks } = await loader(slug);

  const cookieStore = await cookies();
  const jwt = cookieStore.get("jwt")?.value ?? null;
  const userProfile = jwt ? await getUserProfileService(jwt) : null;

  let alreadySignedUp = false;
  if (userProfile && jwt) {
    const signups = await getUserEventSignupsLoader(jwt);
    alreadySignedUp = signups.some((s) => s.event?.documentId === event.documentId);
  }

  return (
    <>
      <div className="container">
        <h2 className={`content-items__headline content-items--center`}>Túrajelentkezés</h2>
        <div className="event-page">
          <EventSignupForm
            blocks={blocks}
            eventId={event.documentId}
            eventTitle={event.title}
            startDate={event.startDate}
            endDate={event.endDate}
            price={event.price}
            image={{ url: event?.image?.url, alt: event?.image?.alternativeText || "Event image" }}
            userProfile={userProfile}
            alreadySignedUp={alreadySignedUp}
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
