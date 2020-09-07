import { Component, OnInit } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ElementRef, ViewChild } from '@angular/core';
import { FormControl, NgForm, FormGroup, FormBuilder, Validators, FormGroupDirective } from '@angular/forms';
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
import { CookieService } from 'ngx-cookie-service';

@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
	styleUrls: [ './profile.component.css' ]
})
export class ProfileComponent implements OnInit {
	constructor(private cookieService: CookieService, private tutorService: TutorService) {}

	basic = true;
	myControl = new FormControl();
	errorText: string;
	@ViewChild('basicProfile') basicProfile: FormGroupDirective;

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
	//data fields
	selectedExpertise;
	expertises: string[] = [];
	educationQualifications: string[] = [];
	previousOraganisations: string[] = [];
	filteredOptions: Observable<string[]>;
	inputOrganisation;
	inputEducation;
	tutorProfile = new tutorProfile();
	tutorProfileDetails = new tutorProfileDetails();
	userId;
	profilePictureUrl;

	ngOnInit() {
		this.filteredOptions = this.myControl.valueChanges.pipe(startWith(''), map((value) => this._filter(value)));
		this.tutorProfileDetails = this.tutorService.getTutorProfileDetails();
		this.tutorProfile = this.tutorService.getTutorDetials();
		console.log(this.tutorProfile);
		console.log(this.tutorProfileDetails);
	}

	private _filter(value: string): string[] {
		const filterValue = value.toLowerCase();

		return this.options.filter((option) => option.toLowerCase().includes(filterValue));
	}

	saveExpertBasicProfile(form: any) {
		this.userId = this.cookieService.get('userId');
		if (this.userId) {
			this.tutorProfile.tid = this.userId;
			this.tutorProfile.fullName = form.value.fullName;
			this.tutorProfile.contact = form.value.contact;
			this.tutorProfile.dateOfBirth = form.value.dob;
			this.tutorProfile.email = form.value.email;
			this.tutorProfile.profilePictureUrl = this.profilePictureUrl;
			console.log(this.tutorProfile);

			this.tutorProfileDetails.fullName = form.value.fullName;
			this.tutorProfileDetails.tid = this.userId;
			this.tutorProfileDetails.educationQualifications = this.educationQualifications;
			this.tutorProfileDetails.professionalSkills = form.value.professionalSkills;
			console.log(this.tutorProfileDetails);
		}
	}

	saveExpertAdvancedProfile(form: any) {
		this.userId = this.cookieService.get('userId');
		if (this.userId && this.expertises.length > 0) {
			this.tutorProfileDetails.institute = form.value.Institute;
			this.tutorProfileDetails.areaOfExpertise = this.expertises;
			this.tutorProfileDetails.linkedInProfileUrl = form.value.linkedInProfile;
			this.tutorProfileDetails.yearsOfExperience = form.value.yearsOfExperience;
			this.tutorProfileDetails.currentOrganisation = form.value.currentOrganisation;
			this.tutorProfileDetails.previousOrganisations = this.previousOraganisations;
			this.tutorProfileDetails.description = form.value.description;
			this.tutorProfileDetails.speciality = form.value.speciality;
			console.log(this.tutorProfileDetails);
		} else {
			this.errorText = 'Enter atleast one area of Expertise !';
		}
	}

	basicProfileToggle() {
		this.basic = true;
	}
	advancedProfileToggle() {
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
		this.educationQualifications.push(this.inputEducation);
		this.inputEducation = '';
	}
	deleteEducation(index: any) {
		this.educationQualifications.splice(index, 1);
	}
}
