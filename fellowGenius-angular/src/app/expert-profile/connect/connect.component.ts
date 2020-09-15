import { Component, OnInit } from "@angular/core";
import { ProfileService } from "../../service/profile.service";
import { tutorProfileDetails } from "../../model/tutorProfileDetails";
import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { meetingDetails } from "src/app/model/meetingDetails";
import { MeetingService } from "src/app/service/meeting.service";
import { NgForm } from "@angular/forms";
import { bookingDetails } from "src/app/model/bookingDetails";
import { Time } from "@angular/common";
import { StudentService } from "src/app/service/student.service";
import { HttpService } from "src/app/service/http.service";
import { ScheduleTime } from "../../model/ScheduleTime";
import { MatSnackBar, MatSnackBarConfig } from "@angular/material/snack-bar";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { scheduleData } from "src/app/model/scheduleData";
import { LoginDetailsService } from "../../service/login-details.service";
@Component({
  selector: "app-connect",
  templateUrl: "./connect.component.html",
  styleUrls: ["./connect.component.css"],
})
export class ConnectComponent implements OnInit {
  config: MatSnackBarConfig = {
    duration: 5000,
    horizontalPosition: "center",
    verticalPosition: "top",
    panelClass: ["snackbar"],
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
  startTimeString = "Start Time";
  endTimeString = "End Time";
  errorMessage: string = "";
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
  model: NgbDateStruct;
  meridian = true;
  date: Date = new Date();
  settings = {
    bigBanner: true,
    timePicker: true,
    format: "dd-MM-yyyy hh:mm a",
    defaultOpen: false,
    closeOnSelect: false,
  };
  ScheduleTime: ScheduleTime[] = [];
  fullDate = [];
  clickedIndex1: number;
  clickedIndex2: number;
  userId;
  profilePictureUrl = "../../assets/images/default-user-image.png";
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
    private dialog: MatDialog
  ) {}
  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.userId = params["page"];
      console.log(this.userId);
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
    if (this.loginService.getLoginType() == "Learner") {
      this.httpService.getTutorIsAvailable(this.userId).subscribe((res) => {
        if (res == true) {
          this.isTutorAvailable = true;
          this.timeFrom(-7);
          this.timeFrom2(-7);
          this.httpService
            .getTutorTimeAvailabilityTimeArray(this.userId)
            .subscribe((res) => {
              this.ScheduleTime = res;
              this.manipulateTimeSlots();
            });
        } else if (res == false) {
          this.isTutorAvailable = false;
        }
      });
    }
  }
  closeNav() {
    this.dialogRef.closeAll();
  }
  openConnectPage() {
    this.dialog.open(ConnectComponent);
  }
  timeSelector(event, index: number, todayDate: string) {
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
        this.startTimeString = this.st.sh + ":" + "0" + this.st.sm;
      } else {
        this.startTimeString = this.st.sh + ":" + this.st.sm;
      }
      this.errorMessage = "";

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
              this.endTimeString = this.et.eh + ":" + "0" + this.et.em;
            } else {
              this.endTimeString = this.et.eh + ":" + this.et.em;
            }
            this.errorMessage = "";

            //case 1 or case 4 or case 5
            if (
              this.tempArray.clickIndex1 != null &&
              this.tempArray.clickIndex2 == null &&
              this.ScheduleTime[this.clickedIndex + 1].date == event.date
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
            this.startTimeString = "Start Time ";
            this.endTimeString = "End Time";
            this.errorMessage = "End time should be after Start time, Reset !";

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
          this.startTimeString = "Start Time ";
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
        this.errorMessage = "Start date and End date should be same";
        this.startDisabled = true;
        this.endDisabled = true;
        event.isStartDate = false;
        this.startSelect = -1;
        this.st.sh = -1;
        this.st.sm = -1;
        this.startTimeString = "Start Time ";
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
        this.startTimeString = this.st.sh + ":" + "0" + this.st.sm;
      } else {
        this.startTimeString = this.st.sh + ":" + this.st.sm;
      }
      this.endTimeString = "End Time";

      this.errorMessage = "";

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
      ).toLocaleDateString("en-GB");
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
  openSideNav() {
    document.getElementById("mySidenav").style.width = "550px";
  }
  closeSideNav() {
    document.getElementById("mySidenav").style.width = "0";
  }
  toggleMeridian() {
    this.meridian = !this.meridian;
  }

  onBooking() {
    this.bookingDetails.startTimeHour = this.st.sh;
    this.bookingDetails.startTimeMinute = this.st.sm;
    this.bookingDetails.dateOfMeeting = this.startDate;
    this.bookingDetails.duration = this.findDuration(
      this.st.sh,
      this.st.sm,
      this.et.eh,
      this.et.em
    );
    this.bookingDetails.endTimeHour = this.et.eh;
    this.bookingDetails.endTimeMinute = this.et.em;
    this.bookingDetails.meetingId = this.onGenerateString(10);
    this.bookingDetails.tutorId = this.teacherProfile.tid;
    this.bookingDetails.studentName = this.studentService.getStudentProfileDetails().fullName;
    this.bookingDetails.tutorName = this.teacherProfile.fullName;
    this.bookingDetails.studentId = this.studentService.getStudentProfileDetails().sid;

    this.httpService.isBookingValid(this.bookingDetails).subscribe((res) => {
      if (res) {
        this.isLoading = true;
        this.httpService.saveBooking(this.bookingDetails).subscribe((res) => {
          if (res == true) {
            this.isLoading = false;

            this.snackBar.open(
              "Booking submitted successfully !",
              "close",
              this.config
            );
            this.dialogRef.closeAll();
          }
        });
      } else if (!res) {
        this.errorMessage =
          "Tutor is busy in between your selected time slots !";
      }
    });
  }

  findDuration(startHour, startMinute, endHour, endMinute) {
    return endHour * 60 + endMinute - (startHour * 60 + startMinute);
  }

  //for generating the hash code
  onGenerateString(l) {
    var text = "";
    var char_list =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
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
