import { Component, OnInit } from '@angular/core';
import { JitEvaluator } from '@angular/compiler';
import { tutorProfileDetails } from 'src/app/model/tutorProfileDetails';
import { MatDialog } from '@angular/material/dialog';
import { TutorProfileComponent } from './tutor-profile/tutor-profile.component';
import { ProfileService } from '../../service/profile.service';
import { HttpService } from 'src/app/service/http.service';
import { TutorService } from 'src/app/service/tutor.service';

@Component({
	selector: 'app-find-tutor',
	templateUrl: './find-tutor.component.html',
	styleUrls: [ './find-tutor.component.css' ]
})
export class FindTutorComponent implements OnInit {
	name: string;
	subject: string;
	price: string;
	availability: string;
	gender: string;
	filterSearch: tutorProfileDetails[] = [];
	someValue: boolean = false;
	profile = new tutorProfileDetails();
	imageUrl = '../../../assets/images/ajayVerma.jpg';
	constructor(
		private matDialog: MatDialog,
		private profileService: ProfileService,
		private httpService: HttpService,
		private tutorService: TutorService
	) {}

	ngOnInit() {
		// this.fetchTutorList();
		this.filterSearch = this.tutorService.tutorList;
	}
	fetchTutorList() {
		this.httpService.getTutorList().subscribe((req) => {
			this.filterSearch = req;
			// for (let tutor of this.filterSearch) {
			// 	console.log(tutor.tid);
			// }
		});
	}

	viewProfile(profile: tutorProfileDetails) {
		console.log(profile.tid);
		this.profileService.setProfile(profile);
		this.openDialogProfile();
	}

	openDialogProfile() {
		this.matDialog.open(TutorProfileComponent, {
			height: '90vh',
			width: '70vw'
		});
	}

	searchName() {
		if (this.name != '') {
			// this.someValue = true;
			this.filterSearch = this.filterSearch.filter((res) => {
				return res.name.toLocaleLowerCase().match(this.name.toLocaleLowerCase());
			});
		} else {
			this.someValue = false;
			this.ngOnInit();
		}
	}

	searchSubject() {
		if (this.subject != '') {
			// this.someValue = true;
			this.filterSearch = this.filterSearch.filter((res) => {
				return res.subject.toLocaleLowerCase().match(this.subject.toLocaleLowerCase());
			});
		} else {
			this.someValue = false;
			this.ngOnInit();
		}
	}

	searchAvailability() {
		if (this.availability != '') {
			// this.someValue = true;
			this.filterSearch = this.filterSearch.filter((res) => {
				return res.availability.toLocaleLowerCase().match(this.availability.toLocaleLowerCase());
			});
		} else {
			this.someValue = false;
			this.ngOnInit();
		}
	}
	searchPrice() {
		if (this.price != '') {
			//this.someValue = true;
			this.filterSearch = this.filterSearch.filter((res) => {
				return res.price.toLocaleLowerCase().match(this.price.toLocaleLowerCase());
			});
		} else {
			this.someValue = false;
			this.ngOnInit();
		}
	}

	searchGender() {
		if (this.gender != '') {
			// this.someValue = true;
			this.filterSearch = this.filterSearch.filter((res) => {
				return res.gender.toLocaleLowerCase().match(this.gender.toLocaleLowerCase());
			});
		} else {
			this.someValue = false;
			this.ngOnInit();
		}
	}
}
