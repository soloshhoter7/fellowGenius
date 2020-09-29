import { Injectable } from '@angular/core';
import { StudentLoginModel } from '../model/studentLoginModel';
import { StudentProfileModel } from '../model/studentProfile';
import { scheduleData } from '../model/scheduleData';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  studentProfile = new StudentProfileModel();
  studentBookings: scheduleData[];
  editVariable: string;
  profileCompleted;
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
}
