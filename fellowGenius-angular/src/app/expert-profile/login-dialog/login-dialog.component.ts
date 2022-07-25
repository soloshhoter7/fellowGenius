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
import { TermsAndConditionsComponent } from '../../facade/terms-and-conditions/terms-and-conditions.component';
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
import { tutorProfileDetails } from 'src/app/model/tutorProfileDetails';
import { AuthService } from 'src/app/service/auth.service';
import { ConnectComponent } from '../connect/connect.component';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.css'],
})
export class LoginDialogComponent implements OnInit {
  login: boolean = true;
  ngOnInit() {
    this.googleSDK();
  }
  toSignUp() {
    this.login = !this.login;
  }
  closeNav() {
    this.dialogRef.closeAll();
  }
  constructor(
    private router: Router,
    private httpClient: HttpService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialog,
    private socialService: SocialService,
    private authService:AuthService,
    private loginService:LoginDetailsService,
    private zone: NgZone
  ) {}
  // --- parent child relationships ------------
  @ViewChild('loginRef', { static: true })
  loginElement: ElementRef;

  @ViewChild('googleSignUp', { static: true })
  googleSignUp: ElementRef;

  @ViewChild('googleLogIn', { static: true })
  googleLogIn: ElementRef;
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
  // ---------- patterns --------------------------------
  mobNumberPattern = '^((\\+91-?)|0)?[0-9]{10}$';
  passwordPattern =
    '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,20}$';

  //  ----------- data fields ------------------------------
  verificationOtp;
  maxDate: string;
  minDate: string;
  userId;
  auth2: any;
  role;
  // --------------- models ---------------------------------
  registrationModel = new registrationModel();
  loginModel = new loginModel();
  studentProfile = new StudentProfileModel();
  socialLogin = new socialLogin();
  tutorProfile = new tutorProfile();
  tutorAvailabilitySchedule: tutorAvailabilitySchedule;
  //---------------- configurations ----------------------
  config: MatSnackBarConfig = {
    duration: 3000,
    horizontalPosition: 'center',
    verticalPosition: 'top',
  };
  //--------------------------------------------------------

  FB: any;
  ngZone: NgZone;
  hideSocialLogin = 'hideBlock';

  hideContainer = '';
  studentLoginDetails = new StudentLoginModel();

  errorText: string;

  //for opening terms and conditions
  openTermsAndConditions() {
    this.dialogRef.open(TermsAndConditionsComponent, {
      width: 'auto',
      height: 'auto',
    });
  }

  //to call reset password
  toResetPassword() {
    this.dialogRef.closeAll();
    this.router.navigate(['reset-password']);
  }

  openConnectPage() {
   
      if (this.loginService.getLoginType() != null && this.loginService.getLoginType()=='Learner') {
        this.dialogRef.open(ConnectComponent, {
          height: 'auto',
          width: 'auto',
        });
      } else {
        this.dialogRef.open(LoginDialogComponent, {
          width: 'auto',
          height: 'auto',
        });
      }
    // this.router.navigate(['home/studentDashboard'])
  }


  //for logging in
  onLogin(form: NgForm) {
    this.isLoading = true;
    this.hideContainer = 'hideBlock';
    this.loginModel.email = form.value.email;
    this.loginModel.password = form.value.password;
    this.authService.onLogin(this.loginModel);
    this.authService.getAuthStatusListener().subscribe((res)=>{
      if(res==false){
        this.errorText = 'Incorrect email or password';
        this.isLoading = false;
        this.hideContainer = '';
        this.incorrectLoginDetails = true;
      }else if(res==true){
        this.isLoading = false;
        this.snackBar.open(
        'Logged in successfully',
        'close',
        this.config
        );
        console.log('here')
        this.dialogRef.closeAll();
        this.openConnectPage();
      }
    });
  }
  //for opening the thank you page and saving social login
  openThankYouPage() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    const dialogRef = this.dialogRef.open(WelcomeComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((data) => {
      this.role = data.role;
      this.registrationModel.role=data.role;
      this.registrationModel.password = data.password;
      this.authService.saveSocialLogin(this.registrationModel);
      this.authService.getAuthStatusListener().subscribe((res)=>{
        if(res==true){
          this.isLoading = false;
        this.snackBar.open(
        'Logged in successfully',
        'close',
        this.config
        );
        this.dialogRef.closeAll();
        this.openConnectPage();
        }
      })
    });
  }
  //google login
  prepareLoginButton() {
  
    if (this.auth2 == null) {
      location.reload();
    }
    this.auth2.attachClickHandler(
      this.googleLogIn.nativeElement,
      {},
      (googleUser) => {
        let profile = googleUser.getBasicProfile();
        this.socialLogin.id = profile.getId();
        this.socialLogin.fullName = profile.getName();
        this.socialLogin.email = profile.getEmail();
        this.socialService.setSocialDetails(this.socialLogin);

        this.zone.run(() => {
          // this.isLoading = true;
          this.hideContainer = 'hideBlock';
          this.loginModel.email = this.socialLogin.email;
          this.loginModel.password = this.socialLogin.id;
          this.authService.onLogin(this.loginModel);
          
          this.authService.getAuthStatusListener().subscribe((res)=>{
            if(res==false){
              this.httpClient.checkUser(this.socialLogin.email).subscribe((res) => {
                if (!res) {
                  this.zone.run(() => {
                    this.registrationModel.fullName = this.socialLogin.fullName;
        this.registrationModel.email = this.socialLogin.email;
        this.registrationModel.password = this.socialLogin.id;
                    this.openThankYouPage();
                  });
                } 
                else {
                  this.isLoading = false;
                  this.snackBar.open(
                    'login not successful',
                    'close',
                    this.config
                  );
                }
              });
            }else if(res==true){
              this.isLoading = false;
              this.snackBar.open(
              'Logged in successfully',
              'close',
              this.config
              );
              console.log('here');
              this.dialogRef.closeAll();
              this.openConnectPage();
            }

          })
        });
      },
      (error) => {
        // alert(JSON.stringify(error, undefined, 2));
      }
    );
  }

  onSignUp(form: NgForm) {
    if (this.verifyEmail == false) {
      this.isLoading = true;
      this.registrationModel.fullName = form.value.fullName;
      this.registrationModel.email = form.value.email;
      this.registrationModel.password = form.value.password;
      this.registrationModel.contact = form.value.contact;
      // this.registrationModel.role = 'Learner';
      this.registrationModel.role = form.value.role;
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
            this.login=true;
          }
        });
    } else {
      if (bcrypt.compareSync(form.value.otp, this.verificationOtp)) {
        this.authService.onSignUp(this.registrationModel);
        this.authService.getAuthStatusListener().subscribe((res)=>{
          console.log('got the result !',res);
          if(res==false){
            this.snackBar.open(
              'registration not successful ! email already exists !',
              'close',
              this.config
            );
            this.incorrectLoginDetails = true;
            this.dialogRef.closeAll();
          }else if(res==true){
            console.log('res is true');
            this.isLoading = false;
          this.snackBar.open(
          'Logged in successfully',
          'close',
          this.config
          );
          this.dialogRef.closeAll();
          console.log('oppenining connect page')
          this.openConnectPage();
          }
        });
      } else {
        this.wrongOtp = true;
      }
    }
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
