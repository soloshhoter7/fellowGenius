import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TutorService } from 'src/app/service/tutor.service';
import { tutorProfile } from 'src/app/model/tutorProfile';
import { tutorProfileDetails } from 'src/app/model/tutorProfileDetails';
import { NgForm, FormControl } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { HttpService } from 'src/app/service/http.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { finalize } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
@Component({
	selector: 'app-updatebox',
	templateUrl: './updatebox.component.html',
	styleUrls: [ './updatebox.component.css' ]
})
export class UpdateboxComponent implements OnInit {
	subjectsValid: boolean;
	constructor(
		private tutorService: TutorService,
		private httpService: HttpService,
		private dialog: MatDialog,
		private snackBar: MatSnackBar,
		private firebaseStorage: AngularFireStorage
	) {}
	tutorProfile = new tutorProfile();
	tutorProfileDetails = new tutorProfileDetails();
	editVariable: string;
	updatedTutorProfile = new tutorProfile();
	mobNumberPattern = '^((\\+91-?)|0)?[0-9]{10}$';
	maxGraduationYear = new Date().getFullYear() + 5;
	selectable = true;
	removable = true;
	separatorKeysCodes: number[] = [ ENTER, COMMA ];
	updateTutorProfileDetails = new tutorProfileDetails();
	fruitCtrl = new FormControl();
	filteredFruits: Observable<string[]>;
	fruits: string[] = [];
	profilePictureUrl;
	uploadedProfilePicture: File = null;
	only3Subjects: boolean;
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
	snackBarConfig: MatSnackBarConfig = {
		duration: 2000,
		horizontalPosition: 'center',
		verticalPosition: 'top'
	};
	@ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;
	@ViewChild('auto') matAutocomplete: MatAutocomplete;

	ngOnInit(): void {
		this.tutorProfile = this.tutorService.getTutorDetials();
		this.tutorProfileDetails = this.tutorService.getTutorProfileDetails();
		this.editVariable = this.tutorService.getEditFunction();
	}

	// name email contact dob addressline1 and 2
	// editBasicInfo(editBasicInfo: NgForm) {
	//   this.updatedTutorProfile = this.tutorService.getTutorDetials();
	//   this.updatedTutorProfile.fullName = editBasicInfo.value.fullName;
	//   this.updatedTutorProfile.email = this.tutorService.getTutorDetials().email;
	//   this.updatedTutorProfile.addressLine1 = editBasicInfo.value.addressLine1;
	//   this.updatedTutorProfile.addressLine2 = editBasicInfo.value.addressLine2;
	//   this.updatedTutorProfile.dateOfBirth = editBasicInfo.value.dateOfBirth;
	//   this.updatedTutorProfile.contact = editBasicInfo.value.contact;

	//   this.httpService
	//     .editBasicInfo(this.updatedTutorProfile)
	//     .subscribe((res) => {
	//       this.snackBar.open(
	//         "Profile details updated successfully !",
	//         "close",
	//         this.snackBarConfig
	//       );
	//       this.dialog.closeAll();
	//     });
	// }

	// //majorSubject, graduation year
	// profileCompleteEdit(profileFormEdit: NgForm) {
	//   this.updateTutorProfileDetails = this.tutorProfileDetails;
	//   this.updateTutorProfileDetails.majorSubject =
	//     profileFormEdit.value.majorSubject;
	//   // this.updateTutorProfileDetails.graduationYear = profileFormEdit.value.graduationYear;
	//   this.updateTutorProfileDetails.graduationYear = this.tutorProfileDetails.graduationYear;
	//   // this.updateTutorProfileDetails.studyInstitution =
	//   //   profileFormEdit.value.studyInstitution;
	//   this.httpService
	//     .editTutorProfileDetails(this.updateTutorProfileDetails)
	//     .subscribe((res) => {
	//       this.snackBar.open(
	//         "Profile details updated successfully !",
	//         "close",
	//         this.snackBarConfig
	//       );
	//       this.dialog.closeAll();
	//     });
	// }

	// //fruits , grade level
	// profileCompleteEdit2(profileFormEdit2: NgForm) {
	//   this.updateTutorProfileDetails = this.tutorProfileDetails;

	//   this.updateTutorProfileDetails.gradeLevel =
	//     profileFormEdit2.value.gradeLevel;
	//   this.fruits.push(profileFormEdit2.value.subject1);
	//   this.fruits.push(profileFormEdit2.value.subject2);
	//   this.fruits.push(profileFormEdit2.value.subject3);
	//   if (this.areSubjectsValid()) {
	//     this.updateTutorProfileDetails.subject1 = profileFormEdit2.value.subject1;
	//     this.updateTutorProfileDetails.subject2 = profileFormEdit2.value.subject2;
	//     this.updateTutorProfileDetails.subject3 = profileFormEdit2.value.subject3;

	//     this.httpService
	//       .editTutorProfileDetails(this.updateTutorProfileDetails)
	//       .subscribe((res) => {
	//         this.snackBar.open(
	//           "Profile details updated successfully !",
	//           "close",
	//           this.snackBarConfig
	//         );
	//         this.dialog.closeAll();
	//       });

	//     this.subjectsValid = false;
	//   }
	// }
	// areSubjectsValid() {
	//   this.only3Subjects = false;
	//   var flags: number[] = [0, 0, 0];
	//   var errorFlag: number = 0;
	//   var i: number;
	//   if (this.fruits.length != 3) {
	//     // errorFlag = 1;
	//     this.only3Subjects = true;
	//     //show error. you are required to select 3 subjects only
	//   } else {
	//     this.only3Subjects = false;
	//   }

	//   if (
	//     this.fruits[0] == this.fruits[1] ||
	//     this.fruits[1] == this.fruits[2] ||
	//     this.fruits[2] == this.fruits[0]
	//   ) {
	//     this.only3Subjects = true;
	//   }

	//   if (this.only3Subjects) {
	//     return false;
	//   } else {
	//     return true;
	//   }
	// }
	// //description, speciality
	// profileCompleteEdit3(profileFormEdit3: NgForm) {
	//   this.updateTutorProfileDetails = this.tutorProfileDetails;
	//   this.updateTutorProfileDetails.description =
	//     profileFormEdit3.value.description;
	//   this.updateTutorProfileDetails.speciality =
	//     profileFormEdit3.value.speciality;

	//   this.httpService
	//     .editTutorProfileDetails(this.updateTutorProfileDetails)
	//     .subscribe((res) => {
	//       this.snackBar.open(
	//         "Profile details updated successfully !",
	//         "close",
	//         this.snackBarConfig
	//       );
	//       this.dialog.closeAll();
	//     });
	// }

	// //city state country
	// profileCompleteEdit4(profileFormEdit4: NgForm) {
	//   this.updatedTutorProfile = this.tutorService.getTutorDetials();
	//   this.updatedTutorProfile.city = profileFormEdit4.value.city;
	//   this.updatedTutorProfile.state = profileFormEdit4.value.state;
	//   this.updatedTutorProfile.country = profileFormEdit4.value.country;

	//   this.httpService
	//     .editBasicProfile(this.updatedTutorProfile)
	//     .subscribe((res) => {
	//       this.snackBar.open(
	//         "Profile details updated successfully !",
	//         "close",
	//         this.snackBarConfig
	//       );
	//       this.dialog.closeAll();
	//     });
	// }

	// //....................................for chips
	// add(event: MatChipInputEvent): void {
	//   const input = event.input;
	//   const value = event.value;

	//   // Add our fruit
	//   if ((value || "").trim()) {
	//     this.fruits.push(value.trim());
	//   }

	//   // Reset the input value
	//   if (input) {
	//     input.value = "";
	//   }

	//   this.fruitCtrl.setValue(null);
	// }

	// remove(fruit: string): void {
	//   const index = this.fruits.indexOf(fruit);

	//   if (index >= 0) {
	//     this.fruits.splice(index, 1);
	//   }
	// }

	// selected(event: MatAutocompleteSelectedEvent): void {
	//   this.fruits.push(event.option.viewValue);
	//   this.fruitInput.nativeElement.value = "";
	//   this.fruitCtrl.setValue(null);
	// }

	// private _filter(value: string): string[] {
	//   const filterValue = value.toLowerCase();

	//   return this.allFruits.filter(
	//     (fruit) => fruit.toLowerCase().indexOf(filterValue) === 0
	//   );
	// }

	// profilePictureChange(event) {
	//   this.uploadedProfilePicture = <File>event.target.files[0];

	//   this.uploadProfilePicture();
	// }

	// //for uploading profile picture
	// uploadProfilePicture() {
	//   var filePath = `tutor_profile_picture/${
	//     this.uploadedProfilePicture
	//   }_${new Date().getTime()}`;
	//   const fileRef = this.firebaseStorage.ref(filePath);
	//   this.firebaseStorage
	//     .upload(filePath, this.uploadedProfilePicture)
	//     .snapshotChanges()
	//     .pipe(
	//       finalize(() => {
	//         fileRef.getDownloadURL().subscribe((url) => {
	//           this.profilePictureUrl = url;
	//           this.tutorProfile.profilePictureUrl = this.profilePictureUrl;

	//           this.snackBar.open(
	//             "Image Uploaded successfully",
	//             "close",
	//             this.snackBarConfig
	//           );
	//         });
	//       })
	//     )
	//     .subscribe();
	// }
}
