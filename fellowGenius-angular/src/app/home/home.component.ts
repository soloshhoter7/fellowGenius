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
import { ThemePalette } from '@angular/material/core';
import { LocationStrategy } from '@angular/common';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: [ './home.component.css' ]
})
export class HomeComponent implements OnInit {
	color: ThemePalette;
	checked = false;
	joinMeeting = new meetingDetails();
	hostMeeting = new meetingDetails();
	studentProfile = new StudentProfileModel();
	tutorProfile = new tutorProfile();
	dashboardUrl: string = '/home/studentDashboard';
	loginType;
	studentLoginDetails = new StudentLoginModel();
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
		private loginDetailsService: LoginDetailsService,
		private locationStrategy: LocationStrategy
	) {}

	ngOnInit() {
		if (this.loginService.getTrType() != null) {
			this.loginType = this.loginService.getLoginType();
			if (this.loginType == 'student') {
				this.studentProfile = this.studentServce.getStudentProfileDetails();
				// this.dashboardUrl = '/home/studentDashboard';
				this.router.navigate([ 'home/studentDashboard' ]);
			} else if (this.loginType == 'tutor') {
				this.tutorProfile = this.tutorService.getTutorDetials();
				if (this.tutorService.getPersonalAvailabilitySchedule().isAvailable == 'yes') {
					this.checked = true;
				} else {
					this.checked = false;
				}
				// this.dashboardUrl = '/home/tutorDashboard';
				this.router.navigate([ 'home/tutorDashboard' ]);
			}
			if (this.loginService.getTrType() == 'signUp') {
				this.dialog.open(WelcomeComponent, {
					width: '70vw',
					height: '90vh'
				});
			}
		} else {
			// this.router.navigate([ '' ]);
		}
		this.preventBackButton();
		this.preventRefreshButton();
	}
	toggleAvailability() {
		if (this.checked == true) {
			this.checked = false;
			this.tutorService.personalAvailablitySchedule.isAvailable = 'no';
		} else {
			this.checked = true;
			this.tutorService.personalAvailablitySchedule.isAvailable = 'yes';
		}
		this.httpService
			.changeAvailabilityStatus(
				this.tutorService.getPersonalAvailabilitySchedule().tid,
				this.tutorService.getPersonalAvailabilitySchedule().isAvailable
			)
			.subscribe((res) => {});
	}
	onJoin() {
		this.joinMeeting.role = 'student';
		this.meetingService.setMeeting(this.joinMeeting);
		this.router.navigate([ 'meeting' ]);
	}
	onHost() {
		this.hostMeeting.roomId = 123;
		this.hostMeeting.role = 'host';
		this.hostMeeting.roomName = 'abc';
		this.meetingService.setMeeting(this.hostMeeting);
		this.router.navigate([ 'meeting' ]);
	}
	openNav() {
		document.getElementById('mySidenav').style.width = '250px';
	}
	closeNav() {
		document.getElementById('mySidenav').style.width = '0';
	}
	preventBackButton() {
		history.pushState(null, null, location.href);
		this.locationStrategy.onPopState(() => {
			history.pushState(null, null, location.href);
		});
	}
	preventRefreshButton() {
		window.addEventListener('beforeunload', function(e) {
			var confirmationMessage = 'o/';
			e.returnValue = confirmationMessage; // Gecko, Trident, Chrome 34+
			return confirmationMessage; // Gecko, WebKit, Chrome <34
		});
	}
}
