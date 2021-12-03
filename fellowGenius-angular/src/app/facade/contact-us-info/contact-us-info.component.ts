import { Component, OnInit } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
@Component({
  selector: 'app-contact-us-info',
  templateUrl: './contact-us-info.component.html',
  styleUrls: ['./contact-us-info.component.css']
})
export class ContactUsInfoComponent implements OnInit {
  
  constructor(
    private snack: MatSnackBar
  ) { }

  public contact={
    name:'',
    email:'', 
    phone:'',  
    message:''
  }

  ngOnInit(): void {
    window.scroll(0,0);
  }

  formSubmit(){
    console.log(this.contact)
    this.snack.open("Details sent successfully !!",'',{
      duration:5000
    });
  }
}
