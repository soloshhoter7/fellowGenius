import { Injectable } from '@angular/core';
import { tutorProfileDetails } from '../model/tutorProfileDetails';
import { tutorLoginModel } from '../model/tutorLoginModel';
import { tutorProfile } from '../model/tutorProfile';
import { tutorAvailabilitySchedule } from '../model/tutorAvailabilitySchedule';
import { scheduleData } from '../model/scheduleData';
import { LoginDetailsService } from './login-details.service';
import { HttpService } from './http.service';
import { bookingDetails } from '../model/bookingDetails';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TutorService {
  personalAvailablitySchedule: tutorAvailabilitySchedule;
  meetingSchedule: scheduleData[];
  tutorProfileDetails = new tutorProfileDetails();
  tutorProfile = new tutorProfile();
  tutorLogin = new tutorLoginModel();
  tutorProfileDetailsChanged = new Subject<tutorProfileDetails>();
  editVariable: string;
  completedMeetings: bookingDetails[];
  completedMeetingsChanged=new Subject<bookingDetails[]>();

//tutor dashboard stuff
  tutorList: tutorProfileDetails[];
  private bookingList: bookingDetails[] = [];
  pendingRequestsCount = 0;
  bookingRequestMessage = '';
//////////////////////////
  bookingsChanged = new Subject<bookingDetails[]>();
  constructor(
    private loginService:LoginDetailsService,
    private httpService:HttpService,
    // private tutorService:TutorService
    ) {}

  setTutorLogin(tutorLogin: tutorLoginModel) {
    this.tutorLogin = tutorLogin;
  }
  getTutorLogin() {
    return this.tutorLogin;
  }
  setTutorDetails(tutorProfile: tutorProfile) {
    this.tutorProfile = tutorProfile;
  }
  getTutorDetials() {
    return this.tutorProfile;
  }
  setTutorProfileDetails(tutorProfile: tutorProfileDetails) {
    this.tutorProfileDetails = tutorProfile;
    this.tutorProfileDetailsChanged.next(this.tutorProfileDetails);
  }
  getTutorProfileDetails() {
    return this.tutorProfileDetails;
  }
  setEditFuntion(editFunction: string) {
    this.editVariable = editFunction;
  }
  getEditFunction() {
    return this.editVariable;
  }
  setPersonalAvailabilitySchedule(
    tutorAvailabilitySchedule: tutorAvailabilitySchedule
  ) {
    this.personalAvailablitySchedule = tutorAvailabilitySchedule;
    this.manipulateMeetingSchedule();
  }
  getPersonalAvailabilitySchedule() {
    return this.personalAvailablitySchedule;
  }
  getBookings(){
    return this.bookingList.slice();
  }
  setBookings(bookings:bookingDetails[]){
    this.bookingList = bookings;
    this.bookingsChanged.next(this.bookingList.slice());
  }

  setCompletedMeetings(booking: bookingDetails[]) {
    this.completedMeetings = booking; 
    this.completedMeetingsChanged.next(this.completedMeetings.slice());
  }
  getCompletedMeetings() {
    return this.completedMeetings.slice();
  }
  manipulateMeetingSchedule() {
    for (let schedule of this.getPersonalAvailabilitySchedule()
      .allMeetingsSchedule) {
      var startDate: Date = new Date(schedule.StartTime.toString());
      var endDate: Date = new Date(schedule.EndTime.toString());
      schedule.StartTime = startDate.toString();
      schedule.EndTime = endDate.toString();
      schedule.Subject = schedule.Subject.concat(
        ' : ',
        schedule.Description.split('=')[0]
      );
    }
    for (let schedule of this.getPersonalAvailabilitySchedule()
      .allAvailabilitySchedule) {
      schedule.Type = 'availability';
    }
  }
// tutor dashboard stuff/////////////
  fetchTutorPendingBookings(){
    if (this.loginService.getLoginType() == 'Expert') {
      this.httpService
        .getTutorBookings(this.getTutorDetials().bookingId)
        .subscribe((res) => {
          this.setBookings(res);
        });
      }
  }

  fetchTutorCompletedMeetings(){
    
    if(this.loginService.getLoginType() == 'Expert'){
     
      this.httpService.
      fetchExpertCompletedMeetings(this.getTutorDetials().bookingId)
      .subscribe((res) => {
       
        this.setCompletedMeetings(res);
      })
    }
  }
}
