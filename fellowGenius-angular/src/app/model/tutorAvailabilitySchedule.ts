import { scheduleData } from './scheduleData';

export class tutorAvailabilitySchedule {
	public tid: number;
	public fullName: string;
	public allAvailabilitySchedule: scheduleData[];
	public allMeetingsSchedule: scheduleData[];
	public availabilityStatus: string;
	public isAvailable: string;
}
