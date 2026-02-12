import { ArticleProps, EventProps } from "@/types";
import { getContent } from "@/data/loaders";

import { PaginationComponent } from "@/components/PaginationComponent";
import { Search } from "@/components/Search"

interface ContentListProps {
  headline: string;
  searchParams: { [key: string]: string };
  query?: string;
  pageParam: string;
  path: string;
  featured?: boolean;
  component: React.ComponentType<ArticleProps & { basePath: string }>;
  headlineAlignment?: "center" | "right" | "left";
  showSearch?: boolean;
  page?: string;
  showPagination?: boolean;
}

async function loader<Type>(path: string, featured?: boolean, query?: string, page?:string ) {
  const { data, meta } = await getContent(path, featured, query, page);
  return {
    data: (data as Type[]) || [],
    pageCount: meta?.pagination?.pageCount || 1,
  };
}

export async function ContentList({
  headline,
  path,
  pageParam,
  searchParams,
  featured,
  component,
  headlineAlignment = "left",
  showSearch,
  showPagination,
  
}: Readonly<ContentListProps>) {
    // Get the page number using the specific pageParam
  const page = searchParams?.[pageParam] || "1";
  const query = searchParams?.query;
  const { data, pageCount } = await loader<EventProps>(path, featured, query, page);
  const Component = component;

  return (
    <section className="content-items container">
      <h3 className={`content-items__headline ${`content-items--${headlineAlignment}`}`}>
        {headline}
      </h3>
      {showSearch && <Search />}
      <div className="content-items__container--card">
        {data.map((article) => (
          <Component key={article.documentId} {...article} basePath={path} />
        ))}
      </div>
      {showPagination && <PaginationComponent pageCount={pageCount} pageParam={pageParam}  />}
    </section>
  );
}