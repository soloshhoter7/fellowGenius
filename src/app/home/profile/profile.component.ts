import { Component, OnInit } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ElementRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { TutorService } from 'src/app/service/tutor.service';
import { tutorProfile } from 'src/app/model/tutorProfile';
import { AngularFireStorageModule } from '@angular/fire/storage/public_api';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
	styleUrls: [ './profile.component.css' ]
})
export class ProfileComponent implements OnInit {
	ngOnInit(): void {
		this.tutorProfile = this.tutorService.getTutorDetials();
	}
	config: MatSnackBarConfig = {
		duration: 2000,
		horizontalPosition: 'center',
		verticalPosition: 'top'
	};
	tutorProfile: tutorProfile;
	uploadedProfilePicture: File = null;
	uploadedIdDocument: File = null;
	uploadedEducationDocument: File = null;
	idDocUrl: string;
	educationDocUrl: string;
	fullName = 'shubham';
	profilePictureUrl;
	actualProfilePicture = null;
	profilePictureDisabled = false;
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
		private http: HttpClient,
		private tutorService: TutorService,
		private firebaseStorage: AngularFireStorage,
		private snackBar: MatSnackBar
	) {
		this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
			startWith(null),
			map((fruit: string | null) => (fruit ? this._filter(fruit) : this.allFruits.slice()))
		);
	}
	basicInfoComplete() {
		this.formProgress += 25;
	}
	profileComplete() {
		this.formProgress += 25;
	}
	verificationComplete() {
		this.formProgress = 99;
	}
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
