import { BlogCard } from "../BlogCard";
import { BlogPostCard } from "../BlogPostCard";
import { ContentList } from "../ContentList";
import { EventCard } from "../EventCard";
import { EmptyReasonOverlay } from "../EmptyReasonOverlay";
import { SearchableCardListProps } from "@/types";
import { EMPTY_REASON_DEFAULT_TITLE, EMPTY_REASON_DEFAULT_TEXT } from "@/utils/texts";

export function SearchableCardList({
  searchPlaceHolder,
  contentCollectionType,
  headline,
  pageSize,
  searchParams,
  showPagination,
  featured,
  showSearch,
  isMainContent = false,
  showEmptyReason = false,
  emptyReasonTitle,
  emptyReasonText,
  emptyReasonBackgroundImage,
  emptyReasonLinks,
}: SearchableCardListProps) {
  const componentToUse = (() => {
    switch (contentCollectionType) {
      // túrák
      case "events":
        return EventCard;
      // beszámolók
      case "articles":
        return BlogCard;
      // blog
      case "blogs":
        return BlogPostCard;
      default:
        throw new Error(
          `Unsupported content collection type in SearchableCardList (Card): ${contentCollectionType}`
        );
    }
  })();

  return (
    <ContentList
      searchPlaceHolder={searchPlaceHolder}
      contentCollectionType={contentCollectionType}
      headline={headline}
      pageSize={pageSize}
      showPagination={showPagination}
      featured={featured}
      searchParams={searchParams}
      showSearch={showSearch}
      component={componentToUse}
      isMainContentOfTheScreen={isMainContent}
      overlay={
        showEmptyReason ? (
          <EmptyReasonOverlay
            title={emptyReasonTitle || EMPTY_REASON_DEFAULT_TITLE}
            text={emptyReasonText || EMPTY_REASON_DEFAULT_TEXT}
            backgroundImage={emptyReasonBackgroundImage}
            links={emptyReasonLinks}
          />
        ) : null
      }
    />
  );
}
