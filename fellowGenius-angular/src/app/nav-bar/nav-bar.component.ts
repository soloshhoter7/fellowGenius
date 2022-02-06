import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { RegisterDiaologComponent } from '../facade/register-diaolog/register-diaolog.component';
import { StudentProfileModel } from '../model/studentProfile';
import { tutorProfile } from '../model/tutorProfile';
import { AuthService } from '../service/auth.service';
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
    public loginService: LoginDetailsService,
    public cookieService: CookieService,
    public studentService: StudentService,
    public tutorService: TutorService
  ) {}
  userDropdownData = {
    name: '',
    role: '',
    profilePictureUrl: '',
    parent: 'NAVBAR',
  };
  loginType;
  studentProfile: StudentProfileModel;
  tutorProfile: tutorProfile;
  allOptions: string[] = [
    'Tools',
    'Marketing',
    'Content',
    'Project Management',
    'Sales',
    'E-comm',
    'Industry Consulation',
    'Strategy',
    'Finance',
    'HR',
    'Operations',
    'IT Support',
  ];
  selectedOptions: string[] = [
    'Tools',
    'Marketing',
    'Content',
    'Project Management',
    'Sales',
    'E-comm',
    // 'Industry Consulation','Strategy','Finance','HR','Operations','IT Support'
  ];
  moreOptions: string[] = [
    'Industry Consulation',
    'Strategy',
    'Finance',
    'HR',
    'Operations',
    'IT Support',
  ];
  cName = 'pre_login';
  ngOnInit(): void {
    this.stickyNavBar();
    this.loginType = this.loginService.getLoginType();
  }

  stickyNavBar() {
    $(window).scroll(function () {
      var y = $(window).scrollTop();
      if (y > 0) {
        $('.navbar').addClass('sticky');
      } else {
        $('.navbar').removeClass('sticky');
      }
    });
  }

  signUpRouting(val) {
    document.getElementById('closePopUpButton').click();
    this.router.navigate([val]);
  }
  toFacade() {
    this.router.navigate(['']);
  }
  onSignUp() {
    this.router.navigate(['sign-up']);
  }

  toSignUpExpert() {
    this.router.navigate(['sign-up-expert']);
  }
  toLoginPage() {
    this.router.navigate(['login']);
  }

  displaySelectedSubjects(category) {
    console.log(category);
    if (category != null) {
      this.router.navigate(['search-results'], {
        queryParams: { subject: category },
      });
    }
  }
}
