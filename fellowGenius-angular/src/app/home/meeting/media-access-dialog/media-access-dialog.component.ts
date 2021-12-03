import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-media-access-dialog',
  templateUrl: './media-access-dialog.component.html',
  styleUrls: ['./media-access-dialog.component.css']
})
export class MediaAccessDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<MediaAccessDialogComponent>) { }

  ngOnInit(): void {
  }
  closeDialog(){
    this.dialogRef.close();
  }
}
