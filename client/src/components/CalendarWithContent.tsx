'use client'

import { CalendarWrapper } from "@/components/custom-ui-components/custom-calendar/CalendarWrapper";
import { CalendarEvent } from "@/components/custom-ui-components/custom-calendar/CalendarTypes";

interface ContentListProps {
  theme: "turquoise" | "brown";
  calendarEvents: CalendarEvent[];
  onYearChange: (year: number) => Promise<CalendarEvent[]>;
}

export function CalendarWithContent({
  theme,
  calendarEvents,
  onYearChange
}: Readonly<ContentListProps>) {

  return (
    <section className="content-items container">
        {<div className="calendar">
          <CalendarWrapper
            calendarEvents={calendarEvents}
            theme={theme}
            onYearChange={onYearChange}
            />
        </div>
        }
    </section>
  );
}