import { Component, OnInit } from '@angular/core';
import { MeetingService } from 'src/app/service/meeting.service';
import { bookingDetails } from 'src/app/model/bookingDetails';
import { HttpService } from 'src/app/service/http.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSnackBarConfig, MatSnackBar } from '@angular/material/snack-bar';

@Component({
	selector: 'app-delete-popup',
	templateUrl: './delete-popup.component.html',
	styleUrls: [ './delete-popup.component.css' ]
})
export class DeletePopupComponent implements OnInit {
	constructor(
		private meetingService: MeetingService,
		private httpService: HttpService,
		private dialog: MatDialog,
		private router: Router,
		private snackBar: MatSnackBar
	) {}

	cancelBooking = new bookingDetails();
	pendingRequests: bookingDetails[];
	config: MatSnackBarConfig = {
		duration: 4000,
		horizontalPosition: 'center',
		verticalPosition: 'top',
		panelClass: [ 'snackbar' ]
	};
	ngOnInit(): void {
		this.cancelBooking = this.meetingService.getDeleteBooking();
		this.pendingRequests = this.meetingService.getStudentPendingRequests();
	}

	close() {
		this.dialog.closeAll();
	}

	deleteBooking() {
		this.httpService.deleteMyBooking(this.cancelBooking.bid).subscribe((response) => {
			if (response) {
				this.pendingRequests.splice(this.pendingRequests.indexOf(this.cancelBooking), 1);
				if (this.pendingRequests.length == 0) {
					this.meetingService.refreshBookingList('delete');
					// this.emptyBookingList=true;
				}
				this.snackBar.open('Booking has been cancelled !', 'close', this.config);
			} else {
				this.snackBar.open('Booking has already been accepted !', 'close', this.config);
			}
		});

		this.dialog.closeAll();
		this.router.navigate([ 'home/studentDashboard' ]);
	}
}