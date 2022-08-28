import { LocationStrategy } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { bookingDetails } from 'src/app/model/bookingDetails';
import { meetingDetails } from 'src/app/model/meetingDetails';
import { HttpService } from 'src/app/service/http.service';
import { MeetingService } from 'src/app/service/meeting.service';
import { StudentService } from 'src/app/service/student.service';
import { MeetingComponent } from '../meeting/meeting.component';
import { DeletePopupComponent } from '../student-dashboard/delete-popup/delete-popup.component';

@Component({
  selector: 'app-learner-sessions',
  templateUrl: './learner-sessions.component.html',
  styleUrls: ['./learner-sessions.component.css'],
})
export class LearnerSessionsComponent implements OnInit {
  constructor(
    private httpService: HttpService,
    private router: Router,
    private studentService: StudentService,
    private snackBar:MatSnackBar,
    private dialog:MatDialog,
    private meetingService:MeetingService,
    private locationStrategy:LocationStrategy
  ) {
    setInterval(() => {
      this.now = new Date();
    }, 1000);
  }
  
  bookingList: bookingDetails[] = [];
  previousMeetings:bookingDetails[]=[];
  emptyPreviousMeetings:boolean=false;
  emptyBookingList: boolean = false;
  sid;
  upcomingMeetingsCount;
  public now: Date = new Date();
  joinMeeting = new meetingDetails();
  config: MatSnackBarConfig = {
    duration: 2000,
    horizontalPosition: 'center',
    verticalPosition: 'top',
  };

  ngOnInit(): void {
    this.sid = this.studentService.getStudentProfileDetails().sid;
    if (this.sid) {

      this.initialiseUpcomingMeetings();
      this.intialiseCompletedMeetings();
      // this.fetchTutorList();
      // this.findStudentPendingBookings();
      // this.initialiseStudentPendingRequest();
      // this.fetchApprovedMeetings();
      // this.intialiseStudentApprovedBookings();
      // this.initialiseLiveMeetingList();
      // this.fetchLiveMeetings();
    } else {
      this.handleRefresh();
    }
  }
  handleRefresh() {
    setTimeout(() => {
      this.sid = this.studentService.getStudentProfileDetails().sid;
      this.initialiseUpcomingMeetings();
      this.intialiseCompletedMeetings();
    }, 1000);
  }
  onJoin(booking: bookingDetails) {
    this.joinMeeting.role = 'student';
    this.joinMeeting.roomId = 123;
    this.joinMeeting.roomName = booking.meetingId;
    this.joinMeeting.userName = booking.studentName;
    this.joinMeeting.userId = booking.studentId;
    this.meetingService.setMeeting(this.joinMeeting);
    this.meetingService.setBooking(booking);
    this.router.navigate(['meeting']);
  }

  //delete pending request
  deleteBooking(myBooking: bookingDetails) {
    // this.meetingService.setDeleteBooking(myBooking);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose=true;
    const dialogRef = this.dialog.open(DeletePopupComponent, {
      width: '400px',
      height: '150px',
    });
    dialogRef.afterClosed().subscribe((data)=>{
      if(data.cancelled == true){
        this.httpService.fetchBookingStatus(myBooking.bid).subscribe((res:any)=>{
          console.log(res.status);
          if(res.status=='PENDING'){
        this.httpService.deleteMyBooking(myBooking.bid).subscribe((response:any) => {
        if(response.response=='booking deleted successfully'){
        	this.initialiseUpcomingMeetings();
			  	this.snackBar.open('Booking has been cancelled !', 'close', this.config);
        }else if(response.response=="booking can't be deleted"){
          this.snackBar.open("Booking can't be deleted !", 'close', this.config);
        }else if(response.response=="delete time has been exceeded"){
          this.snackBar.open('Cancelling time has been exceeded !', 'close', this.config);
        }
          // if (response) {
			
			// } else {
			// 	this.snackBar.open('Booking has already been accepted !', 'close', this.config);
			// }
		});
          }else{
            this.snackBar.open('Booking has already been accepted !', 'close', this.config);
          }
        })
      }
    })
  }
  initialiseUpcomingMeetings(){
    this.studentService.fetchUpcomingMeetings();
    this.upcomingMeetingsCount=0;
    this.studentService.upcomingMeetingsChanged.subscribe((booking:bookingDetails[])=>{
      this.bookingList=booking;
      console.log(this.bookingList);
      this.sortMeetings(this.bookingList);
      for (let booking of this.bookingList) {
        this.timeLeft(booking);
        if (this.bookingList.length == 0) {
          this.emptyBookingList = true;
        }
      }
      for (let booking of this.bookingList) {
        this.eliminateLiveMeetings(booking, this.bookingList);
      }
    })
  }
  intialiseCompletedMeetings(){
    this.studentService.fetchCompletedMeetings();
    this.studentService.completedMeetingsChanged.subscribe((booking:bookingDetails[])=>{
      this.previousMeetings=booking;
      console.log('previous meetings',this.previousMeetings)
      if (this.bookingList.length != 0) {
        this.sortMeetings(this.previousMeetings);
      }else{
        this.emptyPreviousMeetings = true;
      }
    })
  }
  sortMeetings(meetingList) {
    meetingList.sort(function (a, b) {
      // Turn your strings into dates, and then subtract them
      // to get a value that is either negative, positive, or zero.
      var aYear = a.dateOfMeeting.split("/")[2];
      var aMonth = a.dateOfMeeting.split("/")[1]-1;
      var aDate = a.dateOfMeeting.split("/")[0];
      var aHour = a.startTimeHour;
      var aMinute = a.startTimeMinute;
      // var aDateTime = new Date(aYear, aMonth, aDate, aHour, aMinute, 0, 0);
      // console.log(aDateTime);

      var bYear = b.dateOfMeeting.split("/")[2];
      var bMonth = b.dateOfMeeting.split("/")[1]-1;
      var bDate = b.dateOfMeeting.split("/")[0];
      var bHour = b.startTimeHour;
      var bMinute = b.startTimeMinute;
      // var bDateTime = new Date(bYear, bMonth, bDate, bHour, bMinute, 0, 0);
      // console.log(bDateTime);

      // console.log(bDate + "/" + bMonth + "/" + bYear + "...." + bHour + ":" + bMinute);
      // console.log("this is a");
      // console.log(a);
      // console.log("this is b");
      // console.log(b);
      // return b.dateOfMeeting - a.dateOfMeeting;
      return new Date(aYear, aMonth, aDate, aHour, aMinute, 0, 0).valueOf() - new Date(bYear, bMonth, bDate, bHour, bMinute, 0, 0).valueOf();

    });
  }
  eliminateLiveMeetings(booking: bookingDetails, list: bookingDetails[]) {
    var currentDate: string = new Date(Date.now()).toLocaleDateString('en-GB');
    if (currentDate == booking.dateOfMeeting) {
      var endMinutes: number = booking.endTimeHour * 60 + booking.endTimeMinute;
      var currentMinutes = this.now.getHours() * 60 + this.now.getMinutes();
      var differenceMinutes: number = endMinutes - currentMinutes;
      if (differenceMinutes <= 0) {
        if (list.indexOf(booking) != -1) {
          list.splice(list.indexOf(booking), 1);
        }
      }
      setInterval(() => {
        currentMinutes = this.now.getHours() * 60 + this.now.getMinutes();
        differenceMinutes = endMinutes - currentMinutes;
        if (differenceMinutes <= 0) {
          if (list.indexOf(booking) != -1) {
            list.splice(list.indexOf(booking), 1);
          }
        }
      }, 5000);
    }
  }
  connectAgain(id,domain){
    this.router.navigate(["view-tutors"], {
      queryParams: { page: id,subject:domain },
    });
  }
  //to calculate the time left
  timeLeft(booking: bookingDetails) {
    var currDate = new Date();
    var currentDate: string = new Date(Date.now()).toLocaleDateString('en-GB');
    if (currentDate == booking.dateOfMeeting) {
      var startMinutes: number =
        booking.startTimeHour * 60 + booking.startTimeMinute;
      var bookingDuration: number = booking.duration + 10;
      var timeLeftString: string;
      var currentMinutes = this.now.getHours() * 60 + this.now.getMinutes();
      var differenceMinutes: number = startMinutes - currentMinutes;
      var timeLeftHours: number = Math.trunc(differenceMinutes / 60);
      var timeLeftMinutes: number = differenceMinutes % 60;
      if (differenceMinutes > 0) {
        if (timeLeftHours == 0) {
          timeLeftString = timeLeftMinutes + ' minutes';
        } else {
          if (timeLeftMinutes != 0) {
            timeLeftString =
              timeLeftHours + ' hours ' + timeLeftMinutes + ' minutes ';
          } else if (timeLeftMinutes == 0) {
            timeLeftString = timeLeftHours + ' hours ';
          }
        }
        booking.timeLeft = timeLeftString;
      }
      setInterval(() => {
        currentMinutes = this.now.getHours() * 60 + this.now.getMinutes();
        differenceMinutes = startMinutes - currentMinutes;
        timeLeftHours = Math.trunc(differenceMinutes / 60);
        timeLeftMinutes = differenceMinutes % 60;
        if (differenceMinutes > 0) {
          if (timeLeftHours == 0) {
            timeLeftString = timeLeftMinutes + ' minutes ';
          } else {
            if (timeLeftMinutes != 0) {
              timeLeftString =
                timeLeftHours + ' hours ' + timeLeftMinutes + ' minutes';
            } else if (timeLeftMinutes == 0) {
              timeLeftString = timeLeftHours + ' hours';
            }
          }
          booking.timeLeft = timeLeftString;
        } else if (differenceMinutes <= 0) {
          booking.timeLeft = null;
          if (Math.abs(differenceMinutes) > bookingDuration) {
            this.bookingList.splice(this.bookingList.indexOf(booking), 1);

            this.httpService
              .updateBookingStatus(booking.bid, 'completed unattended')
              .subscribe((res) => {});
          }
        }
      }, 5000);
    } else {
      var hoursLeft: number = 0;
      var minutesLeft: number = 0;
      var daysLeft: number = 0;
      var timeLeftString: string;
      var dateParts: any = booking.dateOfMeeting.split('/');
      var bookingDate = new Date(
        +dateParts[2],
        dateParts[1] - 1,
        +dateParts[0]
      );
      var startMinutes: number =
        booking.startTimeHour * 60 + booking.startTimeMinute;
      if (bookingDate.getTime() > currDate.getTime()) {
        var differenceTimeMinutes = Math.trunc(
          (bookingDate.getTime() - currDate.getTime()) / (1000 * 60)
        );
        var daysLeft = Math.trunc(differenceTimeMinutes / (60 * 24));
        if (daysLeft < 1) {
          hoursLeft = Math.trunc(differenceTimeMinutes / 60);
          minutesLeft = differenceTimeMinutes % 60;
        } else {
          var todayMinutesLeft = differenceTimeMinutes % (24 * 60);
          hoursLeft = Math.trunc(todayMinutesLeft / 60);
          minutesLeft = todayMinutesLeft % 60;
        }
        hoursLeft = hoursLeft + Math.trunc(startMinutes / 60);
        minutesLeft = minutesLeft + Math.trunc(startMinutes % 60);
        if (minutesLeft > 60) {
          hoursLeft += minutesLeft / 60;
          minutesLeft = minutesLeft % 60;
        }
        if (hoursLeft > 24) {
          daysLeft += hoursLeft / 24;
          hoursLeft = hoursLeft % 24;
        }
        if (daysLeft == 0) {
          timeLeftString =
            Math.trunc(hoursLeft) +
            ' hours ' +
            Math.trunc(minutesLeft) +
            ' minutes';
        } else {
          timeLeftString =
            Math.trunc(daysLeft) +
            ' days ' +
            Math.trunc(hoursLeft) +
            ' hours ' +
            Math.trunc(minutesLeft) +
            ' minutes';
        }
        booking.timeLeft = timeLeftString;
      }

      setInterval(() => {
        currDate = new Date();
        var differenceTimeMinutes = Math.trunc(
          (bookingDate.getTime() - currDate.getTime()) / (1000 * 60)
        );
        var daysLeft = Math.trunc(differenceTimeMinutes / (60 * 24));
        if (daysLeft < 1) {
          hoursLeft = Math.trunc(differenceTimeMinutes / 60);
          minutesLeft = differenceTimeMinutes % 60;
        } else {
          var todayMinutesLeft = differenceTimeMinutes % (24 * 60);
          hoursLeft = Math.trunc(todayMinutesLeft / 60);
          minutesLeft = todayMinutesLeft % 60;
        }
        hoursLeft = hoursLeft + Math.trunc(startMinutes / 60);
        minutesLeft = minutesLeft + Math.trunc(startMinutes % 60);
        if (minutesLeft > 60) {
          hoursLeft += minutesLeft / 60;
          minutesLeft = minutesLeft % 60;
        }
        if (hoursLeft > 24) {
          daysLeft += hoursLeft / 24;
          hoursLeft = hoursLeft % 24;
        }
        if (daysLeft == 0) {
          timeLeftString =
            Math.trunc(hoursLeft) +
            ' hours ' +
            Math.trunc(minutesLeft) +
            ' minutes';
        } else {
          timeLeftString =
            Math.trunc(daysLeft) +
            ' days ' +
            Math.trunc(hoursLeft) +
            ' hours ' +
            Math.trunc(minutesLeft) +
            ' minutes';
        }
        booking.timeLeft = timeLeftString;
      }, 5000);
    }
  }
}
