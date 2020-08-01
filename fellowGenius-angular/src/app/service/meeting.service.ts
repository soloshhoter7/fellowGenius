import { Injectable } from '@angular/core';
import { meetingDetails } from '../model/meetingDetails';
import { bookingDetails } from '../model/bookingDetails';

@Injectable({
	providedIn: 'root'
})
export class MeetingService {
	deleteBooking: string;
	bookingDetails: bookingDetails;
	cancelBooking = new bookingDetails();
	pendingRequests: bookingDetails[];
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
		this.meeting.userId = meeting.userId;
	}

	getMeeting() {
		return this.meeting;
	}
	setDeleteBooking(booking: bookingDetails) {
		this.cancelBooking = booking;
	}
	getDeleteBooking() {
		return this.cancelBooking;
	}

	refreshBookingList(del: string) {
		this.deleteBooking = del;
	}

	getNewBookingList() {
		return this.deleteBooking;
	}

	studentPendingRequests(bookingList: bookingDetails[]) {
		this.pendingRequests = bookingList;
	}

	getStudentPendingRequests() {
		return this.pendingRequests;
	}
}
