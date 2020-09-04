import { Component, OnInit } from '@angular/core';
import { StudentProfileModel } from 'src/app/model/studentProfile';
import { StudentService } from 'src/app/service/student.service';
import { MatDialog } from '@angular/material/dialog';
import { UpdateboxstudentComponent } from './updateboxstudent/updateboxstudent.component';
import { NgForm } from '@angular/forms';

@Component({
	selector: 'app-student-profile',
	templateUrl: './student-profile.component.html',
	styleUrls: [ './student-profile.component.css' ]
})
export class StudentProfileComponent implements OnInit {
	constructor(private studentService: StudentService, private matDialog: MatDialog) {}

	studentProfile: StudentProfileModel;
	// learningAreas = new Array(3);
	disableAdd: boolean;
	disableSub: boolean;
	index: Number;
	learningArea;
	learningAreas: string[] = [];
	
	ngOnInit(): void {
		this.index = 1;
		this.openNav();
		this.disableAdd = false;
		// this.disableSub = true;
		this.studentProfile = this.studentService.getStudentProfileDetails();

		this.handleRefresh();
	}

	addLearningArea(){
		console.log(this.learningAreas.length);
		if(this.learningAreas.length==5){
			this.disableAdd = true;
			// this.disableSub = true;
		}else{
			this.disableAdd = false;
			console.log(this.learningArea);
			this.learningAreas.push(this.learningArea);
			this.learningArea = '';
			
		}
		
	}

	subtractLearningArea(index: any){
		if(this.learningAreas.length<=5){
			this.disableAdd = false;
		}
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
		
	}

	addEducation() {
		console.log(this.learningArea);
		this.learningAreas.push(this.learningArea);
		this.learningArea = '';
	}

	deleteEducation(index: any) {
		this.learningAreas.splice(index, 1);
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
