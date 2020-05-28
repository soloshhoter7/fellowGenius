import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { meetingDetails } from '../model/meetingDetails';
import { MeetingService } from '../service/meeting.service';
import { StudentProfileModel } from '../model/studentProfile';
import { StudentService } from '../service/student.service';
import { tutorProfile } from '../model/tutorProfile';
import { LoginDetailsService } from '../service/login-details.service';
import { TutorService } from '../service/tutor.service';
import { WelcomeComponent } from '../home/welcome/welcome.component';
import { MatDialog } from '@angular/material/dialog';
import { HttpService } from '../service/http.service';
import { StudentLoginModel } from '../model/studentLoginModel';
@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: [ './home.component.css' ]
})
export class HomeComponent implements OnInit {
	joinMeeting = new meetingDetails();
	hostMeeting = new meetingDetails();
	studentProfile = new StudentProfileModel();
	tutorProfile = new tutorProfile();
	dashboardUrl: string = '/home/studentDashboard';
	loginType;
	studentLoginDetails = new StudentLoginModel();
	@ViewChild('r', { static: false })
	@ViewChild('f', { static: false })
	RegisterForm: NgForm;
	constructor(
		public router: Router,
		public meetingService: MeetingService,
		private studentServce: StudentService,
		private loginService: LoginDetailsService,
		private tutorService: TutorService,
		private dialog: MatDialog,
		private httpService: HttpService,
		private studentService: StudentService,
		private loginDetailsService: LoginDetailsService
	) {}

	ngOnInit() {
		this.loginType = this.loginService.getLoginType();
		// this.httpService.getStudentDetails(this.studentLoginDetails).subscribe((res) => {
		// 	this.studentProfile = res;
		// 	this.studentService.setStudentProfileDetails(this.studentProfile);
		// 	console.log("SID IS " + this.studentService.getStudentProfileDetails().sid);
		// });
		if (this.loginType == 'student') {
			this.studentProfile = this.studentServce.getStudentProfileDetails();
			console.log('student Id:' + this.studentServce.getStudentProfileDetails().sid);
			this.router.navigate([ 'home/studentDashboard' ]);
		} else if (this.loginType == 'tutor') {
			console.log('tutor Id:' + this.tutorService.getTutorDetials().tid);
			this.tutorProfile = this.tutorService.getTutorDetials();
			this.dashboardUrl = '/home/tutorDashboard';
			this.router.navigate([ 'home/tutorDashboard' ]);
		}
		if (this.loginService.getTrType() == 'signUp') {
			this.dialog.open(WelcomeComponent, {
				width: '70vw',
				height: '90vh'
			});
		}
	}
	onJoin() {
		this.joinMeeting.role = 'student';
		console.log(this.joinMeeting);
		this.meetingService.setMeeting(this.joinMeeting);
		this.router.navigate([ 'meeting' ]);
	}
	onHost() {
		this.hostMeeting.roomId = 123;
		this.hostMeeting.role = 'host';
		this.hostMeeting.roomName = 'abc';
		console.log(this.hostMeeting);
		this.meetingService.setMeeting(this.hostMeeting);
		this.router.navigate([ 'meeting' ]);
	}
	openNav() {
		console.log('hey');
		document.getElementById('mySidenav').style.width = '250px';
	}
	closeNav() {
		document.getElementById('mySidenav').style.width = '0';
	}
}
