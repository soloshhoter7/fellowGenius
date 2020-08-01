import { Component, OnInit, ElementRef, ViewChild, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { LoginDetailsService } from '../../service/login-details.service';
import { StudentLoginModel } from 'src/app/model/studentLoginModel';
import { NgForm } from '@angular/forms';
import { tutorLoginModel } from 'src/app/model/tutorLoginModel';
import { HttpService } from 'src/app/service/http.service';
import { StudentProfileModel } from 'src/app/model/studentProfile';
import { StudentService } from 'src/app/service/student.service';
import { tutorProfile } from 'src/app/model/tutorProfile';
import { TutorService } from 'src/app/service/tutor.service';
import { tutorProfileDetails } from 'src/app/model/tutorProfileDetails';
import { socialLogin } from 'src/app/model/socialModel';
import { SocialService } from 'src/app/service/social.service';
import { tutorAvailabilitySchedule } from 'src/app/model/tutorAvailabilitySchedule';
import { CookieService } from 'ngx-cookie-service';
// import * as jwt_decode from 'jwt-decode';
import * as JwtDecode from 'jwt-decode';
declare const FB: any;
@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: [ './login.component.css' ]
})
export class LoginComponent implements OnInit {
	constructor(
		private router: Router,
		public loginDetailsService: LoginDetailsService,
		private httpService: HttpService,
		private studentService: StudentService,
		private tutorService: TutorService,
		private socialService: SocialService,
		private zone: NgZone,
		private cookieService: CookieService
	) {}

	@ViewChild('googleSignUp', { static: true })
	googleSignUp: ElementRef;
	FB: any;
	socialLogin = new socialLogin();
	auth2: any;
	ngZone: NgZone;
	isLoading: boolean = false;
	hideSocialLogin = 'hideBlock';
	studentProfile: StudentProfileModel;
	tutorProfile: tutorProfile;
	tutorProfileDetails: tutorProfileDetails;
	hide: boolean = true;
	hideContainer = '';
	studentLoginDetails = new StudentLoginModel();
	tutorLoginDetails = new tutorLoginModel();
	tutorAvailabilitySchedule = new tutorAvailabilitySchedule();
	incorrectLoginDetails: boolean = false;
	errorText: string;
	userId;
	ngOnInit(): void {
		if (this.loginDetailsService.getLoginType() == null) {
			this.router.navigate([ '' ]);
		}
		if (this.loginDetailsService.getLoginType() == 'tutor') {
			this.hideSocialLogin = '';
		}
		this.googleSDK();
	}

	onLogin(form: NgForm) {
		var loginType = this.loginDetailsService.getLoginType();
		if (loginType != null) {
			this.isLoading = true;
			this.hideContainer = 'hideBlock';
			if (loginType == 'student') {
				this.studentLoginDetails.email = form.value.email;
				this.studentLoginDetails.password = form.value.password;
				this.httpService.checkLogin(this.studentLoginDetails).subscribe((res) => {
					if (res['response'] != 'false') {
						this.cookieService.set('token', res['response']);
						this.cookieService.set('userId', JwtDecode(res['response'])['sub']);
						// this.cookieService.set('userId', jwt_decode(res['response']).sub);
						this.userId = this.cookieService.get('userId');
						this.httpService.getStudentDetails(this.userId).subscribe((res) => {
							this.studentProfile = res;
							this.studentService.setStudentProfileDetails(this.studentProfile);
							this.loginDetailsService.setTrType('login');
							this.httpService.getStudentSchedule(this.studentProfile.sid).subscribe((res) => {
								this.studentService.setStudentBookings(res);
								this.isLoading = false;
								this.router.navigate([ 'home' ]);
							});
						});
					} else {
						this.errorText = 'Incorrect email or password';
						this.isLoading = false;
						this.hideContainer = '';
						this.incorrectLoginDetails = true;
					}
				});
			} else if (loginType == 'tutor') {
				this.tutorLoginDetails.email = form.value.email;
				this.tutorLoginDetails.password = form.value.password;

				this.httpService.checkTutorLogin(this.tutorLoginDetails).subscribe((res) => {
					if (res['response'] != 'false') {
						this.cookieService.set('token', res['response']);

						this.cookieService.set('userId', JwtDecode(res['response'])['sub']);
						this.userId = this.cookieService.get('userId');
						this.httpService.getTutorDetails(this.userId).subscribe((res) => {
							this.tutorProfile = res;
							this.tutorService.setTutorDetails(this.tutorProfile);
							this.httpService.getTutorProfileDetails(this.tutorProfile.tid).subscribe((res) => {
								this.tutorProfileDetails = res;
								this.tutorService.setTutorProfileDetails(this.tutorProfileDetails);
								this.httpService.getScheduleData(this.tutorProfile.tid).subscribe((res) => {
									this.tutorAvailabilitySchedule = res;
									this.tutorService.setPersonalAvailabilitySchedule(this.tutorAvailabilitySchedule);
									this.loginDetailsService.setTrType('login');
									this.isLoading = false;
									this.router.navigate([ '/home' ]);
								});
							});
						});
					} else {
						this.incorrectLoginDetails = true;
						this.isLoading = false;
						this.hideContainer = '';
						this.errorText = 'Incorrect email or password';
					}
				});
			}
		}
	}
	toSignUp() {
		this.router.navigate([ 'signUp' ]);
	}
	toHome() {
		this.router.navigate([ 'home' ]);
	}
	// ------------------------------------------------------------------------------------------------------------------
	//google login
	prepareLoginButton() {
		this.auth2.attachClickHandler(
			this.googleSignUp.nativeElement,
			{},
			(googleUser) => {
				let profile = googleUser.getBasicProfile();
				this.socialLogin.id = profile.getId();
				this.socialLogin.fullName = profile.getName();
				this.socialLogin.email = profile.getEmail();
				this.socialService.setSocialDetails(this.socialLogin);
				this.tutorLoginDetails.email = this.socialLogin.email;
				this.tutorLoginDetails.password = this.socialLogin.id;
				this.httpService.checkTutorLogin(this.tutorLoginDetails).subscribe((res) => {
					this.isLoading = true;
					this.hideContainer = 'hideBlock';
					if (res['response'] != 'false') {
						this.cookieService.set('token', res['response']);

						this.cookieService.set('userId', JwtDecode(res['response'])['sub']);
						this.userId = this.cookieService.get('userId');
						this.httpService.getTutorDetails(this.userId).subscribe((res) => {
							this.tutorProfile = res;
							this.tutorService.setTutorDetails(this.tutorProfile);
							this.httpService.getTutorProfileDetails(this.tutorProfile.tid).subscribe((res) => {
								this.tutorProfileDetails = res;
								this.tutorService.setTutorProfileDetails(this.tutorProfileDetails);
								this.httpService.getScheduleData(this.tutorProfile.tid).subscribe((res) => {
									this.tutorAvailabilitySchedule = res;
									this.tutorService.setPersonalAvailabilitySchedule(this.tutorAvailabilitySchedule);
									this.isLoading = false;
									this.zone.run(() => {
										this.loginDetailsService.setTrType('login');
										this.router.navigate([ 'home' ]);
									});
								});
							});
						});
					} else {
						this.zone.run(() => {
							this.incorrectLoginDetails = true;
							this.isLoading = false;
							this.hideContainer = '';
							this.errorText = 'Not a registered user. Sign Up first';
						});
					}
				});

				// this.httpService.checkSocialLogin(this.socialLogin.email).subscribe((res) => {
				// 	this.isLoading = true;
				// 	this.hideContainer = 'hideBlock';
				// 	if (res == true) {
				// 		var tutLoginModel = new tutorLoginModel();
				// 		this.socialService.setSocialDetails(this.socialLogin);
				// 		tutLoginModel.email = this.socialLogin.email;
				// 		this.httpService.getTutorDetails(tutLoginModel).subscribe((res) => {
				// 			this.tutorService.setTutorDetails(res);
				// 			this.httpService.getTutorProfileDetails(res.tid).subscribe((res) => {
				// 				this.tutorService.setTutorProfileDetails(res);
				// 				this.httpService
				// 					.getScheduleData(this.tutorService.getTutorDetials().tid)
				// 					.subscribe((res) => {
				// 						this.tutorAvailabilitySchedule = res;
				// 						this.tutorService.setPersonalAvailabilitySchedule(
				// 							this.tutorAvailabilitySchedule
				// 						);
				// 						this.zone.run(() => {
				// 							this.loginDetailsService.setTrType('login');
				// 							this.router.navigate([ 'home' ]);
				// 						});
				// 					});
				// 			});
				// 		});
				// 	} else if (res == false) {
				// 		this.zone.run(() => {
				// 			this.incorrectLoginDetails = true;
				// 			this.isLoading = false;
				// 			this.hideContainer = '';
				// 			this.errorText = 'Not a registered user. Sign Up first';
				// 		});
				// 	}
				// });
			},
			(error) => {
				// alert(JSON.stringify(error, undefined, 2));
			}
		);
	}
	googleSDK() {
		window['googleSDKLoaded'] = () => {
			window['gapi'].load('auth2', () => {
				this.auth2 = window['gapi'].auth2.init({
					client_id: '254899928533-k6lru4oe7sbmpe22ns0m11rvtbokk3qk.apps.googleusercontent.com',
					cookiepolicy: 'single_host_origin',
					scope: 'profile email'
				});
				this.prepareLoginButton();
			});
		};

		(function(d, s, id) {
			var js,
				fjs = d.getElementsByTagName(s)[0];
			if (d.getElementById(id)) {
				return;
			}
			js = d.createElement(s);
			js.id = id;
			js.src = 'https://apis.google.com/js/platform.js?onload=googleSDKLoaded';
			fjs.parentNode.insertBefore(js, fjs);
		})(document, 'script', 'google-jssdk');
	}
	fbSDK() {
		(window as any).fbAsyncInit = function() {
			FB.init({
				appId: '551929068861040',
				cookie: true,
				xfbml: true,
				version: 'v6.0'
			});
			this.FB.AppEvents.logPageView();
		};
		(function(d, s, id) {
			var js,
				fjs = d.getElementsByTagName(s)[0];
			if (d.getElementById(id)) {
				return;
			}
			js = d.createElement(s);
			js.id = id;
			js.src = 'https://connect.facebook.net/en_US/sdk.js';
			fjs.parentNode.insertBefore(js, fjs);
		})(document, 'script', 'facebook-jssdk');

		FB.getLoginStatus(function(response: any) {
			if (response.status === 'connected') {
				const accessToken = FB.getAuthResponse()['accessToken'];
				FB.api('/me?fields=name,email,picture', (res: any) => {
					this.socialLogin.id = res.id;
					this.socialLogin.email = res.email;
					this.socialLogin.fullName = res.name;
					this.socialService.setSocialDetails(this.socialLogin);
					this.httpService.checkSocialLogin(this.socialLogin.id).subscribe((res) => {
						this.isLoading = true;
						this.hideContainer = 'hideBlock';
						if (res == true) {
							var tutLoginModel = new tutorLoginModel();
							this.socialService.setSocialDetails(this.socialLogin);
							tutLoginModel.email = this.socialLogin.email;
							this.httpService.getTutorDetails(tutLoginModel).subscribe((res) => {
								this.tutorService.setTutorDetails(res);
								this.httpService.getTutorProfileDetails(res.tid).subscribe((res) => {
									this.tutorService.setTutorProfileDetails(res);
									this.httpService
										.getScheduleData(this.tutorService.getTutorDetials().tid)
										.subscribe((res) => {
											this.tutorAvailabilitySchedule = res;
											this.tutorService.setPersonalAvailabilitySchedule(
												this.tutorAvailabilitySchedule
											);
											this.zone.run(() => {
												this.loginDetailsService.setTrType('login');
												this.router.navigate([ 'home' ]);
											});
										});
								});
							});
						}
					});
				});
			}
		});
	}

	signIn() {
		this.fbSDK();
		FB.login(
			(response: any) => {
				if (response.authResponse) {
					const accessToken = FB.getAuthResponse()['accessToken'];
					FB.api('/me?fields=name,email,picture', (res: any) => {
						this.socialLogin.id = res.id;
						this.socialLogin.email = res.email;
						this.socialLogin.fullName = res.name;
						this.httpService.checkSocialLogin(this.socialLogin.id).subscribe((res) => {
							if (res == true) {
								this.isLoading = true;
								this.hideContainer = 'hideBlock';
								var tutLoginModel = new tutorLoginModel();
								this.socialService.setSocialDetails(this.socialLogin);
								tutLoginModel.email = this.socialLogin.email;
								this.httpService.getTutorDetails(tutLoginModel).subscribe((res) => {
									this.tutorService.setTutorDetails(res);
									this.httpService.getTutorProfileDetails(res.tid).subscribe((res) => {
										this.tutorService.setTutorProfileDetails(res);
										this.httpService
											.getScheduleData(this.tutorService.getTutorDetials().tid)
											.subscribe((res) => {
												this.tutorAvailabilitySchedule = res;
												this.tutorService.setPersonalAvailabilitySchedule(
													this.tutorAvailabilitySchedule
												);
												this.zone.run(() => {
													this.loginDetailsService.setTrType('login');
													this.router.navigate([ 'home' ]);
												});
											});
									});
								});
							} else if (res == false) {
								this.zone.run(() => {
									this.incorrectLoginDetails = true;
									this.isLoading = false;
									this.hideContainer = '';
									this.errorText = 'Not a registered user. Sign Up first';
								});
							}
						});
					});
				}
			},
			{ scope: 'email,public_profile' }
		);
	}

	signOut() {
		FB.logout();
	}
}
