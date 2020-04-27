import { Injectable } from '@angular/core';
import { StudentLoginModel } from '../model/studentLoginModel';

@Injectable({
	providedIn: 'root'
})
export class LoginDetailsService {
	studentLoginModel = new StudentLoginModel();

	loginType: string;
	constructor() {}

	setLoginType(loginType: string) {
		this.loginType = loginType;
	}
	getLoginType() {
		return this.loginType;
	}
}
