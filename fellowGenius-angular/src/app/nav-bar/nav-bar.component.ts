import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { StudentProfileModel } from "../model/studentProfile";
import { tutorProfile } from "../model/tutorProfile";
import { LoginDetailsService } from "../service/login-details.service";
import { StudentService } from "../service/student.service";
import { TutorService } from "../service/tutor.service";
@Component({
  selector: "app-nav-bar",
  templateUrl: "./nav-bar.component.html",
  styleUrls: ["./nav-bar.component.css"],
})
export class NavBarComponent implements OnInit {
  constructor(
    private router: Router,
    private loginService: LoginDetailsService,
    private cookieService: CookieService,
    private studentService: StudentService,
    private tutorService: TutorService
  ) {}
  loginType;
  studentProfile: StudentProfileModel;
  tutorProfile: tutorProfile;
  ngOnInit(): void {
    this.loginType = this.loginService.getLoginType();
    if (this.loginType == "Learner") {
      this.studentProfile = this.studentService.getStudentProfileDetails();
      console.log(this.studentProfile);
    } else if (this.loginType == "Expert") {
      this.tutorProfile = this.tutorService.getTutorDetials();
      console.log(this.tutorProfile);
    }
  }

  onSignUp() {
    this.router.navigate(["signUp"]);
  }

  toLoginPage() {
    this.router.navigate(["login"]);
  }
  toDashboard() {
    if (this.loginType == "Learner") {
      this.router.navigate(["home/studentDashboard"]);
    } else if (this.loginType == "Expert") {
      this.router.navigate(["home/tutorDashboard"]);
    }
  }
  onSignOut() {
    this.cookieService.delete("token");
    this.cookieService.delete("userId");
    this.loginService.setLoginType(null);
    this.loginService.setTrType(null);
    this.router.navigate([""]);
  }
}
