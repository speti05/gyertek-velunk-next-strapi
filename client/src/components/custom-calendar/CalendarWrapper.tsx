'use client';

import { ContinuousCalendar } from '@/components/custom-calendar/ContinuousCalendar';
import { CalendarEvent } from './CalendarTypes';
import { useRouter } from 'next/navigation';
import { ArticleProps } from '@/types';
import { getContent } from '@/data/loaders';

async function loader(path: string, featured?: boolean, query?: string, page?:string ) {
  const { data, meta } = await getContent(path, featured, query, page);
  return {
    articles: (data as ArticleProps[]) || [],
    pageCount: meta?.pagination?.pageCount || 1,
  };
}

interface CalendarWrapperProps {
  calendarEvents: CalendarEvent[];
}

export const CalendarWrapper: React.FC<CalendarWrapperProps> = ({ calendarEvents }) => {
  const router = useRouter();

  const clickHandler = (calendarEvent: CalendarEvent | undefined) => {
    if (calendarEvent) {
      router.push(calendarEvent.link);
    }
    else {
      console.error("No calendar event data available for clickHandler.");
    }
  }

  return (
    <div className="calendar-wrapper">
      <ContinuousCalendar clickHandler={clickHandler} calendarEvents={calendarEvents} />
    </div>
  );
};

