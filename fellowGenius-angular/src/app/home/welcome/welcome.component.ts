import { Component, OnInit } from "@angular/core";
import { TutorService } from "src/app/service/tutor.service";
import { tutorProfile } from "src/app/model/tutorProfile";
import { tutorProfileDetails } from "src/app/model/tutorProfileDetails";
import { StudentProfileModel } from "src/app/model/studentProfile";
import { StudentService } from "src/app/service/student.service";
import { LoginDetailsService } from "src/app/service/login-details.service";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "app-welcome",
  templateUrl: "./welcome.component.html",
  styleUrls: ["./welcome.component.css"],
})
export class WelcomeComponent implements OnInit {
  constructor(
    private tutorService: TutorService,
    private studentService: StudentService,
    private loginService: LoginDetailsService,
    private dialog: MatDialog
  ) {}

  tutorProfile = new tutorProfile();
  tutorProfileDetails = new tutorProfileDetails();
  studentProfile = new StudentProfileModel();
  loginType: any;

  ngOnInit(): void {
    this.loginType = this.loginService.getLoginType();
    if (this.loginType == "Learner") {
      this.studentProfile = this.studentService.getStudentProfileDetails();
    } else if (this.loginType == "Expert") {
      this.tutorProfile = this.tutorService.getTutorDetials();
    }
  }

  continue() {
    this.dialog.closeAll();
  }
}
