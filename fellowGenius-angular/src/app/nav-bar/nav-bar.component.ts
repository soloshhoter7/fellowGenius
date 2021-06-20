import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { StudentProfileModel } from '../model/studentProfile';
import { tutorProfile } from '../model/tutorProfile';
import { LoginDetailsService } from '../service/login-details.service';
import { StudentService } from '../service/student.service';
import { TutorService } from '../service/tutor.service';
@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
})
export class NavBarComponent implements OnInit {
  constructor(
    public router: Router,
    private route:ActivatedRoute,
    public loginService: LoginDetailsService,
    public cookieService: CookieService,
    public studentService: StudentService,
    public tutorService: TutorService
  ) {}
  loginType;
  studentProfile: StudentProfileModel;
  tutorProfile: tutorProfile;
  allOptions:string[]=['Tools','Marketing','Content','Project Management','Sales','E-comm',
  'Industry Consulation','Strategy','Finance','HR','Operations','IT Support'];
  selectedOptions: string[] = [
    'Tools','Marketing','Content','Project Management','Sales','E-comm',
    // 'Industry Consulation','Strategy','Finance','HR','Operations','IT Support'
   ];
   moreOptions:string[]=[
     'Industry Consulation','Strategy','Finance','HR','Operations','IT Support'
   ]
  ngOnInit(): void {
    this.loginType = this.loginService.getLoginType();
    if (this.loginType == 'Learner') {
      this.studentProfile = this.studentService.getStudentProfileDetails();
    } else if (this.loginType == 'Expert') {
      this.tutorProfile = this.tutorService.getTutorDetials();
    }
  }

  toFacade() {
    this.router.navigate(['']);
  }
  onSignUp() {
    this.router.navigate(['signUp']);
  }

  toLoginPage() {
    this.router.navigate(['login']);
  }
  toDashboard() {
    if (this.loginService.getLoginType() == 'Learner') {
      this.router.navigate(['home/studentDashboard']);
    } else if (this.loginService.getLoginType() == 'Expert') {
      this.router.navigate(['home/tutorDashboard']);
    }
  }
  displaySelectedSubjects(category) {
    console.log(category)
    if (category!=null) {
      this.router.navigate(['searchResults'], {
        queryParams: { subject: category },
      });
    }
  }
  onSignOut() {
    let currentRoute = this.route.snapshot.routeConfig.component.name;
    this.cookieService.delete('token');
    this.cookieService.delete('userId');
    this.loginService.setLoginType(null);
    this.loginService.setTrType(null);
    if(currentRoute!='ExpertProfileComponent'){
      this.router.navigate(['']);
    }
  }
}
