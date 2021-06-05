import { Injectable, NgZone } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { loginModel } from '../model/login';
import { HttpService } from './http.service';
import * as JwtDecode from 'jwt-decode';
import { StudentProfileModel } from '../model/studentProfile';
import { socialLogin } from '../model/socialModel';
import { StudentLoginModel } from '../model/studentLoginModel';
import { tutorAvailabilitySchedule } from '../model/tutorAvailabilitySchedule';
import { tutorLoginModel } from '../model/tutorLoginModel';
import { tutorProfile } from '../model/tutorProfile';
import { tutorProfileDetails } from '../model/tutorProfileDetails';
import { StudentService } from './student.service';
import { TutorService } from './tutor.service';
import { LoginDetailsService } from './login-details.service';
import { WebSocketService } from './web-socket.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SocialService } from './social.service';
import { Subject } from 'rxjs';
import { NotificationService } from './notification.service';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private router: Router,
    private loginDetailsService: LoginDetailsService,
    private httpService: HttpService,
    private studentService: StudentService,
    private tutorService: TutorService,
    private cookieService: CookieService,
    private webSocketService:WebSocketService,
    private notificationService:NotificationService
  ) { }
  
  private authStatusListener = new Subject<boolean>();
  private isAuthenticated:boolean;
  private userId;
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
  
  loginType;
  loginModel = new loginModel();
  verificationOtp;
  maxDate: string;
  minDate: string;
  role;

  getUserId(){
    return this.userId;
  }
  isTokenValid() {
    if (this.cookieService.get('token') && !this.isTokenExpired()) {
      return true;
    } else {
      this.cookieService.delete('token');
      this.cookieService.delete('userId');
      return false;
    }
  }

  isTokenExpired(token?: string): boolean {
    if (!token) token = this.getToken();
    if (!token) return true;

    const date = this.getTokenExpirationDate(token);
    if (date === undefined) return false;
    return !(date.valueOf() > new Date().valueOf());
  }
  
  getTokenExpirationDate(token: string): Date {
    const decoded = JwtDecode(token);
    if (decoded['exp'] === undefined) return null;
    const date = new Date(0);
    date.setUTCSeconds(decoded['exp']);
    return date;
  }

  getToken(): string {
    return this.cookieService.get('token');
  }

  toFacade() {
    this.router.navigate(['facade']);
  }

  getAuthStatusListener(){
    return this.authStatusListener.asObservable();
  }
  getIsAuth(){
    return this.isAuthenticated;
  }
  autoAuthUser(){
    this.userId = this.cookieService.get('userId');
    if (JwtDecode(this.cookieService.get('token'))['ROLE'] == 'Learner') {
      this.loginType = 'Learner';
      this.loginDetailsService.setTrType('login');
      this.loginDetailsService.setLoginType(this.loginType);
      this.httpService.getStudentDetails(this.userId).subscribe((res) => {
        this.studentProfile = res;
        this.studentService.setStudentProfileDetails(this.studentProfile);
        this.httpService.getStudentSchedule(this.userId).subscribe((res) => {
          this.studentService.setStudentBookings(res);
          this.isAuthenticated=true;
          this.webSocketService.connectToUserWebSocket(this.userId);
          this.notificationService.fetchNotification();
          // this.router.navigate([ 'home/studentDashboard' ]);
        });
      });
    } else if (
      JwtDecode(this.cookieService.get('token'))['ROLE'] == 'Expert'
    ) {
      this.loginType = 'Expert';
      this.loginDetailsService.setTrType('login');
      this.loginDetailsService.setLoginType(this.loginType);

      this.httpService.getTutorDetails(this.userId).subscribe((res) => {
        this.tutorProfile = res;
        this.tutorService.setTutorDetails(this.tutorProfile);
        this.httpService
          .getTutorProfileDetails(this.userId)
          .subscribe((res) => {
            this.tutorProfileDetails = res;
            this.tutorService.setTutorProfileDetails(res);
            this.httpService.getScheduleData(this.tutorProfileDetails.bookingId).subscribe((res) => {
              this.tutorService.setPersonalAvailabilitySchedule(res);
              this.isAuthenticated=true;
              this.webSocketService.connectToUserWebSocket(this.tutorProfile.bookingId);
              this.notificationService.fetchNotification();
            });
          });
      });
    }
  }
  onLogin(loginModel:loginModel) {
    console.log(loginModel);
    this.httpService.checkLogin(loginModel).subscribe((res) => {
      console.log('login result->',res);
      if (res['response'] != 'false') {
        this.cookieService.set('token', res['response']);
        this.cookieService.set('userId', JwtDecode(res['response'])['sub']);
        var role = JwtDecode(res['response'])['ROLE'];
        this.userId = this.cookieService.get('userId');
        if (role == 'Learner') {
          this.httpService.getStudentDetails(this.userId).subscribe((res) => {
            this.studentProfile = res;
            this.studentService.setStudentProfileDetails(this.studentProfile);
            this.loginDetailsService.setTrType('login');
            this.loginDetailsService.setLoginType('Learner');
            this.httpService
              .getStudentSchedule(this.studentProfile.sid)
              .subscribe((res) => {
                this.studentService.setStudentBookings(res);
                this.isLoading = false;
                this.webSocketService.connectToUserWebSocket(this.userId);
                this.isAuthenticated =true;
                this.authStatusListener.next(true);
                this.notificationService.fetchNotification();
                // this.router.navigate(['home']);
                // this.toFacade();
              });
          });
        } else if (role == 'Expert') {
          this.httpService.getTutorDetails(this.userId).subscribe((res) => {
            this.tutorProfile = res;
            this.tutorService.setTutorDetails(this.tutorProfile);
            this.httpService
              .getTutorProfileDetails(this.tutorProfile.tid)
              .subscribe((res) => {
                this.tutorProfileDetails = res;
                this.tutorService.setTutorProfileDetails(
                  this.tutorProfileDetails
                );
                this.httpService
                  .getScheduleData(this.tutorProfile.bookingId)
                  .subscribe((res) => {
                    this.tutorAvailabilitySchedule = res;
                    this.tutorService.setPersonalAvailabilitySchedule(
                      this.tutorAvailabilitySchedule
                    );
                    this.loginDetailsService.setTrType('login');
                    this.loginDetailsService.setLoginType('Expert');
                    this.isLoading = false;
                    this.isAuthenticated=true;
                    this.authStatusListener.next(true);
                    this.webSocketService.connectToUserWebSocket(this.tutorProfile.bookingId);
                    this.notificationService.fetchNotification();
                    // this.router.navigate(['/home']);
                    // this.toFacade();
                  });
              });
          });
        }
        // this.webSocketService.connectToUserWebSocket(this.userId);
      } else {
      this.authStatusListener.next(false);
      this.isAuthenticated=false;
      }
    });
  }

  onSignUp(registrationModel){
    this.httpService
          .registerUser(registrationModel)
          .subscribe((res) => {
            if (res == true) {
              this.loginModel.email = registrationModel.email;
              this.loginModel.password = registrationModel.password;
              // for logging in once registration is done
              this.httpService.checkLogin(this.loginModel).subscribe((res) => {
                this.cookieService.set('token', res['response']);
                this.cookieService.set(
                  'userId',
                  JwtDecode(res['response'])['sub']
                );
                this.userId = this.cookieService.get('userId');

                if (registrationModel.role == 'Learner') {
                  this.httpService
                    .getStudentDetails(this.userId)
                    .subscribe((res) => {
                      this.studentProfile = res;
                      this.studentService.setStudentProfileDetails(
                        this.studentProfile
                      );
                      this.loginDetailsService.setLoginType('Learner');
                      this.loginDetailsService.setTrType('signUp');
                      this.isAuthenticated=true;
                      this.authStatusListener.next(true);
                      this.webSocketService.connectToUserWebSocket(this.userId);
                      this.notificationService.fetchNotification();
                      // this.router.navigate(['home']);
                      // this.toFacade();
                    });
                } else if (registrationModel.role == 'Expert') {
                  this.httpService
                    .getTutorDetails(this.userId)
                    .subscribe((res) => {
                      this.tutorProfile = res;
                      this.tutorService.setTutorDetails(this.tutorProfile);

                      this.httpService
                        .getTutorProfileDetails(this.tutorProfile.tid)
                        .subscribe((res) => {
                          this.tutorService.setTutorProfileDetails(res);
                          this.httpService
                            .getScheduleData(this.tutorProfile.bookingId)
                            .subscribe((res) => {
                              this.tutorAvailabilitySchedule = res;
                              this.tutorService.setPersonalAvailabilitySchedule(
                                this.tutorAvailabilitySchedule
                              );
                              this.loginDetailsService.setLoginType('Expert');
                              this.loginDetailsService.setTrType('signUp');
                              this.isAuthenticated=true;
                              this.authStatusListener.next(true);
                              this.webSocketService.connectToUserWebSocket(this.tutorProfile.bookingId);
                              this.notificationService.fetchNotification();
                              // this.router.navigate(['home']);
                              // this.toFacade();
                        
                            });
                        });
                    });
                }
              });
            } else if (res == false) {
              this.authStatusListener.next(false);
              this.isAuthenticated=false;
            }
          });
  }
  saveSocialLogin(registrationModel) {
    // registrationModel.fullName = this.socialLogin.fullName;
    // registrationModel.email = this.socialLogin.email;
    // registrationModel.password = this.socialLogin.id;
    // registrationModel.role = this.role;
    console.log(registrationModel);
    this.httpService.registerUser(registrationModel).subscribe((res) => {
      if (res == true) {
        this.loginModel.email = registrationModel.email;
        this.loginModel.password = registrationModel.password;
        // for logging in once registration is done
        this.httpService.checkLogin(this.loginModel).subscribe((res) => {
          this.cookieService.set('token', res['response']);
          this.cookieService.set('userId', JwtDecode(res['response'])['sub']);
          this.userId = this.cookieService.get('userId');

          if (registrationModel.role == 'Learner') {
            this.httpService.getStudentDetails(this.userId).subscribe((res) => {
              this.studentProfile = res;
              this.studentService.setStudentProfileDetails(this.studentProfile);
              this.loginDetailsService.setLoginType('Learner');
              this.loginDetailsService.setTrType('signUp');
              this.isAuthenticated=true;
              this.authStatusListener.next(true);
              this.webSocketService.connectToUserWebSocket(this.userId);
              this.notificationService.fetchNotification();
              // this.router.navigate(['home']);
              // this.toFacade();
            });
          } else if (registrationModel.role == 'Expert') {
            this.httpService.getTutorDetails(this.userId).subscribe((res) => {
              this.tutorProfile = res;
              this.tutorService.setTutorDetails(this.tutorProfile);
              this.httpService
                .getTutorProfileDetails(this.tutorProfile.tid)
                .subscribe((res) => {
                  this.tutorService.setTutorProfileDetails(res);
                  this.httpService
                    .getScheduleData(this.tutorProfile.bookingId)
                    .subscribe((res) => {
                      this.tutorAvailabilitySchedule = res;
                      this.tutorService.setPersonalAvailabilitySchedule(
                        this.tutorAvailabilitySchedule
                      );
                      this.loginDetailsService.setLoginType('Expert');
                      this.loginDetailsService.setTrType('signUp');
                      this.isAuthenticated=true;
                      this.authStatusListener.next(true);
                      this.webSocketService.connectToUserWebSocket(this.tutorProfile.bookingId);
                      this.notificationService.fetchNotification();
                      // this.router.navigate(['home']);
                      // this.toFacade();
                    });
                });
            });
          }
        });
      }{
        this.isAuthenticated=false;
        this.authStatusListener.next(false);
      }
    });
  }

}
