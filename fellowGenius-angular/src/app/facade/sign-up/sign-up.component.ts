import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  NgZone,
} from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { StudentProfileModel } from '../../model/studentProfile';
import { HttpService } from 'src/app/service/http.service';
import { StudentService } from 'src/app/service/student.service';
import { TutorService } from 'src/app/service/tutor.service';
import { LoginDetailsService } from 'src/app/service/login-details.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { TermsAndConditionsComponent } from '../terms-and-conditions/terms-and-conditions.component';
import { StudentLoginModel } from 'src/app/model/studentLoginModel';
import { CookieService } from 'ngx-cookie-service';
// import * as jwt_decode from "jwt-decode";
import * as jwt_decode from 'jwt-decode';
// import { bcrypt } from "node_modules/bcryptjs";
import * as bcrypt from 'bcryptjs';
import { registrationModel } from 'src/app/model/registration';
import { loginModel } from 'src/app/model/login';
import { tutorProfile } from 'src/app/model/tutorProfile';
import { socialLogin } from 'src/app/model/socialModel';
import { tutorAvailabilitySchedule } from 'src/app/model/tutorAvailabilitySchedule';
import { SocialService } from 'src/app/service/social.service';
import { WelcomeComponent } from 'src/app/home/welcome/welcome.component';
import { AuthService } from 'src/app/service/auth.service';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent implements OnInit {
  constructor(
    private router: Router,
    private httpClient: HttpService,
    private studentService: StudentService,
    private tutorService: TutorService,
    private loginService: LoginDetailsService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialog,
    private cookieService: CookieService,
    private socialService: SocialService,
    private zone: NgZone,
    private authService: AuthService
  ) {}
  // --- parent child relationships ------------
  @ViewChild('loginRef', { static: true })
  loginElement: ElementRef;

  @ViewChild('googleSignUp', { static: true })
  googleSignUp: ElementRef;
  // --- booleans ----------------------------
  isLoading: boolean;
  wrongOtp = false;
  showInput: boolean = true;
  verifyEmail: boolean = false;
  incorrectLoginDetails = false;
  termsAndConditionsChecked = false;
  termsAndConditionsError: string;
  showDateError: boolean;
  emailValid = false;
  hide: boolean = true;
  timeOut: boolean = true;
  showExpertCode:boolean = false;
  showPassword:boolean=false;
  // ---------- patterns --------------------------------
  mobNumberPattern = '^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]{8,12}$';
  passwordPattern =
    '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,12}$';

  //  ----------- data fields ------------------------------
  verificationOtp;
  maxDate: string;
  minDate: string;
  userId;
  auth2: any;
  role;
  prev_route;
  expert_userId;
  expert_domain;
  // --------------- models ---------------------------------
  registrationModel = new registrationModel();
  loginModel = new loginModel();
  studentProfile = new StudentProfileModel();
  socialLogin = new socialLogin();
  tutorProfile = new tutorProfile();
  tutorAvailabilitySchedule: tutorAvailabilitySchedule;
  //---------------- configurations ----------------------
  config: MatSnackBarConfig = {
    duration: 5000,
    horizontalPosition: 'center',
    verticalPosition: 'top',
  };
  //--------------------------------------------------------
  ngOnInit() {
    window.scroll(0,0);
    this.prev_route = this.cookieService.get('prev');
    this.expert_userId = this.cookieService.get('expert_userId');
    this.expert_domain = this.cookieService.get('expert_domain');
    this.googleSDK();
    
  }
  togglePassword(){
    this.showPassword=!this.showPassword;
    console.log(this.showPassword);
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
      } else if (this.prev_route == 'home') {
        this.cookieService.delete('prev');
        this.router.navigate(['home']);
      } else {
        this.cookieService.delete('prev');
        this.router.navigate([this.prev_route]);
      }
    }
  }

  otpChange() {
    console.log('input changes');
  }
  onDigitInput(event){

    let element;
    if (event.code !== 'Backspace')
         element = event.srcElement.nextElementSibling;
 
     if (event.code === 'Backspace')
         element = event.srcElement.previousElementSibling;
 
     if(element == null)
         return;
     else
         element.focus();
 }
  seePassword() {
    console.log(this.hide);
    
    $('.toggle-password').each(function (index) {
      $(this).on('click', function () {
        $(this).toggleClass('fa-eye fa-eye-slash');
        var input = $($(this).attr('toggle'));
        if (input.attr('type') == 'password') {
          input.attr('type', 'text');
        } else {
          input.attr('type', 'password');
        }
      });
    });
    
    
  }
  toSignUpPage() {
    this.router.navigate(['sign-up']);
  }

  toFacadePage() {
    this.router.navigate(['']);
  }
  toHome() {
    this.router.navigate(['home']);
  }
  openNewTab(val){
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['terms-and-conditions'])
    );
    // console.log(url);
    window.open(url,'_blank')
  }
  openThankYouPage() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    const dialogRef = this.dialogRef.open(WelcomeComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((data) => {
      this.role = data.role;
      this.registrationModel.role = 'Learner';
      this.registrationModel.password = data.password;
      this.registrationModel.expertCode = data.expertCode;
      this.authService.saveSocialLogin(this.registrationModel);
      this.authService.getAuthStatusListener().subscribe((res) => {
        if (res == true) {
          if (this.loginService.getLoginType() == 'Learner') {
            if (this.prev_route != '') {
              this.goToPreviousUrl();
            } else {
              this.snackBar.open(
                'You have successfully Signed up',
                'close',
                this.config
              );
              this.toFacadePage();
            }
          } else if (this.loginService.getLoginType() == 'Expert') {
            this.toHome();
          }
        }
      });
    });
  }
  openTermsAndConditions() {
    this.dialogRef.open(TermsAndConditionsComponent, {
      width: 'auto',
      height: 'auto',
    });
  }
  appendOtp(form: NgForm) {
    console.log(form);
    let otp: string = '';
    // if (
    //   !form.value.otp_1digit ||
    //   !form.value.otp_2digit ||
    //   !form.value.otp_3digit ||
    //   !form.value.otp_4digit ||
    //   !form.value.otp_5digit ||
    //   !form.value.otp_6digit
    // ) {
    //   return null;
    // }
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
  onSignUp(form: NgForm) {
    if (this.verifyEmail == false) {
      this.isLoading = true;
      this.registrationModel.fullName = form.value.fullName;
      this.registrationModel.email = form.value.email;
      this.registrationModel.password = form.value.password;
      this.registrationModel.contact = form.value.contact;
      this.registrationModel.expertCode = form.value.expertCode
      this.registrationModel.role = 'Learner';
      this.httpClient
        .checkUser(this.registrationModel.email)
        .subscribe((res) => {
          if (!res == true) {
            setTimeout(() => {
              if (this.timeOut == true) {
                this.emailValid = true;
                this.isLoading = false;
                this.showInput = true;
              }
            }, 25000);
            this.httpClient
              .verifyEmail(this.registrationModel.email)
              .subscribe((res) => {
                this.verificationOtp = res['response'];

                this.timeOut = false;
                this.verifyEmail = true;
                this.isLoading = false;
                this.showInput = false;
              });
          } else {
            this.timeOut = false;
            // this.verifyEmail = true;
            this.isLoading = false;
            // this.showInput = false;
            this.snackBar.open(
              'You are already registered. Please Login.',
              'close',
              this.config
            );
            this.router.navigate(['login']);
          }
        });
    } else {
      console.log('in otp region');
      let otp: string = this.appendOtp(form);
      console.log(otp);
      if (otp == null) {
        this.wrongOtp = true;
      } else {
        console.log(otp, this.verificationOtp);
        if (bcrypt.compareSync(otp, this.verificationOtp)) {
          console.log('otp matched !');
          this.authService.onSignUp(this.registrationModel);

          this.authService.getAuthStatusListener().subscribe((res) => {
            if (res == false) {
              this.snackBar.open(
                'registration not successful ! email already exists !',
                'close',
                this.config
              );
              this.incorrectLoginDetails = true;
              this.dialogRef.closeAll();
            } else if (res == true) {
              if (this.loginService.getLoginType() == 'Learner') {
                if (this.prev_route != '') {
                  this.goToPreviousUrl();
                } else {
                  this.snackBar.open(
                    'You have successfully signed up',
                    'close',
                    this.config
                  );
                  this.toFacadePage();
                }
              } else if (this.loginService.getLoginType() == 'Expert') {
                this.toHome();
              }
            }
          });
        } else {
          this.wrongOtp = true;
        }
      }
    }
  }

  //google login
  prepareLoginButton() {
    console.log('called');
    if (this.auth2 == null) {
      location.reload();
    }
    this.auth2.attachClickHandler(
      this.googleSignUp.nativeElement,
      {},
      (googleUser) => {
        let profile = googleUser.getBasicProfile();
        this.socialLogin.id = profile.getId();
        this.socialLogin.fullName = profile.getName();
        this.socialLogin.email = profile.getEmail();
        this.socialService.setSocialDetails(this.socialLogin);
        this.registrationModel.fullName = this.socialLogin.fullName;
        this.registrationModel.email = this.socialLogin.email;
        // this.registrationModel.password = this.socialLogin.id;
        this.registrationModel.socialId = this.socialLogin.id;
        this.httpClient.checkUser(this.socialLogin.email).subscribe((res) => {
          if (!res) {
            this.zone.run(() => {
              this.openThankYouPage();
            });
          } else {
            this.isLoading = false;
            this.snackBar.open(
              'You are already registered. Please Login',
              'close',
              this.config
            );
            this.router.navigate(['login']);
          }
        });
      },
      (error) => {
        console.log(error);
        console.log('google pop up closed by the user');
      }
    );
  }

  googleSDK() {
    window['googleSDKLoaded'] = () => {
      window['gapi'].load('auth2', () => {
        this.auth2 = window['gapi'].auth2.init({
          client_id:
            '254899928533-k6lru4oe7sbmpe22ns0m11rvtbokk3qk.apps.googleusercontent.com',
          // client_id: '15945118442-8olfveag5mpijqdsos8j7atn4u5hcmkk.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
          scope: 'profile email',
        });
        this.prepareLoginButton();
      });
    };

    (function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = 'https://apis.google.com/js/platform.js?onload=googleSDKLoaded';
      fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'google-jssdk');
  }
}
