'use server'

import { StrapiImage } from "../StrapiImage";
import { CalendarWithContent } from "../CalendarWithContent";
import { HeroWithCalendarProps, EventProps } from "@/types";
import { getContentForCalendar } from "@/data/loaders";
import { CalendarEvent } from "../custom-ui-components/custom-calendar/CalendarTypes";

async function loader<Type>(path: string, year: number) {
    const { data } = await getContentForCalendar(path, year);
    console.log(`Fetched data for path ${path} and year ${year}:`, data); // Debug log to check the fetched data
    return {
        data: (data as Type[]) || [],
    };
}

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
    logo,
    theme,
}: Readonly<HeroWithCalendarProps>) {

    const path = `/api/events`;

    let year = new Date().getFullYear();

    const setYear = (newYearValue: number) => {
        year = newYearValue;
    };

    const { data } = await loader<EventProps>(path, year);

    const calendarData: CalendarEvent[] = eventcalendarDataMapper(data);
    console.log("Mapped calendar data:", calendarData); // Debug log to check the mapped calendar data

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
            <div className={`hero__headline hero__headline-centered hero__headline--${theme}`}>
                <h1>{headline}</h1>
                <CalendarWithContent
                    theme={theme}
                    calendarEvents={calendarData}
                />
            </div>
            {logo && (
                <StrapiImage
                    src={logo.image.url}
                    alt={logo.image.alternativeText || "No alternative text provided"}
                    className={`hero__logo hero__logo--${theme}`}
                    width={120}
                    height={120}
                />
            )}
        </section>
    );
}
