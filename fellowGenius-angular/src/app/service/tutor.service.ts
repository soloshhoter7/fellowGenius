import { Injectable } from '@angular/core';
import { tutorProfileDetails } from '../model/tutorProfileDetails';
import { tutorLoginModel } from '../model/tutorLoginModel';
import { TutorProfileComponent } from '../home/find-tutor/tutor-profile/tutor-profile.component';
import { tutorProfile } from '../model/tutorProfile';

@Injectable({
	providedIn: 'root'
})
export class TutorService {
	tutorProfileDetails = new tutorProfileDetails();
	tutorProfile = new tutorProfile();
	tutorLogin = new tutorLoginModel();
	tutorList: tutorProfileDetails[];
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
	constructor() {}
}
