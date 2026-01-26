import { ArticleProps, EventProps } from "@/types";
import { getContent } from "@/data/loaders";

import { PaginationComponent } from "./PaginationComponent";
import { Search } from "@/components/Search"
import { CalendarWrapper } from "./custom-calendar/CalendarWrapper";
import { CalendarEvent } from "./custom-calendar/CalendarTypes";

interface ContentListProps {
  headline: string;
  query?: string;
  path: string;
  featured?: boolean;
  component: React.ComponentType<ArticleProps & { basePath: string }>;
  headlineAlignment?: "center" | "right" | "left";
  showSearch?: boolean;
  page?: string;
  showPagination?: boolean;
  calendarMapper?: (items: any[]) => CalendarEvent[];
}

const FEATURED_ARTICLES_LABEL = "Kiemelt beszámolók";

async function loader<Type>(path: string, featured?: boolean, query?: string, page?:string ) {
  const { data, meta } = await getContent(path, featured, query, page);
  console.log("ContentList loader data:", data);
  return {
    data: (data as Type[]) || [],
    pageCount: meta?.pagination?.pageCount || 1,
  };
}

export async function ContentList({
  headline,
  path,
  featured,
  component,
  headlineAlignment = "left",
  showSearch,
  query,
  page,
  showPagination,
  calendarMapper
}: Readonly<ContentListProps>) {
  const { data, pageCount } = await loader<EventProps>(path, featured, query, page);
  const Component = component;

  const calendarData: CalendarEvent[] = calendarMapper ? calendarMapper(data) : [];

  return (
    <section className="content-items container">
        {!!calendarMapper && <div className="calendar">
          <h3>
            Túranaptár
          </h3>

          <CalendarWrapper calendarEvents={calendarData} />
        </div>
        }

      <h3 className={`content-items__headline ${`content-items--${headlineAlignment}`}`}>
        {headline || FEATURED_ARTICLES_LABEL}
      </h3>
      {showSearch && <Search />}
      <div className="content-items__container--card">
        {data.map((article) => (
          <Component key={article.documentId} {...article} basePath={path} />
        ))}
      </div>
      {showPagination && <PaginationComponent pageCount={pageCount} />}
    </section>
  );
}