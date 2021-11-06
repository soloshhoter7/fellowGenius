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
import { Schedule } from '@syncfusion/ej2-schedule';
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
  showExpertCode: boolean = false;
  expertCode: string;
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
    private webSocket: WebSocketService
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
              console.log(res);
              if (this.ScheduleTime.length == 0) {
                console.log('notified expert for no schedule!');
                this.httpService
                  .notifyExpertNoSchedule(
                    this.teacherProfile.bookingId.toString()
                  )
                  .subscribe((res) => {
                    console.log(res);
                  });
              }
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
    console.log('date change');
    console.log(this.selectedDate);
    if (this.selectedDate.hasElements == false) {
      this.noSchedule = true;
    } else if (this.selectedDate.hasElements == true) {
      console.log('selected date elements : ')
      console.log(this.selectedDate.hasElements);
      this.noSchedule = false;
      this.fillSlots('start');
    }
  }
  startSlotChange() {
    this.endSlots = [];
    console.log('start slot value is :' + this.startTimeValue);
    let time: ScheduleTime =
      this.ScheduleTime[
        this.ScheduleTime.indexOf(this.startSlots[this.startTimeValue])
      ];
    let remainingSlots: ScheduleTime[] = this.returnNextFrameSlots(
      this.ScheduleTime,
      time.frame,
      time
    );
    for (let slot of remainingSlots) {
      this.endSlots.push(slot);
    }
    this.endTimeValue= 0;
    this.dynamicPrice();
  }
  endSlotChange() {
    this.dynamicPrice();
  }
  returnNextFrameSlots(
    ScheduleTime: ScheduleTime[],
    currentFrame: number,
    time: ScheduleTime
  ): ScheduleTime[] {
    let index: number = ScheduleTime.indexOf(time);
    let nextSlots: ScheduleTime[] = [];
    if (index != -1) {
      for (let j = index + 1; j < ScheduleTime.length; j++) {
        if (ScheduleTime[j].frame == currentFrame) {
          nextSlots.push(ScheduleTime[j]);
        }
      }
    }

    return nextSlots;
  }
  fillSlots(method) {
    if (method == 'start') {
      this.startSlots = [];
      this.endSlots = [];
      let selectedFrame: number = 0;
      // console.log('fill slots called')
      for (let time of this.ScheduleTime) {
        let frame: number = time.frame;
        if (time.date == this.selectedDate.date) {
          // console.log('date matched')
          let elLeftInFrame = this.returnNextFrameSlots(
            this.ScheduleTime,
            frame,
            time
          ).length;
          console.log('element left in frame :'+frame+'is :'+elLeftInFrame)
          if (elLeftInFrame !=0) {
            this.startSlots.push(time);
          }
        }
      }

      this.startTimeValue = 0;
      this.endTimeValue = 0;
      let time: ScheduleTime =
        this.ScheduleTime[
          this.ScheduleTime.indexOf(this.startSlots[this.startTimeValue])
        ];
      let remainingSlots: ScheduleTime[] = this.returnNextFrameSlots(
        this.ScheduleTime,
        time.frame,
        time
      );
      console.log('remaining slots: ',remainingSlots)
      for (let slot of remainingSlots) {
        this.endSlots.push(slot);
      }
      console.log('end slots :', this.endSlots);
      // this.startSlots.pop();
      this.dynamicPrice();
    }
  }
  dynamicPrice() {
    let startIndex, endIndex;
    startIndex = this.ScheduleTime.indexOf(
      this.startSlots[this.startTimeValue]
    );
    endIndex = this.ScheduleTime.indexOf(this.endSlots[this.endTimeValue]);
    console.log(startIndex, endIndex);
    this.st.sh = this.ScheduleTime[startIndex].hours;
    this.st.sm = this.ScheduleTime[startIndex].minutes;
    this.et.eh = this.ScheduleTime[endIndex].hours;
    this.et.em = this.ScheduleTime[endIndex].minutes;
    // this.timeSelector(this.startSlots[this.startTimeValue], startIndex);
    // this.timeSelector(this.endSlots[this.endTimeValue], endIndex);
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
            this.isLoading = false;
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
        console.log('found!!');
        this.selectedDomain = area.category;
        console.log(area.category, this.selectedDomain);
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
    console.log(startIndex, endIndex);
    // this.timeSelector(this.startSlots[this.startTimeValue], startIndex);
    // this.timeSelector(this.endSlots[this.endTimeValue], endIndex);
    this.st.sh = this.ScheduleTime[startIndex].hours;
    this.st.sm = this.ScheduleTime[startIndex].minutes;
    this.et.eh = this.ScheduleTime[endIndex].hours;
    this.et.em = this.ScheduleTime[endIndex].minutes;

    this.bookingDetails.startTimeHour = this.st.sh;
    // this.bookingDetails.startTimeHour = this.startSlots[this.startTimeValue].hours;
    this.bookingDetails.startTimeMinute = this.st.sm;
    // this.bookingDetails.startTimeMinute = this.startSlots[this.startTimeValue].minutes;
    // this.bookingDetails.dateOfMeeting = this.startDate;
    this.bookingDetails.dateOfMeeting = this.selectedDate.date;
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
    console.log(this.expertCode);
    this.bookingDetails.expertCode = this.expertCode;
    this.calculatePrice();
    this.findDomain(this.bookingDetails.subject);
    console.log(this.selectedDomain);
    this.bookingDetails.domain = this.selectedDomain;
    this.processingPayment = false;
    console.log(this.bookingDetails);
    // this.httpService.isBookingValid(this.bookingDetails).subscribe((res) => {
    //   console.log('is bookind valid ->', res);
    //   if (res) {
    //     this.isLoading = true;
    //     this.initPay();
    //   } else if (!res) {
    //     this.errorMessage =
    //       'Tutor is not available in between the selected time slots !';
    //   }
    // });
    this.isLoading = true;
    this.initPay();
  }

  closeNav() {
    this.dialogRef.closeAll();
  }

  openConnectPage() {
    this.dialog.open(ConnectComponent);
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
      let count=0;
      for (let slot of this.ScheduleTime) {
        if (slot.date == date.date) {
          count++;
        }
      }
      date.elementCount = count;
      if (count>1) {
        date.hasElements = true;
      } else {
        date.hasElements=false;
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
  elementCount:number;
}
