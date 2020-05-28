import { Injectable } from '@angular/core';
import { tutorProfileDetails } from '../model/tutorProfileDetails';
import { tutorLoginModel } from '../model/tutorLoginModel';
import { TutorProfileComponent } from '../home/find-tutor/tutor-profile/tutor-profile.component';
import { tutorProfile } from '../model/tutorProfile';
import { tutorAvailabilitySchedule } from '../model/tutorAvailabilitySchedule';

@Injectable({
	providedIn: 'root'
})
export class TutorService {
	personalAvailablitySchedule: tutorAvailabilitySchedule;
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
	}
	getPersonalAvailabilitySchedule() {
		return this.personalAvailablitySchedule;
	}
}
