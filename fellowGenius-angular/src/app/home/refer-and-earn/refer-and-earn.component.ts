import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { LoginDetailsService } from 'src/app/service/login-details.service';
import { StudentService } from 'src/app/service/student.service';
import { TutorService } from 'src/app/service/tutor.service';
import { Clipboard } from '@angular/cdk/clipboard';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
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
    private clipboard:Clipboard,
    private snackBar:MatSnackBar
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

  //SHARE DATA VARIABLES
  wSize = "width=600,height=460";
  title = "share";
  loc = encodeURIComponent(window.location.href)
  siteURL="https://fellowgenius.com/"
  deviceType:string="";

  linkedinURL="https://fellowgenius.com/#/sign-up?pt=LI";
  config: MatSnackBarConfig = {
    duration: 5000,
    horizontalPosition: 'center',
    verticalPosition: 'top',
    panelClass: ['snackbar'],
  };
  ngOnInit(): void {
    var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
	
		if (isMobile) {
  			this.deviceType="Mobile";
		} else {
			  this.deviceType="Laptop";
		}
    console.log(this.deviceType);
    this.userId = this.getUserId();
    if (this.loginService.getLoginType() == 'Learner') {
      if(this.studentService.getStudentProfileDetails().fullName==null){
        this.studentService.studentProfileChanged.subscribe((res)=>{
          console.log('data called in refer and earn !');
          this.fullName = this.studentService.getStudentProfileDetails().fullName;
          this.userEmail = this.studentService.getStudentProfileDetails().email;
          console.log(this.fullName,this.userId);
          this.getReferCode();
        })
      }else{
        this.fullName = this.studentService.getStudentProfileDetails().fullName;
          this.userEmail = this.studentService.getStudentProfileDetails().email;
          console.log(this.fullName,this.userId);
          this.getReferCode();
      }
      
    } else if (this.loginService.getLoginType() == 'Expert') {
      console.log('data called in refer and earn !');
      if(this.tutorService.getTutorProfileDetails().fullName==null){
        this.tutorService.tutorProfileDetailsChanged.subscribe((res)=>{
          this.fullName = this.tutorService.getTutorDetials().fullName;
          this.userEmail = this.tutorService.getTutorDetials().email;
          console.log(this.fullName,this.userId);
          this.getReferCode();
        })
      }else{
        this.fullName = this.tutorService.getTutorDetials().fullName;
          this.userEmail = this.tutorService.getTutorDetials().email;
          console.log(this.fullName,this.userId);
          this.getReferCode();
      }
      
    }
   // this.shareLinkedIn(); 
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
      const initials:string=name.substring(0,1);
      this.referCode=this.referCode.concat(initials.toUpperCase());
    }
    const last4uid=this.userId.substring(this.userId.length-4);
    this.referCode=this.referCode.concat(last4uid);
    console.log(this.referCode);

    }
  }

  copyReferCode(){
    this.clipboard.copy(this.referCode);
    console.log('Inside copy method');

    //mat snackbar
    this.snackBar.open(
      'Refer code copied !',
      'close',
      this.config
    );
  }

  copyLinkedinText(){
    let linkedInMsg=`Thinking about how to get an expert’s advice on your ongoing project. Use my referral code ${this.referCode} and complete your 1st session with a FellowGenius expert to earn rewards worth INR 250.Hurry, join the FellowGenius community now!!        
${this.linkedinURL}
    `
    this.clipboard.copy(linkedInMsg);
    console.log('Inside copy method');

    //mat snackbar
    // this.snackBar.open(
    //   'Text copied !',
    //   'close',
    //   this.config
    // );
  }

    add(event: MatChipInputEvent): void {
      console.log(event);
     const value = (event.value || '').trim();
      
    // Add our email
    //firstly check if email is valid
    var validRegex = "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"

    
  
   if (value.match(validRegex)){

    //check if this email is already present or not
    if(this.emailsArray.includes(value)){
      console.log("This email already entered");
    }else{
      this.emailsArray.push(value);
    }
      
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

   shareLinkedIn(){   
     //this.copyLinkedinText();
     let linkedinURL="https://fellowgenius.com/"
     let url="https://mail.google.com/mail/u/0/#inbox"
     console.log(linkedinURL);
    const shareUrl=`https://www.linkedin.com/sharing/share-offsite/?url=${linkedinURL}`;
    console.log('Hello from hello linkedin');
    window.open(shareUrl,"_blank");   
   }

   shareWhatsapp(){
    const whatsappLink=this.getWhatsappMsgLink();
    window.open(whatsappLink,"_blank");
   } 

   shareMail(){
    const emailLink=this.getEmailLink();
    window.open(emailLink,"_blank");
   }

   shareMultipleEmail(){
    let To="";
    this.emailsArray.forEach((email)=>{
      To=To.concat(email+"%20");
    });
    console.log(To);
    const subject="Refer Code Invite";
    const body=`Hello%20from%20${this.fullName}%0AWelcome%20to%20Fellowgenius.%20Your%20Refer%20Code%20is%20${this.referCode}`; 
    const emailLink=`https://mail.google.com/mail/?compose=1&view=cm&fs=1&to=${To}&su=${subject}&body=${body}`;
    window.open(emailLink,"_blank");
   }

   getWhatsappMsgLink(){
    
    const siteurl="https://fellowgenius.com/#/sign-up?pt=WA";
    const message=`Thinking about how to get an experts advice on your ongoing project. Use my referral code ${this.referCode} and complete your 1st session with a FellowGenius expert to earn rewards worth INR 250.Hurry, join the FellowGenius community now!!
${siteurl}
    `
    let encmsg = encodeURI(message);
    console.log(encmsg);
    var whatsappLink="";
    if(this.deviceType==="Laptop"){
      whatsappLink=`https://web.whatsapp.com/send?text=${encmsg}`
    }else if(this.deviceType==="Mobile"){
      whatsappLink=`https://wa.me/?text=${encmsg}`;
    }else{
      console.log("Sorry something went wrong")
    }
    
    return whatsappLink;
   }

   getEmailLink(){
    const subject="Refer Code Invite";
    const body=`Hello%20from%20${this.fullName}%0AWelcome%20to%20Fellowgenius.%20Your%20Refer%20Code%20is%20${this.referCode}`; 
    const emailLink=`https://mail.google.com/mail/?compose=1&view=cm&fs=1&su=${subject}&body=${body}`;
    return emailLink;
   }
}