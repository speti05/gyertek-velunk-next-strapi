import { getContentBySlug } from "@/data/loaders";
import { EventProps } from "@/types";
import { notFound } from "next/navigation";
import { EventSignupFormNoSSR } from "@/components/EventSignupFormNoSSR";
import { EventSignupBlockProps } from "@/types";

async function loader(slug: string) {
  const { data } = await getContentBySlug(slug, "/api/events");
  const event = data?.[0];

  if (!event) throw notFound();
  return { event: event as EventProps, blocks: event?.blocks };
}

export const EventSignupBlock = async ({ eventId, stayInTouchEventId }: EventSignupBlockProps) => {
    const { blocks } = await loader("stay-in-touch");
   
    return (
        <div className="container">
            <div className="event-signup-block" id="eventSignup">
                <EventSignupFormNoSSR blocks={blocks} eventId={eventId} stayInTouchEventId={stayInTouchEventId} />
            </div>
        </div>
    );
};