"use client";

import React, { useCallback, useMemo, useRef, useState } from "react";

import { CalendarEvent } from "./CalendarTypes";
import CustomLink from "@/components/custom-ui-components/custom-link/custom-link";
import {
  CustomMenu,
  CustomMenuItem,
} from "@/components/custom-ui-components/custom-menu/custom-menu";
import { HIKER_PATH } from "@/components/TourDifficultyBadge";
import { useLocale, useLocalizedPath, useTexts } from "@/context/locale-context";
import { LinkProps } from "@/types";
import { formatDate } from "@/utils/format-date";

const DAY_MS = 86_400_000;
const DAYS_IN_WEEK = 7;
const WEEKEND_START = 5;

/** Whole-day index of a local date. DST-proof, so a tour's length can be counted in days. */
const toDayIndex = (date: Date) =>
  Math.round(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / DAY_MS);

const eventStart = (event: CalendarEvent) => toDayIndex(event.startDate);
// Bad data (an end before the start) is drawn as a one-day tour instead of vanishing.
const eventEnd = (event: CalendarEvent) => Math.max(toDayIndex(event.endDate), eventStart(event));

const byStartDate = (a: CalendarEvent, b: CalendarEvent) =>
  a.startDate.getTime() - b.startDate.getTime();

interface PlacedEvent {
  event: CalendarEvent;
  startColumn: number;
  endColumn: number;
  lane: number;
  isPast: boolean;
  continuesBefore: boolean;
  continuesAfter: boolean;
}

/** The weeks (Monday to Sunday) that cover a month, padded with the neighbouring days. */
function buildWeeks(year: number, month: number): Date[][] {
  const mondayOffset = (new Date(year, month, 1).getDay() + 6) % DAYS_IN_WEEK;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const weekCount = Math.ceil((mondayOffset + daysInMonth) / DAYS_IN_WEEK);

  return Array.from({ length: weekCount }, (_, week) =>
    Array.from(
      { length: DAYS_IN_WEEK },
      (_, weekday) => new Date(year, month, 1 - mondayOffset + week * DAYS_IN_WEEK + weekday)
    )
  );
}

/**
 * Lays the tours of one week out as bars. A tour spanning several days becomes one bar
 * across those columns; overlapping tours are stacked into separate lanes.
 */
function placeEvents(week: Date[], events: CalendarEvent[], todayIndex: number): PlacedEvent[] {
  const weekStart = toDayIndex(week[0]);
  const weekEnd = weekStart + DAYS_IN_WEEK - 1;
  const laneEnds: number[] = [];

  return events
    .filter((event) => eventStart(event) <= weekEnd && eventEnd(event) >= weekStart)
    .sort(byStartDate)
    .map((event) => {
      const start = eventStart(event);
      const end = eventEnd(event);
      const startColumn = Math.max(start, weekStart) - weekStart;
      const endColumn = Math.min(end, weekEnd) - weekStart;

      let lane = laneEnds.findIndex((laneEnd) => laneEnd < startColumn);
      if (lane === -1) {
        lane = laneEnds.length;
        laneEnds.push(endColumn);
      } else {
        laneEnds[lane] = endColumn;
      }

      return {
        event,
        startColumn,
        endColumn,
        lane,
        isPast: end < todayIndex,
        continuesBefore: start < weekStart,
        continuesAfter: end > weekEnd,
      };
    });
}

const classNames = (...names: (string | false | null | undefined)[]) =>
  names.filter(Boolean).join(" ");

function ChevronIcon({ direction }: Readonly<{ direction: "left" | "right" | "down" }>) {
  const paths = { left: "m15 18-6-6 6-6", right: "m9 18 6-6-6-6", down: "m6 9 6 6 6-6" };
  return (
    <svg
      className="tour-calendar__icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[direction]} />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      className="tour-calendar__icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      className="tour-calendar__icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

interface TourCardProps {
  event: CalendarEvent;
  isPast: boolean;
}

function TourCard({ event, isPast }: Readonly<TourCardProps>) {
  const locale = useLocale();
  const localizePath = useLocalizedPath();
  const { CALENDAR_MONTH_NAMES_SHORT, CALENDAR_DAY_COUNT, CALENDAR_PAST_BADGE, DIFFICULTY_LABEL } =
    useTexts();

  const dayCount = eventEnd(event) - eventStart(event) + 1;
  const isSingleDay = dayCount === 1;
  const dayLabel = isSingleDay
    ? `${event.startDate.getDate()}`
    : `${event.startDate.getDate()}–${event.endDate.getDate()}`;

  return (
    <CustomLink
      href={localizePath(event.link)}
      underline="none"
      className={classNames("tour-calendar__tour", isPast && "tour-calendar__tour--past")}
      style={{ display: "flex" }}
    >
      <span className="tour-calendar__tour-date" aria-hidden="true">
        <span className="tour-calendar__tour-month">
          {CALENDAR_MONTH_NAMES_SHORT[event.startDate.getMonth()]}
        </span>
        <span
          className={classNames(
            "tour-calendar__tour-day",
            !isSingleDay && "tour-calendar__tour-day--range"
          )}
        >
          {dayLabel}
        </span>
      </span>
      <span className="tour-calendar__tour-body">
        <span className="tour-calendar__tour-title">{event.title}</span>
        <span className="tour-calendar__sr-only">
          {formatDate(event.startDate.toISOString(), locale)}
        </span>
        <span className="tour-calendar__tour-meta">
          <span className="tour-calendar__tour-fact">
            <ClockIcon />
            {CALENDAR_DAY_COUNT(dayCount)}
          </span>
          {isPast && <span className="tour-calendar__past-badge">{CALENDAR_PAST_BADGE}</span>}
          {!isPast && event.difficulty != null && (
            <span className="tour-calendar__tour-fact tour-calendar__tour-fact--difficulty">
              <svg className="tour-calendar__icon" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d={HIKER_PATH} />
              </svg>
              <span aria-hidden="true">{event.difficulty}/10</span>
              <span className="tour-calendar__sr-only">
                {DIFFICULTY_LABEL}: {event.difficulty}/10
              </span>
            </span>
          )}
        </span>
      </span>
      <span className="tour-calendar__tour-chevron">
        <ChevronIcon direction="right" />
      </span>
    </CustomLink>
  );
}

function AllToursLink({ link }: Readonly<{ link: LinkProps }>) {
  const localizePath = useLocalizedPath();
  const { CALENDAR_ALL_TOURS_LABEL } = useTexts();

  return (
    <CustomLink
      href={link.isExternal ? link.href : localizePath(link.href)}
      target={link.isExternal ? "_blank" : "_self"}
      underline="none"
      className="tour-calendar__all-link"
      style={{ display: "inline-flex" }}
    >
      {link.text || CALENDAR_ALL_TOURS_LABEL}
      <ArrowIcon />
    </CustomLink>
  );
}

interface TourCalendarProps {
  theme: "turquoise" | "brown";
  /** Tours of the current year, fetched on the server. */
  initialEvents: CalendarEvent[];
  /** Loads the tours of another year when the visitor pages into it. */
  onYearChange: (year: number) => Promise<CalendarEvent[]>;
  /** The side list of the next few tours. Leave it out where there is no room for it. */
  upcomingEvents?: CalendarEvent[];
  /** The "all tours" button under the lists. Without it the button is not rendered. */
  allPostsLink?: LinkProps;
}

export function TourCalendar({
  theme,
  initialEvents,
  onYearChange,
  upcomingEvents,
  allPostsLink,
}: Readonly<TourCalendarProps>) {
  const localizePath = useLocalizedPath();
  const {
    CALENDAR_DAYS_OF_WEEK,
    CALENDAR_DAYS_OF_WEEK_SHORT,
    CALENDAR_MONTH_NAMES,
    CALENDAR_TODAY_LABEL,
    CALENDAR_ARIA_LABEL,
    CALENDAR_PICK_MONTH_ARIA,
    CALENDAR_PREV_MONTH_ARIA,
    CALENDAR_NEXT_MONTH_ARIA,
    CALENDAR_UPCOMING_TITLE,
    CALENDAR_UPCOMING_EMPTY,
    CALENDAR_MONTH_TOURS_TITLE,
    CALENDAR_MONTH_TOURS_EMPTY,
    CALENDAR_LEGEND_UPCOMING,
    CALENDAR_LEGEND_PAST,
    CALENDAR_LEGEND_TODAY,
  } = useTexts();

  const [today] = useState(() => new Date());
  const todayIndex = toDayIndex(today);

  const [view, setView] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const [eventsByYear, setEventsByYear] = useState<Record<number, CalendarEvent[]>>({
    [today.getFullYear()]: initialEvents,
  });
  const requestedYears = useRef(new Set([today.getFullYear()]));

  const [pickerAnchor, setPickerAnchor] = useState<HTMLElement | null>(null);
  const [pickerYear, setPickerYear] = useState(view.year);

  const loadYear = useCallback(
    async (year: number) => {
      if (requestedYears.current.has(year)) return;
      requestedYears.current.add(year);
      const events = await onYearChange(year);
      setEventsByYear((previous) => ({ ...previous, [year]: events }));
    },
    [onYearChange]
  );

  const goTo = (year: number, month: number) => {
    // The Date constructor rolls month -1 and 12 over into the neighbouring year.
    const target = new Date(year, month, 1);
    const next = { year: target.getFullYear(), month: target.getMonth() };
    setView(next);
    void loadYear(next.year);
    // A tour starting in late December can run on into January.
    if (next.month === 0) void loadYear(next.year - 1);
  };

  const { year, month } = view;
  const monthName = CALENDAR_MONTH_NAMES[month];

  // Tours are fetched per starting year, so a grid near New Year may need two years.
  const visibleEvents = useMemo(
    () => [year - 1, year, year + 1].flatMap((y) => eventsByYear[y] ?? []),
    [eventsByYear, year]
  );

  const weeks = useMemo(() => buildWeeks(year, month), [year, month]);

  const monthEvents = useMemo(() => {
    const monthStart = toDayIndex(new Date(year, month, 1));
    const monthEnd = toDayIndex(new Date(year, month + 1, 0));
    return visibleEvents
      .filter((event) => eventStart(event) <= monthEnd && eventEnd(event) >= monthStart)
      .sort(byStartDate);
  }, [visibleEvents, year, month]);

  const openPicker = (event: React.MouseEvent<HTMLElement>) => {
    setPickerYear(year);
    setPickerAnchor(event.currentTarget);
  };
  const closePicker = () => setPickerAnchor(null);
  const pickMonth = (pickedMonth: number) => {
    goTo(pickerYear, pickedMonth);
    closePicker();
  };

  return (
    <section
      className={`tour-calendar tour-calendar--${theme}`}
      aria-label={CALENDAR_ARIA_LABEL(year, monthName)}
    >
      <div className="tour-calendar__layout">
        <div className="tour-calendar__card">
          <div className="tour-calendar__toolbar">
            <button
              type="button"
              className="tour-calendar__title-button"
              aria-haspopup="menu"
              aria-expanded={Boolean(pickerAnchor)}
              aria-label={CALENDAR_PICK_MONTH_ARIA(year, monthName)}
              onClick={openPicker}
            >
              <span className="tour-calendar__title">
                <span className="tour-calendar__month">{monthName}</span>
                <span className="tour-calendar__year">{year}</span>
              </span>
              <ChevronIcon direction="down" />
            </button>
            <div className="tour-calendar__controls">
              <button
                type="button"
                className="tour-calendar__today-button"
                onClick={() => goTo(today.getFullYear(), today.getMonth())}
              >
                {CALENDAR_TODAY_LABEL}
              </button>
              <button
                type="button"
                className="tour-calendar__nav-button"
                aria-label={CALENDAR_PREV_MONTH_ARIA}
                onClick={() => goTo(year, month - 1)}
              >
                <ChevronIcon direction="left" />
              </button>
              <button
                type="button"
                className="tour-calendar__nav-button"
                aria-label={CALENDAR_NEXT_MONTH_ARIA}
                onClick={() => goTo(year, month + 1)}
              >
                <ChevronIcon direction="right" />
              </button>
            </div>
          </div>

          <CustomMenu anchorEl={pickerAnchor} open={Boolean(pickerAnchor)} onClose={closePicker}>
            <CustomMenuItem onClick={() => setPickerYear((y) => y - 1)}>
              <span className="tour-calendar__picker-year">
                <ChevronIcon direction="left" />
                {pickerYear - 1}
              </span>
            </CustomMenuItem>
            <CustomMenuItem disabled className="tour-calendar__picker-current-year">
              {pickerYear}
            </CustomMenuItem>
            {CALENDAR_MONTH_NAMES.map((name, index) => (
              <CustomMenuItem
                key={name}
                selected={pickerYear === year && index === month}
                onClick={() => pickMonth(index)}
              >
                {name}
              </CustomMenuItem>
            ))}
            <CustomMenuItem onClick={() => setPickerYear((y) => y + 1)}>
              <span className="tour-calendar__picker-year">
                {pickerYear + 1}
                <ChevronIcon direction="right" />
              </span>
            </CustomMenuItem>
          </CustomMenu>

          {/* The grid is visual only - the tour links and the lists carry the content. */}
          <div className="tour-calendar__weekdays" aria-hidden="true">
            {CALENDAR_DAYS_OF_WEEK.map((dayName, index) => (
              <span
                key={dayName}
                className={classNames(
                  "tour-calendar__weekday",
                  index >= WEEKEND_START && "tour-calendar__weekday--weekend"
                )}
              >
                <span className="tour-calendar__weekday-long">{dayName}</span>
                <span className="tour-calendar__weekday-short">
                  {CALENDAR_DAYS_OF_WEEK_SHORT[index]}
                </span>
              </span>
            ))}
          </div>

          <div className="tour-calendar__weeks">
            {weeks.map((week) => {
              const placedEvents = placeEvents(week, visibleEvents, todayIndex);
              const laneCount = placedEvents.reduce((max, placed) => Math.max(max, placed.lane + 1), 0);
              const laneRows = laneCount > 0 ? ` repeat(${laneCount}, auto)` : "";

              return (
                <div
                  key={toDayIndex(week[0])}
                  className="tour-calendar__week"
                  style={{ gridTemplateRows: `var(--tour-calendar-day-row)${laneRows} 1fr` }}
                >
                  {week.map((date, weekday) => (
                    <div
                      key={date.getTime()}
                      aria-hidden="true"
                      className={classNames(
                        "tour-calendar__day",
                        weekday >= WEEKEND_START && "tour-calendar__day--weekend",
                        date.getMonth() !== month && "tour-calendar__day--outside",
                        toDayIndex(date) === todayIndex && "tour-calendar__day--today"
                      )}
                      style={{ gridColumn: weekday + 1, gridRow: "1 / -1" }}
                    >
                      <span className="tour-calendar__day-number">{date.getDate()}</span>
                    </div>
                  ))}
                  {placedEvents.map((placed) => (
                    <CustomLink
                      key={placed.event.id}
                      href={localizePath(placed.event.link)}
                      underline="none"
                      title={placed.event.title}
                      className={classNames(
                        "tour-calendar__event",
                        placed.startColumn === placed.endColumn && "tour-calendar__event--single",
                        placed.isPast && "tour-calendar__event--past",
                        placed.continuesBefore && "tour-calendar__event--continues-before",
                        placed.continuesAfter && "tour-calendar__event--continues-after"
                      )}
                      style={{
                        display: "block",
                        gridColumn: `${placed.startColumn + 1} / ${placed.endColumn + 2}`,
                        gridRow: placed.lane + 2,
                      }}
                    >
                      <span className="tour-calendar__event-title">{placed.event.title}</span>
                    </CustomLink>
                  ))}
                </div>
              );
            })}
          </div>

          <div className="tour-calendar__legend" aria-hidden="true">
            <span className="tour-calendar__legend-item">
              <span className="tour-calendar__legend-swatch" />
              {CALENDAR_LEGEND_UPCOMING}
            </span>
            <span className="tour-calendar__legend-item">
              <span className="tour-calendar__legend-swatch tour-calendar__legend-swatch--past" />
              {CALENDAR_LEGEND_PAST}
            </span>
            <span className="tour-calendar__legend-item">
              <span className="tour-calendar__legend-swatch tour-calendar__legend-swatch--today" />
              {CALENDAR_LEGEND_TODAY}
            </span>
          </div>

          {/* Narrow screens: the bars shrink to markers, so the month's tours are listed. */}
          <div className="tour-calendar__month-list">
            <h3 className="tour-calendar__list-title">{CALENDAR_MONTH_TOURS_TITLE(monthName)}</h3>
            {monthEvents.length > 0 ? (
              <ul className="tour-calendar__tours no-list-style">
                {monthEvents.map((event) => (
                  <li key={event.id}>
                    <TourCard event={event} isPast={eventEnd(event) < todayIndex} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="tour-calendar__empty">{CALENDAR_MONTH_TOURS_EMPTY}</p>
            )}
            {allPostsLink && <AllToursLink link={allPostsLink} />}
          </div>
        </div>

        {upcomingEvents && (
          <aside className="tour-calendar__upcoming">
            <h3 className="tour-calendar__list-title">{CALENDAR_UPCOMING_TITLE}</h3>
            {upcomingEvents.length > 0 ? (
              <ul className="tour-calendar__tours no-list-style">
                {upcomingEvents.map((event) => (
                  <li key={event.id}>
                    <TourCard event={event} isPast={false} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="tour-calendar__empty">{CALENDAR_UPCOMING_EMPTY}</p>
            )}
            {allPostsLink && <AllToursLink link={allPostsLink} />}
          </aside>
        )}
      </div>
    </section>
  );
}
