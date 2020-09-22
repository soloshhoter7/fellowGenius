import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../service/profile.service';
import { tutorProfileDetails } from '../model/tutorProfileDetails';
import { meetingDetails } from 'src/app/model/meetingDetails';
import { MeetingService } from 'src/app/service/meeting.service';
import { NgForm } from '@angular/forms';
import { bookingDetails } from 'src/app/model/bookingDetails';
import { Time } from '@angular/common';
import { StudentService } from 'src/app/service/student.service';
import { HttpService } from 'src/app/service/http.service';
import { ScheduleTime } from '../model/ScheduleTime';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { scheduleData } from 'src/app/model/scheduleData';
import { LoginDetailsService } from '../service/login-details.service';
import { ConnectComponent } from './connect/connect.component';
import { LoginComponent } from '../facade/login/login.component';
import { LoginDialogComponent } from './login-dialog/login-dialog.component';
@Component({
  selector: 'app-expert-profile',
  templateUrl: './expert-profile.component.html',
  styleUrls: ['./expert-profile.component.css'],
})
export class ExpertProfileComponent implements OnInit {
  config: MatSnackBarConfig = {
    duration: 5000,
    horizontalPosition: 'center',
    verticalPosition: 'top',
    panelClass: ['snackbar'],
  };
  startDisabled: boolean;
  endDisabled: boolean;
  isTutorAvailable: boolean;
  isLoading: boolean = false;
  teacherProfile = new tutorProfileDetails();
  meetingDetails = new meetingDetails();
  bookingDetails = new bookingDetails();
  clickedIndex: number;
  startDate: string;
  startTimeString = 'Start Time';
  endTimeString = 'End Time';
  errorMessage: string = '';
  endSelect = -1;
  startSelect = -1;
  tempArray = new ScheduleTime();
  time = { hour: 13, minute: 30 };
  endTime = {
    hour: 0,
    minute: 0,
  };
  st = {
    sh: -1,
    sm: -1,
  };
  et = {
    eh: -1,
    em: -1,
  };
  case1a: boolean = false;
  case1b: boolean = false;
  case2a: boolean = false;
  case2b: boolean = false;
  case3a: boolean = false;
  case3b: boolean = false;
  case4a: boolean = false;
  case4b: boolean = false;
  case5a: boolean = false;
  case5b: boolean = false;
  dates = [];
  scheduleDates: dateModel[] = [];
  meridian = true;
  date: Date = new Date();
  settings = {
    bigBanner: true,
    timePicker: true,
    format: 'dd-MM-yyyy hh:mm a',
    defaultOpen: false,
    closeOnSelect: false,
  };
  ScheduleTime: ScheduleTime[] = [];
  fullDate = [];
  clickedIndex1: number;
  clickedIndex2: number;
  userId;
  profilePictureUrl = '../../assets/images/default-user-image.png';
  constructor(
    public profileService: ProfileService,
    public meetingSevice: MeetingService,
    public studentService: StudentService,
    public httpService: HttpService,
    public snackBar: MatSnackBar,
    public router: Router,
    public dialogRef: MatDialog,
    public activatedRoute: ActivatedRoute,
    public loginService: LoginDetailsService,
    public dialog: MatDialog
  ) {}
  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.userId = params['page'];
      this.httpService
        .fetchTutorProfileDetails(this.userId)
        .subscribe((res) => {
          this.teacherProfile = res;
          this.profilePictureUrl = this.teacherProfile.profilePictureUrl;
        });
    });

    this.startDisabled = true;
    this.endDisabled = true;
    this.teacherProfile = this.profileService.getProfile();
    // if (this.loginService.getLoginType() == 'Learner') {
    //   this.httpService.getTutorIsAvailable(this.userId).subscribe((res) => {
    //     if (res == true) {
    //       this.isTutorAvailable = true;
    //       this.timeFrom(-7);
    //       this.timeFrom2(-7);
    //       this.httpService
    //         .getTutorTimeAvailabilityTimeArray(this.userId)
    //         .subscribe((res) => {
    //           this.ScheduleTime = res;
    //           this.manipulateTimeSlots();
    //         });
    //     } else if (res == false) {
    //       this.isTutorAvailable = false;
    //     }
    //   });
    // }
  }
  openConnectPage() {
    if (this.loginService.getLoginType() != null) {
      this.dialog.open(ConnectComponent, {
        height: 'auto',
        width: 'auto',
      });
    } else {
      this.dialog.open(LoginDialogComponent, {
        width: 'auto',
        height: 'auto',
      });
    }
  }
}
export class dateModel {
  date: string;
  hasElements: boolean = false;
}
