import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { StudentProfileModel } from '../../model/studentProfile';
import { HttpService } from 'src/app/service/http.service';
import { StudentService } from 'src/app/service/student.service';
import { tutorProfileDetails } from 'src/app/model/tutorProfileDetails';
import { tutorProfile } from '../../model/tutorProfile';
import { TutorService } from 'src/app/service/tutor.service';
import { LoginDetailsService } from 'src/app/service/login-details.service';

@Component({
	selector: 'app-sign-up',
	templateUrl: './sign-up.component.html',
	styleUrls: [ './sign-up.component.css' ]
})
export class SignUpComponent implements OnInit {
	constructor(
		private router: Router,
		private httpClient: HttpService,
		private studentService: StudentService,
		private tutorService: TutorService,
		private loginService: LoginDetailsService
	) {}
	studentProfile = new StudentProfileModel();
	tutorProfile = new tutorProfile();
	signUpHide = false;
	signUpStudent = false;
	signUpTutor = false;
	hide: boolean = true;
	ngOnInit(): void {}
	toLoginPage() {
		this.router.navigate([ 'login' ]);
	}
	onStudent() {
		this.signUpHide = true;
		this.signUpTutor = false;
		this.signUpStudent = true;
	}
	onTutor() {
		this.signUpHide = true;
		this.signUpStudent = false;
		this.signUpTutor = true;
	}
	onSignUpStudent(form: NgForm) {
		this.studentProfile.fullName = form.value.fullName;
		this.studentProfile.email = form.value.email;
		this.studentProfile.password = form.value.password;
		this.studentProfile.dateOfBirth = form.value.dateOfBirth;
		this.studentProfile.contact = form.value.contact;
		console.log(this.studentProfile);
		this.httpClient.saveStudentProfile(this.studentProfile).subscribe((res) => {
			console.log(res);
			if (res == true) {
				this.studentService.setStudentProfileDetails(this.studentProfile);
				this.loginService.setLoginType('student');
				this.router.navigate([ 'home' ]);
			} else if (res == false) {
				console.log(' registration not successful ! email already exists !');
			}
		});
		0;
	}
	onSignUpTutor(form: NgForm) {
		this.tutorProfile.fullName = form.value.fullName;
		this.tutorProfile.email = form.value.email;
		this.tutorProfile.password = form.value.password;
		this.tutorProfile.dateOfBirth = form.value.dateOfBirth;
		this.tutorProfile.contact = form.value.contact;
		console.log(this.tutorProfile);
		this.httpClient.saveTutorProfile(this.tutorProfile).subscribe((res) => {
			if (res == true) {
				this.tutorService.setTutorDetails(this.tutorProfile);
				this.loginService.setLoginType('tutor');
				this.router.navigate([ 'home' ]);
			} else {
				console.log('tutor registration not successful! email already exists !');
			}
		});
	}
}
