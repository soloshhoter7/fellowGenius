import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, NgForm } from '@angular/forms';
import { meetingDetails } from '../model/meetingDetails';
import { MeetingService } from '../service/meeting.service';
import { StudentProfileModel } from '../model/studentProfile';
import { StudentService } from '../service/student.service';
import { tutorProfile } from '../model/tutorProfile';
import { LoginDetailsService } from '../service/login-details.service';
import { TutorService } from '../service/tutor.service';
import { WelcomeComponent } from '../home/welcome/welcome.component';
import { MatDialog } from '@angular/material/dialog';
import { HttpService } from '../service/http.service';
import { StudentLoginModel } from '../model/studentLoginModel';
import { ThemePalette } from '@angular/material/core';

import { CookieService } from 'ngx-cookie-service';
import { HostListener } from '@angular/core';
import { Observable } from 'rxjs';
import * as jwt_decode from 'jwt-decode';
import { tutorProfileDetails } from '../model/tutorProfileDetails';
import { map, startWith } from 'rxjs/operators';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';

import { AppComponent } from '../app.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  studentProfileCompleted;
  color: ThemePalette;
  checked = false;
  joinMeeting = new meetingDetails();
  hostMeeting = new meetingDetails();
  studentProfile = new StudentProfileModel();
  tutorProfile = new tutorProfile();
  tutorProfileDetails = new tutorProfileDetails();
  dashboardUrl: string = '/home/studentDashboard';
  loginType;
  studentLoginDetails = new StudentLoginModel();
  RegisterForm: NgForm;
  userId;
  overlay;
  screenHeight: number;
  screenWidth: number;
  profilePictureUrl = '../../../assets/images/default-user-image.png';
  options: string[] = [
    'Mathematics',
    'English',
    'Science',
    'Social Science',
    'History',
    'Political Science',
    'Geography',
    'Physics',
    'Chemistry',
  ];
  filteredOptions: Observable<string[]>;
  myControl = new FormControl();
  selectedSubject;
  toggleNavigation: boolean = false;
  constructor(
    public router: Router,
    public meetingService: MeetingService,
    private studentServce: StudentService,
    private loginService: LoginDetailsService,
    private tutorService: TutorService,
    private dialog: MatDialog,
    private httpService: HttpService,
    private studentService: StudentService,
    private cookieService: CookieService,
    private breakpointObserver: BreakpointObserver,
    private appComp: AppComponent
  ) {
    this.getScreenSize();
  }
  index: Number;
  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
  }
  ngOnInit() {
    // this.toggleNavigation = true;
    this.breakpointObserver
      .observe(['(min-width: 800px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.openNav();
          console.log('called open Nav');
        } else {
          this.closeNav();
          console.log('called close Nav');
        }
      });
    this.toggleNavigation = true;
    // if (this.screenWidth >= 450) {
    //   this.openNav();
    // } else {
    //   this.toggleNavigation = false;
    //   this.closeNav();
    // }
    if (this.isTokenValid()) {
      this.loginType = this.loginService.getLoginType();
      if (
        this.loginType &&
        this.loginType == 'Learner' &&
        this.studentService.getStudentProfileDetails().fullName != null
      ) {
        this.studentProfile = this.studentServce.getStudentProfileDetails();
        if (this.studentProfile.profilePictureUrl != null) {
          this.profilePictureUrl = this.studentProfile.profilePictureUrl;
        }
        this.calculateStudentProfilePercentage();
        this.router.navigate(['home/studentDashboard']);
        if (this.loginService.getTrType() == 'signUp') {
          this.dialog.open(WelcomeComponent, {
            width: 'auto',
            height: 'auto',
          });
        }
      } else if (
        this.loginType &&
        this.loginType == 'Expert' &&
        this.tutorService.getTutorDetials().fullName != null
      ) {
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
        // this.dashboardUrl = '/home/tutorDashboard';
        this.router.navigate(['home/tutorDashboard']);
        if (this.loginService.getTrType() == 'signUp') {
          this.dialog.open(WelcomeComponent, {
            width: 'auto',
            height: 'auto',
          });
        }
      } else {
        this.handleRefresh();
      }
    } else {
      this.router.navigate(['facade']);
    }
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );
  }
  onNavigationClick() {
    if (this.screenWidth <= 500) {
      this.closeNav();
    }
  }
  toFacade() {
    this.router.navigate(['']);
  }
  openNav() {
    if (this.screenWidth >= 450) {
      document.getElementById('sidenav').style.width = '230px';
      document.getElementById('mainContent').style.marginLeft = '230px';
    } else {
      document.getElementById('sidenav').style.width = '100%';
    }
    this.toggleNavigation = true;
  }

  closeNav() {
    document.getElementById('sidenav').style.width = '0px';
    console.log(document.getElementById('sidenav').style.width);
    document.getElementById('mainContent').style.marginLeft = '0px';
    this.toggleNavigation = false;
  }

  navAction(index) {
    if (index % 2 == 1) {
      this.index = index + 1;
      this.closeNav();
    } else {
      this.index = index + 1;
      this.openNav();
    }
  }
  toggleNav() {
    if (this.toggleNavigation) {
      this.closeNav();
    } else {
      this.openNav();
    }
    // this.openNav();
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
  calculateStudentProfilePercentage() {
    var filled = 2;
    var totalFields = 6;
    if (this.studentProfile.dateOfBirth != null) {
      filled += 1;
    }
    if (this.studentProfile.contact != null) {
      filled += 1;
    }
    if (this.studentProfile.learningAreas != null) {
      filled += 1;
    }
    if (this.studentProfile.profilePictureUrl != null) {
      filled += 1;
    }

    if (filled <= totalFields) {
      this.studentProfileCompleted = Math.trunc((filled / totalFields) * 100);
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
  toggleAvailability() {
    if (this.checked == true) {
      this.checked = false;
      this.tutorService.personalAvailablitySchedule.isAvailable = 'no';
    } else {
      this.checked = true;
      this.tutorService.personalAvailablitySchedule.isAvailable = 'yes';
    }
    this.httpService
      .changeAvailabilityStatus(
        this.tutorService.getPersonalAvailabilitySchedule().tid,
        this.tutorService.getPersonalAvailabilitySchedule().isAvailable
      )
      .subscribe((res) => {});
  }

  onSignOut() {
    this.cookieService.delete('token');
    this.cookieService.delete('userId');
    this.loginService.setLoginType(null);
    this.loginService.setTrType(null);
    this.router.navigate(['']);
  }
  openProfile() {
    if (this.loginType == 'Learner') {
      this.onNavigationClick();
      this.router.navigate(['home/studentProfile']);
    } else if (this.loginType == 'Expert') {
      this.onNavigationClick();
      this.router.navigate(['home/profile']);
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  displaySelectedSubjects() {
    if (this.selectedSubject) {
      this.loginService.setLoginType(this.loginType);

      this.router.navigate(['searchResults']);
    }
  }

  handleRefresh() {
    this.userId = this.cookieService.get('userId');
    if (jwt_decode(this.cookieService.get('token'))['ROLE'] == 'Learner') {
      this.loginType = 'Learner';
      this.loginService.setTrType('login');
      this.loginService.setLoginType(this.loginType);

      this.httpService.getStudentDetails(this.userId).subscribe((res) => {
        this.studentProfile = res;
        if (this.studentProfile.profilePictureUrl != null) {
          this.profilePictureUrl = this.studentProfile.profilePictureUrl;
        }
        this.calculateStudentProfilePercentage();
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
            if (this.tutorProfileDetails.profilePictureUrl != null) {
              this.profilePictureUrl = this.tutorProfileDetails.profilePictureUrl;
            }
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
