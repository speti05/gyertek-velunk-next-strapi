import { ArticleProps, CustomSearchParams, EventProps } from "@/types";
import { getContent } from "@/data/loaders";

import { PaginationComponent } from "@/components/PaginationComponent";
import { Search } from "@/components/Search";

interface ContentListProps {
  headline: string;
  searchParams: CustomSearchParams
  query?: string;
  pageSize?: number;
  featured?: boolean;
  component: React.ComponentType<ArticleProps & { basePath: string }>;
  headlineAlignment?: "center" | "right" | "left";
  showSearch?: boolean;
  searchPlaceHolder?: string;
  page?: string;
  showPagination?: boolean;
  contentCollectionType: string;
}

async function loader<Type>(path: string, featured?: boolean, query?: string, page?:string, pageSize?:number ) {
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
  headlineAlignment = "left",
  showSearch,
  searchPlaceHolder,
  showPagination,
  contentCollectionType
  
}: Readonly<ContentListProps>) {
  const pageParam = `${contentCollectionType}Page`;
  const path = `/api/${contentCollectionType}`;
  const queryParam = `${contentCollectionType}Query`;
    // Get the page number using the specific pageParam
  const page = searchParams?.[pageParam] || "1";
  const query = searchParams?.[queryParam] || "";
  const { data, pageCount } = await loader<EventProps>(path, featured, query, page, pageSize);
  const Component = component;

  return (
    <section className="content-items container">
      <h3 className={`content-items__headline ${`content-items--${headlineAlignment}`}`}>
        {headline}
      </h3>
      {!!showSearch && <Search placeHolder={searchPlaceHolder} contentCollectionType={contentCollectionType} />}
      <div className="content-items__container--card">
        {data.map((article) => (
          <Component key={article.documentId} {...article} basePath={path} />
        ))}
      </div>
      {showPagination && <PaginationComponent pageCount={pageCount} pageParam={pageParam} />}
    </section>
  );
}