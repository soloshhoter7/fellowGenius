import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { registrationModel } from 'src/app/model/registration';
import { HttpService } from 'src/app/service/http.service';
import * as bcrypt from 'bcryptjs';

import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Subscription,interval, Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { tutorProfileDetails } from 'src/app/model/tutorProfileDetails';
@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.css']
})
export class OtpComponent implements OnInit {
  timeOut: boolean=false;
  otpErrorText: string;
  otpErrorBoolean: boolean=false;
 
  resendEmailMessage: boolean;
  resendText="";
  resendServer: boolean=true;
  resendTimer: boolean=false;
  resendTimerSubscription: Subscription
  resendCount=0;
  resendRemainingSeconds=0;
  hideTimerMessage=false;
  hideNewOtpMessage=true;
  verifyEmail: boolean=false;
  showInput: boolean;
  email="";
  registeredExpert: boolean;
  constructor(
    private router: Router,
    private httpClient: HttpService,
    private cookieService: CookieService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) { }

  registrationModel = new registrationModel();
  tutorProfileDetails = new tutorProfileDetails();
  @Input('otpJSON')
  otpJSON: any;

//Declare the property
@Output()
emailVerify:EventEmitter<boolean> =new EventEmitter<boolean>();
 
//Raise the event to send the data back to parent
outputVerifyEmail(verifyEmail: boolean) {
  console.log("Inside the event emitter and "+ verifyEmail);
  this.emailVerify.emit(verifyEmail);
}
 
  verificationOtp: any;

  isLoading: boolean=false;
  wrongOtp = false;

  prev_route;
  expert_userId;
  expert_domain;
  eventId;
  otp_1digit: any;
  otp_2digit: any;
  otp_3digit: any;
  otp_4digit: any;
  otp_5digit: any;
  otp_6digit: any;
  otpInputs: string[]=
  ["otp_1digit", "otp_2digit", "otp_3digit","otp_4digit", "otp_5digit", "otp_6digit"]
  otp: string[]=["","","","","","",""]

 //---------------- configurations ----------------------
 config: MatSnackBarConfig = {
  duration: 5000,
  horizontalPosition: 'center',
  verticalPosition: 'top',
};

  ngOnInit(): void {
    if(this.route.snapshot.queryParams.eventId!=undefined){
      this.eventId=this.route.snapshot.queryParams.eventId;
      console.log('Event id logged here');
      console.log(this.eventId);
    }
    this.prev_route = this.cookieService.get('prev');
    console.log('Prev route logged here');
    console.log(this.prev_route);
    this.expert_userId = this.cookieService.get('expert_userId');
    this.expert_domain = this.cookieService.get('expert_domain');
    this.eventId=this.cookieService.get('event_id');
    console.log('Event id from cookies');
    console.log(this.eventId);
    
    
    console.log('OTP JSON ');
    console.log(this.otpJSON);
    this.email=this.otpJSON.email;
    console.log("The mail is "+ this.email);
    this.verificationOtp=this.otpJSON.verificationOtp;
    console.log("Verification otp is "+ this.verificationOtp);
    

  }

  onSignUp(form: NgForm) {
    console.log('in otp region');
      let otp: string = this.appendOtp(form);
      console.log(otp);
      if (otp == null) {
        this.wrongOtp = true;
        this.otpErrorText='Invalid OTP';
        this.otpErrorBoolean=true;

        setTimeout(()=>
        this.otpErrorBoolean=false
        ,5000)

      } else {
        console.log(otp, this.verificationOtp);
        
        if (bcrypt.compareSync(otp, this.verificationOtp)) {
          console.log('otp matched !');
          //this.registrationModel.referActivity = this.referActivity;

          //pass output 
          this.outputVerifyEmail(true);
        } else {
          this.wrongOtp = true;
          this.otpErrorText='Invalid OTP';

          this.otpErrorBoolean=true;

          setTimeout(()=>
          this.otpErrorBoolean=false
          ,5000)
        }

      }
  }

  returnOTPArray(num){
    let otp_array=[];
    while(num){
      const last = num % 10;
      otp_array.unshift(last);
      num = Math.floor(num / 10);
   };
   return otp_array;
  }

  containsAllNumber(str){
    return /^[0-9]*$/.test(str);
  }

  splitOtp(index){
    console.log("Inside the split function");
    console.log("Copy pasted OTP is "+ this.otp[index]);
    if(this.otp[index]){

      if(!this.containsAllNumber(this.otp[index])){

        this.otp[index]='';
        this.otpErrorBoolean=true;
        this.otpErrorText="Please enter numbers only"
  
        setTimeout(() =>
        this.otpErrorBoolean=false
        ,5000)
  
       return document.getElementById(this.otpInputs[index]).focus();
      }else{
  
      let num = parseInt(this.otp[index]);
      console.log("Split function value "+ this.otp[index]);
     
      //document.getElementById(this.otpInputs[0]).focus();
      let otp_array =this.returnOTPArray(num);
     
     console.log("OTP Array is "+otp_array);
  
    if(otp_array.length<=1){
  
    } else if(otp_array.length>6){
      document.getElementById(this.otpInputs[index]).focus(); 
      this.otp[index]='';
    } else if(otp_array.length<6&&otp_array.length>1){
      document.getElementById(this.otpInputs[index]).focus();
      this.otp[index]='';
    }else{
      this.otp[index]='';
      for(let i=0;i<otp_array.length;i++){
        this.otp[i]=otp_array[i];
      }
  
     return document.getElementById(this.otpInputs[5]).focus();
    }
      }
    }
    
    
  }

  goToPreviousUrl() {
    if (this.prev_route != '') {
      this.snackBar.open(
        'You have successfully signed up',
        'close',
        this.config
      );
      console.log(this.prev_route);
      if (this.prev_route == 'view-tutors') {
        this.cookieService.delete('prev');
        this.cookieService.delete('expert_userId');
        this.cookieService.delete('expert_domain');
        this.router.navigate(['view-tutors'], {
          queryParams: {
            page: this.expert_userId,
            subject: this.expert_domain,
          },
        });
      } else if(this.prev_route == 'view-event'){
        this.cookieService.delete('prev');
        this.cookieService.delete('event_id');
        
        
        this.router.navigate(['view-event'],
        {
          queryParams: { eventId: this.eventId},
        })
      } 
      else if (this.prev_route == 'home') {
        this.cookieService.delete('prev');
        this.router.navigate(['home']);
      } else {
        this.cookieService.delete('prev');
        this.router.navigate([this.prev_route]);
      }
    }
  }

  
  toFacadePage() {
    this.router.navigate(['']);
  }
  toHome() {
    this.router.navigate(['home']);
  }

  appendOtp(form: NgForm) {
    console.log(form);
    let otp: string = '';
    let otp_1digit = form.value.otp_1digit;
    let otp_2digit = form.value.otp_2digit;
    let otp_3digit = form.value.otp_3digit;
    let otp_4digit = form.value.otp_4digit;
    let otp_5digit = form.value.otp_5digit;
    let otp_6digit = form.value.otp_6digit;
    otp += otp_1digit.toString();
    otp += otp_2digit.toString();
    otp += otp_3digit.toString();
    otp += otp_4digit.toString();
    otp += otp_5digit.toString();
    otp += otp_6digit.toString();
    console.log(otp);
    return otp;
  }

  onBackspaceInput(event,pos){
    
    if (event.code === 'Backspace'){
    if(event.target.value === ""){
      console.log("no value so move to previous");
      pos=pos-1;
      document.getElementById(this.otpInputs[pos]).focus();
      
    }
     
    }
    
}

  onDigitInput(event) {
    let element;
   
    console.log("Inside the on digit method ");
    console.log(event.target.value);
    if (event.code !== 'Backspace'&&event.target.value)
      element = event.srcElement.nextElementSibling;

    if (element == null) return;
    else element.focus();
  }


  onResend(){
    
    if(this.resendTimer){ //timer is running
      if(this.resendCount<3){
        this.hideTimerMessage=false;
      }else{
        this.hideTimerMessage=true;
        this.resendTimer=false;

        this.otpErrorText='Resend OTP count limit excedeed';

        this.otpErrorBoolean=true;

        setTimeout(()=>
        this.otpErrorBoolean=false
        ,5000)

      }   

    
    }else if(!this.resendTimer){ //timer is not running.

      if(this.resendCount==3){
        this.otpErrorText='Resend OTP count limit excedeed';

        this.otpErrorBoolean=true;

        setTimeout(()=>
        this.otpErrorBoolean=false
        ,5000)

      }else{
        
        this.snackBar.open(
          `OTP is being sent` ,
          'close',
          this.config
        );

        
        if(this.resendServer){
          this.resendServer=false;
          console.log("Inside the if of resend Server : "+this.resendServer);
          this.httpClient
          .verifyEmail(this.email)
          .subscribe((res) => {
            this.verificationOtp = res['response'];
            this.resendCount++;
            
            this.verifyEmail = false;
            this.resendEmailMessage=true;
            this.isLoading = false;
            this.showInput = false;
  
            
            setTimeout(()=>{
              this.resendEmailMessage=false;
              if(this.resendCount<3){
                this.startTimer();
              }
             
            },5000)
  
            
           
          });
        }
       
      }
         
    }
       
  }

  startTimer(){
    const startOtpTimer=interval(1000);
              this.resendTimer=true;
              this.hideTimerMessage=true;
              this.resendTimerSubscription=startOtpTimer.subscribe(res=>{
                
                this.resendRemainingSeconds=60-res;
                console.log("Remaining seconds is "+ this.resendRemainingSeconds);
                
               

                if(this.resendRemainingSeconds<=0){
                  this.resendTimerSubscription.unsubscribe();
                  this.resendTimer=false;
                  this.hideNewOtpMessage=false;
                  setTimeout(()=>{
                    this.hideNewOtpMessage=true;
                    console.log("Inside timeout");
                    console.log("Inside timeout new OTP message "+ this.hideNewOtpMessage);
                    
                  },5000)

                  console.log("Hide new OTP message "+ this.hideNewOtpMessage);

                  this.resendServer=true;
                  console.log("Resend server message is "+ this.resendServer);
                }
              });
          }
}
