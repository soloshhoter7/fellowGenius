import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  NgZone,
} from '@angular/core';
import { Router } from '@angular/router';
import { StudentLoginModel } from 'src/app/model/studentLoginModel';
import { NgForm } from '@angular/forms';
import { tutorLoginModel } from 'src/app/model/tutorLoginModel';
import { HttpService } from 'src/app/service/http.service';
import { StudentProfileModel } from 'src/app/model/studentProfile';
import { StudentService } from 'src/app/service/student.service';
import { tutorProfile } from 'src/app/model/tutorProfile';
import { TutorService } from 'src/app/service/tutor.service';
import { tutorProfileDetails } from 'src/app/model/tutorProfileDetails';
import { socialLogin } from 'src/app/model/socialModel';
import { SocialService } from 'src/app/service/social.service';
import { tutorAvailabilitySchedule } from 'src/app/model/tutorAvailabilitySchedule';
import { CookieService } from 'ngx-cookie-service';
// import * as jwt_decode from 'jwt-decode';
import * as JwtDecode from 'jwt-decode';
import { loginModel } from 'src/app/model/login';
import { LoginDetailsService } from 'src/app/service/login-details.service';
import { TermsAndConditionsComponent } from '../sign-up/terms-and-conditions/terms-and-conditions.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { WelcomeComponent } from 'src/app/home/welcome/welcome.component';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { registrationModel } from 'src/app/model/registration';
import * as jwt_decode from 'jwt-decode';
import { WebSocketService } from 'src/app/service/web-socket.service';
import { AuthService } from 'src/app/service/auth.service';
declare const FB: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(
    private router: Router,
    public loginDetailsService: LoginDetailsService,
    private httpService: HttpService,
    private snackBar: MatSnackBar,
    private socialService: SocialService,
    private zone: NgZone,
    private dialogRef: MatDialog,
    private authService:AuthService
  ) {}

  @ViewChild('googleSignUp', { static: true })
  googleSignUp: ElementRef;
  FB: any;
  socialLogin = new socialLogin();
  auth2: any;
  ngZone: NgZone;
  isLoading: boolean = false;
  hideSocialLogin = 'hideBlock';
  studentProfile: StudentProfileModel;
  tutorProfile: tutorProfile;
  tutorProfileDetails: tutorProfileDetails;
  hide: boolean = true;
  hideContainer = '';
  studentLoginDetails = new StudentLoginModel();
  tutorLoginDetails = new tutorLoginModel();
  tutorAvailabilitySchedule = new tutorAvailabilitySchedule();
  incorrectLoginDetails: boolean = false;
  errorText: string;
  userId;
  loginModel = new loginModel();
  verificationOtp;
  maxDate: string;
  minDate: string;
  role;
  // --------------- models ---------------------------------
  registrationModel = new registrationModel();
  //---------------- configurations ----------------------
  config: MatSnackBarConfig = {
    duration: 5000,
    horizontalPosition: 'center',
    verticalPosition: 'top',
  };
  ngOnInit(): void {
    this.googleSDK();
  }
  toFacade() {
    this.router.navigate(['facade']);
  }

  onLogin(form: NgForm) {
    setTimeout(() => {
      this.isLoading = false;
      this.hideContainer = '';
    }, 20000);
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
        this.toFacade();
      }
    });
  }
  toSignUp() {
    this.router.navigate(['signUp']);
  }
  toHome() {
    this.router.navigate(['home']);
  }
  // ------------------------------------------------------------------------------------------------------------------
  toResetPassword() {
    this.router.navigate(['resetPassword']);
  }
  openThankYouPage() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    const dialogRef = this.dialogRef.open(WelcomeComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((data) => {
      this.role = data;
      this.authService.saveSocialLogin(this.registrationModel);
      this.authService.getAuthStatusListener().subscribe((res)=>{
        if(res==true){
          this.toFacade();
        }
      })
    });
  }
  openTermsAndConditions() {
    this.dialogRef.open(TermsAndConditionsComponent, {
      width: 'auto',
      height: 'auto',
    });
  }

  //google login
  prepareLoginButton() {
    if (this.auth2 == null) {
      location.reload();
    }
    this.incorrectLoginDetails = false;
    this.auth2.attachClickHandler(
      this.googleSignUp.nativeElement,
      {},
      (googleUser) => {
        let profile = googleUser.getBasicProfile();
        this.socialLogin.id = profile.getId();
        this.socialLogin.fullName = profile.getName();
        this.socialLogin.email = profile.getEmail();
        this.socialService.setSocialDetails(this.socialLogin);
        this.zone.run(() => {
          setTimeout(() => {
            this.isLoading = false;
            this.hideContainer = '';
          }, 20000);
          this.isLoading = true;
          this.hideContainer = 'hideBlock';
          this.loginModel.email = this.socialLogin.email;
          this.loginModel.password = this.socialLogin.id;
          this.authService.onLogin(this.loginModel);
          this.authService.getAuthStatusListener().subscribe((res)=>{
      if(res==false){
        this.httpService
        .checkUser(this.socialLogin.email)
        .subscribe((res) => {
          if (!res) {
            this.zone.run(() => {
              this.openThankYouPage();
            });
          } else {
            this.isLoading = false;
            this.hideContainer = '';
            this.snackBar.open(
              'registration not successful ! email already exists !',
              'close',
              this.config
            );
          }
        });
      }else if(res==true){
        this.toFacade();
      }
    });
        });
      },
      (error) => {
        // alert(JSON.stringify(error, undefined, 2));
      }
    );
  }
  googleSDK() {
    window['googleSDKLoaded'] = () => {
      window['gapi'].load('auth2', () => {
        this.auth2 = window['gapi'].auth2.init({
          client_id:
            '254899928533-k6lru4oe7sbmpe22ns0m11rvtbokk3qk.apps.googleusercontent.com',
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
