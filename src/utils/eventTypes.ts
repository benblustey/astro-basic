export interface Event {
	epoch: number;
	src: string;
}

export interface HourlyEvent {
	hour: number;
	count: number;
}
