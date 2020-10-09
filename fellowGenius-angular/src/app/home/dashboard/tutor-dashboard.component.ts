import { Component, HostListener, OnInit } from '@angular/core';
import { extend, Internationalization, L10n } from '@syncfusion/ej2-base';
import { tutorProfileDetails } from '../../model/tutorProfileDetails';
import { bookingDetails } from 'src/app/model/bookingDetails';
import { HttpService } from 'src/app/service/http.service';
import { TutorService } from 'src/app/service/tutor.service';
import { meetingDetails } from '../../model/meetingDetails';
import { MeetingService } from 'src/app/service/meeting.service';
import { Router } from '@angular/router';
import { stringify } from 'querystring';
import { LoginDetailsService } from 'src/app/service/login-details.service';
import { LocationStrategy } from '@angular/common';
L10n.load({
  'en-US': {
    schedule: {
      addTitle: 'My Availability',
    },
  },
});
@Component({
  selector: 'app-tutor-dashboard',
  templateUrl: './tutor-dashboard.component.html',
  styleUrls: ['./tutor-dashboard.component.css'],
})
export class TutorDashboardComponent implements OnInit {
  public now: Date = new Date();
  constructor(
    public httpService: HttpService,
    public tutorService: TutorService,
    public meetingService: MeetingService,
    public router: Router,
    public loginService: LoginDetailsService,
    private locationStrategy: LocationStrategy
  ) {
    setInterval(() => {
      this.now = new Date();
    }, 1000);
  }
  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    var screenHeight = window.innerHeight;
    var screenWidth = window.innerWidth;
    if (screenWidth <= 800) {
      this.tutorChartWidth = '320';
    } else {
      this.tutorChartWidth = '380';
    }
  }

  tutorChartWidth = '380';
  tutorChartHeight = '180';
  // ----------------------skills in demand ------------------------------
  skillsChartType = 'PieChart';
  // skillsChartType = 'Table';
  skillsData = [
    ['Mathematics', 45.0],
    ['English', 26.8],
    ['Science', 12.8],
    ['C++', 8.5],
    ['Machine Learning', 6.2],
    ['Others', 0.7],
  ];
  // skillsColumnName = ["Subject", "Percentage"];
  skillsOptions = { pieHole: 0.4 };
  toggleSkillsInDemand(value) {
    this.skillsChartType = value;
  }
  // --------------------------Earnings Tracker --------------------------
  earningTrackerType = 'ComboChart';
  earningPeriod = 'Week';
  earningTrackerData = [
    ['June', 150, 150],
    ['July', 200, 200],
    ['August', 300, 300],
    ['September', 250, 250],
  ];
  // earningTrackerColumnNames = ["Earnings", "Average"];
  earningTrackerOptions = {
    hAxis: {
      title: 'Months',
    },
    vAxis: {
      title: 'Earning (USD $)',
    },
    seriesType: 'bars',
    series: { 1: { type: 'line' } },
  };
  toggleEarningPeriod(value) {
    this.earningPeriod = value;
  }
  // ---------------------------------------------------------------------
  takeAction;
  pendingRequestsCount = 0;
  showCard: boolean = true;
  bookingRequestMessage = '';
  approvedMeetingsMessage = '';
  liveMeetingsMessage = '';
  isLoading: boolean = false;
  bookingList: bookingDetails[] = [];
  meetingList: bookingDetails[] = [];
  liveMeetingList: bookingDetails[] = [];
  hostMeeting = new meetingDetails();
  tutorProfileDetails: tutorProfileDetails;
  completeProfile = true;
  condition;
  profilePictureUrl = '../../../assets/images/default-user-image.png';
  recentReviewsList: bookingDetails[] = [];
  ngOnInit(): void {
    this.preventBackButton();
    if (window.innerWidth <= 800) {
      this.tutorChartWidth = '320';
    }
    this.tutorProfileDetails = this.tutorService.getTutorProfileDetails();
    if (
      this.loginService.getLoginType() == 'Expert' &&
      this.tutorProfileDetails.tid
    ) {
      this.fetchTutorPendingBookings();
      this.fetchTutorApprovedMeetings();
      this.fetchTutorLiveMeetings();
      this.fetchExpertRecentReviews();
    } else {
      this.handleRefresh();
    }
  }
  viewPendingRequests() {
    this.takeAction = !this.takeAction;
  }
  closeCompleteProfile() {
    this.completeProfile = false;
    this.showCard = false;
  }
  handleRefresh() {
    setTimeout(() => {
      this.tutorProfileDetails = this.tutorService.getTutorProfileDetails();
      this.loginService.setLoginType('Expert');
      this.fetchTutorPendingBookings();
      this.fetchTutorApprovedMeetings();
      this.fetchTutorLiveMeetings();
      this.fetchExpertRecentReviews();
    }, 1000);
  }
  openSchedulePage() {
    this.router.navigate(['home/tutorSchedule']);
  }
  fetchExpertRecentReviews() {
    this.httpService
      .fetchExpertRecentReviews(this.tutorProfileDetails.tid)
      .subscribe((res) => {
        this.recentReviewsList = res;
      });
  }
  // -------------------------------------------------------------------------- tutor functions--------------------------------------------
  // for accepting bookings
  acceptBooking(booking: bookingDetails) {
    this.isLoading = true;
    booking.approvalStatus = 'Accepted';

    this.httpService
      .updateBookingStatus(booking.bid, booking.approvalStatus)
      .subscribe((res) => {
        if (res == true) {
          this.bookingList.splice(this.bookingList.indexOf(booking, 0), 1);
          if (this.bookingList.length == 0) {
            this.bookingRequestMessage = 'No booking requests pending.';
            this.pendingRequestsCount = 0;
            this.takeAction = false;
          }
          this.before10MinutesTime(booking);
          this.enableJoinNow(booking);
          this.timeLeft(booking);
          this.meetingList.push(booking);
          this.approvedMeetingsMessage = '';
          this.isLoading = false;
        }
      });
  }

  //for denying bookings
  denyBooking(booking: bookingDetails) {
    booking.approvalStatus = 'Rejected';

    this.httpService
      .updateBookingStatus(booking.bid, booking.approvalStatus)
      .subscribe((res) => {
        if (res == true) {
          this.bookingList.splice(this.bookingList.indexOf(booking, 0), 1);
          if (this.bookingList.length == 0) {
            this.bookingRequestMessage = 'No booking requests pending.';
            this.pendingRequestsCount = 0;
            this.takeAction = false;
          }
        }
      });
  }

  //for fetching pending tutor booking requests
  fetchTutorPendingBookings() {
    if (this.loginService.getLoginType() == 'Expert') {
      this.httpService
        .getTutorBookings(this.tutorService.getTutorDetials().tid)
        .subscribe((res) => {
          this.bookingList = res;
          if (this.bookingList.length == 0) {
            this.bookingRequestMessage = 'No booking requests pending.';
            this.pendingRequestsCount = 0;
          } else {
            this.pendingRequestsCount = this.bookingList.length;
          }
        });
    }
  }

  //for fetching accepted booking requests
  fetchTutorApprovedMeetings() {
    this.httpService
      .fetchApprovedMeetingsTutor(this.tutorService.getTutorDetials().tid)
      .subscribe((res) => {
        this.meetingList = res;
        this.sortMeetings(this.meetingList);

        if (this.meetingList.length == 0) {
          this.approvedMeetingsMessage = 'No upcoming meetings pending.';
        }
        for (let booking of this.meetingList) {
          this.before10MinutesTime(booking);
          this.enableJoinNow(booking);
          this.timeLeft(booking);

          if (this.meetingList.length == 0) {
            this.approvedMeetingsMessage = 'No upcoming meetings pending.';
          }
        }
      });
  }

  //for fetching live meetings
  fetchTutorLiveMeetings() {
    this.httpService
      .fetchLiveMeetingsTutor(this.tutorService.getTutorDetials().tid)
      .subscribe((res) => {
        this.liveMeetingList = res;
        if (this.liveMeetingList.length == 0) {
          this.liveMeetingsMessage = 'No live meetings.';
        }
        for (let booking of this.liveMeetingList) {
          this.eliminateLiveMeetings(booking, this.liveMeetingList);
          if (this.meetingList.length == 0) {
            this.approvedMeetingsMessage = 'No upcoming meetings pending.';
          }
        }
      });
  }

  sortMeetings(meetingList) {
    meetingList.sort(function (a, b) {
      // Turn your strings into dates, and then subtract them
      // to get a value that is either negative, positive, or zero.
      return b.dateOfMeeting - a.dateOfMeeting;
    });
  }
  //for checking time
  enableJoinNow(booking: bookingDetails) {
    var currentDate: string = new Date(Date.now()).toLocaleDateString('en-GB');
    var bookingMinutes = booking.startTimeHour * 60 + booking.startTimeMinute;
    if (currentDate == booking.dateOfMeeting) {
      setInterval(() => {
        var currentMinutes = this.now.getHours() * 60 + this.now.getMinutes();
        if (currentMinutes >= bookingMinutes) {
          booking.isLive = true;
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
            this.meetingList.splice(this.meetingList.indexOf(booking), 1);
            if (this.meetingList.length == 0) {
              this.approvedMeetingsMessage = 'No upcoming meetings.';
            }
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

  //to check if the meeting is before current time
  isTimeCompleted(booking, list: bookingDetails[]) {
    var currentDate: string = new Date(Date.now()).toLocaleDateString('en-GB');
    if (currentDate == booking.dateOfMeeting) {
      var startMinutes: number =
        booking.startTimeHour * 60 + booking.startTimeMinute;
      var bookingDuration: number = booking.duration + 10;
      var currentMinutes = this.now.getHours() * 60 + this.now.getMinutes();
      var differenceMinutes: number = startMinutes - currentMinutes;
      if (differenceMinutes <= 0) {
        if (Math.abs(differenceMinutes) > bookingDuration) {
          list.splice(list.indexOf(booking), 1);
        }
      }
      setInterval(() => {
        currentMinutes = this.now.getHours() * 60 + this.now.getMinutes();
        differenceMinutes = startMinutes - currentMinutes;
        if (differenceMinutes <= 0) {
          if (Math.abs(differenceMinutes) > bookingDuration) {
            if (list.indexOf(booking) != -1) {
              list.splice(list.indexOf(booking), 1);
            }
          }
        }
      }, 5000);
    }
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
            this.httpService
              .updateBookingStatus(booking.bid, 'completed')
              .subscribe((res) => {});
          }
        }
      }, 5000);
    }
  }
  //minus 10 minutes from time
  before10MinutesTime(meeting: bookingDetails) {
    if (meeting.startTimeMinute == 0) {
      meeting.startTimeMinute = 50;
      meeting.startTimeHour -= 1;
    } else {
      meeting.startTimeMinute -= 10;
    }
  }

  // when tutor initiates the meeting from upcoming meetings
  onHost(booking: bookingDetails) {
    booking.approvalStatus = 'live';
    this.httpService
      .updateBookingStatus(booking.bid, booking.approvalStatus)
      .subscribe((res) => {
        if (res == true) {
          this.meetingList.splice(this.meetingList.indexOf(booking, 0), 1);
          this.liveMeetingList.push(booking);
        }
      });
    this.hostMeeting.roomId = 123;
    this.hostMeeting.role = 'host';
    this.hostMeeting.roomName = booking.meetingId;
    this.hostMeeting.userName = booking.tutorName;
    this.hostMeeting.userId = booking.tutorId;
    this.meetingService.setMeeting(this.hostMeeting);
    this.meetingService.setBooking(booking);
    this.router.navigate(['meeting']);
  }

  //on join function for live meetings
  onJoin(booking: bookingDetails) {
    this.hostMeeting.roomId = 123;
    this.hostMeeting.role = 'host';
    this.hostMeeting.roomName = booking.meetingId;
    this.hostMeeting.userName = booking.tutorName;
    this.hostMeeting.userId = booking.tutorId;
    this.meetingService.setMeeting(this.hostMeeting);
    this.meetingService.setBooking(booking);
    this.router.navigate(['meeting']);
  }
  preventBackButton() {
    history.pushState(null, null, location.href);
    this.locationStrategy.onPopState(() => {
      history.pushState(null, null, location.href);
    });
  }
}
