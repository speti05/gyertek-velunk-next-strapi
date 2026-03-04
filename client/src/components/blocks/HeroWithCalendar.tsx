'use server'

import { StrapiImage } from "../StrapiImage";
import { CalendarWithContent } from "../CalendarWithContent";
import { HeroWithCalendarProps, EventProps } from "@/types";
import { getContentForCalendar } from "@/data/loaders";
import { loadCalendarData } from "@/data/calendar-actions";
import { CalendarEvent } from "../custom-ui-components/custom-calendar/CalendarTypes";
import { HeroTextAndButtons } from "../HeroTextAndButtons";

const eventcalendarDataMapper = (data: EventProps[]) => (data.map((event: EventProps) => ({
    id: event.documentId,
    title: event.title,
    link: `turaink/${event.slug}`,
    description: event.description,
    startDate: new Date(event.startDate),
    endDate: new Date(event.endDate)
})));

export async function HeroWithCalendar({
    headline,
    image,
    theme,
    Link,
    welcomeText
}: Readonly<HeroWithCalendarProps>) {

    const year = new Date().getFullYear();
    const { data } = await getContentForCalendar(`/api/events`, year);
    const calendarData: CalendarEvent[] = eventcalendarDataMapper((data as EventProps[]) || []);
    return (
        <section className="hero hero__with-calendar">
            <div className="hero__background">
                <StrapiImage
                    src={image?.url}
                    alt={image?.alternativeText || "No alternative text provided"}
                    className="hero__background-image"
                    width={1920}
                    height={1080}
                />
                <div className="hero__background__overlay"></div>
            </div>
            <div className={`hero__container`}>
                <div className={`hero__text_and_button_container`}>
                    <HeroTextAndButtons headline={headline} theme={theme} linkButtons={Link} welcomeText={welcomeText} />
                </div>
                <div className={`hero__calendar_container`}>
                    <CalendarWithContent
                        theme={theme}
                        calendarEvents={calendarData}
                        onYearChange={loadCalendarData}
                    />
                </div>
            </div>
        </section>
    );
}
