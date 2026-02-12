import { EventProps } from "@/types";
import { getContent } from "@/data/loaders";
import { CalendarWrapper } from "@/components/custom-ui-components/custom-calendar/CalendarWrapper";
import { CalendarEvent } from "@/components/custom-ui-components/custom-calendar/CalendarTypes";

interface ContentListProps {
  headline: string;
  query: string;
  path: string;
  page?: string;
  calendarMapper: (items: any[]) => CalendarEvent[];
}

async function loader<Type>(path: string, query?: string, page?:string ) {
  const { data, meta } = await getContent(path, false, query, page);
  return {
    data: (data as Type[]) || [],
    pageCount: meta?.pagination?.pageCount || 1,
  };
}

export async function CalendarWithContent({
  headline,
  path,
  query,
  page,
  calendarMapper
}: Readonly<ContentListProps>) {
  const { data } = await loader<EventProps>(path, query, page);

  const calendarData: CalendarEvent[] = calendarMapper ? calendarMapper(data) : [];

  return (
    <section className="content-items container">
        {!!calendarMapper && <div className="calendar">
          <h3>
            {headline}
          </h3>

          <CalendarWrapper calendarEvents={calendarData} />
        </div>
        }
    </section>
  );
}