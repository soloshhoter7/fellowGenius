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
import { ScheduleTime } from '../../../model/ScheduleTime';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
	selector: 'app-tutor-profile',
	templateUrl: './tutor-profile.component.html',
	styleUrls: [ './tutor-profile.component.css' ]
})
export class TutorProfileComponent implements OnInit {
	config: MatSnackBarConfig = {
		duration: 2000,
		horizontalPosition: 'center',
		verticalPosition: 'top'
	};
	teacherProfile = new tutorProfileDetails();
	meetingDetails = new meetingDetails();
	bookingDetails = new bookingDetails();
	clickedIndex: number;
	startDate: string;
	startTimeString = 'Start Time';
	endTimeString = 'End Time';
	endSelect= -1;
	startSelect= -1;
	time = { hour: 13, minute: 30 };
	endTime = {
		hour: 0,
		minute: 0
	};
	st = {
		sh: -1,
		sm: -1
	};
	et = {
		eh: -1,
		em: -1
	};

	dates = [];
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
	ScheduleTime: ScheduleTime[] = [];
	fullDate = [];
	constructor(
		private profileService: ProfileService,
		private meetingSevice: MeetingService,
		private studentService: StudentService,
		private httpService: HttpService,
		private snackBar: MatSnackBar,
		private router: Router,
		private dialogRef: MatDialog
	) {}
	ngOnInit(): void {
		this.teacherProfile = this.profileService.getProfile();
		console.log(this.teacherProfile.tid);
		this.timeFrom(-7);
		this.timeFrom2(-7);
		this.httpService.getTutorTimeAvailabilityTimeArray(this.teacherProfile.tid).subscribe((res) => {
			console.log(res);
			this.ScheduleTime = res;
		});
	}

	timeSelector(event, index: number, todayDate: string) {
		this.clickedIndex = index;
		if (this.st.sh == -1 && this.st.sm == -1 && this.et.eh == -1 && this.et.em == -1) {
			this.startDate = event.date;
			this.st.sh = event.hours;
			this.st.sm = event.minutes;
			event.isStartDate = true;
			this.startSelect=this.clickedIndex;
			this.startTimeString = this.st.sh + ':' + this.st.sm;
			console.log('Start time is ->' + this.st.sh + ':' + this.st.sm);

		} else if (this.st.sh != -1 && this.st.sm != -1 && this.et.eh == -1 && this.et.em == -1) {
			if (this.startDate == event.date) {
				this.et.eh = event.hours;
				this.et.em = event.minutes;
				if (this.et.eh * 60 + this.et.em >= this.st.sh * 60 + this.st.sm) {
					event.isEndDate = true;
					this.endSelect = this.clickedIndex;
					this.endTimeString = this.et.eh + ':' + this.et.em;
					console.log('End time is ->' + this.et.eh + ':' + this.et.em);
					
				} else {
					this.startSelect =-1;
					this.endSelect = -1;
					console.log('Start time and end time reset');
					event.isEndDate = false;
					event.isStartDate = false;
					this.et.eh = -1;
					this.et.em = -1;
					this.st.sh = -1;
					this.st.sm = -1;
					this.startTimeString = 'Start Time ';
					this.endTimeString = 'End Time';
					
				}
			} else {
				console.log('StartSelect is -->' + this.startSelect + "EndSelect is -->" + this.endSelect);
				console.log('start date and end date are different');
				event.isStartDate = false;
				this.startSelect = -1
				this.st.sh = -1;
				this.st.sm = -1;
				this.startTimeString = 'Start Time ';
			}
		} else if (this.st.sh != -1 && this.st.sm != -1 && this.et.eh != -1 && this.et.em != -1) {
			this.startSelect = this.clickedIndex;
			this.endSelect = -1;
			this.startDate = event.date;
			this.st.sh = event.hours;
			this.st.sm = event.minutes;
			this.et.eh = -1;
			this.et.em = -1;
			event.isEndDate = false;
			this.startTimeString = this.st.sh + ':' + this.st.sm;
			this.endTimeString = 'End Time';
			console.log('Start Time is ->' + this.st.sh + ':' + this.st.sm);
			console.log('StartSelect is -->' + this.startSelect + "EndSelect is -->" + this.endSelect);
			console.log('End time is not defined yet');
		}
	}

	timeFrom = (X) => {
		for (let I = 0; I < Math.abs(X); I++) {
			this.fullDate.push(
				new Date(new Date().getTime() - (X >= 0 ? I : I - I - I) * 24 * 60 * 60 * 1000)
				
			);
		}
	};

	timeFrom2 = (X) => {
		for (let I = 0; I < Math.abs(X); I++) {
			this.dates.push(
				// this.convertDate(
				new Date(new Date().getTime() - (X >= 0 ? I : I - I - I) * 24 * 60 * 60 * 1000).toLocaleDateString(
					'en-GB'
				)
				// )
			);
		}
	};
	// convertDate(inputFormat) {
	// 	function pad(s) {
	// 		return s < 10 ? '0' + s : s;
	// 	}
	// 	var d = new Date(inputFormat);
	// 	return [ pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear() ].join('/');
	// }
	openSideNav() {
		document.getElementById('mySidenav').style.width = '550px';
	}
	closeSideNav() {
		document.getElementById('mySidenav').style.width = '0';
	}
	toggleMeridian() {
		this.meridian = !this.meridian;
	}
	// setBookingDescription(ngForm: NgForm){
	// 	console.log(ngForm);
	// 	this.bookingDetails.description = ngForm.value.description;
	// }
	onBooking() {
		// console.log(form.value.dateOfMeeting);
		// var date = form.value.dateOfMeeting;
		// var description = form.value.description;
		// var duration = form.value.duration;
		// var time = this.time;
		this.bookingDetails.startTimeHour = this.st.sh;
		this.bookingDetails.startTimeMinute = this.st.sm;
		this.bookingDetails.dateOfMeeting = this.startDate;
		// this.bookingDetails.description = description;
		this.bookingDetails.duration = this.findDuration(this.st.sh, this.st.sm, this.et.eh, this.et.em);
		this.bookingDetails.endTimeHour = this.et.eh;
		this.bookingDetails.endTimeMinute = this.et.em;
		this.bookingDetails.meetingId = this.onGenerateString(10);
		this.bookingDetails.tutorId = this.teacherProfile.tid;
		this.bookingDetails.studentName = this.studentService.getStudentProfileDetails().fullName;
		this.bookingDetails.tutorName = this.teacherProfile.fullName;
		this.bookingDetails.studentId = this.studentService.getStudentProfileDetails().sid;
		this.httpService.saveBooking(this.bookingDetails).subscribe((res) => {
			if (res == true) {
				console.log('booking submitted successfully !');
				this.snackBar.open('Booking submitted successfully !', 'close', this.config);
				this.dialogRef.closeAll();
			}
		});
		console.log(this.bookingDetails);
	}

	findDuration(startHour, startMinute, endHour, endMinute) {
		return endHour * 60 + endMinute - (startHour * 60 + startMinute);
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

