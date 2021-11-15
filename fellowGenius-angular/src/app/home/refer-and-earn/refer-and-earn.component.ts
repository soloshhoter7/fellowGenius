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

  //SHARE DATA VARIABLES
  wSize = "width=600,height=460";
  title = "share";
  loc = encodeURIComponent(window.location.href)
  siteURL="https://fellowgenius.com/"
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

   shareLinkedIn(){
    //  const summary=`Refer%20Code%20is%20${this.referCode}`;
    
     const url=`https://www.linkedin.com/sharing/share-offsite/?url=${this.siteURL}`;
     const encodedURL=
     //const shareUrl="http://www.linkedin.com/shareArticle?mini=true&url=https://stackoverflow.com/questions/10713542/how-to-make-custom-linkedin-share-button/10737122&title=How%20to%20make%20custom%20linkedin%20share%20button&summary=some%20summary%20if%20you%20want&source=stackoverflow.com"
     console.log('Hello from hello linkedin');
     //const linkedinURL=`https://www.linkedin.com/sharing/share-offsite/?url={url}`;
    // window.open(url,"_self");

    // $('.shareLI').each(function(index){
    //   $(this).on('click', function (){
    //     $('head').append("<meta property='og:title' content='Title of the article'/>");
    //   });
    // });

//     document.getElementById("og_title").setAttribute("content", "Refer Code");
// document.getElementById("og_description").setAttribute("content", `Welcome to Fellow Genius.Your refer code is ${this.referCode}`);
//     document.getElementById("og_url").setAttribute("content",`https://www.fellowgenius.com/signup`); 
    //window.open(shareUrl,"_self");   
   }

   shareWhatsapp(){
     const siteurl="https://www.fellowgenius.com/";
     const msg=`Refer%20Code%20is%20${this.referCode}%0AWebsite%20Link%20is%20${siteurl}`;
    /* const LargeMsg="Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%0ASampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%0ASampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%0ASampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%0ASampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%0ASampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%0ASampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%0ASampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%0ASampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%0ASampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%0ASampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%0ASampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%0ASampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%0ASampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%0ASampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%0ASampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%0ASampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%0ASampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%0ASampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%0ASampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%0ASampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%0ASampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%0ASampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%0ASampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit%20Sampe%20Text%20to%20check%20word%limit"; */
    const whatsappLink=`https://wa.me/?text=${msg}`;
    window.open(whatsappLink,"_self");
   } 

   shareMail(){
    const subject="Refer Code Invite";
    const body=`Hello%20from%20${this.fullName}%0AWelcome%20to%20Fellowgenius.%20Your%20Refer%20Code%20is%20${this.referCode}`; 
    const emailLink=`https://mail.google.com/mail/?compose=1&view=cm&fs=1&su=${subject}&body=${body}`;
    window.open(emailLink,"_self");
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
    window.open(emailLink,"_self");
   }
}