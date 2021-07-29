import { Component, Inject, OnInit } from '@angular/core';
import { MeetingService } from 'src/app/service/meeting.service';
import { bookingDetails } from 'src/app/model/bookingDetails';
import { HttpService } from 'src/app/service/http.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
		private snackBar: MatSnackBar,
		private dialogRef: MatDialogRef<DeletePopupComponent>,
    	@Inject(MAT_DIALOG_DATA) data
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
		let dialogData = {
			cancelled:false
		}
		this.dialogRef.close(dialogData);
	}

	deleteBooking() {
		let dialogData = {
			cancelled:true
		}
		this.dialogRef.close(dialogData);
		this.router.navigate([ 'home/student-dashboard' ]);
	}
}