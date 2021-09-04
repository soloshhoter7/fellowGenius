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
import { AuthService } from './service/auth.service';
import { test1 } from 'src/assets/js/demo';
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
    private breakpointObserver: BreakpointObserver,
    private authService:AuthService
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
    
    // if (this.authService.isTokenValid()) {
    //   this.loginType = this.loginService.getLoginType();
    //   if (this.loginType) {
    //     this.authService.autoAuthUser();
    //   } else {
    //     this.handleRefresh();
    //   }
    // }else{
    //   this.auh
    // }
    this.authService.autoAuthUser();
  }

 
  public handleRefresh() {
    console.log('called handle refresh in app component ts')
    this.authService.autoAuthUser();
  }
}
