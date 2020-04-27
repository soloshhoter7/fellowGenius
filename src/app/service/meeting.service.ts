import { Injectable } from '@angular/core';
import { meetingDetails } from '../model/meetingDetails';
import { bookingDetails } from '../model/bookingDetails';

@Injectable({
	providedIn: 'root'
})
export class MeetingService {
	bookingDetails: bookingDetails;
	setBooking(bookingDetails: bookingDetails) {
		this.bookingDetails = bookingDetails;
	}
	getBooking() {
		return this.bookingDetails;
	}
	meeting = new meetingDetails();
	constructor() {}
	setMeeting(meeting: meetingDetails) {
		this.meeting.role = meeting.role;
		this.meeting.roomId = meeting.roomId;
		this.meeting.roomName = meeting.roomName;
		this.meeting.userName = meeting.userName;
	}

	getMeeting() {
		return this.meeting;
	}
}
