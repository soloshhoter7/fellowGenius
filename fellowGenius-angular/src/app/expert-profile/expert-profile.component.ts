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
import { ActivatedRoute, NavigationEnd, Router, RoutesRecognized } from '@angular/router';
import { scheduleData } from 'src/app/model/scheduleData';
import { LoginDetailsService } from '../service/login-details.service';
import { ConnectComponent } from './connect/connect.component';
import { LoginComponent } from '../facade/login/login.component';
import { LoginDialogComponent } from './login-dialog/login-dialog.component';
import { filter, pairwise } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { SearchExpertProfileService } from '../service/search-expert-profile.service';
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
  isWebinarRedirect: boolean=false;
  teacherProfile = new tutorProfileDetails();
  meetingDetails = new meetingDetails();
  bookingDetails = new bookingDetails();
  reviewList:bookingDetails[] = [];
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
  previousUrl
  selectedDomain;
  eventId;
  selectedSubject: any;
  constructor(
    public profileService: ProfileService,
    public meetingSevice: MeetingService,
    public studentService: StudentService,
    public httpService: HttpService,
    public snackBar: MatSnackBar,
    public router: Router,
    public dialogRef: MatDialog,
    private cookieService:CookieService,
    public activatedRoute: ActivatedRoute,
    public loginService: LoginDetailsService,
    public dialog: MatDialog,
    private searchExpertProfileService:SearchExpertProfileService
  ) {
    
  }
  ngOnInit(): void {
    window.scroll(0,0);
    this.activatedRoute.queryParams.subscribe((params) => {
      this.userId = params['page'];
      this.selectedDomain = params['subject'];
      this.eventId=params['eventId'];
      if(this.eventId){
       
        this.isWebinarRedirect=true;
      }
      if(this.loginService.getLoginType()!='Learner'&&!this.isWebinarRedirect){
        this.cookieService.set("prev","view-tutors");
        this.cookieService.set("expert_userId",this.userId);
        this.cookieService.set("expert_domain",this.selectedDomain);
      }else{
       // this.cookieService.set("prev","view-event");
        this.cookieService.set("event_id",this.eventId);
      }
      this.httpService
        .fetchBookingTutorProfileDetails(this.userId)
        .subscribe((res) => {
          this.teacherProfile = res;
          this.profilePictureUrl = this.teacherProfile.profilePictureUrl;
          if(this.teacherProfile.description!=null&&this.teacherProfile.description!=''){
            
            this.makeTabActive("about_nav","TAb_1");
          }else{
            document.getElementById("about_li").style.display="none";
            document.getElementById("education_li").classList.add("two-items");
            document.getElementById("work_li").classList.add("two-items");
            this.makeTabActive("education_nav","TAb_2");
          }
          this.fetchExpertReviews();
        });
    });
   
    this.startDisabled = true;
    this.endDisabled = true;
    this.teacherProfile = this.profileService.getProfile();
  }
  makeTabActive(tabId,detailId){
    document.getElementById(tabId).classList.add("active");
    document.getElementById(detailId).classList.add("active") ;
  }
  toDomainPage(){
    if (this.selectedDomain) {
      this.router.navigate(['search-results'], {
        queryParams: { subject: this.selectedDomain },
      });
    }
  }
  createExpertString(result:any){
    return this.searchExpertProfileService.createExpertString(result,this.selectedDomain,90);
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
    // this.router.navigate(['home/studentDashboard'])
  }
  fetchExpertReviews(){
    this.httpService.fetchExpertRecentReviews(this.teacherProfile.bookingId).subscribe((res)=>{
      this.reviewList = res;
    })

  }
}
export class dateModel {
  date: string;
  hasElements: boolean = false;
}
