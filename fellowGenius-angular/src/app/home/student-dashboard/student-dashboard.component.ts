import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../service/http.service';
import { StudentService } from '../../service/student.service';
import { bookingDetails } from 'src/app/model/bookingDetails';
import { TutorService } from 'src/app/service/tutor.service';
import { tutorProfileDetails } from 'src/app/model/tutorProfileDetails';
import { meetingDetails } from 'src/app/model/meetingDetails';
import { MeetingService } from 'src/app/service/meeting.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { TutorProfileComponent } from '../find-tutor/tutor-profile/tutor-profile.component';
import { ProfileService } from 'src/app/service/profile.service';
import { DeletePopupComponent } from './delete-popup/delete-popup.component';

@Component({
	selector: 'app-student-dashboard',
	templateUrl: './student-dashboard.component.html',
	styleUrls: [ './student-dashboard.component.css' ]
})
export class StudentDashboardComponent implements OnInit {
	joinMeeting = new meetingDetails();
	sid: number;
	bookingList: bookingDetails[];
	approvedList: bookingDetails[];
	liveMeetingList: bookingDetails[];
	filterSearch: tutorProfileDetails[];
	topTutors: tutorProfileDetails[];
	emptyBookingList: boolean = false;
	emptyApprovedList: boolean = false;
	emptyLiveList: boolean = false;
	public now: Date = new Date();
	noTutorMessage = '';
	constructor(
		private httpService: HttpService,
		private studentService: StudentService,
		private tutorService: TutorService,
		public meetingService: MeetingService,
		private router: Router,
		private dialog: MatDialog,
		private profileService: ProfileService
	) {
		setInterval(() => {
			this.now = new Date();
		}, 1000);
	}

	ngOnInit(): void {
		this.sid = this.studentService.getStudentProfileDetails().sid;
		this.fetchTutorList();
		this.findStudentPendingBookings();
		this.fetchApprovedMeetings();
		this.fetchLiveMeetings();
		this.fetchTopTutors();
		if (this.meetingService.getNewBookingList() == 'delete') {
			this.emptyBookingList = true;
		}
	}
	// -----------------------------------------------fetching all kind of meetings --------------------------------------------------------------------
	// for fetching student pending bookings
	findStudentPendingBookings() {
		this.httpService.findStudentBookings(this.sid).subscribe((res) => {
			this.bookingList = res;
			this.meetingService.studentPendingRequests(this.bookingList);
			if (this.bookingList.length == 0) {
				this.emptyBookingList = true;
			}
		});
	}

	//for fetching student approved meetings
	fetchApprovedMeetings() {
		this.httpService.fetchApprovedMeetings(this.sid).subscribe((res) => {
			this.approvedList = res;
			if (this.approvedList.length == 0) {
				this.emptyApprovedList = true;
			}
			for (let booking of this.approvedList) {
				this.timeLeft(booking);
				if (this.approvedList.length == 0) {
					this.emptyApprovedList = true;
				}
			}
		});
	}

	//for fetching student live meetings
	fetchLiveMeetings() {
		this.httpService.fetchLiveMeetingsStudent(this.sid).subscribe((res) => {
			this.liveMeetingList = res;
			if (this.liveMeetingList.length == 0) {
				this.emptyLiveList = true;
			}
		});
	}

	// --------------------------------------------------meeting operations-----------------------------------------------------------------------------

	// // to check if the meeting is before the current date
	// isBeforeDate(booking: bookingDetails) {
	// 	var dateParts: any = booking.dateOfMeeting.split('/');
	// 	var bookingDate = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
	// 	var bookingDateOfMeeting = new Date(booking.dateOfMeeting);
	// 	var currentDate: string = new Date().toUTCString();
	// 	var currDate: Date = new Date(currentDate);
	// 	// currDate.setHours(0);
	// 	// currDate.setMinutes(0);
	// 	// currDate.setSeconds(0);
	// 	// currDate.setMilliseconds(0);
	// 	console.log(bookingDate + ':' + currDate);
	// 	// console.log(bookingDate.getTime() + ':' + currDate.getTime());
	// 	if (bookingDateOfMeeting.getMilliseconds() < currDate.getMilliseconds()) {
	// 		console.log('booking date is less');
	// 		return true;
	// 	} else {
	// 		console.log('booking date is more!');
	// 		return false;
	// 	}
	// }

	//to calculate the time left
	timeLeft(booking: bookingDetails) {
		var currentDate: string = new Date(Date.now()).toLocaleDateString('en-GB');
		if (currentDate == booking.dateOfMeeting) {
			var startMinutes: number = booking.startTimeHour * 60 + booking.startTimeMinute;
			var endMinutes: number = booking.endTimeHour * 60 + booking.endTimeMinute;
			var bookingDuration: number = booking.duration + 10;
			var timeLeftString: string;
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
				} else if (differenceMinutes <= 0) {
					if (Math.abs(differenceMinutes) > bookingDuration) {
						this.approvedList.splice(this.approvedList.indexOf(booking), 1);
					}
				}
			}, 5000);
		}
	}

	// //to check if the meeting is before current time
	// isTimeCompleted(booking, list: bookingDetails[]) {
	// 	var currentDate: string = new Date(Date.now()).toLocaleDateString('en-GB');
	// 	if (currentDate == booking.dateOfMeeting) {
	// 		console.log('live date Matches');
	// 		var startMinutes: number = booking.startTimeHour * 60 + booking.startTimeMinute;
	// 		var bookingDuration: number = booking.duration + 10;
	// 		var currentMinutes = this.now.getHours() * 60 + this.now.getMinutes();
	// 		var differenceMinutes: number = startMinutes - currentMinutes;
	// 		console.log('difference minutes->' + differenceMinutes);
	// 		if (differenceMinutes <= 0) {
	// 			if (Math.abs(differenceMinutes) > bookingDuration) {
	// 				console.log('spliced');
	// 				list.splice(list.indexOf(booking), 1);
	// 			}
	// 		}
	// 		setInterval(() => {
	// 			currentMinutes = this.now.getHours() * 60 + this.now.getMinutes();
	// 			differenceMinutes = startMinutes - currentMinutes;
	// 			if (differenceMinutes <= 0) {
	// 				if (Math.abs(differenceMinutes) > bookingDuration) {
	// 					if (list.indexOf(booking) != -1) {
	// 						list.splice(list.indexOf(booking), 1);
	// 					}
	// 				}
	// 			}
	// 		}, 5000);
	// 	}
	// }

	// -------------------------------------------------------------------------------------------------------------------------------------------------
	fetchTopTutors() {
		this.httpService.fetchTopTutors(this.studentService.getStudentProfileDetails().subject).subscribe((res) => {
			this.topTutors = res;
			if (this.topTutors.length == 0) {
				this.noTutorMessage = 'No tutors for your registered subject right now';
			}
		});
	}
	fetchTutorList() {
		this.httpService.getTutorList().subscribe((req) => {
			this.filterSearch = req;
			this.tutorService.tutorList = req;
		});
	}
	onJoin(booking: bookingDetails) {
		this.joinMeeting.role = 'student';
		this.joinMeeting.roomId = 123;
		this.joinMeeting.roomName = booking.meetingId;
		this.joinMeeting.userName = booking.studentName;
		this.meetingService.setMeeting(this.joinMeeting);
		this.meetingService.setBooking(booking);
		this.router.navigate([ 'meeting' ]);
	}

	openTutorProfile(tutorList: tutorProfileDetails) {
		this.profileService.setProfile(tutorList);
		this.dialog.open(TutorProfileComponent, {
			width: 'auto',
			height: 'auto'
		});
	}

	//delete pending request
	deleteBooking(myBooking: bookingDetails) {
		this.meetingService.setDeleteBooking(myBooking);
		this.dialog.open(DeletePopupComponent, {
			width: '400px',
			height: '150px'
		});
	}
}
