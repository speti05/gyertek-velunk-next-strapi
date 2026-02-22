'use client';

import { ContinuousCalendar } from '@/components/custom-ui-components/custom-calendar/ContinuousCalendar';
import { CalendarEvent } from './CalendarTypes';
import { useRouter } from 'next/navigation';

interface CalendarWrapperProps {
  theme: "turquoise" | "brown";
  calendarEvents: CalendarEvent[];
  onYearChange: (year: number) => Promise<CalendarEvent[]>;
}

export const CalendarWrapper: React.FC<CalendarWrapperProps> = ({ calendarEvents, theme, onYearChange }) => {
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
        onYearChange={onYearChange}
        calendarEvents={calendarEvents}
        theme={theme}
      />
    </div>
  );
};

