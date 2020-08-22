import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { StudentProfileModel } from '../../../model/studentProfile';
import { HttpService } from 'src/app/service/http.service';
import { StudentService } from 'src/app/service/student.service';
import { TutorService } from 'src/app/service/tutor.service';
import { LoginDetailsService } from 'src/app/service/login-details.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { TermsAndConditionsComponent } from '../terms-and-conditions/terms-and-conditions.component';
import { StudentLoginModel } from 'src/app/model/studentLoginModel';
import { CookieService } from 'ngx-cookie-service';
// import * as jwt_decode from "jwt-decode";
import * as jwt_decode from 'jwt-decode';
// import { bcrypt } from "node_modules/bcryptjs";
import * as bcrypt from 'bcryptjs';
@Component({
	selector: 'app-sign-up-student',
	templateUrl: './sign-up-student.component.html',
	styleUrls: [ './sign-up-student.component.css' ]
})
export class SignUpStudentComponent implements OnInit {
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

	@ViewChild('loginRef', { static: true })
	loginElement: ElementRef;
	isLoading: boolean;
	wrongOtp = false;
	showInput: boolean = true;
	verifyEmail: boolean = false;
	verificationOtp;
	termsAndConditionsChecked = false;
	termsAndConditionsError: string;
	studentProfile = new StudentProfileModel();
	mobNumberPattern = '^((\\+91-?)|0)?[0-9]{10}$';
	// passwordPattern = '^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$';
	passwordPattern = '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{7,}';
	incorrectLoginDetails = false;
	maxDate: string;
	minDate: string;
	showDateError: boolean;
	emailValid = false;
	hide: boolean = true;
	userId;
	ngOnInit(): void {}
	toSignUp() {
		this.router.navigate([ 'signUp' ]);
	}
	config: MatSnackBarConfig = {
		duration: 5000,
		horizontalPosition: 'center',
		verticalPosition: 'top'
	};
	timeOut: boolean = true;
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

	toHomePage() {
		this.router.navigate([ 'facade' ]);
	}
	openTermsAndConditions() {
		this.dialogRef.open(TermsAndConditionsComponent, {
			width: 'auto',
			height: 'auto'
		});
	}
}
