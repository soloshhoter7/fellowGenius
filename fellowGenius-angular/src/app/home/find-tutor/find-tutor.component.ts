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
		this.fetchTutorList();
		this.filterSearch = this.tutorService.tutorList;
	}

	fetchTutorList() {
		this.httpService.getTutorList().subscribe((req) => {
			this.filterSearch = req;
		});
	}

	viewProfile(profile: tutorProfileDetails) {
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
				return res.fullName.toLocaleLowerCase().match(this.name.toLocaleLowerCase());
			});
		} else {
			this.someValue = false;
			this.ngOnInit();
		}
	}

	searchSubject() {
		if (this.subject != '') {
			this.filterSearch = this.filterSearch.filter((res) => {
				return (
					res.subject1.toLocaleLowerCase().match(this.subject.toLocaleLowerCase()) ||
					res.subject2.toLocaleLowerCase().match(this.subject.toLocaleLowerCase()) ||
					res.subject3.toLocaleLowerCase().match(this.subject.toLocaleLowerCase())
				);
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
				return res.price1.toLocaleLowerCase().match(this.price.toLocaleLowerCase());
			});
		} else {
			this.someValue = false;
			this.ngOnInit();
		}
	}
}
