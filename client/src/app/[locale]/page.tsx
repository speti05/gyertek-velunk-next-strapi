// have to force dynamic
// use server is only for Server Action Files only
// page components are already server-side by default in the App Router without it

//export const dynamic = 'force-dynamic';

import { BlockRenderer } from "@/components/BlockRenderer";
import { getHomePage } from "@/data/loaders";
import { notFound } from "next/navigation";
import { PageParams } from "@/types";

async function loader() {
  const data = await getHomePage();
  if (!data) notFound();
  return { ...data.data };
}

export default async function HomeRoute({ searchParams }: PageParams) {
  const data = await loader();
  const blocks = data?.blocks || [];
  return (
    <div>
      <BlockRenderer blocks={blocks} searchParams={await searchParams} />
    </div>
  );
}
