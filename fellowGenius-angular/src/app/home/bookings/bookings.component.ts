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

@Component({
	selector: 'app-bookings',
	templateUrl: './bookings.component.html',
	styleUrls: [ './bookings.component.css' ]
})
export class BookingsComponent implements OnInit {
	constructor(private tutorService: TutorService) {}

	ngOnInit() {}

	@ViewChild('scheduleObj') public scheduleObj: ScheduleComponent;
	@ViewChild('addButton') public addButton: Button;
	public scheduleViews: View[] = [ 'Day', 'Week', 'WorkWeek', 'Month' ];
	tutorAvailabilitySchedule = new tutorAvailabilitySchedule();
	availabilitySchedule: Array<Object> = [];
	availableSchedules: scheduleData[] = [];
	public eventSettings: EventSettingsModel = {
		dataSource: this.tutorService.getPersonalAvailabilitySchedule().allMeetingsSchedule
	};
}
