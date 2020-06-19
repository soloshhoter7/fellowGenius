import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginDetailsService } from '../service/login-details.service';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';

@Component({
	selector: 'app-facade',
	templateUrl: './facade.component.html',
	styleUrls: [ './facade.component.css' ]
})
export class FacadeComponent implements OnInit {
	switchView: boolean = false;
	showContainer: boolean = false;
	constructor(
		private router: Router,
		private loginDetailsService: LoginDetailsService,
		public breakpointObserver: BreakpointObserver
	) {}

	ngOnInit(): void {
		this.breakpointObserver.observe([ '(min-width: 800px)' ]).subscribe((state: BreakpointState) => {
			if (state.matches) {
				this.showContainer = true;
				this.switchView = false;
			} else {
				this.showContainer = false;
				this.switchView = true;
			}
		});
		this.preventRefreshButton();
	}

	onSignUp() {
		this.router.navigate([ 'signUp' ]);
	}

	onLoginStudent() {
		this.loginDetailsService.setLoginType('student');
		this.router.navigate([ 'login' ]);
	}

	onLoginTutor() {
		this.loginDetailsService.setLoginType('tutor');
		this.router.navigate([ 'login' ]);
	}

	preventRefreshButton() {
		window.addEventListener('beforeunload', function(e) {
			var confirmationMessage = 'o/';
			e.returnValue = confirmationMessage; // Gecko, Trident, Chrome 34+
			return confirmationMessage; // Gecko, WebKit, Chrome <34
		});
	}
}
