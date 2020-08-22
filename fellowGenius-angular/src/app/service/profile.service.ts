import { Injectable } from '@angular/core';
import { tutorProfileDetails } from '../model/tutorProfileDetails';
@Injectable({
	providedIn: 'root'
})
export class ProfileService {
	viewProfile = new tutorProfileDetails();
	constructor() {}
	setProfile(profile: tutorProfileDetails) {
		this.viewProfile = profile;
	}

	getProfile() {
		return this.viewProfile;
	}
}
