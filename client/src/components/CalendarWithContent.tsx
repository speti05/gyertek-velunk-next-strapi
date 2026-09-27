"use client";

import { TourCalendar } from "@/components/custom-ui-components/custom-calendar/TourCalendar";
import { CalendarEvent } from "@/components/custom-ui-components/custom-calendar/CalendarTypes";

interface CalendarWithContentProps {
  theme: "turquoise" | "brown";
  calendarEvents: CalendarEvent[];
  onYearChange: (year: number) => Promise<CalendarEvent[]>;
  upcomingEvents?: CalendarEvent[];
}

export function CalendarWithContent({
  theme,
  calendarEvents,
  onYearChange,
  upcomingEvents,
}: Readonly<CalendarWithContentProps>) {
  return (
    <div className="container">
      <TourCalendar
        theme={theme}
        initialEvents={calendarEvents}
        onYearChange={onYearChange}
        upcomingEvents={upcomingEvents}
      />
    </div>
  );
}
