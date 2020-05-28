import { Time } from '@angular/common';

export class bookingDetails {
	public bid: number;
	public endTimeHour: number;
	public endTimeMinute: number;
	public duration: number;
	public dateOfMeeting: string;
	public startTimeHour: number;
	public startTimeMinute: number;
	public description: string;
	public studentId: number;
	public tutorId: number;
	public meetingId: string;
	public studentName: string;
	public tutorName: string;
	public approvalStatus: string = 'Pending';
	public isLive: boolean = false;
	public timeLeft: String = '';
}
