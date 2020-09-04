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
import { AngularFireStorage } from '@angular/fire/storage';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { finalize } from 'rxjs/operators';
import { TutorVerification } from 'src/app/model/tutorVerification';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { UpdateboxComponent } from '../profile/updatebox/updatebox.component';
import { UploadProfilePictureComponent } from 'src/app/facade/sign-up/upload-profile-picture/upload-profile-picture.component';
import { Router } from '@angular/router';

@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
	styleUrls: [ './profile.component.css' ]
})
export class ProfileComponent implements OnInit {
	basic = true;
	options: string[] = [
		'Mathematics',
		'English',
		'Science',
		'Social Science',
		'History',
		'Political Science',
		'Geography',
		'Physics',
		'Chemistry'
	];
	selectedExpertise;
	expertises: string[] = [];
	educationInstitutes: string[] = [];
	previousOraganisations: string[] = [];
	myControl = new FormControl();
	filteredOptions: Observable<string[]>;

	inputOrganisation;
	inputEducation;

	ngOnInit() {
		this.filteredOptions = this.myControl.valueChanges.pipe(startWith(''), map((value) => this._filter(value)));
	}

	private _filter(value: string): string[] {
		const filterValue = value.toLowerCase();

		return this.options.filter((option) => option.toLowerCase().includes(filterValue));
	}

	basicProfile() {
		this.basic = true;
	}
	advancedProfile() {
		this.basic = false;
	}

	saveExpertise() {
		this.expertises.push(this.selectedExpertise);
		this.selectedExpertise = '';
	}

	deleteExpertise(index: any) {
		this.expertises.splice(index, 1);
	}

	addOrganisation() {
		console.log(this.inputOrganisation);
		this.previousOraganisations.push(this.inputOrganisation);
		this.inputOrganisation = '';
	}

	deleteOrganisation(index: any) {
		this.previousOraganisations.splice(index, 1);
	}

	addEducation() {
		console.log(this.inputEducation);
		this.educationInstitutes.push(this.inputEducation);
		this.inputEducation = '';
	}
	deleteEducation(index: any) {
		this.educationInstitutes.splice(index, 1);
	}
}
