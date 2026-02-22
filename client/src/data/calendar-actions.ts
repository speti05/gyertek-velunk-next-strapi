'use server'

import { EventProps } from "@/types";
import { getContentForCalendar } from "@/data/loaders";
import { CalendarEvent } from "@/components/custom-ui-components/custom-calendar/CalendarTypes";

const eventcalendarDataMapper = (data: EventProps[]) => (data.map((event: EventProps) => ({
    id: event.documentId,
    title: event.title,
    link: `turaink/${event.slug}`,
    description: event.description,
    startDate: new Date(event.startDate),
    endDate: new Date(event.endDate)
})));

export async function loadCalendarData(year: number): Promise<CalendarEvent[]> {
    try {
        const { data } = await getContentForCalendar(`/api/events`, year);
        const calendarData: CalendarEvent[] = eventcalendarDataMapper((data as EventProps[]) || []);
        return calendarData;
    } catch (error) {
        console.error(`Error loading calendar data for year ${year}:`, error);
        return [];
    }
}
