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
import { SocialAuthService } from 'angularx-social-login';
import { CookieService } from 'ngx-cookie-service';
import { HostListener } from '@angular/core';
import * as jwt_decode from 'jwt-decode';
import { tutorProfileDetails } from '../model/tutorProfileDetails';
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
	tutorProfileDetails = new tutorProfileDetails();
	dashboardUrl: string = '/home/studentDashboard';
	loginType;
	studentLoginDetails = new StudentLoginModel();
	RegisterForm: NgForm;
	userId;
	overlay;
	screenHeight: number;
	screenWidth: number;
	profilePictureUrl = '../../../assets/images/default-user-image.png';
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
		private locationStrategy: LocationStrategy,
		private authService: SocialAuthService,
		private cookieService: CookieService
	) {
		this.getScreenSize();
	}
	index: Number;
	@HostListener('window:resize', [ '$event' ])
	getScreenSize(event?) {
		this.screenHeight = window.innerHeight;
		this.screenWidth = window.innerWidth;
		// console.log(this.screenHeight, this.screenWidth);
	}
	ngOnInit() {
		this.index = 1;
		if (this.screenWidth >= 450) {
			console.log('executed');
			this.openNav();
		}
		if (this.isTokenValid()) {
			console.log('entered!');
			this.loginType = this.loginService.getLoginType();
			if (this.loginType) {
				if (this.loginType == 'Learner') {
					console.log('entered in learner !');
					this.studentProfile = this.studentServce.getStudentProfileDetails();
					if (this.studentProfile.profilePictureUrl != null) {
						this.profilePictureUrl = this.studentProfile.profilePictureUrl;
					}
					this.router.navigate([ 'home/studentDashboard' ]);
				} else if (this.loginType == 'Expert') {
					this.tutorProfile = this.tutorService.getTutorDetials();
					this.tutorProfileDetails = this.tutorService.getTutorProfileDetails();
					if (this.tutorProfileDetails.profilePictureUrl != null) {
						this.profilePictureUrl = this.tutorProfile.profilePictureUrl;
					}
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
						width: 'auto',
						height: 'auto'
					});
				}
			} else {
				this.handleRefresh();
				// setTimeout(() => {
				// 	console.log('hello');
				// }, 1000);
			}
		} else {
			this.router.navigate([ 'facade' ]);
		}
	}
	openNav() {
		if (this.screenWidth >= 450) {
			document.getElementById('sidenav').style.width = '230px';
			document.getElementById('mainContent').style.marginLeft = '230px';
			this.overlay = '';
		} else {
			document.getElementById('sidenav').style.width = '300px';
			this.overlay = 'overlay';
		}
	}

	closeNav() {
		document.getElementById('sidenav').style.width = '0';
		document.getElementById('mainContent').style.marginLeft = '0';
		this.overlay = '';
	}
	navAction(index) {
		if (index % 2 == 1) {
			this.index = index + 1;
			this.closeNav();
		} else {
			this.index = index + 1;
			this.openNav();
		}
	}
	isTokenValid() {
		if (this.cookieService.get('token') && !this.isTokenExpired()) {
			return true;
		} else {
			this.cookieService.delete('token');
			this.cookieService.delete('userId');
			return false;
		}
	}

	isTokenExpired(token?: string): boolean {
		if (!token) token = this.getToken();
		if (!token) return true;

		const date = this.getTokenExpirationDate(token);
		if (date === undefined) return false;
		return !(date.valueOf() > new Date().valueOf());
	}
	1;
	getTokenExpirationDate(token: string): Date {
		const decoded = jwt_decode(token);

		if (decoded['exp'] === undefined) return null;

		const date = new Date(0);
		date.setUTCSeconds(decoded['exp']);
		return date;
	}

	getToken(): string {
		return this.cookieService.get('token');
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

	onSignOut() {
		this.cookieService.delete('token');
		this.cookieService.delete('userId');
		this.router.navigate([ '' ]);
	}

	// signOut() {
	// 	this.authService.signOut();
	// 	this.router.navigate([ '#' ]);
	// }

	handleRefresh() {
		this.userId = this.cookieService.get('userId');
		if (jwt_decode(this.cookieService.get('token'))['ROLE'] == 'Learner') {
			this.loginType = 'Learner';
			this.loginService.setTrType('login');
			this.httpService.getStudentDetails(this.userId).subscribe((res) => {
				this.studentProfile = res;
				if (this.studentProfile.profilePictureUrl != null) {
					this.profilePictureUrl = this.studentProfile.profilePictureUrl;
				}
				this.studentService.setStudentProfileDetails(this.studentProfile);
				this.httpService.getStudentSchedule(this.userId).subscribe((res) => {
					this.studentService.setStudentBookings(res);
					// this.router.navigate([ 'home/studentDashboard' ]);
				});
			});
		} else if (jwt_decode(this.cookieService.get('token'))['ROLE'] == 'Expert') {
			this.loginType = 'Expert';
			this.loginService.setTrType('login');
			this.httpService.getTutorDetails(this.userId).subscribe((res) => {
				this.tutorProfile = res;
				this.tutorService.setTutorDetails(this.tutorProfile);
				this.httpService.getTutorProfileDetails(this.userId).subscribe((res) => {
					this.tutorProfileDetails = res;
					if (this.tutorProfileDetails.profilePictureUrl != null) {
						this.profilePictureUrl = this.tutorProfileDetails.profilePictureUrl;
					}
					this.tutorService.setTutorProfileDetails(res);
					this.httpService.getScheduleData(this.userId).subscribe((res) => {
						this.tutorService.setPersonalAvailabilitySchedule(res);
						if (this.tutorService.getPersonalAvailabilitySchedule().isAvailable == 'yes') {
							this.checked = true;
						} else {
							this.checked = false;
						}
					});
				});
			});
		}
	}
}
