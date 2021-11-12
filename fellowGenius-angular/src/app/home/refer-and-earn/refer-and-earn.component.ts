import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { LoginDetailsService } from 'src/app/service/login-details.service';
import { StudentService } from 'src/app/service/student.service';
import { TutorService } from 'src/app/service/tutor.service';

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
    private tutorService: TutorService
  ) {}
  userId;
  userName;
  ngOnInit(): void {
    console.log(this.getUserId());
    if (this.loginService.getLoginType() == 'Learner') {
      this.userName = this.studentService.getStudentProfileDetails().fullName;
    } else if (this.loginService.getLoginType() == 'Expert') {
      this.userName = this.tutorService.getTutorDetials().fullName;
    }
    console.log(this.userName,this.userId);
  }
  getUserId() {
    return this.cookieService.get('userId');
  }
}
