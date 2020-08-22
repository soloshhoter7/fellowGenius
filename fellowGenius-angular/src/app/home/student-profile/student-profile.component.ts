import { Component, OnInit } from '@angular/core';
import { StudentProfileModel } from 'src/app/model/studentProfile';
import { StudentService } from 'src/app/service/student.service';
import { MatDialog } from '@angular/material/dialog';
import { UpdateboxstudentComponent } from './updateboxstudent/updateboxstudent.component';

@Component({
	selector: 'app-student-profile',
	templateUrl: './student-profile.component.html',
	styleUrls: [ './student-profile.component.css' ]
})
export class StudentProfileComponent implements OnInit {
	constructor(private studentService: StudentService, private matDialog: MatDialog) {}

	studentProfile: StudentProfileModel;
	learningAreas = new Array(3);
	disableAdd: boolean;
	disableSub: boolean;
	index: Number;
	ngOnInit(): void {
		this.index = 1;
		this.openNav();
		this.disableAdd = false;
		this.disableSub = true;
		this.studentProfile = this.studentService.getStudentProfileDetails();

		this.handleRefresh();
	}

	addLearningArea(){
		
		if(this.learningAreas.length<5 && this.learningAreas.length>2){
			this.disableAdd = false;
			this.learningAreas.push(1);
			this.disableSub =false;
		}else{
			this.disableAdd = true;
		}
		
	}

	subtractLearningArea(){
		
		if(this.learningAreas.length<=3){
			this.disableSub = true;
			this.disableAdd = false;
		}else{
			this.disableSub=false;
			this.learningAreas.pop();
		}
		
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
