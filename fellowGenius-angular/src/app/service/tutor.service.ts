import { Injectable } from '@angular/core';
import { tutorProfileDetails } from '../model/tutorProfileDetails';
import { tutorLoginModel } from '../model/tutorLoginModel';
import { TutorProfileComponent } from '../home/find-tutor/tutor-profile/tutor-profile.component';
import { tutorProfile } from '../model/tutorProfile';
import { tutorAvailabilitySchedule } from '../model/tutorAvailabilitySchedule';
import { scheduleData } from '../model/scheduleData';

@Injectable({
	providedIn: 'root'
})
export class TutorService {
	personalAvailablitySchedule: tutorAvailabilitySchedule;
	meetingSchedule: scheduleData[];
	tutorProfileDetails = new tutorProfileDetails();
	tutorProfile = new tutorProfile();
	tutorLogin = new tutorLoginModel();
	tutorList: tutorProfileDetails[];

	editVariable: string;

	constructor() {}

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
	setPersonalAvailabilitySchedule(tutorAvailabilitySchedule: tutorAvailabilitySchedule) {
		this.personalAvailablitySchedule = tutorAvailabilitySchedule;
		this.manipulateMeetingSchedule();
	}
	getPersonalAvailabilitySchedule() {
		return this.personalAvailablitySchedule;
	}
	manipulateMeetingSchedule() {
		for (let schedule of this.getPersonalAvailabilitySchedule().allMeetingsSchedule) {
			var startDate: Date = new Date(schedule.StartTime.toString());
			var endDate: Date = new Date(schedule.EndTime.toString());
			schedule.StartTime = startDate.toString();
			schedule.EndTime = endDate.toString();
		}
	}
}
