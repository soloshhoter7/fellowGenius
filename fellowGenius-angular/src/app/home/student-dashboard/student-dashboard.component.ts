import { Component, HostListener, OnInit } from '@angular/core';
import { HttpService } from '../../service/http.service';
import { StudentService } from '../../service/student.service';
import { bookingDetails } from 'src/app/model/bookingDetails';
import { TutorService } from 'src/app/service/tutor.service';
import { tutorProfileDetails } from 'src/app/model/tutorProfileDetails';
import { meetingDetails } from 'src/app/model/meetingDetails';
import { MeetingService } from 'src/app/service/meeting.service';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ProfileService } from 'src/app/service/profile.service';
import { DeletePopupComponent } from './delete-popup/delete-popup.component';
//import { StarRatingComponent } from 'ng-starrating';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { LocationStrategy } from '@angular/common';
import { ThrowStmt } from '@angular/compiler';
import { C } from '@angular/cdk/keycodes';
import { WindowRefService } from 'src/app/service/window-ref.service';

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css'],
})
export class StudentDashboardComponent implements OnInit {
  selected = 0;
  hovered = 0;
  readonly = false;
  viewPending = true;
  pendingRequestsCount = 0;
  joinMeeting = new meetingDetails();
  sid: number;
  bookingList: bookingDetails[] = [];
  previousMeetings: bookingDetails[] = [];
  approvedList: bookingDetails[] = [];
  liveMeetingList: bookingDetails[] = [];
  filterSearch: tutorProfileDetails[];
  pendingReviewList: bookingDetails[] = [];
  topTutors: tutorProfileDetails[];
  emptyBookingList: boolean = false;
  emptyApprovedList: boolean = false;
  emptyLiveList: boolean = false;
  emptyPreviousMeetings: boolean = false;
  pendingReviews: tutorProfileDetails[] = [];
  public now: Date = new Date();
  noTutorMessage = '';
  upcomingMeetingsCount;
  selectedCompletedMeeting = new bookingDetails();
  selectedUpcomingMeeting = new bookingDetails();
  constructor(
    public httpService: HttpService,
    public studentService: StudentService,
    public tutorService: TutorService,
    public meetingService: MeetingService,
    public router: Router,
    public dialog: MatDialog,
    public profileService: ProfileService,
    private snackBar: MatSnackBar,
    private locationStrategy: LocationStrategy
  ) {
    setInterval(() => {
      this.now = new Date();
    }, 1000);
  }

  config: MatSnackBarConfig = {
    duration: 5000,
    horizontalPosition: 'center',
    verticalPosition: 'top',
  };

  ngOnInit(): void {
    window.scroll(0, 0);
    this.preventBackButton();
    if (window.innerWidth <= 800) {
      this.studentChartWidth = '320';
    }
    this.sid = this.studentService.getStudentProfileDetails().sid;
    if (this.sid) {
      this.fetchPendingReviewsList();
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
  toBookingsPage() {
    this.router.navigate(['home/student-bookings']);
  }

  setSelectedUpcomingMeeting(booking: bookingDetails) {
    this.selectedUpcomingMeeting = booking;
  }
  setSelectedCompletedMeeting(booking: bookingDetails) {
    this.selectedCompletedMeeting = booking;
  }
  preventBackButton() {
    history.pushState(null, null, location.href);
    this.locationStrategy.onPopState(() => {
      history.pushState(null, null, location.href);
    });
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
  handleRefresh() {
    setTimeout(() => {
      this.sid = this.studentService.getStudentProfileDetails().sid;
      this.fetchPendingReviewsList();
      // this.fetchTutorList();
      // this.findStudentPendingBookings();
      this.initialiseUpcomingMeetings();
      this.intialiseCompletedMeetings();
      // this.initialiseStudentPendingRequest();
      // this.fetchApprovedMeetings();
      // this.intialiseStudentApprovedBookings();
      // this.fetchLiveMeetings();
      // this.initialiseLiveMeetingList();
      // this.fetchTopTutors();
    }, 1000);
  }
  connectAgain(id, domain) {
    if (this.selectedCompletedMeeting) {
      document.getElementById('closePopUpButton').click();
    }
    this.router.navigate(['view-tutors'], {
      queryParams: { page: id, subject: domain },
    });
  }
  initialiseUpcomingMeetings() {
    this.studentService.fetchUpcomingMeetings();
    this.upcomingMeetingsCount = 0;
    this.studentService.upcomingMeetingsChanged.subscribe(
      (booking: bookingDetails[]) => {
        this.bookingList = booking;
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
      }
    );
  }
  intialiseCompletedMeetings() {
    this.studentService.fetchCompletedMeetings();
    this.studentService.completedMeetingsChanged.subscribe(
      (booking: bookingDetails[]) => {
        this.previousMeetings = booking;
        if (this.bookingList.length != 0) {
          this.sortMeetings(this.previousMeetings);
        } else {
          this.emptyPreviousMeetings = true;
        }
      }
    );
  }
  initialiseStudentPendingRequest() {
    this.studentService.fetchStudentPendingBookings();
    this.pendingRequestsCount = 0;
    this.studentService.bookingsChanged.subscribe(
      (booking: bookingDetails[]) => {
        this.bookingList = booking;
        if (this.bookingList.length == 0) {
          this.emptyBookingList = true;
          this.pendingRequestsCount = 0;
        } else {
          this.pendingRequestsCount = this.bookingList.length;
        }
      }
    );
  }

  intialiseStudentApprovedBookings() {
    this.studentService.fetchApprovedStudentMeetings();
    this.studentService.approvedBookingsChanged.subscribe(
      (booking: bookingDetails[]) => {
        this.approvedList = booking;
        this.sortMeetings(this.approvedList);

        if (this.approvedList.length == 0) {
          this.emptyApprovedList = true;
        }
        for (let booking of this.approvedList) {
          this.timeLeft(booking);
          if (this.approvedList.length == 0) {
            this.emptyApprovedList = true;
          }
        }
      }
    );
  }
  initialiseLiveMeetingList() {
    this.studentService.fetchLiveMeetings();
    this.studentService.liveMeetingsChanged.subscribe(
      (booking: bookingDetails[]) => {
        this.liveMeetingList = booking;
        if (this.liveMeetingList.length == 0) {
          this.emptyLiveList = true;
        }
        for (let booking of this.liveMeetingList) {
          this.eliminateLiveMeetings(booking, this.liveMeetingList);
        }
      }
    );
  }
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

  sortMeetings(meetingList) {
    meetingList.sort(function (a, b) {
      // Turn your strings into dates, and then subtract them
      // to get a value that is either negative, positive, or zero.
      var aYear = a.dateOfMeeting.split('/')[2];
      var aMonth = a.dateOfMeeting.split('/')[1] - 1;
      var aDate = a.dateOfMeeting.split('/')[0];
      var aHour = a.startTimeHour;
      var aMinute = a.startTimeMinute;

      var bYear = b.dateOfMeeting.split('/')[2];
      var bMonth = b.dateOfMeeting.split('/')[1] - 1;
      var bDate = b.dateOfMeeting.split('/')[0];
      var bHour = b.startTimeHour;
      var bMinute = b.startTimeMinute;

      return (
        new Date(aYear, aMonth, aDate, aHour, aMinute, 0, 0).valueOf() -
        new Date(bYear, bMonth, bDate, bHour, bMinute, 0, 0).valueOf()
      );
    });
  }
  //for fetching student live meetings
  // fetchLiveMeetings() {
  //   this.httpService.fetchLiveMeetingsStudent(this.sid).subscribe((res) => {
  //     this.liveMeetingList = res;
  //     if (this.liveMeetingList.length == 0) {
  //       this.emptyLiveList = true;
  //     }
  //     for (let booking of this.liveMeetingList) {
  //       this.eliminateLiveMeetings(booking, this.liveMeetingList);
  //     }
  //   });
  // }

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
            this.bookingList.splice(this.bookingList.indexOf(booking), 1);

            // this.httpService
            //   .updateBookingStatus(booking.bid, 'completed unattended')
            //   .subscribe((res) => {});
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
  // fetchTutorList() {
  //   this.httpService.getTutorList().subscribe((req) => {
  //     this.filterSearch = req;
  //     this.tutorService.tutorList = req;
  //   });
  // }
  onJoin(booking: bookingDetails) {
    if (this.selectedCompletedMeeting) {
      document.getElementById('closePopUpButton').click();
    }
    this.joinMeeting.role = 'student';
    this.joinMeeting.roomId = 123;
    this.joinMeeting.roomName = booking.meetingId;
    this.joinMeeting.userName = booking.studentName;
    this.joinMeeting.userId = booking.studentId;
    this.meetingService.setMeeting(this.joinMeeting);
    this.meetingService.setBooking(booking);
    this.router.navigate(['meeting', booking.meetingId]);
  }

  //delete pending request
  deleteBooking(myBooking: bookingDetails) {
    // this.meetingService.setDeleteBooking(myBooking);
    if (this.selectedCompletedMeeting) {
      document.getElementById('closePopUpButton').click();
    }
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    const dialogRef = this.dialog.open(DeletePopupComponent);
    dialogRef.afterClosed().subscribe((data) => {
      if (data.cancelled == true) {
        this.httpService
          .fetchBookingStatus(myBooking.bid)
          .subscribe((res: any) => {
            console.log(res.status);
            if (res.status == 'Pending' || res.status == 'Accepted') {
              this.httpService
                .deleteMyBooking(myBooking.bid)
                .subscribe((response: any) => {
                  if (response.response == 'booking deleted successfully') {
                    this.initialiseUpcomingMeetings();
                    this.snackBar.open(
                      'Booking has been cancelled !',
                      'close',
                      this.config
                    );
                  } else if (response.response == "booking can't be deleted") {
                    this.snackBar.open(
                      "Booking can't be deleted !",
                      'close',
                      this.config
                    );
                  } else if (
                    response.response == 'delete time has been exceeded'
                  ) {
                    this.snackBar.open(
                      'Meeting Cancellation time exceeded',
                      'close',
                      this.config
                    );
                  }
                });
            } else {
              this.snackBar.open(
                'Booking has already been accepted !',
                'close',
                this.config
              );
            }
          });
      }
    });
  }
}
