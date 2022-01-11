import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { LoginDetailsService } from 'src/app/service/login-details.service';
import { StudentService } from 'src/app/service/student.service';
import { TutorService } from 'src/app/service/tutor.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { HttpService } from 'src/app/service/http.service';
import { UserReferralsInfo } from 'src/app/model/UserReferralsInfo';
import { ReferralService } from 'src/app/service/referral.service';
import { environment } from 'src/environments/environment';

import Swal from 'sweetalert2';
import { CashbackEarned } from 'src/app/model/CashbackEarned';
import { FGCredits } from 'src/app/model/FGCredits';
import { CashbackInfo } from 'src/app/model/CashbackInfo';
@Component({
  selector: 'app-refer-and-earn',
  templateUrl: './refer-and-earn.component.html',
  styleUrls: ['./refer-and-earn.component.css'],
})
export class ReferAndEarnComponent implements OnInit {
  constructor(
    private httpService: HttpService,
    private cookieService: CookieService,
    private loginService: LoginDetailsService,
    private studentService: StudentService,
    private tutorService: TutorService,
    private clipboard: Clipboard,
    private snackBar: MatSnackBar,
    private referralService: ReferralService
  ) {}
  referCode: any = '';
  userId: any = '';
  FGCredits: Number;
  CashbackInfo: CashbackEarned;
  fullName: any = '';
  userEmail: any;
  //email chips variable
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  emailsArray: string[] = [];
  isLoading = false;
  linkSent = false;
  userReferralInfoList: UserReferralsInfo[] = [];
  creditsTableInfo: FGCredits[] = [];
  cashbackTableInfo: CashbackInfo[] = [];
  //SHARE DATA VARIABLES
  wSize = 'width=600,height=460';
  title = 'share';
  loc = encodeURIComponent(window.location.href);
  siteURL = environment.FRONTEND_PREFIX;
  deviceType: string = '';

  linkedinURL = environment.FRONTEND_PREFIX + 'sign-up?pt=LI';
  config: MatSnackBarConfig = {
    duration: 5000,
    horizontalPosition: 'center',
    verticalPosition: 'bottom',
    panelClass: ['snackbar'],
  };
  ngOnInit(): void {
    var isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

    if (isMobile) {
      this.deviceType = 'Mobile';
    } else {
      this.deviceType = 'Laptop';
    }
    console.log(this.deviceType);
    this.userId = this.getUserId();
    this.initialiseUserReferralInfo();
    this.initialiseFGCredits();
    this.initialiseCashbackInfo();
    this.initialiseFGCreditsTableInfo();
    if (this.loginService.getLoginType() == 'Learner') {
      if (this.studentService.getStudentProfileDetails().fullName == null) {
        this.studentService.studentProfileChanged.subscribe((res) => {
          console.log('data called in refer and earn !');
          this.fullName =
            this.studentService.getStudentProfileDetails().fullName;
          this.userEmail = this.studentService.getStudentProfileDetails().email;
          console.log(this.fullName, this.userId);
          this.getReferCode();
        });
      } else {
        this.fullName = this.studentService.getStudentProfileDetails().fullName;
        this.userEmail = this.studentService.getStudentProfileDetails().email;
        console.log(this.fullName, this.userId);
        this.getReferCode();
      }
    } else if (this.loginService.getLoginType() == 'Expert') {
      console.log('data called in refer and earn !');
      if (this.tutorService.getTutorProfileDetails().fullName == null) {
        this.tutorService.tutorProfileDetailsChanged.subscribe((res) => {
          this.fullName = this.tutorService.getTutorDetials().fullName;
          this.userEmail = this.tutorService.getTutorDetials().email;
          console.log(this.fullName, this.userId);
          this.getReferCode();
        });
      } else {
        this.fullName = this.tutorService.getTutorDetials().fullName;
        this.userEmail = this.tutorService.getTutorDetials().email;
        console.log(this.fullName, this.userId);
        this.getReferCode();
      }
    }
    // this.shareLinkedIn();
  }
  initialiseFGCredits() {
    this.httpService.getFGCreditsOfUser(this.userId).subscribe(
      (res) => {
        console.log(res);
        this.FGCredits = res;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getUserId() {
    return this.cookieService.get('userId');
  }
  initialiseUserReferralInfo() {
    this.referralService.fetchUserReferralDetailsInfo(this.getUserId());
    this.referralService.referralDetailsChanged.subscribe(
      (userReferralsInfo: UserReferralsInfo[]) => {
        this.userReferralInfoList = userReferralsInfo;
        console.log('user referral info: ', this.userReferralInfoList);
      }
    );
  }

  initialiseCashbackInfo() {
    this.httpService.getCashbackEarnedOfUser(this.userId).subscribe((res) => {
      console.log(res);
      this.CashbackInfo = res;
      if (this.CashbackInfo.totalCashback > 0) {
        this.initialiseCashbackTableInfo();
      }
    });
  }

  initialiseCashbackTableInfo() {
    this.httpService.getCashbackTableOfUser(this.userId).subscribe((res) => {
      console.log(res);
      this.cashbackTableInfo = res;
    });
  }

  initialiseFGCreditsTableInfo() {
    this.httpService.getFGCreditsTableOfUser(this.userId).subscribe((res) => {
      console.log(res);
      this.creditsTableInfo = res;
      console.log('Credits Table Info ' + this.creditsTableInfo);
    });
  }

  getColor(status) {
    switch (status) {
      case 'Meeting Completed':
        return '#416a59';
      case 'Meeting Setup':
        return '#f5eec2';
      case 'Registered':
        return '#8dc63f';
      case 'Offer Expired':
        return '#FF2D58';
    }
  }

  getTextColor(status) {
    switch (status) {
      case 'Meeting Completed':
        return '#FFFFFF !important';
      case 'Meeting Setup':
        return '#000000';
      case 'Registered':
        return '#000000';
      case 'Offer Expired':
        return '#FFFFFF';
    }
  }

  getClass(status, i) {
    let id = 'status_' + i;
    if (status == 'Meeting Completed') {
      //let element=document.getElementById(id).style.color='#00000';

      return 'meetingCompleted';
    } else if (status == 'Meeting Setup') {
      return 'meetingSetup';
    } else if (status == 'Registered') {
      return 'registered';
    } else if (status == 'Offer Expired') {
      return 'offerExpired';
    }
    // switch(status){
    //   case 'Meeting Completed':

    //   case 'Meeting Setup':

    //   case 'Registered':

    //   case 'Offer Expired':

    // }
  }

  returnStatusId(i) {
    return 'status_' + i;
  }
  getReferCode() {
    if (this.referCode === '') {
      this.referCode = this.referCode.concat('FG');
      let currentYear = new Date().getFullYear();
      this.referCode = this.referCode.concat(
        currentYear.toString().substring(2, 4)
      );
      const nameArray = this.fullName.split(' ');
      for (let name of nameArray) {
        const initials: string = name.substring(0, 1);
        this.referCode = this.referCode.concat(initials.toUpperCase());
      }
      const last4uid = this.userId.substring(this.userId.length - 4);
      this.referCode = this.referCode.concat(last4uid);
      console.log(this.referCode);
    }
  }

  copyReferCode() {
    this.clipboard.copy(this.referCode);
    console.log('Inside copy method');

    //mat snackbar
    this.snackBar.open('Refer code copied !', 'close', this.config);
  }

  copyLinkedinText() {
    let linkedInMsg = `Thinking about how to get an expert's advice on your ongoing project. Use my referral code ${this.referCode} and complete your 1st session with a FellowGenius expert to earn rewards worth INR 250.Hurry, join the FellowGenius community now!!
Joining Link : -  ${this.linkedinURL}      

    `;
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
    var validRegex =
      "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?";

    if (value.match(validRegex)) {
      //check if this email is already present or not
      if (this.emailsArray.includes(value)) {
        this.snackBar.open(
          'This email is already entered !',
          'close',
          this.config
        );
      } else if (value == this.userEmail) {
        this.snackBar.open(
          'This email is same as user registered mail id !',
          'close',
          this.config
        );
      } else {
        this.emailsArray.push(value);
      }
    }

    console.log(this.emailsArray);

    //Clear the input value
    event.input.value = '';
  }

  remove(email: string): void {
    const index = this.emailsArray.indexOf(email);

    if (index >= 0) {
      this.emailsArray.splice(index, 1);
    }
    console.log(this.emailsArray);
  }

  shareLinkedIn() {
    //this.copyLinkedinText();
    $('.close-linkedin').click();
    Swal.fire({
      title: 'Connect Linkedin Community to FellowGenius',
      text: 'Paste the text that we have copied for you and share via Post or direct message.',
      icon: 'info',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Great',
    }).then((result) => {
      if (result.isConfirmed) {
        let linkedinURL = 'https://fellowgenius.com/sign-up';
        let url = 'https://mail.google.com/mail/u/0/#inbox';
        console.log(linkedinURL);
        const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${linkedinURL}`;
        console.log('Hello from hello linkedin');
        window.open(shareUrl, '_blank');
      }
    });
  }

  shareWhatsapp() {
    const whatsappLink = this.getWhatsappMsgLink();
    console.log(whatsappLink);
    window.open(whatsappLink, '_blank');
  }

  shareMail() {
    const emailLink = this.getEmailLink();
    window.open(emailLink, '_blank');
  }

  shareMultipleEmail() {
    let To = '';
    this.emailsArray.forEach((email) => {
      To = To.concat(email + '%20');
    });
    console.log(To);
    const subject = 'Refer Code Invite';
    const body = `Hello%20from%20${this.fullName}%0AWelcome%20to%20Fellowgenius.%20Your%20Refer%20Code%20is%20${this.referCode}`;
    const emailLink = `https://mail.google.com/mail/?compose=1&view=cm&fs=1&to=${To}&su=${subject}&body=${body}`;
    window.open(emailLink, '_blank');
  }

  getWhatsappMsgLink() {
    const siteurl = environment.FRONTEND_PREFIX + 'sign-up?pt=WA';
    const message = `Thinking about how to get an expert's advice on your ongoing project. Use my referral code ${this.referCode} and complete your 1st session with a FellowGenius expert to earn rewards worth INR 250.Hurry, join the FellowGenius community now!!
${siteurl}
    `;
    let encmsg = encodeURI(message);
    console.log(encmsg);
    var whatsappLink = '';
    if (this.deviceType === 'Laptop') {
      whatsappLink = `https://web.whatsapp.com/send?text=${encmsg}`;
    } else if (this.deviceType === 'Mobile') {
      const mobileMessage = `Thinking about how to get an expert's advice on your ongoing project. Use my referral code ${this.referCode} and complete your 1st session with a FellowGenius expert to earn rewards worth INR 250.Hurry, join the FellowGenius community now!!
`;
      let encMobilemsg = encodeURI(mobileMessage);
      encMobilemsg =
        encMobilemsg +
        'http%3A%2F%2Flocalhost%3A4200%2F%23%2Fsign-up%3Fpt%3DWA';
      console.log(encMobilemsg);
      whatsappLink = `https://wa.me/?text=${encMobilemsg}`;
    } else {
      console.log('Sorry something went wrong');
    }

    return whatsappLink;
  }

  getEmailLink() {
    const subject = 'Refer Code Invite';
    const body = `Hello%20from%20${this.fullName}%0AWelcome%20to%20Fellowgenius.%20Your%20Refer%20Code%20is%20${this.referCode}`;
    const emailLink = `https://mail.google.com/mail/?compose=1&view=cm&fs=1&su=${subject}&body=${body}`;
    return emailLink;
  }

  sendMail() {
    if (this.emailsArray.length == 0) {
      this.snackBar.open('No email adresses added !', 'close', this.config);
      $('.close-whatsapp').click();
      return;
    }
    console.log(this.emailsArray);
    this.isLoading = true;
    this.httpService
      .sendReferInviteMail(this.emailsArray, this.referCode, this.userEmail)
      .subscribe((res) => {
        this.isLoading = false;
        if (res == true) {
          this.linkSent = !this.linkSent;
        } else {
          console.log('Some error occured in server');
        }
      });
    //mat snackbar
    $('.close-whatsapp').click();
    Swal.fire('Congratulations', 'Mail Sent successfully!', 'success');
  }

  extractInitialsOfFullName(fullName: String) {
    let result = '';
    const nameArray = fullName.split(' ');
    for (let name of nameArray) {
      const initials: string = name.substring(0, 1);
      result = result.concat(initials.toUpperCase());
    }

    return result;
  }
}
