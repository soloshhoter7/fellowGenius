import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'app-search-results',
	templateUrl: './search-results.component.html',
	styleUrls: [ './search-results.component.css' ]
})
export class SearchResultsComponent implements OnInit {
	constructor(private router: Router) {}

	ngOnInit(): void {}

	searchResults = [ '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1' ];
	onSignUp() {
		this.router.navigate([ 'signUp' ]);
	}

	toLoginPage() {
		this.router.navigate([ 'login' ]);
	}
}
