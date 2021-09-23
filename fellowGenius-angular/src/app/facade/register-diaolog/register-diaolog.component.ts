import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-diaolog',
  templateUrl: './register-diaolog.component.html',
  styleUrls: ['./register-diaolog.component.css']
})
export class RegisterDiaologComponent implements OnInit {

  constructor(
    private dialog:MatDialog,
    private router:Router,
    private dialogRef:MatDialogRef<RegisterDiaologComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) { }

  ngOnInit(): void {
  }

  toSignUpPage(){
    this.dialogRef.close();
		this.router.navigate([ 'sign-up' ]);
  }
  toRegisterAsExpertPage(){
    this.dialogRef.close();
		this.router.navigate([ 'sign-up-expert' ]);
  }
}
