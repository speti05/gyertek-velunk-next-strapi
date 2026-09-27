export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  link: string;
  startDate: Date;
  endDate: Date;
  difficulty?: number | null;
}
