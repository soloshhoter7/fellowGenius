import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-media-access-dialog',
  templateUrl: './media-access-dialog.component.html',
  styleUrls: ['./media-access-dialog.component.css'],
})
export class MediaAccessDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<MediaAccessDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.title = data.title;
  }
  title;
  ngOnInit(): void {}
  closeDialog() {
    this.dialogRef.close();
  }
}
