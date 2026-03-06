'use client'

import { useRouter } from 'next/navigation';

interface ParamsProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; query?: string }>;
}

export default function AllEventsRoute({
}: ParamsProps) {

  const router = useRouter();
  // Redirect to the main events page
  router.push('/')
  
  return (
    <></>
  );
}
