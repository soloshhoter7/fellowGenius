import { Component, OnInit, Inject } from '@angular/core';
import { TutorService } from 'src/app/service/tutor.service';
import { tutorProfile } from 'src/app/model/tutorProfile';
import { tutorProfileDetails } from 'src/app/model/tutorProfileDetails';
import { StudentProfileModel } from 'src/app/model/studentProfile';
import { StudentService } from 'src/app/service/student.service';
import { LoginDetailsService } from 'src/app/service/login-details.service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SocialService } from 'src/app/service/social.service';

@Component({
	selector: 'app-welcome',
	templateUrl: './welcome.component.html',
	styleUrls: [ './welcome.component.css' ]
})
export class WelcomeComponent implements OnInit {
	constructor(
		private tutorService: TutorService,
		private studentService: StudentService,
		private loginService: LoginDetailsService,
		private dialog: MatDialog,
		private socialService: SocialService,
		private dialogRef: MatDialogRef<WelcomeComponent>,
		@Inject(MAT_DIALOG_DATA) data
	) {
		this.login = true;
	}

	tutorProfile = new tutorProfile();
	tutorProfileDetails = new tutorProfileDetails();
	studentProfile = new StudentProfileModel();
	loginType: any;
	login = false;
	socialLogin = false;
	socialLoginName;
	role = 'chooseRole';
	ngOnInit() {
		if (this.loginService.getLoginType()) {
			this.loginType = this.loginService.getLoginType();
			this.login = true;
			console.log('login');
			if (this.loginType == 'Learner') {
				this.studentProfile = this.studentService.getStudentProfileDetails();
			} else if (this.loginType == 'Expert') {
				this.tutorProfile = this.tutorService.getTutorDetials();
			}
		} else {
			console.log('this is the case');
			this.socialLogin = true;
			this.socialLoginName = this.socialService.getSocialDetails().fullName;
		}
	}
	chooseRole(role: any) {
		console.log(this.role);
		this.role = role;
	}
	continue() {
		this.dialog.closeAll();
	}
	toDashboard() {
		console.log(this.role);
		if (this.role == 'learner' || this.role == 'expert') {
			this.dialogRef.close(this.role);
		}
	}
}
