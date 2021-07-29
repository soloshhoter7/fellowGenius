import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';
import { dateModel } from '../expert-profile/expert-profile.component';
import { bookingDetails } from '../model/bookingDetails';
import { meetingDetails } from '../model/meetingDetails';
import { ScheduleTime } from '../model/ScheduleTime';
import { tutorProfileDetails } from '../model/tutorProfileDetails';
import { HttpService } from '../service/http.service';
import { ICustomWindow } from '../service/window-ref.service';
import * as JwtDecode from 'jwt-decode';
@Component({
  selector: 'app-reschedule-meeting',
  templateUrl: './reschedule-meeting.component.html',
  styleUrls: ['./reschedule-meeting.component.css']
})
export class RescheduleMeetingComponent implements OnInit {
  token;
  bid;
  isLoading;
  isRescheduled;
  rescheduledStatus;
  isTutorAvailable: boolean;
  userId;
  fullDate = [];


  selectedSubject;
  startTimeValue;
  endTimeValue;
  areaOfExpertises = [];
  startDisabled: boolean;
  endDisabled: boolean;
  noSchedule:boolean = false;
  selectedStart;
  
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
  paymentSuccessful: boolean = false;
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
  amount: number;
  settings = {
    bigBanner: true,
    timePicker: true,
    format: 'dd-MM-yyyy hh:mm a',
    defaultOpen: false,
    closeOnSelect: false,
  };
  ScheduleTime: ScheduleTime[] = [];
  startSlots:ScheduleTime[] =[];
  startSlotsCopy:ScheduleTime[] = [];
  endSlots:ScheduleTime[]=[];
  // fullDate = [];
  clickedIndex1: number;
  clickedIndex2: number;
  // userId;
  selectedDate;
  profilePictureUrl = '../../assets/images/default-user-image.png';
  private _window: ICustomWindow;
  public rzp: any;
  public options: any;
  totalPrice = 0;
  payableAmount = 0;
  processingPayment: boolean;
  paymentResponse: any = {};
  duration;
  errorText;
  constructor(
    private activatedRoute:ActivatedRoute,
    private httpService:HttpService,
    private router:Router,
    private cookieService:CookieService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.token = params['token'];
      this.bid = params['bid'];
      this.userId = params['tid'];
      this.cookieService.set('token', this.token);
      this.cookieService.set('userId', JwtDecode(this.token)['sub']);
      console.log(this.token,this.bid,this.userId);
      this.fetchData();
    });
    

  }
  toLoginPage(){
    this.router.navigate(['']);
  }
  fetchData(){
    this.httpService.fetchBookingStatus(this.bid).subscribe((res:any)=>{
      if(res.status=='Pending'){
        this.httpService.getTutorIsAvailable(this.userId).subscribe((res) => {
          if (res == true) {
            this.isTutorAvailable = true;
            this.timeFrom(-7);
            this.timeFrom2(-7);
            this.httpService
              .getTutorTimeAvailabilityTimeArray(this.userId)
              .subscribe((res) => {
                this.ScheduleTime = res;
                this.selectedDate = this.scheduleDates[0];
                setTimeout(()=>{
                  this.dateChange();
                },1000)
                this.manipulateTimeSlots();
              });
          } else if (res == false) {
            this.isTutorAvailable = false;
          }
        });
      }
    })
  }
  timeFrom = (X) => {
    for (let I = 0; I < Math.abs(X); I++) {
      this.fullDate.push(
        new Date(
          new Date().getTime() - (X >= 0 ? I : I - I - I) * 24 * 60 * 60 * 1000
        )
      );
    }
  };

  timeFrom2 = (X) => {
    for (let I = 0; I < Math.abs(X); I++) {
      var date = new dateModel();
      date.date = new Date(
        new Date().getTime() - (X >= 0 ? I : I - I - I) * 24 * 60 * 60 * 1000
      ).toLocaleDateString('en-GB');
      this.scheduleDates.push(date);
    }
  };
  dateChange(){
    if(this.selectedDate.hasElements == false){
      this.noSchedule= true;
    }else if(this.selectedDate.hasElements == true){
      this.noSchedule=false;
      this.fillSlots('start');
    }
  }
  startSlotChange(){
    this.endSlots = [];
    var i;
    for(i=this.startTimeValue+1;i<this.startSlotsCopy.length;i++){
      this.endSlots.push(this.startSlotsCopy[i]);
    }
  }
  fillSlots(method){
    if(method=='start'){
      this.startSlots=[];
      this.endSlots=[];
      this.startSlotsCopy=[];
      for(let time of this.ScheduleTime){
        if(time.date == this.selectedDate.date){
          this.startSlots.push(time);
        }
      }
      for(let time of this.ScheduleTime){
        if(time.date == this.selectedDate.date){
          this.startSlotsCopy.push(time);
        }
      }
      var i;
      for(i=1;i<this.startSlotsCopy.length;i++){
        this.endSlots.push(this.startSlotsCopy[i]);
      }
      this.startTimeValue = 0;
      this.endTimeValue = 0;
      this.startSlots.pop();
    }
  }
  
  onBooking() {
    var startIndex,endIndex;
    startIndex = this.ScheduleTime.indexOf(this.startSlots[this.startTimeValue]);
    // endIndex = this.ScheduleTime.indexOf(this.endSlots[this.endTimeValue]);

    this.timeSelector(this.startSlots[this.startTimeValue], startIndex);
    // this.timeSelector(this.endSlots[this.endTimeValue], endIndex);

    

    this.bookingDetails.startTimeHour = this.st.sh;
    // this.bookingDetails.startTimeHour = this.startSlots[this.startTimeValue].hours;
    this.bookingDetails.startTimeMinute = this.st.sm;
    // this.bookingDetails.startTimeMinute = this.startSlots[this.startTimeValue].minutes;
    this.bookingDetails.dateOfMeeting = this.startDate;
 
    this.bookingDetails.bid=this.bid;

    console.log(this.bookingDetails);
    this.isLoading=true;
    this.httpService.canRescheduleBooking(this.token,this.bid).subscribe((r:any)=>{
      console.log(r);
      if(r.response == "rescheduling possible"){
        this.httpService.rescheduleBooking(this.bookingDetails).subscribe((res:any)=>{
          console.log(res);
          if(res.response=="rescheduled successfully"){
            this.isLoading=false;
            this.isRescheduled=true;
            this.rescheduledStatus=true;
          }else if(res.response=="expert busy"){
            this.isLoading=false;
            this.errorMessage="Expert is busy choose another time !";
          } else if(res.response=="rescheduling unsuccessful"){
            this.isLoading=false;
            this.isRescheduled=true;
            this.rescheduledStatus=false;
            this.errorText='rescheduling unsuccessful !'
          } 
        })
      }else if(r.response=="rescheduling time limit exceeded"){
        this.isLoading=false;
        this.isRescheduled=true;
        this.rescheduledStatus=false;
        this.errorText="rescheduling time exceeded !";
      }else if(r.response=="invalid user"){
        this.isLoading=false;
        this.isRescheduled=true;
        this.rescheduledStatus=false;
        this.errorText="Invalid User !";
      }else if(r.response=="already rescheduled"){
        this.isLoading=false;
        this.isRescheduled=true;
        this.rescheduledStatus=false;
        this.errorText="Already rescheduled !";
        
      }
    })
    
    // this.httpService.isBookingValid(this.bookingDetails).subscribe((res) => {
    //   if (res) {
    //     this.isLoading = true;
    //   } else if (!res) {
    //     this.errorMessage =
    //       'Tutor is busy in between your selected time slots !';
    //   }
    // });
  }
  

  timeSelector(event, index: number) {
    this.clickedIndex = index;
    // if start time and end time are null
    if (
      this.st.sh == -1 &&
      this.st.sm == -1 &&
      this.et.eh == -1 &&
      this.et.em == -1
    ) {
      this.clickedIndex1 = index;
      this.startDisabled = false;
      this.startDate = event.date;
      this.st.sh = event.hours;
      this.st.sm = event.minutes;
      event.isStartDate = true;
      this.startSelect = this.clickedIndex;
      if (this.st.sm == 0) {
        this.startTimeString = this.st.sh + ':' + '0' + this.st.sm;
      } else {
        this.startTimeString = this.st.sh + ':' + this.st.sm;
      }
      this.errorMessage = '';

      //case 1 or case 3
      if (this.tempArray.clickIndex1 == null &&
        this.tempArray.clickIndex2 == null && 
        (this.clickedIndex - 1 == -1 || this.ScheduleTime[this.clickedIndex - 1].date != event.date)
      ) {
        if (this.clickedIndex - 1 == -1) {
        }
        this.tempArray.clickIndex1 = index;

        this.case1a = true;
        this.case3a = true;
      } else if (
        this.tempArray.clickIndex1 == null &&
        this.tempArray.clickIndex2 == null &&
        this.ScheduleTime[this.clickedIndex - 1].date == event.date
      ) {
        //case 2 or case 4 or case 5
        this.tempArray.clickIndex1 = index;
        this.case2a = true;
        this.case4a = true;
        this.case5a = true;
      }

      // else if start time is selected and end time is not selected
    } else if (
      this.st.sh != -1 &&
      this.st.sm != -1 &&
      this.et.eh == -1 &&
      this.et.em == -1
    ) {
      this.clickedIndex2 = index;
      // if date of start time selection and end time selection date are same
      if (this.startDate == event.date) {
        if (this.clickedIndex2 - this.clickedIndex1 <= 6) {
          this.et.eh = event.hours;
          this.et.em = event.minutes;
          //if end time is greater than start time
          if (this.et.eh * 60 + this.et.em > this.st.sh * 60 + this.st.sm) {
            this.endDisabled = false;
            event.isEndDate = true;
            this.endSelect = this.clickedIndex;
            if (this.et.em == 0) {
              this.endTimeString = this.et.eh + ':' + '0' + this.et.em;
            } else {
              this.endTimeString = this.et.eh + ':' + this.et.em;
            }
            this.errorMessage = '';
            //case 1 or case 4 or case 5
            if (
              this.tempArray.clickIndex1 != null &&
              this.tempArray.clickIndex2 == null &&
              this.ScheduleTime[this.clickedIndex].date == event.date
              // this.ScheduleTime[this.clickedIndex + 1].date == event.date
            ) {
              if (this.tempArray.clickIndex1 != null) {
              }
              this.tempArray.clickIndex2 = index;

              this.case1b = true;
              this.case4b = true;
              this.case5b = true;

              if (this.case1a && this.case1b) {
                this.bookingDetails.bookingCase = 1;
              }
              var diff = index - this.tempArray.clickIndex1;

              if (diff == 1 && this.case4a && this.case4b) {
                this.bookingDetails.bookingCase = 4;
              } else if (diff != 1 && this.case5a && this.case5b) {
                this.bookingDetails.bookingCase = 5;
              }
            } else if (
              this.tempArray.clickIndex1 != null &&
              this.tempArray.clickIndex2 == null &&
              this.ScheduleTime[this.clickedIndex + 1].date != event.date
            ) {
              //case 2 or case 3
              this.tempArray.clickIndex2 = index;
              this.case2b = true;
              this.case3b = true;

              if (this.case2a && this.case2b) {
                this.bookingDetails.bookingCase = 2;
              } else if (this.case3a && this.case3b) {
                this.bookingDetails.bookingCase = 3;
              }
            }
          } else if (
            this.et.eh * 60 + this.et.em <=
            this.st.sh * 60 + this.st.sm
          ) {
            //if end time is less than start time
            this.startDisabled = true;
            this.endDisabled = true;
            this.startSelect = -1;
            this.endSelect = -1;

            event.isEndDate = false;
            event.isStartDate = false;
            this.et.eh = -1;
            this.et.em = -1;
            this.st.sh = -1;
            this.st.sm = -1;
            this.startTimeString = 'Start Time ';
            this.endTimeString = 'End Time';
            this.errorMessage = 'End time should be after Start time, Reset !';

            this.tempArray.clickIndex1 = null;
            this.tempArray.clickIndex2 = null;
            this.case1a = false;
            this.case1b = false;
            this.case2a = false;
            this.case2b = false;
            this.case3a = false;
            this.case3b = false;
            this.case4a = false;
            this.case4b = false;
            this.case5a = false;
            this.case5b = false;
          }
        } else {
          this.errorMessage = "You can't book a tutor for more than 3 hours";
          this.startDisabled = true;
          this.endDisabled = true;
          event.isStartDate = false;
          this.startSelect = -1;
          this.st.sh = -1;
          this.st.sm = -1;
          this.startTimeString = 'Start Time ';
          this.tempArray.clickIndex1 = null;
          this.tempArray.clickIndex2 = null;
          this.case1a = false;
          this.case1b = false;
          this.case2a = false;
          this.case2b = false;
          this.case3a = false;
          this.case3b = false;
          this.case4a = false;
          this.case4b = false;
          this.case5a = false;
          this.case5b = false;
        }
      } else {
        // if start time date and end time date are not equal
        this.errorMessage = 'Start date and End date should be same';
        this.startDisabled = true;
        this.endDisabled = true;
        event.isStartDate = false;
        this.startSelect = -1;
        this.st.sh = -1;
        this.st.sm = -1;
        this.startTimeString = 'Start Time ';
        this.tempArray.clickIndex1 = null;
        this.tempArray.clickIndex2 = null;
        this.case1a = false;
        this.case1b = false;
        this.case2a = false;
        this.case2b = false;
        this.case3a = false;
        this.case3b = false;
        this.case4a = false;
        this.case4b = false;
        this.case5a = false;
        this.case5b = false;
      }
    } else if (
      this.st.sh != -1 &&
      this.st.sm != -1 &&
      this.et.eh != -1 &&
      this.et.em != -1
    ) {
      // if both start time and end time are already selected
      this.endDisabled = true;
      this.startDisabled = false;
      this.startSelect = this.clickedIndex;
      this.endSelect = -1;
      this.startDate = event.date;
      this.st.sh = event.hours;
      this.st.sm = event.minutes;
      this.et.eh = -1;
      this.et.em = -1;
      event.isEndDate = false;
      if (this.st.sm == 0) {
        this.startTimeString = this.st.sh + ':' + '0' + this.st.sm;
      } else {
        this.startTimeString = this.st.sh + ':' + this.st.sm;
      }
      this.endTimeString = 'End Time';

      this.errorMessage = '';

      this.tempArray.clickIndex1 = null;
      this.tempArray.clickIndex2 = null;
      this.case1a = false;
      this.case1b = false;
      this.case2a = false;
      this.case2b = false;
      this.case3a = false;
      this.case3b = false;
      this.case4a = false;
      this.case4b = false;
      this.case5a = false;
      this.case5b = false;

      //case 1 or case 3
      if (
        this.tempArray.clickIndex1 == null &&
        this.tempArray.clickIndex2 == null &&
        (this.clickedIndex - 1 == -1 ||
          this.ScheduleTime[this.clickedIndex - 1].date != event.date)
      ) {
        this.tempArray.clickIndex1 = index;
        this.case1a = true;
        this.case3a = true;
      } else if (
        this.tempArray.clickIndex1 == null &&
        this.tempArray.clickIndex2 == null &&
        this.ScheduleTime[this.clickedIndex - 1].date == event.date
      ) {
        //case 2 or case 4 or case 5
        this.tempArray.clickIndex1 = index;
        this.case2a = true;
        this.case4a = true;
        this.case5a = true;
      }
    }
  }

 

  manipulateTimeSlots() {
    for (let date of this.scheduleDates) {
      var flag = 0;
      for (let slot of this.ScheduleTime) {
        if (slot.date == date.date) {
          flag = 1;
          break;
        }
      }
      if (flag == 1) {
        date.hasElements = true;
      } else {
      }
    }
  }
  toggleMeridian() {
    this.meridian = !this.meridian;
  }

  findDuration(startHour, startMinute, endHour, endMinute) {
    return endHour * 60 + endMinute - (startHour * 60 + startMinute);
  }

  //for generating the hash code
  onGenerateString(l) {
    var text = '';
    var char_list =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < l; i++) {
      text += char_list.charAt(Math.floor(Math.random() * char_list.length));
    }
    return text;
  }

  //for calculating the end time
  calculateEndTime(startTime, duration) {
    var numberOfHours: number;
    var numberOfMinutes: number;
    numberOfHours = duration - (duration % 1);
    numberOfMinutes = (duration % 1) * 60;
    var startTimeHours = startTime.hour;
    var startTimeMinutes = startTime.minute;
    this.endTime.hour = startTimeHours + numberOfHours;
    this.endTime.minute = startTimeMinutes + numberOfMinutes;
    if (this.endTime.minute >= 60) {
      var newMinute = this.endTime.minute - 60;
      this.endTime.hour++;
      this.endTime.minute = newMinute;
    }
    this.endTime.hour = Math.trunc(this.endTime.hour);
    this.endTime.minute = Math.trunc(this.endTime.minute);
    return this.endTime;
  }
}
