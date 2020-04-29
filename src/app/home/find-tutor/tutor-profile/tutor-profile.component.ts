import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../../service/profile.service';
import { tutorProfileDetails } from '../../../model/tutorProfileDetails';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { meetingDetails } from 'src/app/model/meetingDetails';
import { MeetingService } from 'src/app/service/meeting.service';
import { NgForm } from '@angular/forms';
import { bookingDetails } from 'src/app/model/bookingDetails';
import { Time } from '@angular/common';
import { StudentService } from 'src/app/service/student.service';
import { HttpService } from 'src/app/service/http.service';

@Component({
	selector: 'app-tutor-profile',
	templateUrl: './tutor-profile.component.html',
	styleUrls: [ './tutor-profile.component.css' ]
})
export class TutorProfileComponent implements OnInit {
	teacherProfile = new tutorProfileDetails();
	meetingDetails = new meetingDetails();
	bookingDetails = new bookingDetails();
	time = { hour: 13, minute: 30 };
	endTime = {
		hour: 0,
		minute: 0
	};
	model: NgbDateStruct;
	meridian = true;
	date: Date = new Date();
	settings = {
		bigBanner: true,
		timePicker: true,
		format: 'dd-MM-yyyy hh:mm a',
		defaultOpen: false,
		closeOnSelect: false
	};
	constructor(
		private profileService: ProfileService,
		private meetingSevice: MeetingService,
		private studentService: StudentService,
		private httpService: HttpService
	) {}
	ngOnInit(): void {
		this.teacherProfile = this.profileService.getProfile();
	}
	openSideNav() {
		document.getElementById('mySidenav').style.width = '315px';
	}
	closeSideNav() {
		document.getElementById('mySidenav').style.width = '0';
	}
	toggleMeridian() {
		this.meridian = !this.meridian;
	}
	onBooking(form: NgForm) {
		console.log(form.value.dateOfMeeting);
		var date = form.value.dateOfMeeting;
		var description = form.value.description;
		var duration = form.value.duration;
		var time = this.time;
		this.bookingDetails.startTimeHour = time.hour;
		this.bookingDetails.startTimeMinute = time.minute;
		this.bookingDetails.dateOfMeeting = date;
		this.bookingDetails.description = description;
		this.bookingDetails.duration = duration;
		this.bookingDetails.endTimeHour = this.calculateEndTime(this.time, form.value.duration).hour;
		this.bookingDetails.endTimeMinute = this.calculateEndTime(this.time, form.value.duration).minute;
		this.bookingDetails.meetingId = this.onGenerateString(10);
		this.bookingDetails.tutorId = this.teacherProfile.tid;
		this.bookingDetails.studentName = this.studentService.getStudentProfileDetails().fullName;
		this.bookingDetails.tutorName = this.teacherProfile.name;
		this.bookingDetails.studentId = this.studentService.getStudentProfileDetails().sid;
		this.httpService.saveBooking(this.bookingDetails).subscribe((res) => {
			if (res == true) {
				console.log('booking submitted successfully !');
			}
		});
		console.log(this.bookingDetails);
	}
	//for generating the hash code
	onGenerateString(l) {
		var text = '';
		var char_list = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		for (var i = 0; i < l; i++) {
			text += char_list.charAt(Math.floor(Math.random() * char_list.length));
		}
		return text;
	}
	//for calculating the end time
	calculateEndTime(startTime, duration) {
		console.log(startTime + duration);
		var numberOfHours: number;
		var numberOfMinutes: number;
		numberOfHours = duration - duration % 1;
		numberOfMinutes = (duration % 1) * 60;
		var startTimeHours = startTime.hour;
		var startTimeMinutes = startTime.minute;
		this.endTime.hour = startTimeHours + numberOfHours;
		this.endTime.minute = startTimeMinutes + numberOfMinutes;
		if (this.endTime.minute >= 60) {
			var newMinute = this.endTime.minute - 60;
			this.endTime.hour++;
			this.endTime.minute = newMinute;
		}
		this.endTime.hour = Math.trunc(this.endTime.hour);
		this.endTime.minute = Math.trunc(this.endTime.minute);
		return this.endTime;
	}
}
