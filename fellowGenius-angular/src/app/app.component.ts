import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, NgForm } from '@angular/forms';
import { meetingDetails } from '../app/model/meetingDetails';
import { MeetingService } from '../app/service/meeting.service';
import { StudentProfileModel } from '../app/model/studentProfile';
import { StudentService } from '../app/service/student.service';
import { tutorProfile } from '../app/model/tutorProfile';
import { LoginDetailsService } from '../app/service/login-details.service';
import { TutorService } from '../app/service/tutor.service';
import { WelcomeComponent } from '../app/home/welcome/welcome.component';
import { MatDialog } from '@angular/material/dialog';
import { HttpService } from '../app/service/http.service';
import { StudentLoginModel } from '../app/model/studentLoginModel';
import { ThemePalette } from '@angular/material/core';
import { LocationStrategy } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { HostListener } from '@angular/core';
import { Observable } from 'rxjs';
import * as jwt_decode from 'jwt-decode';
import { tutorProfileDetails } from '../app/model/tutorProfileDetails';
import { map, startWith } from 'rxjs/operators';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(
    public router: Router,
    public meetingService: MeetingService,
    private loginService: LoginDetailsService,
    private tutorService: TutorService,
    private dialog: MatDialog,
    private httpService: HttpService,
    private studentService: StudentService,
    private cookieService: CookieService,
    private breakpointObserver: BreakpointObserver
  ) {}

  studentProfileCompleted;
  color: ThemePalette;
  checked = false;
  studentProfile = new StudentProfileModel();
  tutorProfile = new tutorProfile();
  tutorProfileDetails = new tutorProfileDetails();
  loginType;
  studentLoginDetails = new StudentLoginModel();
  RegisterForm: NgForm;
  userId;
  screenHeight: number;
  screenWidth: number;
  myControl = new FormControl();
  profilePictureUrl = '../../../assets/images/default-user-image.png';
  ngOnInit() {
    if (this.isTokenValid()) {
      this.loginType = this.loginService.getLoginType();
      if (this.loginType) {
        if (this.loginType == 'Learner') {
          this.studentProfile = this.studentService.getStudentProfileDetails();
          if (this.studentProfile.profilePictureUrl != null) {
            this.profilePictureUrl = this.studentProfile.profilePictureUrl;
          }
        } else if (this.loginType == 'Expert') {
          this.tutorProfile = this.tutorService.getTutorDetials();
          this.tutorProfileDetails = this.tutorService.getTutorProfileDetails();
          if (this.tutorProfileDetails.profilePictureUrl != null) {
            this.profilePictureUrl = this.tutorProfile.profilePictureUrl;
          }
          if (
            this.tutorService.getPersonalAvailabilitySchedule().isAvailable ==
            'yes'
          ) {
            this.checked = true;
          } else {
            this.checked = false;
          }
        }
      } else {
        this.handleRefresh();
      }
    } else {
      // this.router.navigate(['facade']);
    }
  }

  isTokenValid() {
    if (this.cookieService.get('token') && !this.isTokenExpired()) {
      return true;
    } else {
      this.cookieService.delete('token');
      this.cookieService.delete('userId');
      return false;
    }
  }
  isTokenExpired(token?: string): boolean {
    if (!token) token = this.getToken();
    if (!token) return true;

    const date = this.getTokenExpirationDate(token);
    if (date === undefined) return false;
    return !(date.valueOf() > new Date().valueOf());
  }
  1;
  getTokenExpirationDate(token: string): Date {
    const decoded = jwt_decode(token);

    if (decoded['exp'] === undefined) return null;

    const date = new Date(0);
    date.setUTCSeconds(decoded['exp']);
    return date;
  }

  getToken(): string {
    return this.cookieService.get('token');
  }

  public handleRefresh() {
    this.userId = this.cookieService.get('userId');
    if (jwt_decode(this.cookieService.get('token'))['ROLE'] == 'Learner') {
      this.loginType = 'Learner';
      this.loginService.setTrType('login');
      this.loginService.setLoginType(this.loginType);
      this.httpService.getStudentDetails(this.userId).subscribe((res) => {
        this.studentProfile = res;
        this.studentService.setStudentProfileDetails(this.studentProfile);
        this.httpService.getStudentSchedule(this.userId).subscribe((res) => {
          this.studentService.setStudentBookings(res);
          // this.router.navigate([ 'home/studentDashboard' ]);
        });
      });
    } else if (
      jwt_decode(this.cookieService.get('token'))['ROLE'] == 'Expert'
    ) {
      this.loginType = 'Expert';
      this.loginService.setTrType('login');
      this.loginService.setLoginType(this.loginType);

      this.httpService.getTutorDetails(this.userId).subscribe((res) => {
        this.tutorProfile = res;
        this.tutorService.setTutorDetails(this.tutorProfile);
        this.httpService
          .getTutorProfileDetails(this.userId)
          .subscribe((res) => {
            this.tutorProfileDetails = res;

            this.tutorService.setTutorProfileDetails(res);
            this.httpService.getScheduleData(this.userId).subscribe((res) => {
              this.tutorService.setPersonalAvailabilitySchedule(res);
              if (
                this.tutorService.getPersonalAvailabilitySchedule()
                  .isAvailable == 'yes'
              ) {
                this.checked = true;
              } else {
                this.checked = false;
              }
            });
          });
      });
    }
  }
}
