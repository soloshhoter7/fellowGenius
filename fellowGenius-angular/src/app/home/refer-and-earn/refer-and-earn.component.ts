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
  userEmail;
  ngOnInit(): void {
    this.userId = this.getUserId();
    if (this.loginService.getLoginType() == 'Learner') {
      this.studentService.studentProfileChanged.subscribe((res)=>{
        this.userName = this.studentService.getStudentProfileDetails().fullName;
        this.userEmail = this.studentService.getStudentProfileDetails().email;
        console.log(this.userName,this.userId);
      })
    } else if (this.loginService.getLoginType() == 'Expert') {
      this.tutorService.tutorProfileDetailsChanged.subscribe((res)=>{
        this.userName = this.tutorService.getTutorDetials().fullName;
        this.userEmail = this.tutorService.getTutorDetials().email;
        console.log(this.userName,this.userId);
      })
    }
    
  }

  getUserId() {
    return this.cookieService.get('userId');
  }

}
