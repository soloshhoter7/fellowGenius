import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { LoginDetailsService } from "../service/login-details.service";
@Component({
  selector: "app-nav-bar",
  templateUrl: "./nav-bar.component.html",
  styleUrls: ["./nav-bar.component.css"],
})
export class NavBarComponent implements OnInit {
  constructor(
    private router: Router,
    private loginService: LoginDetailsService,
    private cookieService: CookieService
  ) {}
  loginType;
  ngOnInit(): void {
    this.loginType = this.loginService.getLoginType();
  }

  onSignUp() {
    this.router.navigate(["signUp"]);
  }

  toLoginPage() {
    this.router.navigate(["login"]);
  }
  toDashboard() {
    if (this.loginType == "Learner") {
      this.router.navigate(["home/studentDashboard"]);
    } else if (this.loginType == "Expert") {
      this.router.navigate(["home/tutorDashboard"]);
    }
  }
  onSignOut() {
    this.cookieService.delete("token");
    this.cookieService.delete("userId");
    this.loginService.setLoginType(null);
    this.loginService.setTrType(null);
    this.router.navigate([""]);
  }
}
