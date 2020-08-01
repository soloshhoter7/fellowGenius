import { Component, OnInit } from '@angular/core';
import { StudentService } from 'src/app/service/student.service';
import { StudentProfileModel } from 'src/app/model/studentProfile';
import { NgForOf } from '@angular/common';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { HttpService } from 'src/app/service/http.service';

@Component({
	selector: 'app-updateboxstudent',
	templateUrl: './updateboxstudent.component.html',
	styleUrls: [ './updateboxstudent.component.css' ]
})
export class UpdateboxstudentComponent implements OnInit {
	constructor(
		private studentService: StudentService,
		private dialog: MatDialog,
		private snackBar: MatSnackBar,
		private http: HttpService
	) {}
	editVariable: string;
	studentProfile = new StudentProfileModel();
	mobNumberPattern = '^((\\+91-?)|0)?[0-9]{10}$';
	snackBarConfig: MatSnackBarConfig = {
		duration: 2000,
		horizontalPosition: 'center',
		verticalPosition: 'top'
	};

	ngOnInit(): void {
		this.editVariable = this.studentService.getEditFunction();
		this.studentProfile = this.studentService.getStudentProfileDetails();
	}

	editBasicInfo(ngForm: NgForm) {
		this.studentProfile = this.studentService.getStudentProfileDetails();
		this.studentProfile = ngForm.value;
		this.studentProfile.sid = this.studentService.getStudentProfileDetails().sid;
		this.studentProfile.email = this.studentService.getStudentProfileDetails().email;
		this.http.updateStudentProfile(this.studentProfile).subscribe((res) => {
			this.snackBar.open('Profile details updated successfully !', 'close', this.snackBarConfig);
			this.dialog.closeAll();
		});
	}
	editBasicInfo2(ngForm: NgForm) {
		this.studentProfile = this.studentService.getStudentProfileDetails();
		this.studentProfile.fullName = ngForm.value.fullName;

		this.http.updateStudentProfile(this.studentProfile).subscribe((res) => {
			this.snackBar.open('Profile details updated successfully !', 'close', this.snackBarConfig);
			this.dialog.closeAll();
		});
	}
}
