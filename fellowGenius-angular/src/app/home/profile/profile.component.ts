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
	constructor(
		private cookieService: CookieService,
		private tutorService: TutorService,
		private httpService: HttpService
	) {}

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
		if (this.tutorService.getTutorProfileDetails().profileCompleted) {
			this.tutorProfile = this.tutorService.getTutorDetials();
			this.tutorProfileDetails = this.tutorService.getTutorProfileDetails();
			console.log(this.tutorProfile);
			console.log(this.tutorProfileDetails);
			if (this.tutorProfileDetails.educationalQualifications != null) {
				this.educationQualifications = this.tutorProfileDetails.educationalQualifications;
			}
			if (this.tutorProfileDetails.areaOfExpertise != null) {
				this.expertises = this.tutorProfileDetails.areaOfExpertise;
			}
			if (this.tutorProfileDetails.previousOrganisations != null) {
				this.previousOraganisations = this.tutorProfileDetails.previousOrganisations;
				console.log(this.previousOraganisations);
			}
		} else {
			console.log('else executed');
			setTimeout(() => {
				this.tutorProfile = this.tutorService.getTutorDetials();
				this.tutorProfileDetails = this.tutorService.getTutorProfileDetails();
				console.log(this.tutorProfile);
				console.log(this.tutorProfileDetails);
				if (this.tutorProfileDetails.educationalQualifications != null) {
					this.educationQualifications = this.tutorProfileDetails.educationalQualifications;
				}
				if (this.tutorProfileDetails.areaOfExpertise != null) {
					this.expertises = this.tutorProfileDetails.areaOfExpertise;
				}
				if (this.tutorProfileDetails.previousOrganisations != null) {
					this.previousOraganisations = this.tutorProfileDetails.previousOrganisations;
					console.log(this.previousOraganisations);
				}
			}, 1000);
		}
	}

	private _filter(value: string): string[] {
		const filterValue = value.toLowerCase();

		return this.options.filter((option) => option.toLowerCase().includes(filterValue));
	}

	saveExpertBasicProfile(form: any) {
		this.userId = this.cookieService.get('userId');
		if (this.userId) {
			this.tutorProfile.tid = this.userId;
			this.tutorProfile.contact = form.value.contact;
			this.tutorProfile.dateOfBirth = form.value.dob;
			this.tutorProfile.profilePictureUrl = this.profilePictureUrl;
			this.tutorProfileDetails.tid = this.userId;
			this.tutorProfileDetails.educationalQualifications = this.educationQualifications;
			this.tutorProfileDetails.professionalSkills = form.value.professionalSkills;
			console.log(this.tutorProfileDetails);
			console.log(this.tutorProfile);
			this.httpService.updateTutorProfile(this.tutorProfile).subscribe((res) => {
				this.tutorService.setTutorDetails(this.tutorProfile);
				this.httpService.updateTutorProfileDetails(this.tutorProfileDetails).subscribe(() => {
					if (this.tutorProfileDetails.profileCompleted < 50) {
						this.tutorProfileDetails.profileCompleted = 50;
					}
					this.tutorService.setTutorProfileDetails(this.tutorProfileDetails);
					console.log('all info saved successfully');
				});
			});
		}
	}

	saveExpertAdvancedProfile(form: any) {
		if (this.tutorProfileDetails.profileCompleted >= 50) {
			console.log('before ->');
			console.log(this.tutorProfileDetails);
			this.userId = this.cookieService.get('userId');
			if (this.userId && this.expertises.length > 0) {
				this.tutorProfileDetails.institute = form.value.Institute;
				this.tutorProfileDetails.areaOfExpertise = this.expertises;
				this.tutorProfileDetails.linkedInProfile = form.value.linkedInProfile;
				this.tutorProfileDetails.yearsOfExperience = form.value.yearsOfExperience;
				this.tutorProfileDetails.currentOrganisation = form.value.currentOrganisation;
				this.tutorProfileDetails.previousOrganisations = this.previousOraganisations;
				this.tutorProfileDetails.description = form.value.description;
				this.tutorProfileDetails.speciality = form.value.speciality;
				if (this.tutorProfileDetails.profileCompleted == 50) {
					this.tutorProfileDetails.profileCompleted = 100;
				}
				console.log("After->");
				console.log(this.tutorProfileDetails);
				this.httpService.updateTutorProfileDetails(this.tutorProfileDetails).subscribe((res) => {
					this.tutorService.setTutorProfileDetails(this.tutorProfileDetails);
					console.log('information updated successfully');
				});
			} else {
				this.errorText = 'Enter atleast one area of Expertise !';
			}
		} else {
			console.log('complete basic profile first');
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
