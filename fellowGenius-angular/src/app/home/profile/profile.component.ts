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
import { MatDialog } from '@angular/material/dialog';
import { UpdateboxComponent } from '../profile/updatebox/updatebox.component';

@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
	styleUrls: [ './profile.component.css' ]
})
export class ProfileComponent implements OnInit {
	profilePictureDisplay = '../../../assets/icons/user-square.svg';
	ngOnInit(): void {
		this.tutorProfile = this.tutorService.getTutorDetials();
		this.userEmail = this.tutorProfile.email;
		this.profilePictureDisplay = this.tutorProfile.profilePictureUrl;
		this.tutorFormDetails = this.tutorService.getTutorProfileDetails();
		
		this.formProgress = this.tutorService.getTutorProfileDetails().profileCompleted;
		if (this.formProgress >= 99) {
			this.profileCompleted = true;
		}
	}
	subjectsValid: boolean = true;
	disableContinue1: boolean = false;
	disableContinue2: boolean = false;
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
	tutorFormDetails = new tutorProfileDetails();
	tutorVerification = new TutorVerification();
	profileCompleted = false;
	formProgress = 12;
	visible = true;
	selectable = true;
	maxGraduationYear = new Date().getFullYear()+5;
	removable = true;
	price1;
	userEmail;
	only3Subjects: boolean;
	separatorKeysCodes: number[] = [ ENTER, COMMA ];
	fruitCtrl = new FormControl();
	filteredFruits: Observable<string[]>;
	fruits: string[] = [];
	allFruits: string[] = [
		'English',
		'Hindi',
		'Science',
		'Social Science',

		'Physics',
		'Chemistry',
		'Biology',
		'Mathematics',
		'Physical Education',
		'Psychology',
		'Biotechnology',
		'Home Science',
		'Computer Science',
		'Engineering Drawing',

		'Accountancy',
		'Business Studies',
		'Economics',
		'Multimedia & Web Technology',
		'Entrepreneurship',
		'Legal Studies',
		'Fine Arts',

		'History',
		'Political Science',
		'Economics',
		'Geography',
		'Sociology',
		'Media Studies',

		'B.Com(Hons)-Year 1',
		'B.Com(Hons)-Year 2',
		'B.Com(Hons) Year 3',

		'Bachelor of Management Studies- Year 1',
		'Bachelor of Management Studies- year 2',
		'Bachelor of Management Studies- Year 3',

		'B.Com(Corporate Laws)-year 1',
		'B.Com(Corporate Laws)-year 1',
		'B.Com(Corporate Laws)-year 1',

		'BBA- Year 1',
		'BBA-Year 2',
		'BBA- year 3',

		'Bachelor of Business Studies- Year 1',
		'Bachelor of Business Studies- Year 2',
		'Bachelor of Business Studies- Year 3',

		'B.Sc(Gen-Mathematics)- Year 1',
		'B.Sc(Gen-Mathematics)- Year 2',
		'B.Sc(Gen-Mathematics)- Year 3',

		'B.Sc(Hons-Mathematics)- Year 1',
		'B.Sc(Hons-Mathematics)- Year 1',
		'B.Sc(Hons-Mathematics)- Year 1',

		'B.Sc(Hons-Chemistry)- Year 1',
		'B.Sc(Hons-Chemistry)- year 2',
		'B.Sc(Hons-Chemistry) - Year 3',

		'B.Sc(Hons-Physics)- Year 1',
		'B.Sc(Hons-Physics)- Year 2',
		'B.Sc(Hons-Physics)- Year 3',

		'B.Sc (Hons) Applied Physical Science- Year 1',
		'B.Sc (Hons) Applied Physical Science- Year 2',
		'B.Sc (Hons) Applied Physical Science- Year 3',

		'B.Sc (Hons) Statistics- Year 1',
		'B.Sc (Hons) Statistics- Year 2',
		'B.Sc (Hons) Statistics- Year 3',

		'B.Sc (Hons) Botany - Year 1',
		'B.Sc (Hons) Botany - Year 2',
		'B.Sc (Hons) Botany - Year 3',

		'B.Sc (Hons) Zoology - Year 1',
		'B.Sc (Hons) Zoology - Year 2',
		'B.Sc (Hons) Zoology - Year 3',

		'B.Sc (Hons) Industrial Chemistry - Year 1',
		'B.Sc (Hons) Industrial Chemistry - Year 2',
		'B.Sc (Hons) Industrial Chemistry - Year 3',

		'B.Sc (Hons) Biological Science- Year 1',
		'B.Sc (Hons) Biological Science- Year 2',
		'B.Sc (Hons) Biological Science- Year 3',

		'B.Sc (Hons) Computer Science- Year 1',
		'B.Sc (Hons) Computer Science- Year 2',
		'B.Sc (Hons) Computer Science- Year 3',

		'B.Sc (Hons) Electronics- Year 1',
		'B.Sc (Hons) Electronics- Year 2',
		'B.Sc (Hons) Electronics- Year 3',

		'B.Sc. (MT) Radiography - Year 1',
		'B.Sc. (MT) Radiography - Year 2',
		'B.Sc. (MT) Radiography - Year 3',

		'B.Sc (Hons) Geology- Year 1',
		'B.Sc (Hons) Geology- Year 2',
		'B.Sc (Hons) Geology- Year 3',

		'B.Sc (Hons) Anthropology- Year 1',
		'B.Sc (Hons) Anthropology- Year 2',
		'B.Sc (Hons) Anthropology- Year 3',

		'B.Sc (Hons) Microbiology- Year 1',
		'B.Sc (Hons) Microbiology- Year 2',
		'B.Sc (Hons) Microbiology- Year 3',

		'B.Sc (Hons) Bio-Chemistry - Year 1',
		'B.Sc (Hons) Bio-Chemistry - Year 2',
		'B.Sc (Hons) Bio-Chemistry - Year 3',

		'B.Sc (Hons) Biomedical Science- Year 1',
		'B.Sc (Hons) Biomedical Science- Year 2',
		'B.Sc (Hons) Biomedical Science- Year 3',

		'B.Sc (Hons) Polymer Science - Year 1',
		'B.Sc (Hons) Polymer Science - Year 2',
		'B.Sc (Hons) Polymer Science - Year 3',

		'B.A (Hons) English- Year 1',
		'B.A (Hons) English- Year 1',
		'B.A (Hons) English- Year 1',

		'B.A. (Hons) Economics- Year 1',
		'B.A. (Hons) Economics- Year 2',
		'B.A. (Hons) Economics- Year 3',

		'B.A. (Hons.) Business Economics- Year 1',
		'B.A. (Hons.) Business Economics- Year 2',
		'B.A. (Hons.) Business Economics- Year 3',

		'B.A. (Hons.) Multimedia and Mass Communication- Year 1',
		'B.A. (Hons.) Multimedia and Mass Communication- Year 2',
		'B.A. (Hons.) Multimedia and Mass Communication- Year 3',

		'B.A (Hons) Political Science- Year 1',
		'B.A (Hons) Political Science- Year 2',
		'B.A (Hons) Political Science- Year 3',

		'B.A (Hons) Psychology- Year 1',
		'B.A (Hons) Psychology- Year 2',
		'B.A (Hons) Psychology- Year 3',

		'B.A. (Hons) Business Economics (BBE)- Year 1',
		'B.A. (Hons) Business Economics (BBE)- Year 2',
		'B.A. (Hons) Business Economics (BBE)- Year 3',

		'B.A (Hons) Spanish- Year 1',
		'B.A (Hons) Spanish- Year 2',
		'B.A (Hons) Spanish- Year 3',

		'B.A (Hons) Sanskrit- Year 1',
		'B.A (Hons) Sanskrit- Year 2',
		'B.A (Hons) Sanskrit- Year 3'
	];
	showDateError: boolean;
	@ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;
	@ViewChild('auto') matAutocomplete: MatAutocomplete;

	constructor(
		private tutorService: TutorService,
		private httpService: HttpService,
		private firebaseStorage: AngularFireStorage,
		private snackBar: MatSnackBar,
		private matDialog: MatDialog
	) {
		this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
			startWith(null),
			map((fruit: string | null) => (fruit ? this._filter(fruit) : this.allFruits.slice()))
		);
	}

	updateBasicTutorProfile(profilePictureUrl) {
		this.basicTutorProfileDetails.subject1 = this.fruits[0];
		this.basicTutorProfileDetails.subject2 = this.fruits[1];
		this.basicTutorProfileDetails.subject3 = this.fruits[2];
		this.basicTutorProfileDetails.gradeLevel = this.gradeLevel;
		this.basicTutorProfileDetails.price1 = this.price1;
		this.basicTutorProfileDetails.fullName = this.tutorService.getTutorDetials().fullName;
		this.basicTutorProfileDetails.tid = this.tutorService.getTutorDetials().tid;
		this.basicTutorProfileDetails.profilePictureUrl = profilePictureUrl;
		this.tutorService.setTutorProfileDetails(this.basicTutorProfileDetails);
		this.httpService.updateTutorProfileDetails(this.basicTutorProfileDetails).subscribe((res) => {});
	}

	basicInfoComplete(basicInfo: NgForm) {
		this.tutorProfile.dateOfBirth = basicInfo.value.dateOfBirth;
		var tutorDOB = this.tutorProfile.dateOfBirth.split('-');

		var dobYear = parseInt(tutorDOB[0]);
		var maxYear = new Date().getFullYear() - 6;
		var minYear = new Date().getFullYear() - 70;

		if (dobYear < maxYear && dobYear > minYear) {
			this.gradeLevel = basicInfo.value.gradeLevel;
			this.tutorService.tutorProfileDetails.price1 = this.price1 = basicInfo.value.price1;
			this.tutorProfile = basicInfo.value;
			this.tutorProfile.email = this.userEmail;
			this.tutorProfile.tid = this.tutorService.getTutorDetials().tid;
			if (this.areSubjectsValid()) {
				if (this.profilePictureUrl == null) {
				} else {
					this.tutorProfile.profilePictureUrl = this.profilePictureUrl;
					this.formProgress += 25;
					this.tutorService.tutorProfileDetails.profileCompleted = 37;
					this.httpService.updateTutorProfile(this.tutorProfile).subscribe((res) => {
						this.tutorService.setTutorDetails(this.tutorProfile);
						this.updateBasicTutorProfile(this.tutorProfile.profilePictureUrl);
					});
				}
			} else {
				this.subjectsValid = false;
			}
		} else {
			this.showDateError = true;
		}
	}

	areSubjectsValid() {
		var flags: number[] = [ 0, 0, 0 ];
		var errorFlag: number = 0;
		var i: number;
		if(this.fruits.length!=3){
			// errorFlag = 1;
			this.only3Subjects = true;
			//show error. you are required to select 3 subjects only
		}else{
			this.only3Subjects = false;
			for (i = 0; i < 3; i++) {
				var subject: string = this.fruits[i];
				for (let fruit of this.allFruits) {
					if (subject == fruit) {
						flags[i] = 1;
					}
				}
			}
			for (let element of flags) {
				if (element == 0) {
					errorFlag = 1;
				}
			}
		}
		
		if((this.fruits[0]==this.fruits[1]) || (this.fruits[1]==this.fruits[2]) || (this.fruits[2]==this.fruits[0])){
			this.only3Subjects = true;
		}

		if (errorFlag == 1 || this.only3Subjects) {
			return false;
		} else {
			return true;
		}
	}
	profileComplete(profileForm: NgForm) {
		this.tutorProfileDetails = profileForm.value;
		this.tutorProfileDetails.subject1 = this.tutorService.getTutorProfileDetails().subject1;
		this.tutorProfileDetails.subject2 = this.tutorService.getTutorProfileDetails().subject2;
		this.tutorProfileDetails.subject3 = this.tutorService.getTutorProfileDetails().subject3;
		this.tutorProfileDetails.tid = this.tutorService.getTutorProfileDetails().tid;
		this.tutorProfileDetails.gradeLevel = this.tutorService.getTutorProfileDetails().gradeLevel;
		this.tutorProfileDetails.fullName = this.tutorService.getTutorDetials().fullName;
		this.tutorProfileDetails.profilePictureUrl = this.tutorService.getTutorDetials().profilePictureUrl;
		this.tutorProfileDetails.price1 = this.tutorService.getTutorProfileDetails().price1;
		this.httpService.updateTutorProfileDetails(this.tutorProfileDetails).subscribe((res) => {
			this.tutorService.setTutorProfileDetails(this.tutorProfileDetails);
		});
		this.formProgress += 25;
		this.tutorService.tutorProfileDetails.profileCompleted = 62;
	}
	verificationComplete(verificationForm: NgForm) {
		if (this.disableContinue2 && this.disableContinue1) {
			this.formProgress = 99;
			this.tutorService.tutorProfileDetails.profileCompleted = 99;
			this.tutorVerification = verificationForm.value;
			this.tutorVerification.idDocUrl = this.idDocUrl;
			this.tutorVerification.educationDocUrl = this.educationDocUrl;
			this.tutorVerification.tid = this.tutorService.getTutorDetials().tid;
			if (this.idDocUrl == null && this.educationDocUrl == null) {
			} else {
				this.httpService.updateTutorVerification(this.tutorVerification).subscribe((res) => {
					this.profileCompleted = true;
					this.tutorFormDetails = this.tutorService.getTutorProfileDetails();
					this.profilePictureDisplay = this.tutorService.getTutorDetials().profilePictureUrl;
				});
			}
		} else {
		}
	}

	//-----------------------------------------firebase management-------------------------

	//profile picture change function
	profilePictureChange(event) {
		// this.profilePictureDisabled = true;
		this.uploadedProfilePicture = <File>event.target.files[0];
		this.uploadProfilePicture();
	}
	profilePictureChangeCompleted(event) {
		this.uploadedProfilePicture = <File>event.target.files[0];
		var filePath = `tutor_profile_picture/${this.uploadedProfilePicture}_${new Date().getTime()}`;
		const fileRef = this.firebaseStorage.ref(filePath);
		this.firebaseStorage
			.upload(filePath, this.uploadedProfilePicture)
			.snapshotChanges()
			.pipe(
				finalize(() => {
					fileRef.getDownloadURL().subscribe((url) => {
						var tutorProfileDetails: tutorProfileDetails = this.tutorService.getTutorProfileDetails();
						this.profilePictureUrl = url;
						tutorProfileDetails.profilePictureUrl = this.profilePictureUrl;
						this.httpService.editTutorProfileDetails(tutorProfileDetails).subscribe((res) => {
							var tutProfile: tutorProfile = this.tutorService.getTutorDetials();
							tutProfile.profilePictureUrl = this.profilePictureUrl;
							this.httpService.editBasicProfile(tutProfile).subscribe((res) => {
								this.tutorProfile.profilePictureUrl = this.profilePictureUrl;
								this.snackBar.open('Image Uploaded successfully', 'close', this.config);
							});
						});
					});
				})
			)
			.subscribe();
	}
	//id document change function
	idDocumentChange(event) {
		this.uploadedIdDocument = <File>event.target.files[0];
		this.uploadIdDocument();
	}
	//education document change function
	educationDocumentChange(event) {
		this.uploadedEducationDocument = <File>event.target.files[0];
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
						this.disableContinue2 = true;
						this.profilePictureUrl = url;
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
						this.disableContinue1 = true;
						this.idDocUrl = url;
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
						this.disableContinue2 = true;
						this.snackBar.open('education document Uploaded successfully', 'close', this.config);
					});
				})
			)
			.subscribe();
	}
	// -------------------------------------------------------------------------------------------------------------------------------------

	// Edit profile functions

	basicInfoEdit() {
		this.tutorService.setEditFuntion('EditBasicInfo');
		this.matDialog.open(UpdateboxComponent, {
			width: 'auto',
			height: 'auto'
		});
	}

	tutProfileDetailsEdit() {
		this.tutorService.setEditFuntion('tutProfileDetailsEdit');
		this.matDialog.open(UpdateboxComponent, {
			width: 'auto',
			height: 'auto'
		});
	}

	tutProfileDetailsEdit2() {
		this.tutorService.setEditFuntion('tutProfileDetailsEdit2');
		this.matDialog.open(UpdateboxComponent, {
			width: 'auto',
			height: 'auto'
		});
	}

	tutProfileDetailsEdit3() {
		this.tutorService.setEditFuntion('tutProfileDetailsEdit3');
		this.matDialog.open(UpdateboxComponent, {
			width: 'auto',
			height: 'auto'
		});
	}

	tutProfileDetailsEdit4() {
		this.tutorService.setEditFuntion('tutProfileDetailsEdit4');
		this.matDialog.open(UpdateboxComponent, {
			width: 'auto',
			height: 'auto'
		});
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
