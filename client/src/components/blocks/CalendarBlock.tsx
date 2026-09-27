import type { CalendarBlockProps } from "@/types";
import { CalendarWithContent } from "@/components/CalendarWithContent";
import { ContentListHeadline } from "@/components/ContentListHeadline";
import { loadCalendarData, loadUpcomingEvents } from "@/data/calendar-actions";

// The same event calendar as the Hero with calendar block, but laid out as a plain page
// section instead of sitting on top of a full-width hero image.
export async function CalendarBlock({
  headline,
  theme,
  LinkToAllPosts,
}: Readonly<CalendarBlockProps>) {
  const [calendarEvents, upcomingEvents] = await Promise.all([
    loadCalendarData(new Date().getFullYear()),
    loadUpcomingEvents(),
  ]);

  return (
    <div className="calendar-block">
      {headline && <ContentListHeadline headline={headline} />}
      <CalendarWithContent
        theme={theme}
        calendarEvents={calendarEvents}
        onYearChange={loadCalendarData}
        upcomingEvents={upcomingEvents}
        allPostsLink={LinkToAllPosts ?? undefined}
      />
    </div>
  );
}
