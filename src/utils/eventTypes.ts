export interface Event {
	epoch: number;
	src: string;
}

export interface HourlyEvent {
	hour: number;
	count: number;
}

export interface AllEventsData {
  daysTotal: number;
  eventTotal: number;
  hourlyEvents: { hour: number; count: number }[];
  calendarData: { date: string; count: number }[];
}
