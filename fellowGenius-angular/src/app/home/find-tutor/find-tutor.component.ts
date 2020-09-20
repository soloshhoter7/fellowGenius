import { Component, OnInit } from '@angular/core';
import { JitEvaluator } from '@angular/compiler';
import { tutorProfileDetails } from 'src/app/model/tutorProfileDetails';
import { MatDialog } from '@angular/material/dialog';
import { TutorProfileComponent } from './tutor-profile/tutor-profile.component';
import { ProfileService } from '../../service/profile.service';
import { HttpService } from 'src/app/service/http.service';
import { TutorService } from 'src/app/service/tutor.service';
import { filter } from 'rxjs/operators';
import { StudentService } from 'src/app/service/student.service';

@Component({
	selector: 'app-find-tutor',
	templateUrl: './find-tutor.component.html',
	styleUrls: [ './find-tutor.component.css' ]
})
export class FindTutorComponent implements OnInit {
	name: string;
	lowerValue: string;
	higherValue: string;
	subject: string;
	setSubject: string;
	price: string;
	availability: string;
	gender: string;
	filterSearch: tutorProfileDetails[] = [];
	tempFilterSearch: tutorProfileDetails[] = [];
	someValue: boolean = false;
	profile = new tutorProfileDetails();
	imageUrl = '../../../assets/images/ajayVerma.jpg';
	constructor(
		private matDialog: MatDialog,
		private profileService: ProfileService,
		private httpService: HttpService,
		private tutorService: TutorService,
		private studentService: StudentService,
	) {}

	ngOnInit() {
		this.fetchAllLinkedTutors();
		// this.fetchTutorList();
		this.filterSearch = this.tutorService.tutorList;
	}

	fetchAllLinkedTutors(){
		this.httpService.fetchAllLinkedTutors(this.studentService.getStudentProfileDetails().sid).subscribe((res)=>{
			console.log(res);
		})
	}
	fetchTutorList() {
		this.httpService.getTutorList().subscribe((req) => {
			this.filterSearch = req;
			this.tempFilterSearch = req;
		});
	}

	setToInitialList() {
		this.tempFilterSearch = this.filterSearch;
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
		// this.name = $event.target.value;
		// if(this.filterSearch.length == this.tempFilterSearch.length){
		// if(this.name!=''){
		this.tempFilterSearch = this.filterSearch.filter((response) => {
			return response.fullName.toLocaleLowerCase().match(this.name.toLocaleLowerCase());
		});
		// }else{
		// 	this.ngOnInit();
		// }
		// if length of both the arrays are different
		// }else{
		// 	this.tempFilterSearch = this.tempFilterSearch.filter((res) => {
		// 		return res.fullName.toLocaleLowerCase().match(this.name.toLocaleLowerCase());
		// 	});

		// }
	}
}

	// searchSubject($event) {
	// 	this.subject = $event.target.value;
	// 	if (this.price == null) {
	// 		this.tempFilterSearch = this.filterSearch.filter((res) => {
	// 			return (
	// 				res.subject1.toLocaleLowerCase().startsWith(this.subject.toLocaleLowerCase()) ||
	// 				res.subject2.toLocaleLowerCase().startsWith(this.subject.toLocaleLowerCase()) ||
	// 				res.subject3.toLocaleLowerCase().startsWith(this.subject.toLocaleLowerCase())
	// 			);
	// 		});
	// 	} else if (this.price != null) {
	// 		this.tempFilterSearch = this.filterSearch.filter((res) => {
	// 			if (
	// 				(Number(res.price1) >= Number(this.lowerValue) &&
	// 					Number(res.price1) <= Number(this.higherValue) &&
	// 					res.subject1.match(this.subject)) ||
	// 				res.subject2.match(this.subject) ||
	// 				res.subject3.match(this.subject)
	// 			) {
	// 				return res.subject1 || res.subject2 || res.subject3;
	// 			}
	// 		});
	// 	}

	// }else{
	// 	this.tempFilterSearch = this.tempFilterSearch.filter((res) => {
	// 		return (
	// 			res.subject1.toLocaleLowerCase().match(this.subject.toLocaleLowerCase()) ||
	// 			res.subject2.toLocaleLowerCase().match(this.subject.toLocaleLowerCase()) ||
	// 			res.subject3.toLocaleLowerCase().match(this.subject.toLocaleLowerCase())
	// 			);
	// 		});
	// }


// searchPrice($event) {
// 	this.price = $event.target.value.split('-');
// 	this.lowerValue = this.price[0];
// 	this.higherValue = this.price[1];

// 	if (this.subject == null) {
// 		this.tempFilterSearch = this.filterSearch.filter((res) => {
// 			if (Number(res.price1) >= Number(this.lowerValue) && Number(res.price1) <= Number(this.higherValue))
// 				return res.price1.toLocaleLowerCase;
// 		});
// 	} else if (this.subject != null) {
// 		this.tempFilterSearch = this.filterSearch.filter((res) => {
// 			if (Number(res.price1) >= Number(this.lowerValue) && Number(res.price1) <= Number(this.higherValue)) {
// 				return res.price1.toLocaleLowerCase;
// 			}
// 		});
// 	}
// }

// 	resetFilter() {
// 		this.setToInitialList();
// 	}
// }
