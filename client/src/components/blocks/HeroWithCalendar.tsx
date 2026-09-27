"use server";

import { StrapiImageWithSkeleton } from "../StrapiImageWithSkeleton";
import { CalendarWithContent } from "../CalendarWithContent";
import { HeroWithCalendarProps } from "@/types";
import { loadCalendarData } from "@/data/calendar-actions";
import { HeroTextAndButtons } from "../HeroTextAndButtons";

export async function HeroWithCalendar({
  headline,
  image,
  theme,
  Link,
  welcomeText,
}: Readonly<HeroWithCalendarProps>) {
  const calendarData = await loadCalendarData(new Date().getFullYear());
  return (
    <section className="hero hero__with-calendar">
      <div className="hero__background">
        <StrapiImageWithSkeleton
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
          <HeroTextAndButtons
            headline={headline}
            theme={theme}
            linkButtons={Link}
            welcomeText={welcomeText}
          />
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
