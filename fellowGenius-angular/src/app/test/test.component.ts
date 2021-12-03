
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute} from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { filtersApplied } from '../model/filtersApplied';
import { tutorProfileDetails } from '../model/tutorProfileDetails';
import { FiltersDialogComponent } from '../search-results/filters-dialog/filters-dialog.component';
import { ProfileService } from '../service/profile.service';
import {
  Component,
  OnInit,
  Pipe,
  PipeTransform,
  ViewChild,
  ElementRef,
  Input,
  Sanitizer,
  ViewChildren,
  HostListener,
} from '@angular/core';
import {
  DomSanitizer,
  SafeHtml,
  SafeUrl,
  SafeStyle,
} from '@angular/platform-browser';
import * as Stomp from 'stompjs';
import { fromEvent } from 'rxjs';
import { switchMap, takeUntil, pairwise } from 'rxjs/operators';
import {
  NgxAgoraService,
  Stream,
  AgoraClient,
  ClientEvent,
  StreamEvent,
  LocalStreamStats,
  RemoteStreamStats,
  StreamStats,
} from 'ngx-agora';
import * as SockJS from 'sockjs-client';
import { timer, Subscription,interval } from 'rxjs';
import { MeetingService } from 'src/app/service/meeting.service';
import { meetingDetails } from 'src/app/model/meetingDetails';
import { Router } from '@angular/router';
import { bookingDetails } from 'src/app/model/bookingDetails';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarConfig } from '@angular/material/snack-bar';
import { MessageModel } from 'src/app/model/message';
import { WebSocketService } from 'src/app/service/web-socket.service';
import { DataSource } from '@angular/cdk/collections';
import { LocationStrategy } from '@angular/common';
import { LoginDetailsService } from 'src/app/service/login-details.service';
import { HttpService } from 'src/app/service/http.service';
import { CookieService } from 'ngx-cookie-service';
import * as jwt_decode from 'jwt-decode';
import { environment } from 'src/environments/environment';
const numbers = timer(3000, 1000);
@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css'],
})
export class TestComponent implements OnInit {
  constructor(

  ) {
   
  }

  
  onDigitInput(event){

    let element;
    if (event.code !== 'Backspace')
         element = event.srcElement.nextElementSibling;
 
     if (event.code === 'Backspace')
         element = event.srcElement.previousElementSibling;
 
     if(element == null)
         return;
     else
         element.focus();
 }

 private subscription: Subscription;
  
 public dateNow = new Date();
 public dDay = new Date('Jan 01 2021 00:00:00');
 milliSecondsInASecond = 1000;
 hoursInADay = 24;
 minutesInAnHour = 60;
 SecondsInAMinute  = 60;

 public timeDifference;
 public secondsToDday;
 public minutesToDday;
 public hoursToDday;
 public daysToDday;


 private getTimeDifference () {
     this.timeDifference = this.dDay.getTime() - new  Date().getTime();
     this.allocateTimeUnits(this.timeDifference);
     console.log(Math.floor(this.timeDifference/1000));
 }

private allocateTimeUnits (timeDifference) {
     this.secondsToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond) % this.SecondsInAMinute);
     this.minutesToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour) % this.SecondsInAMinute);
     this.hoursToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute) % this.hoursInADay);
     this.daysToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute * this.hoursInADay));
}

 ngOnInit() {
    this.subscription = interval(1000)
        .subscribe(x => { this.getTimeDifference(); });
 }

ngOnDestroy() {
   this.subscription.unsubscribe();
}

}
