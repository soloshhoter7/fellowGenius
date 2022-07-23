import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Event } from 'src/app/model/Event';
import { tutorProfileDetails } from 'src/app/model/tutorProfileDetails';
import { AdminService } from 'src/app/service/admin.service';
import { HttpService } from 'src/app/service/http.service';
import moment from 'moment';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-events',
  templateUrl: './admin-events.component.html',
  styleUrls: ['./admin-events.component.css']
})
export class AdminEventsComponent implements OnInit {

  event:Event={
    eventId: '',
    eventType: 'WEBINAR',
    eventStartTime: '',
    eventEndTime: '',
    eventTitle: '',
    eventDescription: '',
    eventLink: '',
    eventPassword: '',
    eventVenue: 'ONLINE',
    eventStatus: 'UPCOMING',
    bannerUrl: '',
    hostUserId:'',
    eventDomain:''
  };

  expertsList: tutorProfileDetails[];

  topicsList: string[];
  constructor(private httpService: HttpService,private adminService: AdminService,
    private snackbar: MatSnackBar) { }

    config: MatSnackBarConfig = {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['snackbar'],
    };

  ngOnInit(): void {
    this.expertsList=this.adminService.getExpertsList();
    
  }

  changeTopics(expertName: any){
    this.topicsList=[]; //empty the topics list
    
    var expertises=this.expertsList.find((expert)=> expert.fullName===expertName)
    .areaOfExpertise;
    for(let i=0;i<expertises.length;i++){
      this.topicsList.push(expertises[i].category);
    }
  }

  onCreateEvent(form: NgForm){
    
    
    this.event.eventTitle=form.value.eventTitle;
    this.event.eventDescription=form.value.eventDescription;
    this.event.eventStartTime=moment(form.value.eventStartTime).local()
    .format("DD/MM/YYYY HH:MM:SS");
    this.event.eventEndTime=moment(form.value.eventEndTime).local()
    .format("DD/MM/YYYY HH:MM:SS");
    this.event.eventLink=form.value.eventLink;
    this.event.eventPassword=form.value.eventPassword;
    
    var index=this.expertsList.findIndex((expert)=>expert.fullName===form.value.eventHost);
    
    this.event.hostUserId=this.expertsList[index].tid.toString();
    this.event.eventDomain=form.value.eventDomain;
    

    this.httpService.saveEvents(this.event).subscribe(
      (res)=>{
       
        this.snackbar.open('Event created successfully','close',this.config);
      }

    
    )
    
  }
}
