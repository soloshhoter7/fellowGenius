import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import { StudentProfileModel } from "../../model/studentProfile";
import { HttpService } from "src/app/service/http.service";
import { StudentService } from "src/app/service/student.service";
import { TutorService } from "src/app/service/tutor.service";
import { LoginDetailsService } from "src/app/service/login-details.service";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar, MatSnackBarConfig } from "@angular/material/snack-bar";
import { TermsAndConditionsComponent } from "../sign-up/terms-and-conditions/terms-and-conditions.component";
import { StudentLoginModel } from "src/app/model/studentLoginModel";
import { CookieService } from "ngx-cookie-service";
// import * as jwt_decode from "jwt-decode";
import * as jwt_decode from "jwt-decode";
// import { bcrypt } from "node_modules/bcryptjs";
import * as bcrypt from "bcryptjs";
import { registrationModel } from "src/app/model/registration";
import { loginModel } from "src/app/model/login";
import { tutorProfile } from "src/app/model/tutorProfile";
import { socialLogin } from "src/app/model/socialModel";
import { tutorAvailabilitySchedule } from "src/app/model/tutorAvailabilitySchedule";
@Component({
  selector: "app-sign-up",
  templateUrl: "./sign-up.component.html",
  styleUrls: ["./sign-up.component.css"],
})
export class SignUpComponent implements OnInit {
  constructor(
    private router: Router,
    private httpClient: HttpService,
    private studentService: StudentService,
    private tutorService: TutorService,
    private loginService: LoginDetailsService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialog,
    private cookieService: CookieService
  ) {}
  // --- parent child relationships ------------
  @ViewChild("loginRef", { static: true })
  loginElement: ElementRef;

  @ViewChild("googleSignUp", { static: true })
  googleSignUp: ElementRef;
  // --- booleans ----------------------------
  isLoading: boolean;
  wrongOtp = false;
  showInput: boolean = true;
  verifyEmail: boolean = false;
  incorrectLoginDetails = false;
  termsAndConditionsChecked = false;
  termsAndConditionsError: string;
  showDateError: boolean;
  emailValid = false;
  hide: boolean = true;
  timeOut: boolean = true;
  // ---------- patterns --------------------------------
  mobNumberPattern = "^((\\+91-?)|0)?[0-9]{10}$";
  // passwordPattern = '^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$';
  passwordPattern =
    // "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{7,}";
    "(?=^.{8,}$)((?=.*d)|(?=.*W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$";
  //  ----------- data fields ------------------------------
  verificationOtp;
  maxDate: string;
  minDate: string;
  userId;
  // --------------- models ---------------------------------
  registrationModel = new registrationModel();
  loginModel = new loginModel();
  studentProfile = new StudentProfileModel();
  socialLogin = new socialLogin();
  tutorProfile = new tutorProfile();
  tutorAvailabilitySchedule: tutorAvailabilitySchedule;
  //---------------- configurations ----------------------
  config: MatSnackBarConfig = {
    duration: 5000,
    horizontalPosition: "center",
    verticalPosition: "top",
  };
  //--------------------------------------------------------
  ngOnInit(): void {}

  toSignUpPage() {
    this.router.navigate(["signUp"]);
  }

  toFacadePage() {
    this.router.navigate(["facade"]);
  }

  openTermsAndConditions() {
    this.dialogRef.open(TermsAndConditionsComponent, {
      width: "auto",
      height: "auto",
    });
  }

  onSignUp(form: NgForm) {
    if (this.verifyEmail == false) {
      this.isLoading = true;
      this.registrationModel.fullName = form.value.fullName;
      this.registrationModel.email = form.value.email;
      this.registrationModel.password = form.value.password;
      this.registrationModel.contact = form.value.contact;
      this.registrationModel.role = form.value.role;
      setTimeout(() => {
        if (this.timeOut == true) {
          this.emailValid = true;
          this.isLoading = false;
          this.showInput = true;
        }
      }, 25000);
      this.httpClient
        .verifyEmail(this.registrationModel.email)
        .subscribe((res) => {
          this.verificationOtp = res["response"];

          this.timeOut = false;
          this.verifyEmail = true;
          this.isLoading = false;
          this.showInput = false;
        });
    } else {
      if (bcrypt.compareSync(form.value.otp, this.verificationOtp)) {
        this.httpClient
          .registerUser(this.registrationModel)
          .subscribe((res) => {
            if (res == true) {
              this.loginModel.email = this.registrationModel.email;
              this.loginModel.password = this.registrationModel.password;
              // for logging in once registration is done
              this.httpClient.checkLogin(this.loginModel).subscribe((res) => {
                this.cookieService.set("token", res["response"]);
                this.cookieService.set(
                  "userId",
                  jwt_decode(res["response"])["sub"]
                );
                this.userId = this.cookieService.get("userId");

                if (this.registrationModel.role == "Learner") {
                  this.httpClient
                    .getStudentDetails(this.userId)
                    .subscribe((res) => {
                      this.studentProfile = res;
                      this.studentService.setStudentProfileDetails(
                        this.studentProfile
                      );
                      this.loginService.setLoginType("Learner");
                      this.loginService.setTrType("signUp");
                      this.router.navigate(["home"]);
                    });
                } else if (this.registrationModel.role == "Expert") {
                  this.httpClient
                    .getTutorDetails(this.userId)
                    .subscribe((res) => {
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
                              this.loginService.setLoginType("Expert");
                              this.loginService.setTrType("signUp");
                              this.router.navigate(["home"]);
                            });
                        });
                    });
                }
              });
            } else if (res == false) {
              this.snackBar.open(
                "registration not successful ! email already exists !",
                "close",
                this.config
              );
              this.incorrectLoginDetails = true;
              this.dialogRef.closeAll();
            }
          });
      } else {
        this.wrongOtp = true;
      }
    }
  }

  // onSignUpTutor(form: NgForm) {
  // 	if (this.verifyEmail == false) {
  // 		this.isLoading = true;
  // 		this.tutorProfile.fullName = form.value.fullName;
  // 		this.tutorProfile.email = form.value.email;
  // 		this.tutorProfile.password = form.value.password;
  // 		this.tutorProfile.dateOfBirth = form.value.dateOfBirth;
  // 		this.tutorProfile.contact = form.value.contact;
  // 		setTimeout(() => {
  // 			if (this.timeOut == true) {
  // 				this.isLoading = false;
  // 				this.showInput = true;
  // 				this.emailValid = false;
  // 			}
  // 		}, 25000);

  // 		this.httpClient.verifyEmail(this.tutorProfile.email).subscribe((res) => {
  // 			this.timeOut = false;
  // 			this.verificationOtp = res;
  // 			this.verifyEmail = true;
  // 			this.isLoading = false;
  // 			this.showInput = false;
  // 		});
  // 	} else {
  // 		var tutLoginModel = new tutorLoginModel();
  // 		var tid;

  // 		//   if (this.verificationOtp == form.value.otp) {
  // 		if (bcrypt.compareSync(form.value.otp, this.verificationOtp)) {
  // 			this.httpClient.saveTutorProfile(this.tutorProfile).subscribe((res) => {
  // 				if (res == true) {
  // 					tutLoginModel.email = this.tutorProfile.email;
  // 					tutLoginModel.password = this.tutorProfile.password;
  // 					// this.tutorService.setTutorDetails(this.tutorProfile);

  // 					this.httpClient.checkTutorLogin(tutLoginModel).subscribe((res) => {
  // 						if (res['response'] != 'false') {
  // 							this.cookieService.set('token', res['response']);

  // 							this.cookieService.set('userId', jwt_decode(res['response'])['sub']);
  // 							this.userId = this.cookieService.get('userId');
  // 							this.httpClient.getTutorDetails(this.userId).subscribe((res) => {
  // 								this.tutorProfile = res;
  // 								this.tutorService.setTutorDetails(this.tutorProfile);

  // 								this.httpClient.getTutorProfileDetails(this.tutorProfile.tid).subscribe((res) => {
  // 									this.tutorService.setTutorProfileDetails(res);
  // 									this.httpClient.getScheduleData(this.tutorProfile.tid).subscribe((res) => {
  // 										this.tutorAvailabilitySchedule = res;
  // 										this.tutorService.setPersonalAvailabilitySchedule(
  // 											this.tutorAvailabilitySchedule
  // 										);
  // 										this.loginService.setLoginType('tutor');
  // 										this.loginService.setTrType('signUp');
  // 										this.router.navigate([ 'home' ]);
  // 									});
  // 								});
  // 							});
  // 						}
  // 					});
  // 				} else if (res == false) {
  // 					// this.router.navigate(['signUp'])
  // 					this.snackBar.open(
  // 						'registration not successful ! email already exists !',
  // 						'close',
  // 						this.config
  // 					);
  // 					this.dialogRef.closeAll();
  // 					// setTimeout(() => {
  // 					// 	window.location.reload();
  // 					// }, 2000);
  // 				}
  // 			});
  // 		} else {
  // 			this.wrongOtp = true;
  // 		}
  // 	}
  // }
  // onSignUpStudent(form: NgForm) {
  // 	if (this.verifyEmail == false) {
  // 		this.studentProfile.dateOfBirth = form.value.dateOfBirth;
  // 		var studentDOB = this.studentProfile.dateOfBirth.split('-');

  // 		var dobYear = parseInt(studentDOB[0]);
  // 		var maxYear = new Date().getFullYear() - 6;
  // 		var minYear = new Date().getFullYear() - 70;

  // 		if (dobYear < maxYear && dobYear > minYear) {
  // 			this.isLoading = true;
  // 			this.studentProfile.fullName = form.value.fullName;
  // 			this.studentProfile.email = form.value.email;
  // 			this.studentProfile.password = form.value.password;
  // 			this.studentProfile.dateOfBirth = form.value.dateOfBirth;
  // 			this.studentProfile.contact = form.value.contact;
  // 			this.studentProfile.subject = form.value.subject;
  // 			this.studentProfile.gradeLevel = form.value.gradeLevel;
  // 			setTimeout(() => {
  // 				if (this.timeOut == true) {
  // 					this.emailValid = true;
  // 					this.isLoading = false;
  // 					this.showInput = true;
  // 				}
  // 			}, 25000);
  // 			this.httpClient.verifyEmail(this.studentProfile.email).subscribe((res) => {
  // 				console.log(res);
  // 				this.verificationOtp = res['response'];
  // 				console.log(this.verificationOtp);
  // 				this.timeOut = false;
  // 				this.verifyEmail = true;
  // 				this.isLoading = false;
  // 				this.showInput = false;
  // 			});
  // 		} else {
  // 			this.showDateError = true;
  // 		}
  // 	} else {
  // 		//   var bcrypt = require("bcryptjs");
  // 		if (bcrypt.compareSync(form.value.otp, this.verificationOtp)) {
  // 			console.log('otp matched !');
  // 			//   console.log(this.verificationOtp);
  // 			//   if (this.verificationOtp == form.value.otp) {
  // 			this.httpClient.saveStudentProfile(this.studentProfile).subscribe((res) => {
  // 				if (res == true) {
  // 					var studentLogin: StudentLoginModel = new StudentLoginModel();
  // 					studentLogin.email = this.studentProfile.email;
  // 					studentLogin.password = this.studentProfile.password;
  // 					this.httpClient.checkLogin(studentLogin).subscribe((res) => {
  // 						this.cookieService.set('token', res['response']);
  // 						this.cookieService.set('userId', jwt_decode(res['response'])['sub']);
  // 						this.userId = this.cookieService.get('userId');
  // 						this.httpClient.getStudentDetails(this.userId).subscribe((res) => {
  // 							this.studentProfile = res;
  // 							this.studentService.setStudentProfileDetails(this.studentProfile);
  // 							this.loginService.setLoginType('student');
  // 							this.loginService.setTrType('signUp');
  // 							this.router.navigate([ 'home' ]);
  // 						});
  // 					});
  // 				} else if (res == false) {
  // 					// this.router.navigate(['signUp'])
  // 					this.snackBar.open(
  // 						'registration not successful ! email already exists !',
  // 						'close',
  // 						this.config
  // 					);
  // 					this.incorrectLoginDetails = true;
  // 					this.dialogRef.closeAll();
  // 					// window.location.reload();
  // 				}
  // 			});
  // 		} else {
  // 			this.wrongOtp = true;
  // 		}
  // 	}
  // }
}
