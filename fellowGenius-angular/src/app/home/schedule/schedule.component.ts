import { Component, ViewChild, OnInit, Inject } from "@angular/core";
import {
  ScheduleComponent,
  EventSettingsModel,
  DayService,
  WeekService,
  WorkWeekService,
  MonthService,
  View,
  EventRenderedArgs,
  ActionEventArgs,
} from "@syncfusion/ej2-angular-schedule";
import * as jwt_decode from "jwt-decode";

import { Button } from "../../../../node_modules/@syncfusion/ej2-buttons";
import { timeInterval } from "rxjs/operators";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from "@angular/material/dialog";
import { HttpService } from "src/app/service/http.service";
import { scheduleData } from "src/app/model/scheduleData";
import { ValueConverter } from "@angular/compiler/src/render3/view/template";
import { tutorAvailabilitySchedule } from "src/app/model/tutorAvailabilitySchedule";
import { TutorService } from "src/app/service/tutor.service";
import { LoginDetailsService } from "src/app/service/login-details.service";
import { CookieService } from "ngx-cookie-service";

@Component({
  selector: "app-schedule",
  templateUrl: "./schedule.component.html",
  styleUrls: ["./schedule.component.css"],
})
export class tutorScheduleComponent implements OnInit {
  ngOnInit(): void {
    // if (this.loginService.getTrType() == 'signUp') {
    // 	this.matDialog.open(instructionGuide, {
    // 		width: '80%',
    // 		height: '80%'
    // 	});
    // }
  }
  ngAfterViewInit() {
    if (this.tutorService.getPersonalAvailabilitySchedule()) {
      this.scheduleObj.eventSettings.dataSource = this.tutorService.getPersonalAvailabilitySchedule().allAvailabilitySchedule;
      // this.meetingObj.eventSettings.dataSource = this.tutorService.getPersonalAvailabilitySchedule().allMeetingsSchedule;
      this.tutorAvailabilitySchedule.fullName = this.tutorService.getTutorDetials().fullName;
      this.tutorAvailabilitySchedule.tid = this.tutorService.getTutorDetials().tid;
      this.tutorAvailabilitySchedule.isAvailable = this.tutorService.getPersonalAvailabilitySchedule().isAvailable;
      this.copySchedule();
      this.copyBookings();
    } else {
      this.handleRefresh();
    }
  }
  constructor(
    private matDialog: MatDialog,
    private httpService: HttpService,
    private tutorService: TutorService,
    private loginService: LoginDetailsService,
    private cookieService: CookieService
  ) {}

  @ViewChild("scheduleObj") public scheduleObj: ScheduleComponent;
  @ViewChild("meetingObj") public meetingObj: ScheduleComponent;
  // @ViewChild('addButton') public addButton: Button;
  public scheduleViews: View[] = ["Day", "Week", "WorkWeek", "Month"];
  tutorAvailabilitySchedule = new tutorAvailabilitySchedule();
  calendarLoaded = false;
  calendarView = "Availability";
  availabiltiySchedules: scheduleData[] = [];
  availableSchedules: scheduleData[] = [];
  bookingSchedule: scheduleData[] = [];
  combinedSchedule: scheduleData[] = [];
  // public eventSettings: EventSettingsModel = {
  // 	// dataSource:
  // 	dataSource: this.tutorService.getPersonalAvailabilitySchedule().allAvailabilitySchedule
  // };
  switchCalendarView() {
    if (this.calendarView == "Availability") {
      this.calendarView = "Meeting";
      this.scheduleObj.eventSettings.dataSource = this.bookingSchedule;
    } else {
      this.calendarView = "Availability";
      this.scheduleObj.eventSettings.dataSource = this.tutorService.getPersonalAvailabilitySchedule().allAvailabilitySchedule;
    }
  }
  handleRefresh() {
    if (this.cookieService.get("userId")) {
      let userId = this.cookieService.get("userId");
      this.httpService.getScheduleData(parseInt(userId)).subscribe((res) => {
        this.tutorService.setPersonalAvailabilitySchedule(res);
        this.tutorAvailabilitySchedule.fullName = this.tutorService.getTutorDetials().fullName;
        this.tutorAvailabilitySchedule.tid = this.tutorService.getTutorDetials().tid;
        this.tutorAvailabilitySchedule.isAvailable = this.tutorService.getPersonalAvailabilitySchedule().isAvailable;
        this.availabiltiySchedules = this.tutorService.getPersonalAvailabilitySchedule().allAvailabilitySchedule;
        this.copySchedule();
        this.copyBookings();
        // setTimeout(() => {
        // 	let scheduleObj = (document.querySelector('.e-schedule') as any).ej2_instances[0];
        // 	scheduleObj.eventSettings.dataSource = this.tutorService.getPersonalAvailabilitySchedule().allAvailabilitySchedule;
        // }, 3000);
        // this.meetingObj.eventSettings.dataSource = this.tutorService.getPersonalAvailabilitySchedule().allMeetingsSchedule;
        this.scheduleObj.eventSettings.dataSource = this.tutorService.getPersonalAvailabilitySchedule().allAvailabilitySchedule;
        // this.scheduleObj.eventSettings.dataSource = this.combinedSchedule;
      });
    }
  }

  // initiateCalendar() {
  //   // console.log('initiate calendar called !');
  //   // // let scheduleObj = (document.querySelector('scheduleObj') as any).ej2_instances[0];
  //   // this.scheduleObj.eventSettings.dataSource = this.availabiltiySchedules;
  //   setTimeout(function () {
  //     let scheduleObj = (document.querySelector(".e-schedule") as any)
  //       .ej2_instances[0];
  //     let scheduleData: Object[] = [
  //       {
  //         Id: 1,
  //         Subject: "Conference",
  //         StartTime: new Date(2018, 1, 12, 9, 0),
  //         EndTime: new Date(2018, 1, 12, 10, 0),
  //         IsAllDay: false,
  //       },
  //       {
  //         Id: 2,
  //         Subject: "Meeting",
  //         StartTime: new Date(2018, 1, 15, 10, 0),
  //         EndTime: new Date(2018, 1, 15, 11, 30),
  //         IsAllDay: false,
  //       },
  //       {
  //         Id: 3,
  //         Subject: "Testing",
  //         StartTime: new Date(2018, 1, 11, 9, 0),
  //         EndTime: new Date(2018, 1, 11, 10, 0),
  //         IsAllDay: false,
  //       },
  //       {
  //         Id: 4,
  //         Subject: "Vacation",
  //         StartTime: new Date(2018, 1, 13, 9, 0),
  //         EndTime: new Date(2018, 1, 13, 10, 0),
  //         IsAllDay: false,
  //       },
  //     ];
  //     scheduleObj.eventSettings.dataSource = scheduleData;
  //   }, 3000);
  // }
  copySchedule() {
    for (let schedule of this.tutorService.getPersonalAvailabilitySchedule()
      .allAvailabilitySchedule) {
      var appointment = new scheduleData();
      appointment.Id = schedule.Id;
      appointment.Subject = schedule.Subject;
      appointment.StartTime = schedule.StartTime;
      appointment.EndTime = schedule.EndTime;
      appointment.IsAllDay = schedule.IsAllDay;
      appointment.RecurrenceRule = schedule.RecurrenceRule;
      appointment.RecurrenceException = schedule.RecurrenceException;
      appointment.Guid = schedule.Guid;
      appointment.IsReadonly = false;
      this.availableSchedules.push(appointment);
    }
  }

  copyBookings() {
    for (let schedule of this.tutorService.getPersonalAvailabilitySchedule()
      .allMeetingsSchedule) {
      var appointment = new scheduleData();
      appointment.Subject = schedule.Subject;
      appointment.StartTime = schedule.StartTime;
      appointment.EndTime = schedule.EndTime;
      appointment.IsAllDay = schedule.IsAllDay;
      appointment.RecurrenceRule = schedule.RecurrenceRule;
      appointment.RecurrenceException = schedule.RecurrenceException;
      appointment.Guid = schedule.Guid;
      appointment.Type = "booking";
      appointment.IsReadonly = true;
      this.bookingSchedule.push(appointment);
    }
  }
  copyAppointment(schedule) {
    var appointment = new scheduleData();
    appointment.Id = schedule.Id;
    appointment.Subject = schedule.Subject;
    appointment.StartTime = schedule.StartTime.toString();
    appointment.EndTime = schedule.EndTime.toString();
    appointment.IsAllDay = schedule.IsAllDay;
    appointment.RecurrenceRule = schedule.RecurrenceRule;
    appointment.RecurrenceException = schedule.RecurrenceException;
    appointment.Guid = schedule.Guid;
    return appointment;
  }
  // for adding events into calendar schedules
  addEvents(appointment: scheduleData) {
    this.availableSchedules.push(appointment);
    this.tutorAvailabilitySchedule.allAvailabilitySchedule = this.availableSchedules;
    setTimeout(() => {
      //<<<---    using ()=> syntax
      this.httpService
        .saveScheduleData(this.tutorAvailabilitySchedule)
        .subscribe((res) => {
          this.tutorService.personalAvailablitySchedule = this.tutorAvailabilitySchedule;
        });
    }, 3000);
  }
  public onEventRendered(args: any): void {
    if (args.data.Type == "booking") {
      args.element.style.backgroundColor = "#4a4040";
    }
  }
  // for updating events into calendar schedules
  updateEvents(newAppointment: scheduleData) {
    let updateIndex = this.availableSchedules.findIndex(
      (obj) => obj.Id == newAppointment.Id
    );
    if (updateIndex == -1) {
      this.availableSchedules.push(newAppointment);
    } else {
      this.availableSchedules[updateIndex] = newAppointment;
    }
    this.tutorAvailabilitySchedule.allAvailabilitySchedule = this.availableSchedules;
    setTimeout(() => {
      this.httpService
        .saveScheduleData(this.tutorAvailabilitySchedule)
        .subscribe((res) => {
          this.tutorService.personalAvailablitySchedule = this.tutorAvailabilitySchedule;
        });
    }, 3000);
  }
  //for deleting events into calendar schedules
  deleteEvents(appointment: scheduleData) {
    let deleteIndex = this.availableSchedules.findIndex(
      (obj) => obj.Id == appointment.Id
    );
    this.availableSchedules.splice(deleteIndex, 1);
    this.tutorAvailabilitySchedule.allAvailabilitySchedule = this.availableSchedules;
    setTimeout(() => {
      this.httpService
        .saveScheduleData(this.tutorAvailabilitySchedule)
        .subscribe((res) => {
          this.tutorService.personalAvailablitySchedule = this.tutorAvailabilitySchedule;
        });
    }, 3000);
  }
  //for updating special case
  updateSpecialEvents() {
    this.tutorAvailabilitySchedule.allAvailabilitySchedule = this.availableSchedules;
    setTimeout(() => {
      //<<<---    using ()=> syntax
      this.httpService
        .saveScheduleData(this.tutorAvailabilitySchedule)
        .subscribe((res) => {
          this.tutorService.personalAvailablitySchedule = this.tutorAvailabilitySchedule;
        });
    }, 3000);
  }
  // on event rendered
  // onEventRendered(args: EventRenderedArgs): void {}

  onActionBegin(args: ActionEventArgs): void {
    var schedule;
    //when an event is created
    if (args.requestType === "eventCreate") {
      schedule = args.addedRecords;
      setTimeout(() => {
        this.addEvents(this.copyAppointment(schedule[0]));
      }, 3000);
    } else if (args.requestType === "eventChange") {
      // when an event is changed
      schedule = args.changedRecords;

      setTimeout(() => {
        if (
          schedule[0].Guid != null &&
          schedule[0].RecurrenceException != null
        ) {
          // if an recurrence exception is created
          this.availableSchedules.splice(0, this.availableSchedules.length);
          for (let schedule of this.tutorService.getPersonalAvailabilitySchedule()
            .allAvailabilitySchedule) {
            var appointment = new scheduleData();
            appointment.Id = schedule.Id;
            appointment.Subject = schedule.Subject;
            appointment.StartTime = schedule.StartTime.toString();
            appointment.EndTime = schedule.EndTime.toString();
            appointment.IsAllDay = schedule.IsAllDay;
            appointment.RecurrenceRule = schedule.RecurrenceRule;
            appointment.RecurrenceException = schedule.RecurrenceException;
            appointment.Guid = schedule.Guid;
            appointment.RecurrenceID = schedule.RecurrenceID;
            this.availableSchedules.push(appointment);
          }
          this.updateSpecialEvents();
        } else {
          //normal updation
          this.updateEvents(this.copyAppointment(schedule[0]));
        }
      }, 3000);
    } else if (args.requestType === "eventRemove") {
      // when an event is removed
      schedule = args.deletedRecords;
      if (schedule.length != 0) {
        setTimeout(() => {
          this.availableSchedules.splice(0, this.availableSchedules.length);
          for (let schedule of this.tutorService.getPersonalAvailabilitySchedule()
            .allAvailabilitySchedule) {
            var appointment = new scheduleData();
            appointment.Id = schedule.Id;
            appointment.Subject = schedule.Subject;
            appointment.StartTime = schedule.StartTime.toString();
            appointment.EndTime = schedule.EndTime.toString();
            appointment.IsAllDay = schedule.IsAllDay;
            appointment.RecurrenceRule = schedule.RecurrenceRule;
            appointment.RecurrenceException = schedule.RecurrenceException;
            appointment.Guid = schedule.Guid;
            appointment.RecurrenceID = schedule.RecurrenceID;
            this.availableSchedules.push(appointment);
          }
          this.updateSpecialEvents();
        }, 3000);
      } else if (schedule.length == 0) {
        setTimeout(() => {
          this.availableSchedules.splice(0, this.availableSchedules.length);
          for (let schedule of this.tutorService.getPersonalAvailabilitySchedule()
            .allAvailabilitySchedule) {
            var appointment = new scheduleData();
            appointment.Id = schedule.Id;
            appointment.Subject = schedule.Subject;
            appointment.StartTime = schedule.StartTime.toString();
            appointment.EndTime = schedule.EndTime.toString();
            appointment.IsAllDay = schedule.IsAllDay;
            appointment.RecurrenceRule = schedule.RecurrenceRule;
            appointment.RecurrenceException = schedule.RecurrenceException;
            appointment.Guid = schedule.Guid;
            appointment.RecurrenceID = schedule.RecurrenceID;
            this.availableSchedules.push(appointment);
          }
          this.updateSpecialEvents();
        }, 3000);
      }
    }
  }
}
// -----------------------------------------------------------------------------------------------------------------------------
@Component({
  selector: "instruction-guide",
  templateUrl: "instruction-guide.html",
})
export class instructionGuide {
  constructor() {}
}
