import { Component, HostListener, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { StudentProfileModel } from 'src/app/model/studentProfile';
import { tutorProfile } from 'src/app/model/tutorProfile';
import { AuthService } from 'src/app/service/auth.service';
import { LoginDetailsService } from 'src/app/service/login-details.service';
import { StudentService } from 'src/app/service/student.service';
import { TutorService } from 'src/app/service/tutor.service';

@Component({
  selector: 'app-user-dropdown',
  templateUrl: './user-dropdown.component.html',
  styleUrls: ['./user-dropdown.component.css'],
})
export class UserDropdownComponent implements OnInit {
  loginType: string;
  studentProfile: StudentProfileModel;
  tutorProfile: tutorProfile;
  profilePictureUrl = '../../../assets/images/default-user-image.png';
  fullName = '';
  role = '';
  @Input() parent = '';
  constructor(
    public router: Router,
    private route: ActivatedRoute,
    public loginService: LoginDetailsService,
    public cookieService: CookieService,
    public studentService: StudentService,
    public tutorService: TutorService,
    private authService: AuthService
  ) {}
  //to close the user dropdown if clicked outside
  @HostListener('document:click', ['$event']) onDocumentClick(event) {
    let toggleMenu = document.querySelector('.menu');
    if (toggleMenu.classList.contains('active')) {
      this.menuToggle();
    }
  }
  ngOnInit(): void {
    console.log(this.parent);
    this.loginType = this.loginService.getLoginType();
    console.log(this.loginType);
    if (this.loginType == 'Learner') {
      this.studentProfile = this.studentService.getStudentProfileDetails();
      if (this.studentProfile.fullName != null) {
        this.setDetails();
      } else {
        this.listenToAuth();
      }
    } else if (this.loginType == 'Expert') {
      this.tutorProfile = this.tutorService.getTutorDetials();
      if (this.tutorProfile.fullName != null) {
        this.setDetails();
      } else {
        this.listenToAuth();
      }
    } else if (this.loginType == 'Admin') {
      this.fullName = 'Administrator';
    }
  }
  listenToAuth() {
    console.log('called listen to auth');
    this.authService.getAuthStatusListener().subscribe((res) => {
      console.log('subscription called !');
      if (res == true) {
        console.log('received res ');
        this.setDetails();
      }
    });
  }
  //populate the details inside user dropdown
  setDetails() {
    if (this.loginType == 'Learner') {
      this.studentProfile = this.studentService.getStudentProfileDetails();
      console.log(this.studentProfile);
      this.fullName = this.studentProfile.fullName;
      this.role = 'Learner';
      if (this.studentProfile.profilePictureUrl)
        this.profilePictureUrl = this.studentProfile.profilePictureUrl;
      console.log(this.fullName, this.role, this.profilePictureUrl);
    } else if (this.loginType == 'Expert') {
      this.tutorProfile = this.tutorService.getTutorDetials();
      this.fullName = this.tutorProfile.fullName;
      this.role = 'Expert';
      if (this.tutorProfile.profilePictureUrl)
        this.profilePictureUrl = this.tutorProfile.profilePictureUrl;
    }
  }
  onSignOut() {
    let currentRoute = this.route.snapshot.routeConfig.component.name;
    this.cookieService.delete('token');
    this.cookieService.delete('userId');
    this.loginService.setLoginType(null);
    this.loginService.setTrType(null);
    if (currentRoute != 'ExpertProfileComponent') {
      this.router.navigate(['']);
    }
  }
  toDashboard() {
    if (this.loginType == 'Learner') {
      this.router.navigate(['home/student-dashboard']);
    } else if (this.loginType == 'Expert') {
      this.router.navigate(['home/tutor-dashboard']);
    } else if (this.loginType == 'Admin') {
      this.router.navigate(['admin/home']);
    }
  }
  //toggle the visibility of user dropdown
  menuToggle() {
    let toggleMenu = document.querySelector('.menu');
    toggleMenu.classList.toggle('active');
    event.stopPropagation();
  }
}
