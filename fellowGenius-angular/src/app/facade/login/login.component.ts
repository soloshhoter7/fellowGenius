import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
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
		private socialService: SocialService
	) {}

	@ViewChild('googleSignUp', { static: true })
	googleSignUp: ElementRef;

	socialLogin = new socialLogin();
	hideSocialLogin = 'hideBlock';
	studentProfile: StudentProfileModel;
	tutorProfile: tutorProfile;
	tutorProfileDetails: tutorProfileDetails;
	hide: boolean = true;
	studentLoginDetails = new StudentLoginModel();
	tutorLoginDetails = new tutorLoginModel();
	incorrectLoginDetails: boolean = false;
	ngOnInit(): void {
		console.log('login type ->' + this.loginDetailsService.getLoginType());
		if (this.loginDetailsService.getLoginType() == null) {
			console.log('login type is null !');
			this.router.navigate([ '' ]);
		}
		if (this.loginDetailsService.getLoginType() == 'tutor') {
		}
		this.googleSDK();
		this.fbSDK();
	}

	onLogin(form: NgForm) {
		var loginType = this.loginDetailsService.getLoginType();
		if (loginType != null) {
			if (loginType == 'student') {
				this.studentLoginDetails.email = form.value.email;
				this.studentLoginDetails.password = form.value.password;
				console.log(this.studentLoginDetails);
				this.httpService.checkLogin(this.studentLoginDetails).subscribe((res) => {
					console.log(res);
					if (res == true) {
						this.httpService.getStudentDetails(this.studentLoginDetails).subscribe((res) => {
							this.studentProfile = res;
							this.studentService.setStudentProfileDetails(this.studentProfile);
							console.log(this.studentService.getStudentProfileDetails());
							this.router.navigate([ 'home' ]);
						});
					} else if (res == false) {
						console.log('login details incorrect !');
						this.incorrectLoginDetails = true;
					}
				});
			} else if (loginType == 'tutor') {
				this.tutorLoginDetails.email = form.value.email;
				this.tutorLoginDetails.password = form.value.password;
				console.log(this.tutorLoginDetails);
				this.httpService.checkTutorLogin(this.tutorLoginDetails).subscribe((res) => {
					if (res == true) {
						console.log(res);
						this.httpService.getTutorDetails(this.tutorLoginDetails).subscribe((res) => {
							this.tutorProfile = res;
							this.tutorService.setTutorDetails(this.tutorProfile);
							console.log(this.tutorService.getTutorDetials());
							this.httpService.getTutorProfileDetails(this.tutorProfile.tid).subscribe((res) => {
								this.tutorProfileDetails = res;
								this.tutorService.setTutorProfileDetails(this.tutorProfileDetails);
								console.log('-------------------->');
								console.log(this.tutorProfileDetails.profileCompleted);
								this.router.navigate([ 'home' ]);
							});
						});
					} else if (res == false) {
						console.log('login details incorrect !');
						this.incorrectLoginDetails = true;
					}
				});
			}
		}
	}
	toSignUp() {
		this.router.navigate([ '/signUp' ]);
	}
	toHome() {
		this.router.navigate([ '/home' ]);
	}
	// ------------------------------------------------------------------------------------------------------------------
	auth2: any;
	//google login
	prepareLoginButton() {
		this.auth2.attachClickHandler(
			this.googleSignUp.nativeElement,
			{},
			(googleUser) => {
				let profile = googleUser.getBasicProfile();
				console.log('Token || ' + googleUser.getAuthResponse().id_token);
				this.socialLogin.id = profile.getId();
				this.socialLogin.fullName = profile.getName();
				this.socialLogin.email = profile.getEmail();
				console.log(this.socialLogin);
				this.socialService.setSocialDetails(this.socialLogin);
				this.httpService.checkSocialLogin(this.socialLogin.id).subscribe((res) => {
					if (res == true) {
						this.socialService.setSocialDetails(this.socialLogin);
						this.router.navigate([ 'home' ]);
					}
				});
			},
			(error) => {
				alert(JSON.stringify(error, undefined, 2));
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
				console.log('user connected !');
				const accessToken = FB.getAuthResponse()['accessToken'];
				FB.api('/me?fields=name,email,picture', (res: any) => {
					console.log('profile picture url :' + res.picture.data.url);
					this.socialLogin.id = res.id;
					this.socialLogin.email = res.email;
					this.socialLogin.fullName = res.name;
					console.log(this.socialLogin);
					this.socialService.setSocialDetails(this.socialLogin);
					this.httpService.checkSocialLogin(this.socialLogin.id).subscribe((res) => {
						if (res == true) {
							this.socialService.setSocialDetails(this.socialLogin);
							this.router.navigate([ 'home' ]);
						}
					});
				});
			}
		});
	}

	signIn() {
		FB.login(
			(response: any) => {
				if (response.authResponse) {
					const accessToken = FB.getAuthResponse()['accessToken'];
					FB.api('/me?fields=name,email,picture', (res: any) => {
						console.log('profile picture url :' + res.picture.data.url);
						this.socialLogin.id = res.id;
						this.socialLogin.email = res.email;
						this.socialLogin.fullName = res.name;
						console.log(this.socialLogin);
						this.httpService.checkSocialLogin(this.socialLogin.id).subscribe((res) => {
							if (res == true) {
								this.socialService.setSocialDetails(this.socialLogin);
								this.router.navigate([ 'home' ]);
							}
						});
					});
				}
			},
			{ scope: 'email,public_profile' }
		);
	}

	signOut() {
		FB.logout((response: any) => {
			console.log('user logged out');
		});
	}
}
