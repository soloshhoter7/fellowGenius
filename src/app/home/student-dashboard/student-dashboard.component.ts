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
	filterSearch: tutorProfileDetails[];
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
		});
	}

	fetchApprovedMeetings() {
		this.httpService.fetchApprovedMeetings(this.sid).subscribe((req) => {
			console.log('THESE ARE APPROVED MEETINGS' + req);
			this.approvedList = req;
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
