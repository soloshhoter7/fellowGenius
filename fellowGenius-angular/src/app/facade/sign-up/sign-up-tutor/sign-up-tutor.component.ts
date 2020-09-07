import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { StudentProfileModel } from '../../../model/studentProfile';
import { HttpService } from 'src/app/service/http.service';
import { StudentService } from 'src/app/service/student.service';
import { tutorProfileDetails } from 'src/app/model/tutorProfileDetails';
import { tutorProfile } from '../../../model/tutorProfile';
import { TutorService } from 'src/app/service/tutor.service';
import { LoginDetailsService } from 'src/app/service/login-details.service';
import { tutorLoginModel } from 'src/app/model/tutorLoginModel';
import { socialLogin } from 'src/app/model/socialModel';
import { SocialService } from 'src/app/service/social.service';
import { tutorAvailabilitySchedule } from 'src/app/model/tutorAvailabilitySchedule';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { TermsAndConditionsComponent } from '../terms-and-conditions/terms-and-conditions.component';
import * as jwt_decode from 'jwt-decode';
import * as bcrypt from 'bcryptjs';
import { CookieService } from 'ngx-cookie-service';
declare const FB: any;
@Component({
	selector: 'app-sign-up-tutor',
	templateUrl: './sign-up-tutor.component.html',
	styleUrls: [ './sign-up-tutor.component.css' ]
})
export class SignUpTutorComponent implements OnInit {
	constructor(
		private router: Router,
		private httpClient: HttpService,
		private socialService: SocialService,
		private tutorService: TutorService,
		private loginService: LoginDetailsService,
		private zone: NgZone,
		private snackBar: MatSnackBar,
		private dialogRef: MatDialog,
		private cookieService: CookieService
	) {}

	@ViewChild('googleSignUp', { static: true })
	googleSignUp: ElementRef;
	wrongOtp = false;
	showInput: boolean = true;
	verifyEmail: boolean = false;
	verificationOtp;
	isLoading: boolean;
	hideSocialLogin = '';
	incorrectLoginDetails = false;
	socialLogin = new socialLogin();
	studentProfile = new StudentProfileModel();
	tutorProfile = new tutorProfile();
	emailValid: boolean = true;
	tutorAvailabilitySchedule: tutorAvailabilitySchedule;
	termsAndConditionsChecked = false;
	hide: boolean = true;
	mobNumberPattern = '^((\\+91-?)|0)?[0-9]{10}$';
	passwordPattern = '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{7,}';
	emailPattern = '[a-zA-Z0-9_.+-]{1,20}@(?:(?:[a-zA-Z0-9-]+.)?[a-zA-Z]+.)?(gmail|piet|yahoo|hotmail|rediffmail|apple|microsoft).([a-z]{2,4})(.[a-z]{2,4})?$';
	userId;
	config: MatSnackBarConfig = {
		duration: 2000,
		horizontalPosition: 'center',
		verticalPosition: 'top'
	};
	ngOnInit(): void {
		this.googleSDK();
		// this.fbSDK();
	}
	// ---------------------------------------------------------------------------------------------------------------
	auth2: any;
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
				this.httpClient.saveSocialLogin(this.socialLogin).subscribe((res) => {
					if (res) {
						var loginModel = new tutorLoginModel();
						loginModel.email = this.socialLogin.email;
						loginModel.password = this.socialLogin.id;
						this.socialService.setSocialDetails(this.socialLogin);

						// this.httpClient.getTutorDetails(loginModel).subscribe((res) => {
						// 	this.tutorService.setTutorDetails(res);
						// 	this.httpClient
						// 		.getTutorProfileDetails(this.tutorService.getTutorDetials().tid)
						// 		.subscribe((res) => {
						// 			this.tutorService.setTutorProfileDetails(res);
						// 			this.httpClient
						// 				.getScheduleData(this.tutorService.getTutorDetials().tid)
						// 				.subscribe((res) => {
						// 					this.tutorAvailabilitySchedule = res;
						// 					this.tutorService.setPersonalAvailabilitySchedule(
						// 						this.tutorAvailabilitySchedule
						// 					);
						// 					this.zone.run(() => {
						// 						this.loginService.setLoginType('tutor');
						// 						this.loginService.setTrType('signUp');
						// 						this.router.navigate([ 'home' ]);
						// 					});
						// 				});
						// 		});
						// });

						// 		tutLoginModel.email = this.tutorProfile.email;
						// tutLoginModel.password = this.tutorProfile.password;
						// this.tutorService.setTutorDetails(this.tutorProfile);

						this.httpClient.checkTutorLogin(loginModel).subscribe((res) => {
							if (res['response'] != 'false') {
								this.cookieService.set('token', res['response']);

								this.cookieService.set('userId', jwt_decode(res['response'])['sub']);
								this.userId = this.cookieService.get('userId');
								this.httpClient.getTutorDetails(this.userId).subscribe((res) => {
									this.tutorProfile = res;
									this.tutorService.setTutorDetails(this.tutorProfile);

									this.httpClient.getTutorProfileDetails(this.tutorProfile.tid).subscribe((res) => {
										this.tutorService.setTutorProfileDetails(res);
										this.httpClient.getScheduleData(this.tutorProfile.tid).subscribe((res) => {
											this.tutorAvailabilitySchedule = res;
											this.tutorService.setPersonalAvailabilitySchedule(
												this.tutorAvailabilitySchedule
											);
											this.zone.run(() => {
												this.loginService.setLoginType('tutor');
												this.loginService.setTrType('signUp');
												this.router.navigate([ 'home' ]);
											});
										});
									});
								});
							}
						});
					} else {
						this.zone.run(() => {
							this.incorrectLoginDetails = true;
						});
					}
				});
			},
			(error) => {
				alert(JSON.stringify(error, undefined, 2));
			}
		);
	}
	openTermsAndConditions() {
		this.dialogRef.open(TermsAndConditionsComponent, {
			width: 'auto',
			height: 'auto'
		});
	}
	googleSDK() {
		window['googleSDKLoaded'] = () => {
			window['gapi'].load('auth2', () => {
				this.auth2 = window['gapi'].auth2.init({
					client_id: '254899928533-k6lru4oe7sbmpe22ns0m11rvtbokk3qk.apps.googleusercontent.com',
					// client_id: '15945118442-8olfveag5mpijqdsos8j7atn4u5hcmkk.apps.googleusercontent.com',
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
						this.socialLogin.id = res.id;
						this.socialLogin.email = res.email;
						this.socialLogin.fullName = res.name;
						this.httpClient.saveSocialLogin(this.socialLogin).subscribe((res) => {
							if (res) {
								var loginModel = new tutorLoginModel();
								loginModel.email = this.socialLogin.email;
								loginModel.password = this.socialLogin.id;
								this.socialService.setSocialDetails(this.socialLogin);

								// this.httpClient.getTutorDetails(loginModel).subscribe((res) => {
								// 	this.tutorService.setTutorDetails(res);
								// 	this.httpClient
								// 		.getTutorProfileDetails(this.tutorService.getTutorDetials().tid)
								// 		.subscribe((res) => {
								// 			this.tutorService.setTutorProfileDetails(res);
								// 			this.httpClient
								// 				.getScheduleData(this.tutorService.getTutorDetials().tid)
								// 				.subscribe((res) => {
								// 					this.tutorAvailabilitySchedule = res;
								// 					this.tutorService.setPersonalAvailabilitySchedule(
								// 						this.tutorAvailabilitySchedule
								// 					);
								// 					this.zone.run(() => {
								// 						this.loginService.setLoginType('tutor');
								// 						this.loginService.setTrType('signUp');
								// 						this.router.navigate([ 'home' ]);
								// 					});
								// 				});
								// 		});
								// });

								// 		tutLoginModel.email = this.tutorProfile.email;
								// tutLoginModel.password = this.tutorProfile.password;
								// this.tutorService.setTutorDetails(this.tutorProfile);

								this.httpClient.checkTutorLogin(loginModel).subscribe((res) => {
									if (res['response'] != 'false') {
										this.cookieService.set('token', res['response']);

										this.cookieService.set('userId', jwt_decode(res['response'])['sub']);
										this.userId = this.cookieService.get('userId');
										this.httpClient.getTutorDetails(this.userId).subscribe((res) => {
											this.tutorProfile = res;
											this.tutorService.setTutorDetails(this.tutorProfile);

											this.httpClient
												.getTutorProfileDetails(this.tutorProfile.tid)
												.subscribe((res) => {
													this.tutorService.setTutorProfileDetails(res);
													this.httpClient
														.getScheduleData(this.tutorProfile.tid)
														.subscribe((res) => {
															this.tutorAvailabilitySchedule = res;
															this.tutorService.setPersonalAvailabilitySchedule(
																this.tutorAvailabilitySchedule
															);
															this.loginService.setLoginType('tutor');
															this.loginService.setTrType('signUp');
															this.router.navigate([ 'home' ]);
														});
												});
										});
									}
								});
							} else {
								this.zone.run(() => {
									this.incorrectLoginDetails = true;
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
		FB.logout((response: any) => {});
	}

	// ---------------------------------------------------------------------------------------------------------------
	continueWithEmail() {
		this.hideSocialLogin = 'hideBlock';
	}
	toHomePage() {
		this.router.navigate([ 'facade' ]);
	}
	backToSocialLogin() {
		this.hideSocialLogin = '';
	}
	backToSignUpComponent() {
		this.router.navigate([ 'signUp' ]);
	}
	timeOut: boolean = true;
	//   onSignUpTutor(form: NgForm) {
	//     if (this.verifyEmail == false) {
	//       this.isLoading = true;
	//       this.tutorProfile.fullName = form.value.fullName;
	//       this.tutorProfile.email = form.value.email;
	//       this.tutorProfile.password = form.value.password;
	//       this.tutorProfile.dateOfBirth = form.value.dateOfBirth;
	//       this.tutorProfile.contact = form.value.contact;
	//       setTimeout(() => {
	//         if (this.timeOut == true) {
	//           this.isLoading = false;
	//           this.showInput = true;
	//           this.emailValid = false;
	//         }
	//       }, 25000);

	//       this.httpClient.verifyEmail(this.tutorProfile.email).subscribe((res) => {
	//         this.timeOut = false;
	//         this.verificationOtp = res;
	//         this.verifyEmail = true;
	//         this.isLoading = false;
	//         this.showInput = false;
	//       });
	//     } else {
	//       var tutLoginModel = new tutorLoginModel();
	//       var tid;

	//       //   if (this.verificationOtp == form.value.otp) {
	//       if (bcrypt.compareSync(form.value.otp, this.verificationOtp)) {
	//         this.httpClient.saveTutorProfile(this.tutorProfile).subscribe((res) => {
	//           if (res == true) {
	//             tutLoginModel.email = this.tutorProfile.email;
	//             tutLoginModel.password = this.tutorProfile.password;
	//             // this.tutorService.setTutorDetails(this.tutorProfile);

	//             this.httpClient.checkTutorLogin(tutLoginModel).subscribe((res) => {
	//               if (res["response"] != "false") {
	//                 this.cookieService.set("token", res["response"]);

	//                 this.cookieService.set(
	//                   "userId",
	//                   jwt_decode(res["response"])['sub']
	//                 );
	//                 this.userId = this.cookieService.get("userId");
	//                 this.httpClient
	//                   .getTutorDetails(this.userId)
	//                   .subscribe((res) => {
	//                     this.tutorProfile = res;
	//                     this.tutorService.setTutorDetails(this.tutorProfile);

	//                     this.httpClient
	//                       .getTutorProfileDetails(this.tutorProfile.tid)
	//                       .subscribe((res) => {
	//                         this.tutorService.setTutorProfileDetails(res);
	//                         this.httpClient
	//                           .getScheduleData(this.tutorProfile.tid)
	//                           .subscribe((res) => {
	//                             this.tutorAvailabilitySchedule = res;
	//                             this.tutorService.setPersonalAvailabilitySchedule(
	//                               this.tutorAvailabilitySchedule
	//                             );
	//                             this.loginService.setLoginType("tutor");
	//                             this.loginService.setTrType("signUp");
	//                             this.router.navigate(["home"]);
	//                           });
	//                       });
	//                   });
	//               }
	//             });
	//           } else if (res == false) {
	//             // this.router.navigate(['signUp'])
	//             this.snackBar.open(
	//               "registration not successful ! email already exists !",
	//               "close",
	//               this.config
	//             );
	//             this.dialogRef.closeAll();
	//             // setTimeout(() => {
	//             // 	window.location.reload();
	//             // }, 2000);
	//           }
	//         });
	//       } else {
	//         this.wrongOtp = true;
	//       }
	//     }
	//   }
}
