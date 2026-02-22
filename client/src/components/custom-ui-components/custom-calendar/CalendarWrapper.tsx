'use client';

import { ContinuousCalendar } from '@/components/custom-ui-components/custom-calendar/ContinuousCalendar';
import { CalendarEvent } from './CalendarTypes';
import { useRouter } from 'next/navigation';

interface CalendarWrapperProps {
  theme: "turquoise" | "brown";
  calendarEvents: CalendarEvent[];
  //updateYear: (newYearValue: number) => void;
}

export const CalendarWrapper: React.FC<CalendarWrapperProps> = async ({ calendarEvents, theme, updateYear }) => {
  const router = useRouter();

  const clickHandler = (calendarEvent: CalendarEvent | undefined) => {
    if (calendarEvent) {
      router.push(calendarEvent.link);
    }
    else {
      console.error("No calendar event data available for clickHandler.");
    }
  };

  return (
    <div className="calendar-wrapper">
      <ContinuousCalendar
        clickHandler={clickHandler}
        //updateYear={updateYear}
        calendarEvents={calendarEvents}
        theme={theme}
      />
    </div>
  );
};

