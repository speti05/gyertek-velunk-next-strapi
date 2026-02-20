import { ContentList } from "../ContentList";
import { EventCard } from "../EventCard";
import { SearchableCardListProps } from "@/types";

export function SearchableCardList({
  searchPlaceHolder,
  contentCollectionType,
  headline,
  pageSize,
  searchParams,
  featured,
  showSearch
}: SearchableCardListProps) {
  return (
    <ContentList
      searchPlaceHolder={searchPlaceHolder}
      contentCollectionType={contentCollectionType}
      headline={headline}
      pageSize={pageSize}
      showPagination
      featured={featured}
      searchParams={searchParams}
      showSearch={showSearch}
      component={EventCard}/>
  );
}
