import { Injectable } from '@angular/core';
import { StudentLoginModel } from '../model/studentLoginModel';
import { StudentProfileModel } from '../model/studentProfile';

@Injectable({
	providedIn: 'root'
})
export class StudentService {
	studentProfile = new StudentProfileModel();
	editVariable: string;
	setEditFuntion(editFunction: string) {
		this.editVariable = editFunction;
	}
	getEditFunction() {
		return this.editVariable;
	}
	setStudentProfileDetails(studentProfile: StudentProfileModel) {
		this.studentProfile = studentProfile;
	}
	getStudentProfileDetails() {
		return this.studentProfile;
	}
	constructor() {}
}
