import type { Block, CustomSearchParams } from "@/types";

import { HeroSection } from "@/components/blocks/HeroSection";
import { InfoBlock } from "@/components/blocks/InfoBlock";
import { FeaturedArticle } from "@/components/blocks/FeaturedArticle";
import { Subscribe } from "@/components/blocks/Subscribe";
import { Heading } from "@/components/blocks/Heading";
import { ParagraphWithImage } from "@/components/blocks/ParagraphWithImage";
import { Paragraph } from "@/components/blocks/Paragraph";
import { FullImage } from "@/components/blocks/FullImage";
import { TextContentBlock } from "@/components/blocks/OnlyTextContent";
import { SearchableCardList } from "@/components/blocks/SearchableCardList";
import { HeroWithCalendar } from "@/components/blocks/HeroWithCalendar";
import { EventSignupBlock } from "@/components/blocks/EventSignupBlock";

function blockRenderer(block: Block, index: number, searchParams: CustomSearchParams ) {
  switch (block.__component) {
    case "blocks.hero-section":
      return <HeroSection {...block} key={index} />;
    case "blocks.info-block":
      return <InfoBlock {...block} key={index} />;
    case "blocks.featured-article":
      return <FeaturedArticle {...block} key={index} />;
    case "blocks.subscribe":
      return <Subscribe {...block} key={index} />;
    case "blocks.heading":
      return <Heading {...block} key={index} />;
    case "blocks.paragraph-with-image":
      return <ParagraphWithImage {...block} key={index} />;
    case "blocks.paragraph":
      return <Paragraph {...block} key={index} />;
    case "blocks.full-image":
      return <FullImage {...block} key={index} />;
    case "blocks.text-content-block":
      return <TextContentBlock {...block} key={index} />;
    case "blocks.searchable-card-list":
      return <SearchableCardList {...block} key={index} searchParams={searchParams}/>;
    case "blocks.hero-with-calendar":
      return <HeroWithCalendar {...block} key={index} searchParams={searchParams}/>;
     case "blocks.event-signup-form":
      return <EventSignupBlock {...block} eventId={null} key={index} />;  
    default:
      return null;
  }
}

export function BlockRenderer({ blocks, searchParams }: { blocks: Block[];  searchParams?: CustomSearchParams }) {
  return blocks.map((block, index) => blockRenderer(block, index, searchParams));
}
