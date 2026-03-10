"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";
import type { EventSignupForm as EventSignupFormType } from "@/components/EventsSignupForm";

const EventSignupFormDynamic = dynamic(() => import("@/components/EventsSignupForm").then((m) => m.EventSignupForm), { ssr: false });

export function EventSignupFormNoSSR(props: ComponentProps<typeof EventSignupFormType>) {
  return <EventSignupFormDynamic {...props} />;
}
