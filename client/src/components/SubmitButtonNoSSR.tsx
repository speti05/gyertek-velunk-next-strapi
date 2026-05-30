"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";
import type { SubmitButton as SubmitButtonType } from "@/components/SubmitButton";

const SubmitButtonDynamic = dynamic(
  () => import("@/components/SubmitButton").then((m) => m.SubmitButton),
  { ssr: false }
);

export function SubmitButtonNoSSR(props: ComponentProps<typeof SubmitButtonType>) {
  return <SubmitButtonDynamic {...props} />;
}
