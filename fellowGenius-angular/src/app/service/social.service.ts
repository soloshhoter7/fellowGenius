import { Injectable } from '@angular/core';
import { socialLogin } from '../model/socialModel';

@Injectable({
	providedIn: 'root'
})
export class SocialService {
	constructor() {}
	socialDetails: socialLogin;
	setSocialDetails(socialDetails: socialLogin) {
		this.socialDetails = socialDetails;
	}

	getSocialDetails() {
		return this.socialDetails;
	}
}
