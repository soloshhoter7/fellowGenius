import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { StudentProfileModel } from '../model/studentProfile';
import { tutorProfile } from '../model/tutorProfile';
import { LoginDetailsService } from '../service/login-details.service';
import { StudentService } from '../service/student.service';
import { TutorService } from '../service/tutor.service';
@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
})
export class NavBarComponent implements OnInit {
  constructor(
    public router: Router,
    public loginService: LoginDetailsService,
    public cookieService: CookieService,
    public studentService: StudentService,
    public tutorService: TutorService
  ) {}
  loginType;
  studentProfile: StudentProfileModel;
  tutorProfile: tutorProfile;
  ngOnInit(): void {
    this.loginType = this.loginService.getLoginType();
    if (this.loginType == 'Learner') {
      this.studentProfile = this.studentService.getStudentProfileDetails();
    } else if (this.loginType == 'Expert') {
      this.tutorProfile = this.tutorService.getTutorDetials();
    }
  }

  toFacade() {
    this.router.navigate(['']);
  }
  onSignUp() {
    this.router.navigate(['signUp']);
  }

  toLoginPage() {
    this.router.navigate(['login']);
  }
  toDashboard() {
    if (this.loginService.getLoginType() == 'Learner') {
      this.router.navigate(['home/studentDashboard']);
    } else if (this.loginService.getLoginType() == 'Expert') {
      this.router.navigate(['home/tutorDashboard']);
    }
  }
  onSignOut() {
    this.cookieService.delete('token');
    this.cookieService.delete('userId');
    this.loginService.setLoginType(null);
    this.loginService.setTrType(null);
    this.router.navigate(['']);
  }
}
