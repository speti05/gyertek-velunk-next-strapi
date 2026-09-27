"use server";

import { EventProps } from "@/types";
import { getContentForCalendar, getUpcomingEvents } from "@/data/loaders";
import { CalendarEvent } from "@/components/custom-ui-components/custom-calendar/CalendarTypes";
import { Route } from "@/i18n/config";

const EVENTS_PATH = "/api/events";
const UPCOMING_EVENT_COUNT = 3;

const eventcalendarDataMapper = (data: EventProps[]): CalendarEvent[] =>
  data.map((event: EventProps) => ({
    id: event.documentId,
    title: event.title,
    link: `${Route.Tours}/${event.slug}`,
    description: event.description ?? "",
    startDate: new Date(event.startDate),
    // A one-day tour may be saved without an end date; new Date(null) would be 1970.
    endDate: new Date(event.endDate ?? event.startDate),
    difficulty: event.difficulty ?? null,
  }));

export async function loadCalendarData(year: number): Promise<CalendarEvent[]> {
  try {
    const { data } = await getContentForCalendar(EVENTS_PATH, year);
    return eventcalendarDataMapper((data as EventProps[]) || []);
  } catch (error) {
    console.error(`Error loading calendar data for year ${year}:`, error);
    return [];
  }
}

export async function loadUpcomingEvents(): Promise<CalendarEvent[]> {
  try {
    const { data } = await getUpcomingEvents(EVENTS_PATH, UPCOMING_EVENT_COUNT);
    return eventcalendarDataMapper((data as EventProps[]) || []);
  } catch (error) {
    console.error("Error loading upcoming events:", error);
    return [];
  }
}
