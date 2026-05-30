"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";
import type { Subscribe as SubscribeType } from "@/components/blocks/Subscribe";

const SubscribeDynamic = dynamic(
  () => import("@/components/blocks/Subscribe").then((m) => m.Subscribe),
  { ssr: false }
);

export function SubscribeNoSSR(props: ComponentProps<typeof SubscribeType>) {
  return <SubscribeDynamic {...props} />;
}
