import { Injectable } from '@angular/core';
import { StudentLoginModel } from '../model/studentLoginModel';
import { StudentProfileModel } from '../model/studentProfile';
import { scheduleData } from '../model/scheduleData';
import { HttpService } from './http.service';
import { bookingDetails } from '../model/bookingDetails';
import { Subject } from 'rxjs';
import { LoginDetailsService } from './login-details.service';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  studentProfile = new StudentProfileModel();
  studentBookings: scheduleData[];
  editVariable: string;
  profileCompleted;
  private bookingList: bookingDetails[] = [];
  private approvedList: bookingDetails[] = [];
  private liveMeetingList: bookingDetails[] = [];
  private upcomingMeetingList: bookingDetails[] = [];
  approvedBookingsChanged = new Subject<bookingDetails[]>();
  bookingsChanged = new Subject<bookingDetails[]>();
  liveMeetingsChanged = new Subject<bookingDetails[]>();
  upcomingMeetingsChanged = new Subject<bookingDetails[]>();
  constructor(
    private httpService: HttpService,
    private loginService: LoginDetailsService
  ) {}

  setUpcomingBookings(booking: bookingDetails[]) {
    this.upcomingMeetingList = this.upcomingMeetingList.concat(booking);
    this.upcomingMeetingsChanged.next(this.upcomingMeetingList.slice());
  }
  getUpcomingMeetings() {
    return this.upcomingMeetingList.slice();
  }

  setPendingBookings(booking: bookingDetails[]) {
    this.bookingList = booking;
    this.bookingsChanged.next(this.bookingList.slice());
  }
  getPendingBookings() {
    return this.bookingList.slice();
  }

  setApprovedBookings(booking: bookingDetails[]) {
    this.approvedList = booking;
    this.approvedBookingsChanged.next(this.approvedList.slice());
  }
  getApprovedBookings() {
    return this.approvedList.slice();
  }

  setLiveBookings(booking: bookingDetails[]) {
    this.liveMeetingList = booking;
    this.liveMeetingsChanged.next(this.liveMeetingList.slice());
  }
  getLiveBookings() {
    return this.liveMeetingList.slice();
  }

  setProfileCompleted(profileCompleted: number) {
    this.profileCompleted = profileCompleted;
  }
  getProfileCompleted() {
    return this.profileCompleted;
  }

  setEditFuntion(editFunction: string) {
    this.editVariable = editFunction;
  }
  getEditFunction() {
    return this.editVariable;
  }

  setStudentProfileDetails(studentProfile: StudentProfileModel) {
    this.studentProfile = studentProfile;
  }
  getStudentProfileDetails() {
    return this.studentProfile;
  }

  setStudentBookings(schedule: scheduleData[]) {
    this.studentBookings = schedule;
    this.manipulateMeetingSchedule();
  }
  getStudentBookings() {
    return this.studentBookings;
  }

  manipulateMeetingSchedule() {
    for (let schedule of this.studentBookings) {
      var startDate: Date = new Date(schedule.StartTime.toString());
      var endDate: Date = new Date(schedule.EndTime.toString());
      schedule.StartTime = startDate.toString();
      schedule.EndTime = endDate.toString();
      schedule.Type = 'booking';
    }
  }
  //for fetching student pending bookings
  fetchStudentPendingBookings() {
    if (this.loginService.getLoginType() == 'Learner') {
      if (this.studentProfile.sid) {
        this.httpService
          .findStudentBookings(this.studentProfile.sid)
          .subscribe((res) => {
            this.setPendingBookings(res);
          });
      }
    }
  }
  //for fetching student approved bookings
  fetchApprovedStudentMeetings() {
    if (
      this.loginService.getLoginType() == 'Learner' &&
      this.studentProfile.sid
    ) {
      this.httpService
        .fetchApprovedMeetings(this.studentProfile.sid)
        .subscribe((res) => {
          this.setApprovedBookings(res);
        });
    }
  }
  //for fetching student live meetings
  fetchLiveMeetings() {
    if (
      this.loginService.getLoginType() == 'Learner' &&
      this.studentProfile.sid
    ) {
      this.httpService
        .fetchLiveMeetingsStudent(this.studentProfile.sid)
        .subscribe((res) => {
          this.setLiveBookings(res);
        });
    }
  }
  fetchUpcomingMeetings() {
    if (this.loginService.getLoginType() == 'Learner') {
      if (this.studentProfile.sid) {
        this.upcomingMeetingList=[];
        this.httpService
          .findStudentBookings(this.studentProfile.sid)
          .subscribe((res) => {
            this.setUpcomingBookings(res);
          });
          this.httpService
        .fetchApprovedMeetings(this.studentProfile.sid)
        .subscribe((res) => {
          this.setUpcomingBookings(res);
        });
        this.httpService
        .fetchLiveMeetingsStudent(this.studentProfile.sid)
        .subscribe((res) => {
          this.setUpcomingBookings(res);
        });
      }
    }
  }
}
