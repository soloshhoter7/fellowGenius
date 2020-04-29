import { Component, OnInit, ElementRef } from '@angular/core';
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
		private tutorService: TutorService
	) {}
	studentProfile: StudentProfileModel;
	tutorProfile: tutorProfile;
	hide: boolean = true;
	studentLoginDetails = new StudentLoginModel();
	tutorLoginDetails = new tutorLoginModel();
	ngOnInit(): void {
		console.log('login type ->' + this.loginDetailsService.getLoginType());
		if (this.loginDetailsService.getLoginType() == null) {
			console.log('login type is null !');
			this.router.navigate([ '' ]);
		}
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
							this.router.navigate([ 'home' ]);
						});
					} else if (res == false) {
						console.log('login details incorrect !');
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
}
