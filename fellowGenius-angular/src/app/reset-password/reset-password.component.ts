import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { togglePassword, initiateSelect2 } from '../../assets/js/custom';
import { HttpService } from '../service/http.service';
import { LoginDetailsService } from '../service/login-details.service';
import { MeetingService } from '../service/meeting.service';
import { ProfileService } from '../service/profile.service';
import { StudentService } from '../service/student.service';
import * as bcrypt from 'bcryptjs';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {
  passwordReset: boolean;
  constructor(
    public profileService: ProfileService,
    public meetingSevice: MeetingService,
    public studentService: StudentService,
    public httpService: HttpService,
    public snackBar: MatSnackBar,
    public router: Router,
    public dialogRef: MatDialog,
    public activatedRoute: ActivatedRoute,
    public loginService: LoginDetailsService,
    public dialog: MatDialog
  ) {
    togglePassword();
  }
  showEmail: boolean;
  showPassword: boolean;
  userId;
  code;
  isLoading: boolean;
  incorrectEmail: boolean;
  passwordError='';
  linkSent = false;
  mobNumberPattern = '^((\\+91-?)|0)?[0-9]{10}$';
  passwordPattern =
    '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,12}$';
  ngOnInit(): void {
    this.seePassword();
    this.activatedRoute.queryParams.subscribe((params) => {
      this.code = params['token'];
      if (this.code == null) {
        this.showEmail = true;
      } else {
        this.showPassword = true;
      }
      
      // this.httpService
      //   .fetchTutorProfileDetails(this.userId)
      //   .subscribe((res) => {
      //     this.teacherProfile = res;

      //   });
      
    });
  }
  seePassword() {
    $('.toggle-password').each(function (index) {
      console.log('hello');
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
  toLoginPage() {
    this.router.navigate(['login']);
  }

  onReset(form) {
    if (form.value.password == form.value.retypePassword) {
      this.passwordError = '';

      this.httpService
        .updatePassword(this.code, form.value.password)
        .subscribe((res) => {
          if (res == true) {
            this.passwordReset = true;
          }
        });
    } else {
      this.passwordError = "Password and retyped password doesn't match !";
    }
  }
  submitEmail(form) {
    this.isLoading = true;
    this.httpService.resetPasswordLink(form.value.email).subscribe((res) => {
      this.isLoading = false;
      if (res == true) {
        this.linkSent = !this.linkSent;
      } else {
        this.incorrectEmail = true;
      }
    });
  }
}
