import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/service/http.service';
@Component({
  selector: 'app-contact-us-info',
  templateUrl: './contact-us-info.component.html',
  styleUrls: ['./contact-us-info.component.css']
})
export class ContactUsInfoComponent implements OnInit {
  
  constructor(
    private router: Router,
    private snack: MatSnackBar,
    private httpClient: HttpService
  ) { }

  public contact={
    name:'',
    email:'', 
    phone:'',  
    message:''
  }

  /*************** PATTERN ************/
  fullNamePattern = '[a-zA-Z ]*$';
  mobNumberPattern = '^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-s./0-9]{8,12}$';
  emailPattern=
"[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"

  ngOnInit(): void {
    window.scroll(0,0);
  }

  onSubmit(form:NgForm){
    this.contact.name=form.value.fullName;
    this.contact.email=form.value.email;
    this.contact.phone=form.value.contact;
    this.contact.message=form.value.message;
    console.log(this.contact)

    this.snack.open("Details sent successfully !!",'',{
      duration:5000
    });

    
    this.httpClient.saveContactusDetails(this.contact)
    .subscribe((res) =>{
      console.log(res);
      console.log("Mail sent successfully");
     
      this.toFacade();
    })
    
    form.value.fullName=' ';
    form.value.email=' ';
    form.value.phone=' ';
    form.value.message=' ';

    
  }

  toFacade() {
    this.router.navigate(['']);
  }
}
