import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { LoginDetailsService } from 'src/app/service/login-details.service';
import { StudentService } from 'src/app/service/student.service';
import { TutorService } from 'src/app/service/tutor.service';
import { Clipboard } from '@angular/cdk/clipboard';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';
@Component({
  selector: 'app-refer-and-earn',
  templateUrl: './refer-and-earn.component.html',
  styleUrls: ['./refer-and-earn.component.css'],
})
export class ReferAndEarnComponent implements OnInit {
  constructor(
    private cookieService: CookieService,
    private loginService: LoginDetailsService,
    private studentService: StudentService,
    private tutorService: TutorService,
    private clipboard:Clipboard
  ) {}
  referCode:any="";
  userId:any="";
  fullName:any="";
  userEmail:any;
  //email chips variable
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  emailsArray:string[]=[];

  ngOnInit(): void {
   
    this.userId = this.getUserId();
    if (this.loginService.getLoginType() == 'Learner') {
      this.studentService.studentProfileChanged.subscribe((res)=>{
        this.fullName = this.studentService.getStudentProfileDetails().fullName;
        this.userEmail = this.studentService.getStudentProfileDetails().email;
        console.log(this.fullName,this.userId);
        this.getReferCode();
      })
    } else if (this.loginService.getLoginType() == 'Expert') {
      this.tutorService.tutorProfileDetailsChanged.subscribe((res)=>{
        this.fullName = this.tutorService.getTutorDetials().fullName;
        this.userEmail = this.tutorService.getTutorDetials().email;
        console.log(this.fullName,this.userId);
        this.getReferCode();
      })
    }
    
  }

  getUserId(){
    return this.cookieService.get('userId');
  }
    

  getReferCode(){
    if(this.referCode===""){
      this.referCode=this.referCode.concat("FG");
    let currentYear=new Date().getFullYear();
    this.referCode=this.referCode.concat(currentYear.toString().substring(2,4));
    const nameArray=this.fullName.split(" ");
    for(let name of nameArray){
      const initials=name.substring(0,1);
      this.referCode=this.referCode.concat(initials);
    }
    const last4uid=this.userId.substring(this.userId.length-4);
    this.referCode=this.referCode.concat(last4uid);
    console.log(this.referCode);

    }
  }

  copyReferCode(){
    this.clipboard.copy(this.referCode);
    console.log('Inside copy method');
  }

    add(event: MatChipInputEvent): void {
      console.log(event);
     const value = (event.value || '').trim();
      
    // Add our email
    //firstly check if email is valid
    var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  
   if (value.match(validRegex)){
      this.emailsArray.push(value);
    }

    console.log(this.emailsArray);

    //Clear the input value
   event.input.value="";
  }

   remove(email: string ): void {
    const index = this.emailsArray.indexOf(email);

    if (index >= 0) {
      this.emailsArray.splice(index, 1);
    }
    console.log(this.emailsArray);
   }
}