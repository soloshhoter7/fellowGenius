import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../service/http.service';
import { StudentService } from '../../service/student.service';
import { bookingDetails } from 'src/app/model/bookingDetails';
import { TutorService } from 'src/app/service/tutor.service';
import { tutorProfileDetails } from 'src/app/model/tutorProfileDetails';
import { meetingDetails } from 'src/app/model/meetingDetails';
import { MeetingService } from 'src/app/service/meeting.service';
import { Router } from '@angular/router';

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
	emptyBookingList: boolean = false;
	emptyApprovedList: boolean = false;
	emptyLiveList: boolean = false;

	constructor(
		private httpService: HttpService,
		private studentService: StudentService,
		private tutorService: TutorService,
		private meetingService: MeetingService,
		private router: Router
	) {}

	ngOnInit(): void {
		this.sid = this.studentService.getStudentProfileDetails().sid;
		console.log('sid is' + this.sid);
		this.fetchTutorList();
		this.findStudentBookings();
		this.fetchApprovedMeetings();
		this.fetchLiveMeetings();
	}

	fetchTutorList() {
		this.httpService.getTutorList().subscribe((req) => {
			this.filterSearch = req;
			this.tutorService.tutorList = req;
		});
	}
	findStudentBookings() {
		this.httpService.findStudentBookings(this.sid).subscribe((req) => {
			console.log('THESE ARE Pending MEETINGS' + req);
			this.bookingList = req;
			if (this.bookingList.length == 0) {
				this.emptyBookingList = true;
			}
		});
	}

	fetchApprovedMeetings() {
		this.httpService.fetchApprovedMeetings(this.sid).subscribe((req) => {
			console.log('THESE ARE APPROVED MEETINGS');
			console.log(req);
			this.approvedList = req;
			console.log(this.approvedList.length);
			if (this.approvedList.length == 0) {
				this.emptyApprovedList = true;
			}
		});
	}

	fetchLiveMeetings() {
		this.httpService.fetchLiveMeetingsStudent(this.sid).subscribe((res) => {
			console.log(' live meetings list');
			this.liveMeetingList = res;
			if (this.liveMeetingList.length == 0) {
				this.emptyLiveList = true;
			}
		});
	}
	onJoin(booking: bookingDetails) {
		this.joinMeeting.role = 'student';
		this.joinMeeting.roomId = 123;
		this.joinMeeting.roomName = booking.meetingId;
		this.joinMeeting.userName = booking.studentName;
		console.log(this.joinMeeting);
		this.meetingService.setMeeting(this.joinMeeting);
		this.router.navigate([ 'meeting' ]);
	}
}
