"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";
import type { Search as SearchType } from "@/components/Search";

const SearchDynamic = dynamic(() => import("@/components/Search").then((m) => m.Search), { ssr: false });

export function SearchNoSSR(props: ComponentProps<typeof SearchType>) {
  return <SearchDynamic {...props} />;
}
