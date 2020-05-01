import { Component, OnInit } from '@angular/core';
import { tutorProfileDetails } from '../../model/tutorProfileDetails';
import { bookingDetails } from 'src/app/model/bookingDetails';
import { HttpService } from 'src/app/service/http.service';
import { TutorService } from 'src/app/service/tutor.service';
import { meetingDetails } from '../../model/meetingDetails';
import { MeetingService } from 'src/app/service/meeting.service';
import { Router } from '@angular/router';
@Component({
	selector: 'app-tutor-dashboard',
	templateUrl: './tutor-dashboard.component.html',
	styleUrls: [ './tutor-dashboard.component.css' ]
})
export class TutorDashboardComponent implements OnInit {
	constructor(
		private httpService: HttpService,
		private tutorService: TutorService,
		private meetingService: MeetingService,
		private router: Router
	) {}
	bookingList: bookingDetails[];
	meetingList: bookingDetails[];
	hostMeeting = new meetingDetails();
	tutorProfileDetails: tutorProfileDetails;
	completeProfile = true;
	condition;
	ngOnInit(): void {
		this.tutorProfileDetails = this.tutorService.getTutorProfileDetails();
		this.fetchTutorBookings();
		this.fetchTutorApprovedMeetings();
	}
	closeCompleteProfile() {
		this.completeProfile = false;
	}
	// -------------------------------------------------------------------------- tutor functions--------------------------------------------
	acceptBooking(booking: bookingDetails) {
		booking.approvalStatus = 'Accepted';
		console.log(booking.bid);
		console.log(this.bookingList.indexOf(booking, 0));
		this.httpService.updateBookingStatus(booking.bid, booking.approvalStatus).subscribe((res) => {
			if (res == true) {
				console.log('booking status update Successfully !');
				this.bookingList.splice(this.bookingList.indexOf(booking, 0), 1);
				this.meetingList.push(booking);
			}
		});
	}
	denyBooking(booking: bookingDetails) {
		booking.approvalStatus = 'Rejected';
		console.log(booking.bid);
		this.httpService.updateBookingStatus(booking.bid, booking.approvalStatus).subscribe((res) => {
			if (res == true) {
				console.log('booking status updated successfully !');
				this.bookingList.splice(this.bookingList.indexOf(booking, 0), 1);
			}
		});
	}
	fetchTutorBookings() {
		this.httpService.getTutorBookings(this.tutorService.getTutorDetials().tid).subscribe((res) => {
			this.bookingList = res;
			if (res == null) {
				console.log(' no bookings ');
			}
			console.log(this.bookingList);
		});
	}

	fetchTutorApprovedMeetings() {
		this.httpService.fetchApprovedMeetingsTutor(this.tutorService.getTutorDetials().tid).subscribe((res) => {
			this.meetingList = res;
			console.log('this is meeting list !');
			console.log(this.meetingList);
		});
	}

	onHost(booking: bookingDetails) {
		this.hostMeeting.roomId = 123;
		this.hostMeeting.role = 'host';
		this.hostMeeting.roomName = booking.meetingId;
		this.hostMeeting.userName = booking.tutorName;
		console.log(this.hostMeeting);
		this.meetingService.setMeeting(this.hostMeeting);
		this.router.navigate([ 'meeting' ]);
	}
	// --------------------------------------------------------------------------------------------------------------
}
