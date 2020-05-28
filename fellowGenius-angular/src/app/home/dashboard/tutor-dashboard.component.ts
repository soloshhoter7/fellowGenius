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
	public now: Date = new Date();
	constructor(
		private httpService: HttpService,
		private tutorService: TutorService,
		private meetingService: MeetingService,
		private router: Router
	) {
		setInterval(() => {
			this.now = new Date();
		}, 1000);
	}

	bookingRequestMessage = '';
	approvedMeetingsMessage = '';
	liveMeetingsMessage = '';

	bookingList: bookingDetails[];
	meetingList: bookingDetails[];
	liveMeetingList: bookingDetails[];
	hostMeeting = new meetingDetails();
	tutorProfileDetails: tutorProfileDetails;
	completeProfile = true;
	condition;
	ngOnInit(): void {
		this.tutorProfileDetails = this.tutorService.getTutorProfileDetails();
		this.fetchTutorBookings();
		this.fetchTutorApprovedMeetings();
		this.fetchTutorLiveMeetings();
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
			if (this.bookingList.length == 0) {
				console.log(' no bookings ');
				this.bookingRequestMessage = 'No booking Requests Pending.';
			}
			console.log(this.bookingList);
		});
	}

	fetchTutorApprovedMeetings() {
		this.httpService.fetchApprovedMeetingsTutor(this.tutorService.getTutorDetials().tid).subscribe((res) => {
			this.meetingList = res;
			if (this.meetingList.length == 0) {
				this.approvedMeetingsMessage = 'No upcoming Meetings Pending.';
			}
			for (let booking of this.meetingList) {
				this.before10MinutesTime(booking);
				this.timeLeft(booking);
				this.enableJoinNow(booking);
			}
			console.log('this is meeting list !');
			console.log(this.meetingList);
		});
	}

	fetchTutorLiveMeetings() {
		this.httpService.fetchLiveMeetingsTutor(this.tutorService.getTutorDetials().tid).subscribe((res) => {
			this.liveMeetingList = res;
			if (this.liveMeetingList.length == 0) {
				this.liveMeetingsMessage = 'No live meetings.';
			}
			console.log('this is live meeting list!');
			console.log(this.liveMeetingList);
		});
	}
	//for checking time
	enableJoinNow(booking: bookingDetails) {
		setInterval(() => {
			if (booking.startTimeHour == this.now.getHours() && booking.startTimeMinute == this.now.getMinutes()) {
				console.log('now is the time!');
				booking.isLive = true;
			}
		}, 20000);
	}
	//to calculate the time left
	timeLeft(booking: bookingDetails) {
		var startMinutes: number = booking.startTimeHour * 60 + booking.startTimeMinute;
		var timeLeftString: string;
		// console.log('booking id ->' + booking.bid + 'start Minutes ->' + startMinutes);
		var currentMinutes = this.now.getHours() * 60 + this.now.getMinutes();
		var differenceMinutes: number = startMinutes - currentMinutes;
		var timeLeftHours: number = Math.trunc(differenceMinutes / 60);
		var timeLeftMinutes: number = differenceMinutes % 60;
		if (differenceMinutes > 0) {
			if (timeLeftHours == 0) {
				timeLeftString = timeLeftMinutes + ' minutes left ';
			} else {
				if (timeLeftMinutes != 0) {
					timeLeftString = timeLeftHours + ' hours ' + timeLeftMinutes + ' minutes left';
				} else if (timeLeftMinutes == 0) {
					timeLeftString = timeLeftHours + ' hours left';
				}
			}
			booking.timeLeft = timeLeftString;
		}
		setInterval(() => {
			currentMinutes = this.now.getHours() * 60 + this.now.getMinutes();
			differenceMinutes = startMinutes - currentMinutes;
			timeLeftHours = Math.trunc(differenceMinutes / 60);
			timeLeftMinutes = differenceMinutes % 60;
			if (differenceMinutes > 0) {
				if (timeLeftHours == 0) {
					timeLeftString = timeLeftMinutes + ' minutes left ';
				} else {
					if (timeLeftMinutes != 0) {
						timeLeftString = timeLeftHours + ' hours ' + timeLeftMinutes + ' minutes left';
					} else if (timeLeftMinutes == 0) {
						timeLeftString = timeLeftHours + ' hours left';
					}
				}
				booking.timeLeft = timeLeftString;
			}
		}, 20000);
	}
	//minus 10 minutes from time
	before10MinutesTime(meeting: bookingDetails) {
		if (meeting.startTimeMinute == 0) {
			meeting.startTimeMinute = 50;
			meeting.startTimeHour -= 1;
		} else {
			meeting.startTimeMinute -= 10;
		}
	}

	onHost(booking: bookingDetails) {
		booking.approvalStatus = 'live';
		this.httpService.updateBookingStatus(booking.bid, booking.approvalStatus).subscribe((res) => {
			if (res == true) {
				console.log('booking status update Successfully !');
				this.meetingList.splice(this.meetingList.indexOf(booking, 0), 1);
				this.liveMeetingList.push(booking);
				console.log('status updated successfully !');
			}
		});
		this.hostMeeting.roomId = 123;
		this.hostMeeting.role = 'host';
		this.hostMeeting.roomName = booking.meetingId;
		this.hostMeeting.userName = booking.tutorName;
		console.log(this.hostMeeting);
		this.meetingService.setMeeting(this.hostMeeting);
		this.router.navigate([ 'meeting' ]);
	}

	//on join function for live meetings
	onJoin(booking: bookingDetails) {
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
