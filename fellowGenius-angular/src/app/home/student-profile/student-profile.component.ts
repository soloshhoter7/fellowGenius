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

	ngOnInit(): void {
		this.studentProfile = this.studentService.getStudentProfileDetails();

		this.handleRefresh();
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
