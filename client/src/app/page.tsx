// have to force dynamic
// use server is only for Server Action Files only
// page components are already server-side by default in the App Router without it

//export const dynamic = 'force-dynamic';

import { BlockRenderer } from "@/components/BlockRenderer";
import { getContentBySlug, getHomePage } from "@/data/loaders";
import { notFound } from "next/navigation";
import { EventProps, PageParams } from "@/types";

async function loader() {
  const data = await getHomePage();
  if (!data) notFound();
  return { ...data.data };
}

async function stayInTouchloader() {
  const result = await getContentBySlug('stay-in-touch', "/api/events");
  const event = result?.data?.[0];
  if (!event) throw notFound();
  return { stayInTouchEvent: event as EventProps};
}

export default async function HomeRoute({
  searchParams,
}: PageParams) {
  const data = await loader();
  const { stayInTouchEvent } = await stayInTouchloader();
  const blocks = data?.blocks || [];
  return (
    <div>
      <BlockRenderer blocks={blocks} searchParams={await searchParams} stayInTouchEventId={stayInTouchEvent.documentId}/>
    </div>
  );
}
