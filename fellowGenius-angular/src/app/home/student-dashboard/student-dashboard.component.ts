import { Component, HostListener, OnInit } from '@angular/core';
import { HttpService } from '../../service/http.service';
import { StudentService } from '../../service/student.service';
import { bookingDetails } from 'src/app/model/bookingDetails';
import { TutorService } from 'src/app/service/tutor.service';
import { tutorProfileDetails } from 'src/app/model/tutorProfileDetails';
import { meetingDetails } from 'src/app/model/meetingDetails';
import { MeetingService } from 'src/app/service/meeting.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ProfileService } from 'src/app/service/profile.service';
import { DeletePopupComponent } from './delete-popup/delete-popup.component';
import { StarRatingComponent } from 'ng-starrating';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css'],
})
export class StudentDashboardComponent implements OnInit {
  selected = 0;
  hovered = 0;
  readonly = false;
  viewPending;
  pendingRequestsCount = 0;
  joinMeeting = new meetingDetails();
  sid: number;
  bookingList: bookingDetails[] = [];
  approvedList: bookingDetails[] = [];
  liveMeetingList: bookingDetails[] = [];
  filterSearch: tutorProfileDetails[];
  pendingReviewList: bookingDetails[] = [];
  topTutors: tutorProfileDetails[];
  emptyBookingList: boolean = false;
  emptyApprovedList: boolean = false;
  emptyLiveList: boolean = false;
  pendingReviews: tutorProfileDetails[] = [];
  public now: Date = new Date();
  noTutorMessage = '';

  constructor(
    public httpService: HttpService,
    public studentService: StudentService,
    public tutorService: TutorService,
    public meetingService: MeetingService,
    public router: Router,
    public dialog: MatDialog,
    public profileService: ProfileService,
    private snackBar: MatSnackBar
  ) {
    setInterval(() => {
      this.now = new Date();
    }, 1000);
  }

  config: MatSnackBarConfig = {
    duration: 2000,
    horizontalPosition: 'center',
    verticalPosition: 'top',
  };

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    var screenWidth = window.innerWidth;
    if (screenWidth <= 800) {
      // console.log("called");
      this.studentChartWidth = '320';
    } else {
      this.studentChartWidth = '380';
    }
  }

  ngOnInit(): void {
    if (window.innerWidth <= 800) {
      this.studentChartWidth = '320';
    }
    this.sid = this.studentService.getStudentProfileDetails().sid;
    if (this.sid) {
      this.fetchPendingReviewsList();
      this.fetchTutorList();
      this.findStudentPendingBookings();
      this.fetchApprovedMeetings();
      this.fetchLiveMeetings();
    } else {
      this.handleRefresh();
    }
  }
  cancelReview() {
    console.log('canceledReviews');
  }

  saveRating(profile: any, rating: any) {
    var meetingId = profile.meetingId;
    var review = ' ';
    var tid = profile.tutorId;
    this.httpService
      .giveFeedback(meetingId, rating, review, tid)
      .subscribe((res) => {
        this.pendingReviewList.splice(
          this.pendingReviewList.indexOf(profile),
          1
        );
        this.snackBar.open(
          'Feedback submitted successfully',
          'close',
          this.config
        );
      });
  }
  viewPendingRequests() {
    this.viewPending = !this.viewPending;
  }
  type = 'PieChart';
  data = [
    ['Mathematics', 45.0],
    ['English', 26.8],
    ['Science', 12.8],
    ['C++', 8.5],
    ['Machine Learning', 6.2],
    ['Others', 0.7],
  ];
  // columnNames = ['Subject', 'Percentage'];
  options = { pieHole: 0.4 };
  studentChartWidth = '380';
  studentChartHeight = '180';
  toggleSkillsInDemand(value) {
    this.type = value;
  }

  openRecordingsPage() {
    this.router.navigate(['home/recordings']);
  }
  refreshPage() {
    location.reload();
  }
  // -----------------------------------------------fetching all kind of meetings --------------------------------------------------------------------

  // for fetching pending review list
  fetchPendingReviewsList() {
    this.httpService.fetchPendingReviewsList(this.sid).subscribe((res) => {
      this.pendingReviewList = res;
    });
  }

  giveFeedback(profile) {
    var meetingId = profile.meetingId;
    var rating = 80;
    var review = 'You are a god teacher';
    var tid = profile.tutorId;
    this.httpService
      .giveFeedback(meetingId, rating, review, tid)
      .subscribe((res) => {});
  }
  // for fetching student pending bookings
  findStudentPendingBookings() {
    this.httpService.findStudentBookings(this.sid).subscribe((res) => {
      this.bookingList = res;
      this.meetingService.studentPendingRequests(this.bookingList);
      if (this.bookingList.length == 0) {
        this.emptyBookingList = true;
        this.pendingRequestsCount = 0;
      } else {
        this.pendingRequestsCount = this.bookingList.length;
      }
    });
  }

  //for fetching student approved meetings
  fetchApprovedMeetings() {
    this.httpService.fetchApprovedMeetings(this.sid).subscribe((res) => {
      this.approvedList = res;
      if (this.approvedList.length == 0) {
        this.emptyApprovedList = true;
      }
      for (let booking of this.approvedList) {
        this.timeLeft(booking);
        if (this.approvedList.length == 0) {
          this.emptyApprovedList = true;
        }
      }
    });
  }

  //for fetching student live meetings
  fetchLiveMeetings() {
    this.httpService.fetchLiveMeetingsStudent(this.sid).subscribe((res) => {
      this.liveMeetingList = res;
      if (this.liveMeetingList.length == 0) {
        this.emptyLiveList = true;
      }
      for (let booking of this.liveMeetingList) {
        this.eliminateLiveMeetings(booking, this.liveMeetingList);
      }
    });
  }

  // --------------------------------------------------meeting operations-----------------------------------------------------------------------------
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
            this.httpService
              .updateBookingStatus(booking.bid, 'completed')
              .subscribe((res) => {});
          }
        }
      }, 5000);
    }
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
            this.approvedList.splice(this.approvedList.indexOf(booking), 1);

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
  // -------------------------------------------------------------------------------------------------------------------------------------------------
  fetchTutorList() {
    this.httpService.getTutorList().subscribe((req) => {
      this.filterSearch = req;
      this.tutorService.tutorList = req;
    });
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
    this.meetingService.setDeleteBooking(myBooking);
    this.dialog.open(DeletePopupComponent, {
      width: '400px',
      height: '150px',
    });
    this.dialog.afterAllClosed.subscribe(() => {
      if (this.bookingList.length == 0) {
        this.emptyBookingList = true;
      }
    });
  }
  handleRefresh() {
    setTimeout(() => {
      this.sid = this.studentService.getStudentProfileDetails().sid;
      this.fetchPendingReviewsList();
      this.fetchTutorList();
      this.findStudentPendingBookings();
      this.fetchApprovedMeetings();
      this.fetchLiveMeetings();
      // this.fetchTopTutors();
    }, 1000);
  }
}
