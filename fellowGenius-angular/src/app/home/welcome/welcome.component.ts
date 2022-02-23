import { Component, OnInit, Inject } from '@angular/core';
import { TutorService } from 'src/app/service/tutor.service';
import { tutorProfile } from 'src/app/model/tutorProfile';
import { tutorProfileDetails } from 'src/app/model/tutorProfileDetails';
import { StudentProfileModel } from 'src/app/model/studentProfile';
import { StudentService } from 'src/app/service/student.service';
import { LoginDetailsService } from 'src/app/service/login-details.service';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { SocialService } from 'src/app/service/social.service';
import { AppData } from 'src/app/model/AppData';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
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
  expertCode;
  tutorProfile = new tutorProfile();
  tutorProfileDetails = new tutorProfileDetails();
  studentProfile = new StudentProfileModel();
  loginType: any;
  login = false;
  socialLogin = false;
  socialLoginName;
  role = 'Learner';
  hide: boolean = true;
  password: string = ' ';
  showExpertCode: boolean = false;
  data = new AppData('');
  // ---------- patterns --------------------------------
  mobNumberPattern = '^((\\+91-?)|0)?[0-9]{10}$';
  passwordPattern =
    '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,12}$';
  referCodePattern = '^FG22[A-Z]{2}[\\d]{4}$';
  
  ngOnInit() {
    if (this.loginService.getLoginType()) {
      this.loginType = this.loginService.getLoginType();
      this.login = true;
      if (this.loginType == 'Learner') {
        this.studentProfile = this.studentService.getStudentProfileDetails();
      } else if (this.loginType == 'Expert') {
        this.tutorProfile = this.tutorService.getTutorDetials();
      }
    } else {
      this.socialLogin = true;
      this.socialLoginName = this.socialService.getSocialDetails().fullName;
    }
  }
  chooseRole(role: any) {
    this.role = role;
  }
  continue() {
    this.dialog.closeAll();
  }
  toDashboard() {
    // this.role = form.value.role;
    console.log(this.role);
    console.log(this.data.name);
    console.log(this.expertCode);
    if (
      (this.role == 'Learner' || this.role == 'Expert') &&
      this.data.name != null
    ) {
      let dialogData = {
        role: this.role,
        password: this.data.name,
        expertCode: this.expertCode,
      };
      this.dialogRef.close(dialogData);
    }
  }
  closeDialog() {
    this.dialogRef.close();
  }
}
