import { Component, OnInit } from '@angular/core';
import { StudentProfileModel } from 'src/app/model/studentProfile';
import { StudentService } from 'src/app/service/student.service';
import { MatDialog } from '@angular/material/dialog';
import { UpdateboxstudentComponent } from './updateboxstudent/updateboxstudent.component';
import { NgForm } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from "@angular/material/snack-bar";
import { finalize } from "rxjs/operators";
import { AngularFireStorage } from "@angular/fire/storage";
import { HttpService } from "../../service/http.service";
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith} from 'rxjs/operators';

@Component({
	selector: 'app-student-profile',
	templateUrl: './student-profile.component.html',
	styleUrls: [ './student-profile.component.css' ]
})
export class StudentProfileComponent implements OnInit {
	constructor(private studentService: StudentService, 
				private matDialog: MatDialog,
    			private snackBar: MatSnackBar,
				private firebaseStorage: AngularFireStorage,
				private httpService: HttpService) {}

	studentProfile: StudentProfileModel;
	myControl = new FormControl();
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
	filteredOptions: Observable<string[]>;
	// learningAreas = new Array(3);
	uploadedProfilePicture: File = null;
	index: Number;
	learningArea;
	profilePictureUrl;
	learningAreas: string[] = [];
	snackBarConfig: MatSnackBarConfig = {
		duration: 2000,
		horizontalPosition: "center",
		verticalPosition: "top",
	  };

	ngOnInit(): void {
		this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
		this.index = 1;
		this.openNav();
		// this.disableSub = true;
		this.studentProfile = this.studentService.getStudentProfileDetails();
		this.handleRefresh();
	}

	private _filter(value: string): string[] {
		const filterValue = value.toLowerCase();
		return this.options.filter(option => option.toLowerCase().includes(filterValue));
	}

	addLearningArea(){
		this.learningAreas.push(this.learningArea);
		this.learningArea = '';
	}

	subtractLearningArea(index: any){
		this.learningAreas.splice(index, 1);
	}

	navAction(index){
		if(index%2==1){
			this.index = index + 1;
			this.closeNav();
		}else{
			this.index = index + 1;
			this.openNav();
		}
	}
	openNav() {
		document.getElementById("sidenav").style.width = "230px";
		document.getElementById("mainContent").style.marginLeft = "230px";
	  }
	  
	closeNav() {
		document.getElementById("sidenav").style.width = "0";
		document.getElementById("mainContent").style.marginLeft= "0";
	}

	saveStudentProfile(form: NgForm){
		console.log(form);
		this.studentProfile.contact = form.value.contact;
		this.studentProfile.dateOfBirth = form.value.dob;
		this.studentProfile.email = form.value.email;
		this.studentProfile.fullName = form.value.fullName;
		this.studentProfile.linkProfile = form.value.linkProfile;
		this.studentProfile.learningAreas = this.learningAreas;
		console.log(this.studentProfile);
		if(this.learningAreasDuplicacyCheck(this.learningAreas)){
			this.httpService.updateStudentProfile(this.studentProfile).subscribe(res=>{
				console.log(res);
			})
		}else{
			console.log("duplicate entries found");
		}	
	}

	learningAreasDuplicacyCheck(fields: string[]){
		for(var i=0; i<fields.length-1; i++){
			for(var j=i+1; j<fields.length; j++){
				if(fields[i]==fields[j]){
					return false;
				}
			}
		}
		return true;
	}

	profilePictureChange(event) {
		this.uploadedProfilePicture = <File>event.target.files[0];
		this.uploadProfilePicture();
	  }
	
	  //for uploading profile picture
	uploadProfilePicture() {
		var filePath = `tutor_profile_picture/${
		  this.uploadedProfilePicture
		}_${new Date().getTime()}`;
		const fileRef = this.firebaseStorage.ref(filePath);
		this.firebaseStorage
		  .upload(filePath, this.uploadedProfilePicture)
		  .snapshotChanges()
		  .pipe(
			finalize(() => {
			  fileRef.getDownloadURL().subscribe((url) => {
				this.profilePictureUrl = url;
				this.studentProfile.profilePictureUrl = this.profilePictureUrl;
	
				this.snackBar.open(
				  "Image Uploaded successfully",
				  "close",
				  this.snackBarConfig
				);
			  });
			})
		  )
		  .subscribe();
	  }

	basicInfoEdit() {
		this.studentService.setEditFuntion('basicInfoEdit');
		this.matDialog.open(UpdateboxstudentComponent, {
			width: 'auto',
			height: 'auto'
		});
	}
	tutProfileDetailsEdit() {
		this.studentService.setEditFuntion('basicInfoEdit2');
		this.matDialog.open(UpdateboxstudentComponent, {
			width: 'auto',
			height: 'auto'
		});
	}
	handleRefresh() {
		if (!this.studentProfile.sid) {
			setTimeout(() => {
				this.studentProfile = this.studentService.getStudentProfileDetails();
			}, 1000);
		}
	}
}
