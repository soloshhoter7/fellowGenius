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
import { LocationStrategy } from '@angular/common';
import { NotificationService } from '../service/notification.service';
import { NotificationModel } from '../model/notification';
import { C } from '@angular/cdk/keycodes';

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
  notificationCount=0;
  profilePictureUrl = '../../../assets/images/default-user-image.png';
  options: string[] = [
    'Tools','Marketing','Content','Project Management','Sales','E-comm','Industry Consulation','Strategy','Finance','HR','Operations','IT Support'
   ];
  subject;
  fullName;
  filteredOptions: Observable<string[]>;
  myControl = new FormControl();
  selectedSubject;
  toggleNavigation: boolean = false;
  notifications:NotificationModel[]=[];
  showNotifications:boolean=false;
  constructor(
    public router: Router,
    public meetingService: MeetingService,
    public studentServce: StudentService,
    private loginService: LoginDetailsService,
    public tutorService: TutorService,
    private dialog: MatDialog,
    private httpService: HttpService,
    private studentService: StudentService,
    private cookieService: CookieService,
    private breakpointObserver: BreakpointObserver,
    private locationStrategy: LocationStrategy,
    private notificationService:NotificationService
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
    this.preventBackButton();
    this.toggleNavigation = true;
    // this.breakpointObserver
    //   .observe(['(min-width: 800px)'])
    //   .subscribe((state: BreakpointState) => {
    //     if (state.matches) {
    //       this.openNav();
    //     } else {
    //       this.closeNav();
    //     }
    //   });
    // this.toggleNavigation = true;
    // if (this.screenWidth >= 450) {
    //   this.openNav();
    // } else {
    //   this.toggleNavigation = false;
    //   this.closeNav();
    // }
    if (this.isTokenValid()) {
      console.log('heyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy')
      this.loginType = this.loginService.getLoginType();
      console.log(this.loginType)
      if (
        this.loginType &&
        this.loginType == 'Learner' &&
        this.studentService.getStudentProfileDetails().fullName != null
      ) {
        this.studentProfile = this.studentServce.getStudentProfileDetails();
        if (this.studentServce.getStudentProfileDetails().profilePictureUrl == null) {
          this.studentServce.getStudentProfileDetails().profilePictureUrl = this.profilePictureUrl
        }
        this.calculateStudentProfilePercentage();

        this.fullName=this.studentProfile.fullName;
        this.profilePictureUrl= this.studentProfile.profilePictureUrl;
        this.router.navigate(['home/student-dashboard']);
        // if (this.loginService.getTrType() == 'signUp') {
        //   this.dialog.open(WelcomeComponent, {
        //     width: 'auto',
        //     height: 'auto',
        //   });
        // }
      } else if (
        this.loginType &&
        this.loginType == 'Expert' &&
        this.tutorService.getTutorDetials().fullName != null
      ) {
        console.log('here')
        this.tutorProfile = this.tutorService.getTutorDetials();
        this.tutorProfileDetails = this.tutorService.getTutorProfileDetails();
        // if (this.tutorProfileDetails.profilePictureUrl != null) {
        //   this.profilePictureUrl = this.tutorService.getTutorDetials().profilePictureUrl;
        // }else{
        //   this.
        // }

        if(this.tutorService.getTutorDetials().profilePictureUrl == null){
          this.tutorService.getTutorDetials().profilePictureUrl = this.profilePictureUrl
        }
        if (
          this.tutorService.getPersonalAvailabilitySchedule().isAvailable ==
          'yes'
        ) {
          this.checked = true;
        } else {
          this.checked = false;
        }
        this.profilePictureUrl= this.tutorService.getTutorDetials().profilePictureUrl
        this.fullName=this.tutorProfile.fullName;
        console.log(this.fullName)
        // this.dashboardUrl = '/home/tutorDashboard';
        this.router.navigate(['home/tutor-dashboard']);
        // if (this.loginService.getTrType() == 'signUp') {
        //   this.dialog.open(WelcomeComponent, {
        //     width: 'auto',
        //     height: 'auto',
        //   });
        // }
      } else {
        this.handleRefresh();
      }
      this.initialiseNotifications();
    } else {
      this.router.navigate(['']);
    }
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );
  }
  initialiseNotifications(){
    this.notificationService.fetchNotification();
    this.notificationService.notificationsChanged.subscribe((notifs:NotificationModel[])=>{
      this.notifications=notifs;
    })
  }
  // initialiseStudentPendingRequest(){
  //   this.studentService.fetchStudentPendingBookings();
  //   this.studentService.bookingsChanged.subscribe((booking:bookingDetails[])=>{
  //     this.bookingList=booking;
  //     if (this.bookingList.length == 0) {
  //       this.emptyBookingList = true;
  //       this.pendingRequestsCount = 0;
  //     } else {
  //       this.pendingRequestsCount = this.bookingList.length;
  //     }
  //   })
  // }
  displayNotifications(){
    this.showNotifications=!this.showNotifications;
  }
  getNotificationCount(){
    return this.notificationService.getNotificationCount();
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
    document.getElementById('mainContent').style.marginLeft = '0px';
    this.toggleNavigation = false;
    setTimeout(() => {
      if (document.getElementById('sidenav').style.width == '230px') {
        document.getElementById('sidenav').style.width = '0px';
        document.getElementById('mainContent').style.marginLeft = '0px';
      }
    }, 100);
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
  public calculateStudentProfilePercentage() {
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
      this.router.navigate(['home/student-profile']);
    } else if (this.loginType == 'Expert') {
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
      this.router.navigate(['search-results'], {
        queryParams: { subject: this.selectedSubject },
      });
    }
  }
  preventBackButton() {
    history.pushState(null, null, location.href);
    this.locationStrategy.onPopState(() => {
      history.pushState(null, null, location.href);
    });
  }
  handleRefresh() {
    this.userId = this.cookieService.get('userId');
    if (jwt_decode(this.cookieService.get('token'))['ROLE'] == 'Learner') {
      this.loginType = 'Learner';
      this.loginService.setTrType('login');
      this.loginService.setLoginType(this.loginType);

      this.httpService.getStudentDetails(this.userId).subscribe((res) => {
        this.studentProfile = res;
       
        this.calculateStudentProfilePercentage();
        this.studentService.setStudentProfileDetails(this.studentProfile);
        if (this.studentServce.getStudentProfileDetails().profilePictureUrl == null) {
          this.studentServce.getStudentProfileDetails().profilePictureUrl = this.profilePictureUrl
        }
        this.httpService.getStudentSchedule(this.userId).subscribe((res) => {
          this.studentService.setStudentBookings(res);
          this.fullName=this.studentProfile.fullName;
          this.profilePictureUrl= this.studentProfile.profilePictureUrl
          // this.router.navigate([ 'home/student-dashboard' ]);
        });
        this.initialiseNotifications();
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
            console.log(res);
            this.tutorProfileDetails = res;
            // if (this.tutorProfileDetails.profilePictureUrl != null) {
            //   this.profilePictureUrl = this.tutorProfileDetails.profilePictureUrl;
            // }
        if(this.tutorService.getTutorDetials().profilePictureUrl == null){
          this.tutorService.getTutorDetials().profilePictureUrl = this.profilePictureUrl;
        }
            this.tutorService.setTutorProfileDetails(res);
            // this.subject = this.tutorProfileDetails.educationalQualifications[0];
            this.httpService.getScheduleData(this.tutorProfile.bookingId).subscribe((res) => {
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
            this.fullName=this.tutorProfile.fullName
            this.profilePictureUrl= this.tutorService.getTutorDetials().profilePictureUrl;
            this.initialiseNotifications();
          });
      });
    }
  }
}
