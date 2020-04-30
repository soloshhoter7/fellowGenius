import { Component, OnInit } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ElementRef, ViewChild } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { TutorService } from 'src/app/service/tutor.service';
import { tutorProfile } from 'src/app/model/tutorProfile';
import { HttpService } from 'src/app/service/http.service';
import { tutorProfileDetails } from 'src/app/model/tutorProfileDetails';

@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
	styleUrls: [ './profile.component.css' ]
})
export class ProfileComponent implements OnInit {

	ngOnInit(): void {
		 this.tutorProfile = this.tutorService.getTutorDetials();
		//  console.log(this.tutorService.getTutorProfileDetails());
		//  this.tutorProfileDetails = this.tutorService.getTutorProfileDetails();
	}
	tutorProfileDetails = new tutorProfileDetails();
	mobNumberPattern = "^((\\+91-?)|0)?[0-9]{10}$";
	tutorProfile = new tutorProfile();
	profileCompleted = false;
	formProgress = 12;
	visible = true;
	selectable = true;
	removable = true;
	separatorKeysCodes: number[] = [ ENTER, COMMA ];
	fruitCtrl = new FormControl();
	filteredFruits: Observable<string[]>;
	fruits: string[] = [];
	allFruits: string[] = [
		'Automata',
		'Compiler Design',
		'Science',
		'Maths',
		'English',
		'C++',
		'java',
		'Internet Fundamentals'
	];

	@ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;
	@ViewChild('auto') matAutocomplete: MatAutocomplete;

	constructor(
		private tutorService: TutorService,
		private httpService: HttpService
	) 
	{
		this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
			startWith(null),
			map((fruit: string | null) => (fruit ? this._filter(fruit) : this.allFruits.slice()))
		);
	}

	basicInfoComplete(basicInfo: NgForm){
		this.tutorProfile = basicInfo.value;
		this.tutorProfile.tid = this.tutorService.getTutorDetials().tid;
		console.log(this.tutorProfile);
		this.formProgress += 25;
		this.httpService.updateTutorProfile(this.tutorProfile).subscribe((res)=>{
			console.log(res);
		})
	}

	profileComplete(profileForm: NgForm) {
		// this.tutorProfileDetails.graduationYear = profileForm.value.graduationYear;
		// this.tutorProfileDetails.workInstitution = profileForm.value.workInstitution;
		// this.tutorProfileDetails.studyInstitution = profileForm.value.studyInstitution;
		// this.tutorProfileDetails.workTitle = profileForm.value.workTitle;
		// this.tutorProfileDetails.majorSubject = profileForm.value.majorSubject;
		// this.tutorProfileDetails.description = profileForm.value.description;
		this.tutorProfileDetails = profileForm.value;
		console.log(this.tutorProfileDetails);
		this.formProgress += 25;
	}
	verificationComplete() {
		this.formProgress = 99;
	}
	// ------------------------------------------- for chips --------------------------------------------------------------------------
	add(event: MatChipInputEvent): void {
		const input = event.input;
		const value = event.value;

		// Add our fruit
		if ((value || '').trim()) {
			this.fruits.push(value.trim());
		}

		// Reset the input value
		if (input) {
			input.value = '';
		}

		this.fruitCtrl.setValue(null);
		console.log(this.fruits);
	}

	remove(fruit: string): void {
		const index = this.fruits.indexOf(fruit);

		if (index >= 0) {
			this.fruits.splice(index, 1);
		}
	}

	selected(event: MatAutocompleteSelectedEvent): void {
		this.fruits.push(event.option.viewValue);
		this.fruitInput.nativeElement.value = '';
		this.fruitCtrl.setValue(null);
	}

	private _filter(value: string): string[] {
		const filterValue = value.toLowerCase();

		return this.allFruits.filter((fruit) => fruit.toLowerCase().indexOf(filterValue) === 0);
	}
	// -------------------------------------------------------------------------------------------------------------------------------------
}
