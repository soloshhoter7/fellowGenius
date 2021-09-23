import { Component, NgZone, OnInit } from '@angular/core';
import { ProfileService } from '../../service/profile.service';
import { tutorProfileDetails } from '../../model/tutorProfileDetails';
import { environment } from './../../../environments/environment';
import { meetingDetails } from 'src/app/model/meetingDetails';
import { MeetingService } from 'src/app/service/meeting.service';
import { NgForm } from '@angular/forms';
import { bookingDetails } from 'src/app/model/bookingDetails';
import { Time } from '@angular/common';
import { StudentService } from 'src/app/service/student.service';
import { HttpService } from 'src/app/service/http.service';
import { ScheduleTime } from '../../model/ScheduleTime';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { scheduleData } from 'src/app/model/scheduleData';
import { LoginDetailsService } from '../../service/login-details.service';
import {
  ICustomWindow,
  WindowRefService,
} from 'src/app/service/window-ref.service';
import { Observable } from 'rxjs';
import { WebSocketService } from 'src/app/service/web-socket.service';
@Component({
  selector: 'app-connect',
  templateUrl: './connect.component.html',
  styleUrls: ['./connect.component.css'],
})
export class ConnectComponent implements OnInit {
  config: MatSnackBarConfig = {
    duration: 5000,
    horizontalPosition: 'center',
    verticalPosition: 'top',
    panelClass: ['snackbar'],
  };
  signedIn = false;
  selectedSubject;
  startTimeValue;
  endTimeValue;
  areaOfExpertises = [];
  startDisabled: boolean;
  endDisabled: boolean;
  noSchedule: boolean = false;
  selectedStart;
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
  startSlots: ScheduleTime[] = [];
  startSlotsCopy: ScheduleTime[] = [];
  endSlots: ScheduleTime[] = [];
  fullDate = [];
  clickedIndex1: number;
  clickedIndex2: number;
  userId;
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
  selectedDomain;
  showExpertCode:boolean=false;
  expertCode:string;
  constructor(
    private profileService: ProfileService,
    private meetingSevice: MeetingService,
    private studentService: StudentService,
    private httpService: HttpService,
    private snackBar: MatSnackBar,
    private router: Router,
    private dialogRef: MatDialog,
    private activatedRoute: ActivatedRoute,
    private loginService: LoginDetailsService,
    private dialog: MatDialog,
    private zone: NgZone,
    private winRef: WindowRefService,
    private webSocket: WebSocketService,
  ) {}
  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.userId = params['page'];
      this.httpService
        .fetchBookingTutorProfileDetails(this.userId)
        .subscribe((res) => {
          this.teacherProfile = res;
          this.amount = parseInt(this.teacherProfile.price1);
          this.profilePictureUrl = this.teacherProfile.profilePictureUrl;
          this.areaOfExpertises = this.teacherProfile.areaOfExpertise;
        });
    });

    this.startDisabled = true;
    this.endDisabled = true;
    this.teacherProfile = this.profileService.getProfile();
    if (this.loginService.getLoginType() == 'Learner') {
      console.log('here');
      this.signedIn = true;
      console.log(this.signedIn);
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
              setTimeout(() => {
                this.dateChange();
              }, 1000);
              this.manipulateTimeSlots();
            });
        } else if (res == false) {
          this.isTutorAvailable = false;
        }
      });
    } else {
      this.signedIn = false;
    }
  }

  dateChange() {
    if (this.selectedDate.hasElements == false) {
      this.noSchedule = true;
    } else if (this.selectedDate.hasElements == true) {
      this.noSchedule = false;

      this.fillSlots('start');
    }
  }
  startSlotChange() {
    this.endSlots = [];
    var i;
    for (i = this.startTimeValue + 1; i < this.startSlotsCopy.length; i++) {
      this.endSlots.push(this.startSlotsCopy[i]);
    }
    this.dynamicPrice();
  }
  endSlotChange(){
    this.dynamicPrice();
  }
  fillSlots(method) {
    if (method == 'start') {
      this.startSlots = [];
      this.endSlots = [];
      this.startSlotsCopy = [];
      for (let time of this.ScheduleTime) {
        if (time.date == this.selectedDate.date) {
          this.startSlots.push(time);
        }
      }
      for (let time of this.ScheduleTime) {
        if (time.date == this.selectedDate.date) {
          this.startSlotsCopy.push(time);
        }
      }
      var i;
      for (i = 1; i < this.startSlotsCopy.length; i++) {
        this.endSlots.push(this.startSlotsCopy[i]);
      }
      this.startTimeValue = 0;
      this.endTimeValue = 0;
      this.startSlots.pop();
      this.dynamicPrice();
      
    }
  }
  dynamicPrice(){
    let startIndex, endIndex;
    startIndex = this.ScheduleTime.indexOf(
      this.startSlots[this.startTimeValue]
    );
    endIndex = this.ScheduleTime.indexOf(
      this.endSlots[this.endTimeValue]
    );
    console.log(startIndex,endIndex)
    this.timeSelector(
      this.startSlots[this.startTimeValue],
      startIndex
    );
    this.timeSelector(this.endSlots[this.endTimeValue], endIndex);
    this.bookingDetails.duration = this.findDuration(
      this.st.sh,
      this.st.sm,
      this.et.eh,
      this.et.em
    );
    console.log(this.bookingDetails.duration);
    this.calculatePrice();
  }
  initPay(): void {
    this.rzp = new this.winRef.nativeWindow['Razorpay'](
      this.preparePaymentDetails()
    );
    this.rzp.open();
  }

  preparePaymentDetails() {
    var ref = this;
    return {
      key: environment.RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
      amount: (ref.payableAmount * 100).toString(), // Amount is in currency subunits. Default currency is INR. Hence, 29935 refers to 29935 paise or INR 299.35.
      name: 'Pay' + ' ' + ref.teacherProfile.fullName,
      image: this.teacherProfile.profilePictureUrl,
      handler: function (response) {
        ref.paymentHandler(response);
      },
      modal: {
        ondismiss: () => {
          this.zone.run(() => {
            console.log('payment failed');
            this.isLoading=false;
          });
        },
      },
      prefill: {
        name: 'FellowGenius',
        email: '',
      },
      theme: {
        color: '#2874f0',
      },
    };
  }
  paymentHandler(res: any) {
    this.zone.run(() => {
      this.paymentSuccessful = true;
      this.createBooking(res);
    });
  }
  findDomain(subject) {
    var subjectPrice;
    console.log(subject);
    for (let area of this.teacherProfile.areaOfExpertise) {
      if (area.subCategory == subject) {
        console.log('found!!')
        this.selectedDomain = area.category;
        console.log(area.category,this.selectedDomain);
        subjectPrice = area.price;
      }
    }
  }
  calculatePrice() {
    this.payableAmount =
      (this.bookingDetails.duration / 60) *
      parseInt(this.teacherProfile.price1);
  }

  createBooking(res: any) {
    if (this.paymentSuccessful) {
      console.log('payment response', res);
      this.bookingDetails.razorpay_payment_id = res.razorpay_payment_id;
      this.bookingDetails.razorpay_order_id = res.razorpay_order_id;
      this.bookingDetails.razorpay_signature = res.razorpay_signature;
      this.bookingDetails.amount = this.payableAmount;
      console.log(this.bookingDetails);
      this.httpService.saveBooking(this.bookingDetails).subscribe((res) => {
        if (res == true) {
          this.isLoading = false;
          let data = JSON.stringify({
            entityType: '1',
            entityTypeId: '11',
            actorId: this.bookingDetails.studentId,
            notifierId: this.bookingDetails.tutorId,
            pictureUrl: this.studentService.studentProfile.profilePictureUrl,
            readStatus: false,
          });
          this.webSocket.sendAppointmentNotfication(
            data,
            this.bookingDetails.tutorId.toString()
          );
          this.snackBar.open(
            'Booking submitted successfully !',
            'close',
            this.config
          );
          this.dialogRef.closeAll();
          this.router.navigate(['home/student-dashboard']);
        }
      });
    }
  }

  onBooking() {
    var startIndex, endIndex;
    startIndex = this.ScheduleTime.indexOf(
      this.startSlots[this.startTimeValue]
    );
    endIndex = this.ScheduleTime.indexOf(this.endSlots[this.endTimeValue]);
    console.log(startIndex,endIndex);
    this.timeSelector(this.startSlots[this.startTimeValue], startIndex);
    this.timeSelector(this.endSlots[this.endTimeValue], endIndex);

    this.bookingDetails.startTimeHour = this.st.sh;
    // this.bookingDetails.startTimeHour = this.startSlots[this.startTimeValue].hours;
    this.bookingDetails.startTimeMinute = this.st.sm;
    // this.bookingDetails.startTimeMinute = this.startSlots[this.startTimeValue].minutes;
    this.bookingDetails.dateOfMeeting = this.startDate;
    // this.bookingDetails.dateOfMeeting = this.selectedDate;
    this.bookingDetails.duration = this.findDuration(
      this.st.sh,
      this.st.sm,
      this.et.eh,
      this.et.em
    );

    this.bookingDetails.endTimeHour = this.et.eh;
    this.bookingDetails.endTimeMinute = this.et.em;
    this.bookingDetails.meetingId = this.onGenerateString(10);
    this.bookingDetails.tutorId = this.teacherProfile.bookingId;
    this.bookingDetails.studentName =
      this.studentService.getStudentProfileDetails().fullName;
    this.bookingDetails.tutorName = this.teacherProfile.fullName;
    this.bookingDetails.tutorProfilePictureUrl =
      this.teacherProfile.profilePictureUrl;
    this.bookingDetails.studentId =
      this.studentService.getStudentProfileDetails().sid;
    console.log(this.expertCode)
    this.bookingDetails.expertCode = this.expertCode;
    this.calculatePrice();
    this.findDomain(this.bookingDetails.subject);
    console.log(this.selectedDomain)
    this.bookingDetails.domain = this.selectedDomain;
    this.processingPayment = false;
    console.log(this.bookingDetails)
    this.httpService.isBookingValid(this.bookingDetails).subscribe((res) => {
      if (res) {
        this.isLoading = true;
        this.initPay();
      } else if (!res) {
        this.errorMessage =
          'Tutor is busy in between your selected time slots !';
      }
    });
  }

  closeNav() {
    this.dialogRef.closeAll();
  }

  openConnectPage() {
    this.dialog.open(ConnectComponent);
  }

  timeSelector(event, index: number) {
    console.log('calleddd')
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
      if (
        this.tempArray.clickIndex1 == null &&
        this.tempArray.clickIndex2 == null &&
        (this.clickedIndex - 1 == -1 ||
          this.ScheduleTime[this.clickedIndex - 1].date != event.date)
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
export class dateModel {
  date: string;
  hasElements: boolean = false;
}
