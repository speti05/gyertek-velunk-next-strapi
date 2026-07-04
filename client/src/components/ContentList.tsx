import { ArticleProps, ContentCollectionType, CustomSearchParams, EventProps } from "@/types";
import { getContent } from "@/data/loaders";

import { PaginationComponent } from "@/components/PaginationComponent";
import { SearchNoSSR } from "@/components/SearchNoSSR";
import { removeAccents } from "@/utils/text-utils";
import { ContentListHeadline } from "@/components/ContentListHeadline";

interface ContentListProps {
  headline: string;
  searchParams: CustomSearchParams;
  query?: string;
  pageSize?: number;
  featured?: boolean;
  component: React.ComponentType<ArticleProps & { basePath: string }>;
  headlineAlignment?: "center" | "right" | "left";
  showSearch?: boolean;
  searchPlaceHolder?: string;
  page?: string;
  showPagination?: boolean;
  contentCollectionType: ContentCollectionType;
  isMainContentOfTheScreen?: boolean;
}

async function loader<Type>(
  path: string,
  featured?: boolean,
  query?: string,
  page?: string,
  pageSize?: number
) {
  const { data, meta } = await getContent(path, featured, query, page, pageSize);
  return {
    data: (data as Type[]) || [],
    pageCount: meta?.pagination?.pageCount || 1,
  };
}

export async function ContentList({
  headline,
  pageSize,
  searchParams,
  featured,
  component,
  headlineAlignment = "center",
  showSearch,
  searchPlaceHolder,
  showPagination,
  contentCollectionType,
  isMainContentOfTheScreen = false,
}: Readonly<ContentListProps>) {
  const pageParam = `${contentCollectionType}Page`;
  const path = `/api/${contentCollectionType}`;
  const queryParam = `${contentCollectionType}Query`;
  const page = searchParams?.[pageParam] || "1";
  const query = searchParams?.[queryParam] || "";
  const { data, pageCount } = await loader<EventProps>(path, featured, query, page, pageSize);
  const Component = component;

  const navigationId = removeAccents(headline);

  return (
    <section className="content-items content-items container">
      <ContentListHeadline
        headline={headline}
        alignment={headlineAlignment}
        isMain={isMainContentOfTheScreen}
        navigationId={navigationId}
      />
      {!!showSearch && (
        <SearchNoSSR
          placeHolder={searchPlaceHolder}
          contentCollectionType={contentCollectionType}
        />
      )}
      <div className="content-items__container--card">
        {data.map((article) => (
          <Component key={article.documentId} {...article} basePath={path} />
        ))}
      </div>
      {showPagination && <PaginationComponent pageCount={pageCount} pageParam={pageParam} />}
    </section>
  );
}
