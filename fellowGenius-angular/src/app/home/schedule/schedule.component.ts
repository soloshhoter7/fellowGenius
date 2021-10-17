import { Component, ViewChild, OnInit, Inject } from '@angular/core';
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
  PopupCloseEventArgs,
  PopupOpenEventArgs,
} from '@syncfusion/ej2-angular-schedule';
import * as jwt_decode from 'jwt-decode';

import { Button } from '../../../../node_modules/@syncfusion/ej2-buttons';
import { timeInterval } from 'rxjs/operators';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
import { HttpService } from 'src/app/service/http.service';
import { scheduleData } from 'src/app/model/scheduleData';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { tutorAvailabilitySchedule } from 'src/app/model/tutorAvailabilitySchedule';
import { TutorService } from 'src/app/service/tutor.service';
import { LoginDetailsService } from 'src/app/service/login-details.service';
import { CookieService } from 'ngx-cookie-service';
import { Query } from '@syncfusion/ej2-data';
import { ThrowStmt } from '@angular/compiler';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css'],
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
      console.log('i am here')
      console.log(this.tutorService.getPersonalAvailabilitySchedule().allAvailabilitySchedule);
      this.scheduleObj.eventSettings.dataSource =
        this.tutorService.getPersonalAvailabilitySchedule().allAvailabilitySchedule;
        console.log(this.tutorService.getPersonalAvailabilitySchedule().allAvailabilitySchedule);
      // this.meetingObj.eventSettings.dataSource = this.tutorService.getPersonalAvailabilitySchedule().allMeetingsSchedule;
      this.tutorAvailabilitySchedule.fullName =
        this.tutorService.getTutorDetials().fullName;
      this.tutorAvailabilitySchedule.tid =
        this.tutorService.getTutorDetials().bookingId;
      this.tutorAvailabilitySchedule.isAvailable =
        this.tutorService.getPersonalAvailabilitySchedule().isAvailable;
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
    private cookieService: CookieService,
    private datePipe:DatePipe
  ) {}

  @ViewChild('scheduleObj') public scheduleObj: ScheduleComponent;
  @ViewChild('meetingObj') public meetingObj: ScheduleComponent;
  public scheduleViews: View[] = ['Day', 'Week', 'WorkWeek', 'Month'];
  tutorAvailabilitySchedule = new tutorAvailabilitySchedule();
  calendarLoaded = false;
  calendarView = 'Availability';
  availabiltiySchedules: scheduleData[] = [];
  availableSchedules: scheduleData[] = [];
  bookingSchedule: scheduleData[] = [];
  combinedSchedule: scheduleData[] = [];
  userId;
  isLoading = false;
  // public eventSettings: EventSettingsModel = {
  // 	// dataSource:
  // 	dataSource: this.tutorService.getPersonalAvailabilitySchedule().allAvailabilitySchedule
  // };
  switchCalendarView() {
    if (this.calendarView == 'Availability') {
      this.calendarView = 'Meeting';
      this.scheduleObj.eventSettings.dataSource = this.bookingSchedule;
    } else {
      this.calendarView = 'Availability';
      this.scheduleObj.eventSettings.dataSource =
        this.tutorService.getPersonalAvailabilitySchedule().allAvailabilitySchedule;
    }
  }
  handleRefresh() {
    if (this.cookieService.get('userId')) {
      this.userId = this.cookieService.get('userId');
      var bookingId;
      this.httpService.getTutorDetails(this.userId).subscribe((res) => {
        bookingId = res.bookingId;
        this.httpService
          .getScheduleData(parseInt(bookingId))
          .subscribe((res) => {
            this.tutorService.setPersonalAvailabilitySchedule(res);
            this.tutorAvailabilitySchedule.fullName =
              this.tutorService.getTutorDetials().fullName;
            this.tutorAvailabilitySchedule.tid =
              this.tutorService.getTutorDetials().bookingId;
            this.tutorAvailabilitySchedule.isAvailable =
              this.tutorService.getPersonalAvailabilitySchedule().isAvailable;
            this.availabiltiySchedules =
              this.tutorService.getPersonalAvailabilitySchedule().allAvailabilitySchedule;
            this.copySchedule();
            this.copyBookings();
            // setTimeout(() => {
            // 	let scheduleObj = (document.querySelector('.e-schedule') as any).ej2_instances[0];
            // 	scheduleObj.eventSettings.dataSource = this.tutorService.getPersonalAvailabilitySchedule().allAvailabilitySchedule;
            // }, 3000);
            // this.meetingObj.eventSettings.dataSource = this.tutorService.getPersonalAvailabilitySchedule().allMeetingsSchedule;
            this.scheduleObj.eventSettings.dataSource =
              this.tutorService.getPersonalAvailabilitySchedule().allAvailabilitySchedule;
            // this.scheduleObj.eventSettings.dataSource = this.combinedSchedule;
          });
      });
    }
  }

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
      appointment.Type = 'availability';
      this.availableSchedules.push(appointment);
    }
  }

  copyBookings() {
    if (
      this.tutorService.getPersonalAvailabilitySchedule().allMeetingsSchedule
        .length != 0
    ) {
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
        appointment.Type = 'booking';
        appointment.IsReadonly = true;
        this.bookingSchedule.push(appointment);
      }
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
    appointment.Description = schedule.Description;
    appointment.Type = 'availability';
    return appointment;
  }
  checkIfSameDate(appointment:scheduleData){
    let startDateTime:Date = new Date(appointment.StartTime);
    let endDateTime:Date = new Date (appointment.EndTime);
    let diffHours:any = Math.abs(endDateTime.getTime()-startDateTime.getTime())/36e5;
    let allAppointments:scheduleData[]=[];
    // let formattedStartDate:Date = new Date(this.datePipe.transform(startDateTime,'dd/MM/yyyy'));
    let formattedStartDate:Date = new Date(this.datePipe.transform(startDateTime,'MM-dd-yyyy'));
    let formattedEndDate:Date = new Date(this.datePipe.transform(endDateTime,'MM-dd-yyyy'));
    console.log(formattedStartDate);
    let str3:string = formattedStartDate.toString()

    console.log(str3);

    console.log(formattedEndDate);
    if(formattedStartDate.getTime()==formattedEndDate.getTime()){
      allAppointments.push(appointment);
      console.log('same date');
      return allAppointments;
    }else{
      let diffInDates = 
      Math.abs(formattedEndDate.getTime()-formattedStartDate.getTime())/36e5/24;
      let arrDiffDates:Date[]=[];
      console.log(diffInDates)
      arrDiffDates.push(new Date(formattedStartDate.getTime()));
      if(diffInDates>1){
        let selectedDate = formattedStartDate;
        for(let i=2;i<=diffInDates;i++){
          selectedDate.setDate(selectedDate.getDate()+1);
          arrDiffDates.push(new Date(selectedDate.getTime()));
        }
      }
      arrDiffDates.push(new Date(formattedEndDate.getTime()))
      
      console.log('different dates are : ');
      console.log(arrDiffDates);
      let startingId=appointment.Id;
     
      for(let j=0;j<arrDiffDates.length;j++){
        let startDate:Date = new Date(arrDiffDates[j].getTime());
        let endDate:Date = new Date(arrDiffDates[j].getTime());
        let app = new scheduleData();
        app.Id=startingId;
        startingId++;
        app.Subject="My Availability";
        app.Type="availability";
        app.IsAllDay=false;
        if(j==0){
          console.log('first item')
           startDate.setHours(startDateTime.getHours());
           startDate.setMinutes(startDateTime.getMinutes());
           endDate.setHours(24);
           endDate.setMinutes(0);
           app.StartTime=startDate.toString();
           app.EndTime= endDate.toString();
        }else if(j==(arrDiffDates.length-1)){
          console.log('last item')
          startDate.setHours(0);
           startDate.setMinutes(0);
           endDate.setHours(endDateTime.getHours());
           endDate.setMinutes(endDateTime.getMinutes());
           app.StartTime=startDate.toString();
           app.EndTime= endDate.toString();
        }else if(j>0&&j<(arrDiffDates.length-1)){
          console.log('mid item')
          startDate.setHours(0);
           startDate.setMinutes(0);
           endDate.setHours(24);
           endDate.setMinutes(0);
           app.StartTime=startDate.toString();
           app.EndTime= endDate.toString();
        }
        allAppointments.push(app);
      }
      console.log(allAppointments);
      return allAppointments;
    }
  }
  // for adding events into calendar schedules
  addEvents(appointment: scheduleData) {
    console.log(appointment);
    let allAppointments:scheduleData[] = this.checkIfSameDate(appointment); 
    for(let item of allAppointments){
      this.availableSchedules.push(item);
    }
    console.log(allAppointments);
    this.tutorAvailabilitySchedule.allAvailabilitySchedule =
      this.availableSchedules;
    console.log(this.availableSchedules);
    this.isLoading=false;
      if (this.userId != null) {
        this.tutorAvailabilitySchedule.tid =
          this.tutorService.getTutorDetials().bookingId;
      }

      this.httpService
        .saveScheduleData(this.tutorAvailabilitySchedule)
        .subscribe((res) => {
          this.tutorService.personalAvailablitySchedule =
            this.tutorAvailabilitySchedule;
          this.isLoading = false;
        });
  }
  
  onPopupOpen(args) {
    if (args.type === 'Editor') {
      args.element.querySelector('.e-start').ej2_instances[0].format =
        'd/M/yy h:mm a';
      args.element.querySelector('.e-end').ej2_instances[0].format =
        'd/M/yy h:mm a';
    }
  }
  // public onPopupOpen(args: PopupOpenEventArgs): void {
  //   if (args.type == 'Editor') {
  //     (this.scheduleObj.eventWindow as any).recurrenceEditor.frequencies = [
  //       'daily',
  //       'never',
  //     ];
  //     (document.querySelector(
  //       '.e-repeat-interval'
  //     ) as any).ej2_instances[0].max = 1;
  //     let end = (document.querySelector('.e-end-on-element') as any)
  //       .ej2_instances[0];
  //     end.query = new Query().where('value', 'equal', 'never');
  //     end.setProperties(
  //       { query: new Query().where('value', 'equal', 'never') },
  //       true
  //     );
  //     end.dataBind();
  //   }
  // }

  public onEventRendered(args: any): void {
    if (args.data.Type == 'booking') {
      args.element.style.backgroundColor = '#e30084';
    } else if (args.data.Type == 'availability') {
      args.element.style.backgroundColor = '#7d0f7d';
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
    this.tutorAvailabilitySchedule.allAvailabilitySchedule =
      this.availableSchedules;
    console.log(this.availableSchedules)
 
      this.httpService
        .saveScheduleData(this.tutorAvailabilitySchedule)
        .subscribe((res) => {
          this.tutorService.personalAvailablitySchedule =
            this.tutorAvailabilitySchedule;
          this.isLoading = false;
        });
    
  }
  //for deleting events into calendar schedules
  deleteEvents(appointment: scheduleData) {
    let deleteIndex = this.availableSchedules.findIndex(
      (obj) => obj.Id == appointment.Id
    );
    this.availableSchedules.splice(deleteIndex, 1);
    this.tutorAvailabilitySchedule.allAvailabilitySchedule =
      this.availableSchedules;
    // this.isLoading = true;
  
      this.httpService
        .saveScheduleData(this.tutorAvailabilitySchedule)
        .subscribe((res) => {
          this.tutorService.personalAvailablitySchedule =
            this.tutorAvailabilitySchedule;
          this.isLoading = false;
        });
  }
  //for updating special case
  updateSpecialEvents() {
    this.tutorAvailabilitySchedule.allAvailabilitySchedule =
      this.availableSchedules;
      console.log(this.availableSchedules)
    // this.isLoading = true;
    setTimeout(() => {
      //<<<---    using ()=> syntax
      this.httpService
        .saveScheduleData(this.tutorAvailabilitySchedule)
        .subscribe((res) => {
          this.tutorService.personalAvailablitySchedule =
            this.tutorAvailabilitySchedule;
          this.isLoading = false;
        });
    }, 3000);
  }
  // on event rendered
  // onEventRendered(args: EventRenderedArgs): void {}

  onActionBegin(args: ActionEventArgs): void {
    var schedule;
    //when an event is created
    if (args.requestType === 'eventCreate') {
      schedule = args.addedRecords;
      // this.isLoading=!this.isLoading;
      this.isLoading=true;
      setTimeout(() => {
        this.addEvents(this.copyAppointment(schedule[0]));
      }, 3000);
    } else if (args.requestType === 'eventChange') {
      // when an event is changed
      schedule = args.changedRecords;
      console.log(schedule);
      // this.isLoading = !this.isLoading;
      this.isLoading=true;
      setTimeout(() => {
        if (
          schedule[0].Guid != null &&
          schedule[0].RecurrenceException != null
        ) {
          console.log('called recurrence rule exception')
          // if an recurrence exception is created
          // this.availableSchedules.splice(0, this.availableSchedules.length);
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
          console.log('called normal updation !')
          //normal updation
          this.updateEvents(this.copyAppointment(schedule[0]));
        }
      }, 3000);
    } else if (args.requestType === 'eventRemove') {
      console.log('event is removed !');
      // when an event is removed
      schedule = args.deletedRecords;
      console.log(schedule);
      
      if (schedule.length != 0) {
        this.isLoading=true;
        setTimeout(() => {
          for( let sch of schedule){
            this.deleteEvents(this.copyAppointment(sch));
          }
        }, 3000);
      } 
      // else if (schedule.length == 0) {
      //   setTimeout(() => {
      //     this.availableSchedules.splice(0, this.availableSchedules.length);
      //     for (let schedule of this.tutorService.getPersonalAvailabilitySchedule()
      //       .allAvailabilitySchedule) {
      //       var appointment = new scheduleData();
      //       appointment.Id = schedule.Id;
      //       appointment.Subject = schedule.Subject;
      //       appointment.StartTime = schedule.StartTime.toString();
      //       appointment.EndTime = schedule.EndTime.toString();
      //       appointment.IsAllDay = schedule.IsAllDay;
      //       appointment.RecurrenceRule = schedule.RecurrenceRule;
      //       appointment.RecurrenceException = schedule.RecurrenceException;
      //       appointment.Guid = schedule.Guid;
      //       appointment.RecurrenceID = schedule.RecurrenceID;
      //       this.availableSchedules.push(appointment);
      //     }
      //     this.updateSpecialEvents();
      //   }, 3000);
      // }
    }
  }
}
// -----------------------------------------------------------------------------------------------------------------------------
@Component({
  selector: 'instruction-guide',
  templateUrl: 'instruction-guide.html',
})
export class instructionGuide {
  constructor() {}
}
