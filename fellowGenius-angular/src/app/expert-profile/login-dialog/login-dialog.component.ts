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
import { TermsAndConditionsComponent } from '../../facade/sign-up/terms-and-conditions/terms-and-conditions.component';
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
    private studentService: StudentService,
    private tutorService: TutorService,
    private loginService: LoginDetailsService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialog,
    private cookieService: CookieService,
    private socialService: SocialService,
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
    '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,12}$';

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
    duration: 10000,
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
  openTermsAndConditions() {
    this.dialogRef.open(TermsAndConditionsComponent, {
      width: 'auto',
      height: 'auto',
    });
  }

  onLogin(form: NgForm) {
    this.isLoading = true;
    this.hideContainer = 'hideBlock';
    this.loginModel.email = form.value.email;
    this.loginModel.password = form.value.password;
    this.httpClient.checkLogin(this.loginModel).subscribe((res) => {
      if (res['response'] != 'false') {
        var role = jwt_decode(res['response'])['ROLE'];
        if (role == 'Learner') {
          this.cookieService.set('token', res['response']);
          this.cookieService.set('userId', jwt_decode(res['response'])['sub']);
          this.userId = this.cookieService.get('userId');
          this.httpClient.getStudentDetails(this.userId).subscribe((res) => {
            this.studentProfile = res;
            this.studentService.setStudentProfileDetails(this.studentProfile);
            this.loginService.setTrType('login');
            this.loginService.setLoginType('Learner');
            this.httpClient
              .getStudentSchedule(this.studentProfile.sid)
              .subscribe((res) => {
                this.studentService.setStudentBookings(res);
                this.isLoading = false;
                this.dialogRef.closeAll();
              });
          });
        } else {
          this.errorText = 'Incorrect email or password';
          this.isLoading = false;
          this.hideContainer = '';
          this.incorrectLoginDetails = true;
        }
      } else {
        this.errorText = 'Incorrect email or password';
        this.isLoading = false;
        this.hideContainer = '';
        this.incorrectLoginDetails = true;
      }
    });
  }
  // ------------------------------------------------------------------------------------------------------------------
  //google login
  prepareLoginButton() {
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
          this.isLoading = true;
          this.hideContainer = 'hideBlock';
          this.loginModel.email = this.socialLogin.email;
          this.loginModel.password = this.socialLogin.id;
          this.httpClient.checkLogin(this.loginModel).subscribe((res) => {
            if (res['response'] != 'false') {
              var role = jwt_decode(res['response'])['ROLE'];

              if (role == 'Learner') {
                this.cookieService.set('token', res['response']);
                this.cookieService.set(
                  'userId',
                  jwt_decode(res['response'])['sub']
                );
                this.userId = this.cookieService.get('userId');
                this.httpClient
                  .getStudentDetails(this.userId)
                  .subscribe((res) => {
                    this.studentProfile = res;
                    this.studentService.setStudentProfileDetails(
                      this.studentProfile
                    );
                    this.loginService.setTrType('login');
                    this.loginService.setLoginType('Learner');
                    this.httpClient
                      .getStudentSchedule(this.studentProfile.sid)
                      .subscribe((res) => {
                        this.studentService.setStudentBookings(res);
                        this.isLoading = false;
                        this.dialogRef.closeAll();
                      });
                  });
              }
            } else {
              this.errorText = 'Incorrect email or password';
              this.isLoading = false;
              this.hideContainer = '';
              this.incorrectLoginDetails = true;
            }
          });
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
      this.registrationModel.role = 'Learner';
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
      if (bcrypt.compareSync(form.value.otp, this.verificationOtp)) {
        this.httpClient
          .registerUser(this.registrationModel)
          .subscribe((res) => {
            if (res == true) {
              this.loginModel.email = this.registrationModel.email;
              this.loginModel.password = this.registrationModel.password;
              // for logging in once registration is done
              this.httpClient.checkLogin(this.loginModel).subscribe((res) => {
                this.cookieService.set('token', res['response']);
                this.cookieService.set(
                  'userId',
                  jwt_decode(res['response'])['sub']
                );
                this.userId = this.cookieService.get('userId');

                if (this.registrationModel.role == 'Learner') {
                  this.httpClient
                    .getStudentDetails(this.userId)
                    .subscribe((res) => {
                      this.studentProfile = res;
                      this.studentService.setStudentProfileDetails(
                        this.studentProfile
                      );
                      this.loginService.setLoginType('Learner');
                      this.loginService.setTrType('signUp');
                      this.dialogRef.closeAll();
                    });
                }
              });
            } else if (res == false) {
              this.snackBar.open(
                'registration not successful ! email already exists !',
                'close',
                this.config
              );
              this.incorrectLoginDetails = true;
              this.dialogRef.closeAll();
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
