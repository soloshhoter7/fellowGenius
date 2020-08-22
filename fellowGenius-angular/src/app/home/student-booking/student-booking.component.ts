import { Component, ViewChild, OnInit, Inject } from '@angular/core';
import {
	ScheduleComponent,
	EventSettingsModel,
	DayService,
	WeekService,
	WorkWeekService,
	MonthService,
	View,
	EventRenderedArgs,
	ActionEventArgs
} from '@syncfusion/ej2-angular-schedule';

import { Button } from '../../../../node_modules/@syncfusion/ej2-buttons';
import { timeInterval } from 'rxjs/operators';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { HttpService } from 'src/app/service/http.service';
import { scheduleData } from 'src/app/model/scheduleData';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { tutorAvailabilitySchedule } from 'src/app/model/tutorAvailabilitySchedule';
import { TutorService } from 'src/app/service/tutor.service';
import { StudentService } from 'src/app/service/student.service';

@Component({
	selector: 'app-student-booking',
	templateUrl: './student-booking.component.html',
	styleUrls: [ './student-booking.component.css' ]
})
export class StudentBookingComponent implements OnInit {
	constructor(private studentService: StudentService) {}

	ngOnInit() {
		if (this.studentService.getStudentBookings()) {
			this.scheduleObj.eventSettings.dataSource = this.studentService.getStudentBookings();
		} else {
			this.handleRefresh();
		}
	}

	@ViewChild('scheduleObj') public scheduleObj: ScheduleComponent;
	@ViewChild('addButton') public addButton: Button;
	public scheduleViews: View[] = [ 'Day', 'Week', 'WorkWeek', 'Month' ];

	handleRefresh() {
		setTimeout(() => {
			this.scheduleObj.eventSettings.dataSource = this.studentService.getStudentBookings();
		}, 2000);
	}
	public eventSettings: EventSettingsModel = {
		dataSource: this.studentService.getStudentBookings()
	};
}
