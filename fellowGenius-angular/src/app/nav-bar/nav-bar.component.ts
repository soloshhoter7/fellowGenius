import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { RegisterDiaologComponent } from '../facade/register-diaolog/register-diaolog.component';
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
    public tutorService: TutorService,
    private dialog:MatDialog
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
    this.stickyNavBar()
    this.loginType = this.loginService.getLoginType();
    console.log(this.loginType);
    if (this.loginType == 'Learner') {
      this.studentProfile = this.studentService.getStudentProfileDetails();
    } else if (this.loginType == 'Expert') {
      this.tutorProfile = this.tutorService.getTutorDetials();
    }
  }
  stickyNavBar(){
  
    $(window).scroll(function() {
      var y = $(window).scrollTop();
      if (y > 0) {
          $(".navbar").addClass('sticky');
      } 
      else {
          $(".navbar").removeClass('sticky');
      }
  });
  }
  signUpRouting(val){
    document.getElementById('closePopUpButton').click();
    this.router.navigate([val])
  }
  toFacade() {
    this.router.navigate(['']);
  }
  onSignUp() {
    this.router.navigate(['sign-up']);
  }

  toSignUpExpert(){
    this.router.navigate(['sign-up-expert'])
  }
  toLoginPage() {
    this.router.navigate(['login']);
  }
  toDashboard() {
    if (this.loginService.getLoginType() == 'Learner') {
      this.router.navigate(['home/student-dashboard']);
    } else if (this.loginService.getLoginType() == 'Expert') {
      this.router.navigate(['home/tutor-dashboard']);
    }
  }
  displaySelectedSubjects(category) {
    console.log(category)
    if (category!=null) {
      this.router.navigate(['search-results'], {
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
