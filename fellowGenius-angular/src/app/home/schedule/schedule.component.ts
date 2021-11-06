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
import { stringify } from 'querystring';
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
            console.log(this.tutorService.getPersonalAvailabilitySchedule().allAvailabilitySchedule);
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
      appointment.RecurrenceID = schedule.RecurrenceID;
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
        appointment.RecurrenceID = schedule.RecurrenceID;
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
    appointment.RecurrenceID = schedule.RecurrenceID;
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
        app.IsAllDay = appointment.IsAllDay;
        app.RecurrenceRule = appointment.RecurrenceRule;
        app.RecurrenceException = appointment.RecurrenceException;
        app.RecurrenceID = appointment.RecurrenceID;
        app.Guid = appointment.Guid;
        allAppointments.push(app);
      }
      console.log(allAppointments);
      return allAppointments;
    }
  }
  // for adding events into calendar schedules
  addEvents(appointment: scheduleData) {
    console.log(appointment);
    // let allAppointments:scheduleData[] = this.checkIfSameDate(appointment); 
    
      this.availableSchedules.push(appointment);
    
    // console.log(allAppointments);
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
  deleteEvents(appointment: scheduleData[],mode:string) {
    
    let index = this.availableSchedules.findIndex(
      (obj) => obj.Id == appointment[0].Id
    );
    if(mode=='whole'){
      this.availableSchedules.splice(index, 1);
    }else if(mode == 'recurrenceEvent'){
      let parentIndex; 
      console.log('deleting recurrent event !')
      console.log(appointment);
      if(appointment.length==2){
        this.availableSchedules.splice(index,1);
        parentIndex = this.availableSchedules.findIndex(
          (obj) => obj.Id == appointment[1].Id
        );
        if(parentIndex!=-1){
          this.availableSchedules[parentIndex]=appointment[1];
        }
        
      }else if(appointment.length==1){
        this.availableSchedules[index]=appointment[0];
      }
    }
    console.log(this.availableSchedules)
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
  updateSpecialEvents(parentSchedule,occurrenceSchedule) {
    console.log(this.availableSchedules);
    let parentAppointment:scheduleData = this.copyAppointment(parentSchedule);
    let occurrenceAppointment:scheduleData = this.copyAppointment(occurrenceSchedule);
    //updating the parent schedule
    let parentIndex = this.availableSchedules.findIndex(
      (obj) => obj.Id == parentAppointment.Id
    );
    if (parentIndex == -1) {
      this.availableSchedules.push(parentAppointment);
    } else {
      this.availableSchedules[parentIndex] = parentAppointment;
    }
    
    // adding the occurrence schedule
    let occurrenceIndex = this.availableSchedules.findIndex(
      (obj) => obj.Id == occurrenceAppointment.Id
    );
    if(occurrenceIndex==-1){
      this.availableSchedules.push(occurrenceAppointment);
    }else{
      this.availableSchedules[occurrenceIndex] = occurrenceAppointment;
    }


    this.tutorAvailabilitySchedule.allAvailabilitySchedule =
    this.availableSchedules;
    console.log(this.availableSchedules);
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

  onPopupOpen(args) {
    if (args.type === 'Editor') {

      args.element.querySelector('.e-start').ej2_instances[0].format =
        'd/M/yy h:mm a';
      args.element.querySelector('.e-end').ej2_instances[0].format =
        'd/M/yy h:mm a';

      (<any>this.scheduleObj.eventWindow).recurrenceEditor.frequencies = [
        'none',
        'daily',
        'weekly',
      ];
    }
  }

  onEventRendered(args: any): void {
    if (args.data.Type == 'booking') {
      args.element.style.backgroundColor = '#e30084';
    } else if (args.data.Type == 'availability') {
      args.element.style.backgroundColor = '#7d0f7d';
    }
  }

  onActionBegin(args: ActionEventArgs): void {
    var schedule;
    //when an event is created
    if (args.requestType === 'eventCreate') {
      console.log(this.availableSchedules)
      schedule = args.addedRecords;
      // this.isLoading=!this.isLoading;
      this.isLoading=true;
      setTimeout(() => {
        this.addEvents(this.copyAppointment(schedule[0]));
      }, 3000);
    } else if (args.requestType === 'eventChange') {
      console.log(this.availableSchedules);
      // when an event is changed
      schedule=args.data;
      this.isLoading=true;
      console.log(this.availableSchedules);
      setTimeout(() => {
        if(schedule.occurrence!=null&&schedule.parent!=null){
          console.log('recurrence exception !')
          console.log(schedule.occurrence);
          console.log(schedule.parent)
          this.updateSpecialEvents(schedule.parent,schedule.occurrence);
        }else if(schedule!=null&&schedule.occurrence==null&&schedule.parent==null){
            //normal updation
          schedule=args.changedRecords;
          console.log('called normal updation !')
          this.updateEvents(this.copyAppointment(schedule[0]));
        }
      }, 3000);
    } else if (args.requestType === 'eventRemove') {
      console.log('event is removed !');
      let mode:string='whole'
      // when an event is removed
      schedule = args.deletedRecords;
      console.log(schedule);
      console.log(args.data);
      this.isLoading=true;
      setTimeout(() => {
        if(args.deletedRecords.length==0&&args.data[0].parent!=null){
          if(args.data[0].occurrence!=null){
            schedule.push(this.copyAppointment(args.data[0].occurrence))
          }
          if(args.data[0].parent!=null){
            schedule.push(this.copyAppointment(args.data[0].parent))
          }  
          mode='recurrenceEvent';
          console.log('deleting a recurrence event',schedule)
          this.deleteEvents(schedule,mode);
        }else{
          schedule.push(this.copyAppointment(args.data[0]));
          this.deleteEvents(schedule,mode);
        }  
      }, 3000);
      
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
