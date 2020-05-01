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

@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
	styleUrls: [ './profile.component.css' ]
})
export class ProfileComponent implements OnInit {
	ngOnInit(): void {
		this.formProgress = this.tutorService.getTutorProfileDetails().profileCompleted;
		this.tutorProfile = this.tutorService.getTutorDetials();
	}
	basicTutorProfileDetails = new tutorProfileDetails();
	gradeLevel;
	//firebase connection
	uploadedProfilePicture: File = null;
	uploadedIdDocument: File = null;
	uploadedEducationDocument: File = null;
	idDocUrl: string;
	educationDocUrl: string;
	fullName = 'shubham';
	profilePictureUrl;
	actualProfilePicture = null;
	profilePictureDisabled = false;
	config: MatSnackBarConfig = {
		duration: 2000,
		horizontalPosition: 'center',
		verticalPosition: 'top'
	};
	mobNumberPattern = '^((\\+91-?)|0)?[0-9]{10}$';
	tutorProfile = new tutorProfile();
	tutorProfileDetails = new tutorProfileDetails();
	tutorVerification = new TutorVerification();
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
		private httpService: HttpService,
		private firebaseStorage: AngularFireStorage,
		private snackBar: MatSnackBar
	) {
		this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
			startWith(null),
			map((fruit: string | null) => (fruit ? this._filter(fruit) : this.allFruits.slice()))
		);
	}

	updateBasicTutorProfile(profilePictureUrl) {
		console.log(this.tutorService.getTutorDetials().profilePictureUrl);
		this.basicTutorProfileDetails.subject1 = this.fruits[0];
		this.basicTutorProfileDetails.subject2 = this.fruits[1];
		this.basicTutorProfileDetails.subject3 = this.fruits[2];
		this.basicTutorProfileDetails.gradeLevel = this.gradeLevel;
		this.basicTutorProfileDetails.tid = this.tutorService.getTutorDetials().tid;
		this.basicTutorProfileDetails.profilePictureUrl = profilePictureUrl;
		this.tutorService.setTutorProfileDetails(this.basicTutorProfileDetails);
		console.log(this.basicTutorProfileDetails);
		this.httpService.updateTutorProfileDetails(this.basicTutorProfileDetails).subscribe((res) => {});
	}

	basicInfoComplete(basicInfo: NgForm) {
		this.gradeLevel = basicInfo.value.gradeLevel;
		this.tutorProfile = basicInfo.value;
		this.tutorProfile.tid = this.tutorService.getTutorDetials().tid;
		if (this.profilePictureUrl == null) {
			console.log('Unable to upload');
		} else {
			console.log(this.basicTutorProfileDetails);
			this.tutorProfile.profilePictureUrl = this.profilePictureUrl;
			console.log('basic info details ->');
			console.log(this.tutorProfile);
			this.formProgress += 25;
			this.httpService.updateTutorProfile(this.tutorProfile).subscribe((res) => {
				this.updateBasicTutorProfile(this.tutorProfile.profilePictureUrl);
			});
		}
	}

	profileComplete(profileForm: NgForm) {
		this.tutorProfileDetails = profileForm.value;
		console.log(this.tutorProfileDetails);
		this.tutorProfileDetails.subject1 = this.tutorService.getTutorProfileDetails().subject1;
		this.tutorProfileDetails.subject2 = this.tutorService.getTutorProfileDetails().subject2;
		this.tutorProfileDetails.subject3 = this.tutorService.getTutorProfileDetails().subject3;
		this.tutorProfileDetails.tid = this.tutorService.getTutorProfileDetails().tid;
		this.tutorProfileDetails.gradeLevel = this.tutorService.getTutorProfileDetails().gradeLevel;
		this.tutorProfileDetails.profilePictureUrl = this.tutorService.getTutorDetials().profilePictureUrl;
		this.httpService.updateTutorProfileDetails(this.tutorProfileDetails).subscribe((res) => {
			console.log(res);
			console.log('profile details have been updated !');
		});
		this.formProgress += 25;
	}
	verificationComplete(verificationForm: NgForm) {
		this.formProgress = 99;
		this.tutorVerification = verificationForm.value;
		this.tutorVerification.idDocUrl = this.idDocUrl;
		this.tutorVerification.educationDocUrl = this.educationDocUrl;
		this.tutorVerification.tid = this.tutorService.getTutorDetials().tid;
		console.log(this.tutorVerification);
		if (this.idDocUrl == null && this.educationDocUrl == null) {
			console.log('verification not possible !');
		} else {
			console.log('verification possible' + this.tutorVerification.tid);
			this.httpService.updateTutorVerification(this.tutorVerification).subscribe();
		}
	}

	//-----------------------------------------firebase management-------------------------

	//profile picture change function
	profilePictureChange(event) {
		// this.profilePictureDisabled = true;
		this.uploadedProfilePicture = <File>event.target.files[0];
		console.log(event);
		this.uploadProfilePicture();
	}
	//id document change function
	idDocumentChange(event) {
		console.log('hello');
		this.uploadedIdDocument = <File>event.target.files[0];
		console.log(event);
		this.uploadIdDocument();
	}
	//education document change function
	educationDocumentChange(event) {
		this.uploadedEducationDocument = <File>event.target.files[0];
		console.log(event);
		this.uplaodEducationDocument();
	}
	//for uploading profile picture
	uploadProfilePicture() {
		var filePath = `tutor_profile_picture/${this.uploadedProfilePicture}_${new Date().getTime()}`;
		const fileRef = this.firebaseStorage.ref(filePath);
		this.firebaseStorage
			.upload(filePath, this.uploadedProfilePicture)
			.snapshotChanges()
			.pipe(
				finalize(() => {
					fileRef.getDownloadURL().subscribe((url) => {
						this.profilePictureUrl = url;
						console.log(this.profilePictureUrl);
						this.snackBar.open('Image Uploaded successfully', 'close', this.config);
					});
				})
			)
			.subscribe();
	}
	//for uploading id documents
	uploadIdDocument() {
		var filePath = `tutor_id_document/${this.uploadedIdDocument}_${new Date().getTime()}`;
		const fileRef = this.firebaseStorage.ref(filePath);
		this.firebaseStorage
			.upload(filePath, this.uploadedIdDocument)
			.snapshotChanges()
			.pipe(
				finalize(() => {
					fileRef.getDownloadURL().subscribe((url) => {
						this.idDocUrl = url;
						console.log(this.idDocUrl);
						this.snackBar.open('Id document Uploaded successfully', 'close', this.config);
					});
				})
			)
			.subscribe();
	}
	//for uploading education documents
	uplaodEducationDocument() {
		var filePath = `tutor_education_document/${this.uploadedEducationDocument}_${new Date().getTime()}`;
		const fileRef = this.firebaseStorage.ref(filePath);
		this.firebaseStorage
			.upload(filePath, this.uploadedEducationDocument)
			.snapshotChanges()
			.pipe(
				finalize(() => {
					fileRef.getDownloadURL().subscribe((url) => {
						this.educationDocUrl = url;
						console.log(this.educationDocUrl);
						this.snackBar.open('education document Uploaded successfully', 'close', this.config);
					});
				})
			)
			.subscribe();
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
