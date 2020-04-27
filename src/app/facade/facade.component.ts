import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginDetailsService } from '../service/login-details.service';

@Component({
	selector: 'app-facade',
	templateUrl: './facade.component.html',
	styleUrls: [ './facade.component.css' ]
})
export class FacadeComponent implements OnInit {
	constructor(private router: Router, private loginDetailsService: LoginDetailsService) {}

	ngOnInit(): void {}

	onSignUp() {
		this.router.navigate([ 'signUp' ]);
	}
	onLoginStudent() {
		this.loginDetailsService.setLoginType('student');
		this.router.navigate([ 'login' ]);
		// this.loginDetailsService.getLoginType
	}
	onLoginTutor() {
		this.loginDetailsService.setLoginType('tutor');
		this.router.navigate([ 'login' ]);
	}
}
