import { Component, OnInit } from '@angular/core';
import { Event } from 'src/app/model/Event';
import { HttpService } from 'src/app/service/http.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import * as moment from 'moment';
import { LoginDetailsService } from 'src/app/service/login-details.service';
import { CookieService } from 'ngx-cookie-service';
import { tutorProfileDetails } from 'src/app/model/tutorProfileDetails';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit {

  constructor(private httpService: HttpService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private snackBar:MatSnackBar,
    private loginService:LoginDetailsService,
    private cookieService: CookieService) { }


    config: MatSnackBarConfig = {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['snackbar'],
    };

    eventId: any;
    event=new Event();
    date: string;
    time: string;
    isBooked: boolean=false;
    expertProfilePictureUrl='../../../assets/images/default-user-image.png';
    expertName='';
    expertDescription='';
    expertBookingId='';
    expertDomain='';
    eventStartDate: any;

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.eventId= params['eventId'];
      this.httpService.getEvent(this.eventId).subscribe((res)=>{
      this.event=res;
      this.expertBookingId=this.event.hostUserId;
      this.expertDomain=this.event.eventDomain;
      
        
      this.eventStartDate= this.setDateTime(this.event.eventStartTime)
        
      this.httpService.fetchBookingTutorProfileDetails(this.event.hostUserId).subscribe((res)=>{
          
          this.expertName=res.fullName;
          this.expertDescription=res.description;
          this.expertProfilePictureUrl=res.profilePictureUrl;
          this.checkUserForTheEvent();
        })
      })
      
    });
  }

  setDateTime(dateTime) {
    const [date, time] = dateTime.split(" ");
    const [DD, MM, YYYY] = date.split("/");
    const [h, m, s] = time.split(":");
    return new Date(YYYY, MM - 1, DD, h, m, s);
  }

  viewProfile() {
    this.router.navigate(['view-tutors'], {
      queryParams: { page: this.event.hostUserId, subject: this.expertDomain,eventId: this.eventId },
    });
  }
  checkUserForTheEvent(){
    if(this.loginService.getLoginType()=='Learner'){
      var userId=this.getUserId();

      //check if this user id is already booked for event
      this.httpService.checkUserForEvent(userId,this.eventId).subscribe((res)=>{
        if(res){
          this.isBooked=true;
        }else{
          this.isBooked=false;
        }
      })
    }
  }
  saveUserToEvent(){
    

    if(this.loginService.getLoginType()=='Learner'){
     var userId=this.getUserId();

     this.httpService.addUserToEvent(userId,this.eventId).subscribe((res)=>{

      if(res){
        this.isBooked=true;
        this.snackBar.open(`Webinar booked Successfully!` ,
        'close',
        this.config)
      }
     })
    }else{

      this.router.navigate(['sign-up'], {
        queryParams: { eventId: this.eventId},
      })

    }
  }

  getUserId() {
    return this.cookieService.get('userId');
  }


}

