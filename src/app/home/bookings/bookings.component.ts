import { Component, OnInit } from '@angular/core';
import { ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { colors } from '../../../colors';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours } from 'date-fns';
import { Subject } from 'rxjs';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView } from 'angular-calendar';

@Component({
	selector: 'app-bookings',
	templateUrl: './bookings.component.html',
	styleUrls: [ './bookings.component.css' ]
})
export class BookingsComponent implements OnInit {
	constructor() {}

	ngOnInit() {}
	view: CalendarView = CalendarView.Week;

	CalendarView = CalendarView;

	viewDate: Date = new Date();

	modalData: {
		action: string;
		event: CalendarEvent;
	};

	activeDayIsOpen: boolean = true;
	events: CalendarEvent[] = [
		{
			start: startOfDay(new Date()),
			title: 'An event',
			color: colors.yellow
		},
		{
			start: addHours(startOfDay(new Date()), 2),
			end: new Date(),
			title: 'Another event',
			color: colors.blue
		},
		{
			start: addDays(addHours(startOfDay(new Date()), 2), 2),
			end: addDays(new Date(), 2),
			title: 'And another',
			color: colors.red
		}
	];

	dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
		if (isSameMonth(date, this.viewDate)) {
			if ((isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) || events.length === 0) {
				this.activeDayIsOpen = false;
			} else {
				this.activeDayIsOpen = true;
			}
			this.viewDate = date;
		}
	}

	addEvent(): void {
		this.events = [
			...this.events,
			{
				title: 'New event',
				start: startOfDay(new Date()),
				end: endOfDay(new Date()),
				color: colors.red,
				draggable: true,
				resizable: {
					beforeStart: true,
					afterEnd: true
				}
			}
		];
	}

	deleteEvent(eventToDelete: CalendarEvent) {
		this.events = this.events.filter((event) => event !== eventToDelete);
	}

	setView(view: CalendarView) {
		this.view = view;
	}

	closeOpenMonthViewDay() {
		this.activeDayIsOpen = false;
	}
	openNav() {
		console.log('hey');
		document.getElementById('mySidenav').style.width = '30%';
	}
	closeNav() {
		document.getElementById('mySidenav').style.width = '0';
	}
}
// ----------------------------------------------------------------------------------
