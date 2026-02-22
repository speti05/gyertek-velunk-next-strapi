'use server'

import { CalendarWrapper } from "@/components/custom-ui-components/custom-calendar/CalendarWrapper";
import { CalendarEvent } from "@/components/custom-ui-components/custom-calendar/CalendarTypes";

interface ContentListProps {
  theme: "turquoise" | "brown";
  calendarEvents: CalendarEvent[];
  //updateYear: (newYearValue: number) => void;
}

export async function CalendarWithContent({
  theme,
  calendarEvents,
  //updateYear
}: Readonly<ContentListProps>) {

  return (
    <section className="content-items container">
        {<div className="calendar">
          <CalendarWrapper
            calendarEvents={calendarEvents}
            theme={theme}
            //updateYear={updateYear}
            />
        </div>
        }
    </section>
  );
}