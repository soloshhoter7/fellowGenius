import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Event } from 'src/app/model/Event';
import { HttpService } from 'src/app/service/http.service';

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
    bannerUrl: ''
  };
  constructor(private httpService: HttpService) { }

  ngOnInit(): void {

  }

  onCreateEvent(form: NgForm){
    console.log(form);
    console.log(form.value.eventTitle);
    
    this.event.eventTitle=form.value.eventTitle;
    this.event.eventDescription=form.value.eventDescription;
    this.event.eventStartTime=form.value.eventStartTime;
    this.event.eventEndTime=form.value.eventEndTime;
    this.event.eventLink=form.value.eventLink;
    this.event.eventPassword=form.value.eventPassword;

    console.log(this.event);

    this.httpService.saveEvents(this.event).subscribe(
      (res)=>{
        console.log(res);
        console.log('Event saved successfully');
        
      }
    )
    
  }
}
