import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../service/http.service';
import { tutorProfileDetails } from '../model/tutorProfileDetails'

@Component({
	selector: 'app-search-results',
	templateUrl: './search-results.component.html',
	styleUrls: [ './search-results.component.css' ]
})
export class SearchResultsComponent implements OnInit {

	searchResults: tutorProfileDetails[];
	filteredArray: tutorProfileDetails[] = [];

	constructor(private router: Router,
				private httpService: HttpService) {}

	ngOnInit(): void {
		// this.fetchTutorList();
		this.searchResults = [{
			tid: 1234,
			fullName: 'Ajay Verma',
			institute: 'Panipat Institute of Engineering and Technology',
			educationalQualifications: ['Btech(CSE)'],
			price1: '400',
			price2: '400',
			price3: '400',
			description: 'I am teaching since 2001',
			speciality: 'JAVA and Angular',
			rating: 92,
			reviewCount: 0,
			lessonCompleted: 43,
			profilePictureUrl: null,
			professionalSkills: 'Angular and JAVA',
			currentOrganisation: 'Google',
			previousOrganisations: ['PeopleStrong Pvt. Ltd'],
			areaOfExpertise: ['Mathematics', 'Science', 'English', 'Physics'],
			profileCompleted: 100,
			yearsOfExperience: 19,
			linkedInProfile: 'Ajay.linkedin',
		},{
			tid: 3578,
			areaOfExpertise: ["Mathematics", "English", "Physics"],
			currentOrganisation: "Google",
			description: "I have an experience of 10 years",
			educationalQualifications: ["Btech(CSE)", "HTML", "CSS"],
			fullName: "Ajay Verma",
			institute: "Panipat Institute of Engineering and Technology",
			lessonCompleted: 0,
			linkedInProfile: "AJay.linkedin",
			previousOrganisations: ["PeopleStrong Pvt. Ltd"],
			price1: '800',
			price2: '400',
			price3: '400',
			professionalSkills: "Angular, JAVA",
			profileCompleted: 100,
			profilePictureUrl: null,
			rating: 100,
			reviewCount: 0,
			speciality: "Angular, JAVA",
			yearsOfExperience: 10	
		}];

		this.filteredArray = this.searchResults;
	}

	// searchResults = [ '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1' ];
	onSignUp() {
		this.router.navigate([ 'signUp' ]);
	}

	toLoginPage() {
		this.router.navigate([ 'login' ]);
	}

	fetchTutorList() {
		this.httpService.getTutorList().subscribe((req) => {
			console.log(req);
			// this.searchResults = req;
		});
	}

	searchPrice($event) {

		if($event.target.value==1500){
			this.filteredArray = this.searchResults.filter((res) => {
				if (Number(res.price1) >= Number(1500)) {
					return res.price1.toLocaleLowerCase;
				}
			});
		}else{
			console.log($event.target.value);
			var price = $event.target.value.split('-');
			var lowerValue = price[0];
			var higherValue = price[1];
			this.filteredArray = this.searchResults.filter((res) => {
				if (Number(res.price1) >= Number(lowerValue) && Number(res.price1) <= Number(higherValue))
					return res.price1.toLocaleLowerCase;
			});
		}


		
	}
}
