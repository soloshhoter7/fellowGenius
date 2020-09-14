import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { LoginDetailsService } from "../service/login-details.service";
@Component({
  selector: "app-nav-bar",
  templateUrl: "./nav-bar.component.html",
  styleUrls: ["./nav-bar.component.css"],
})
export class NavBarComponent implements OnInit {
  constructor(
    private router: Router,
    private loginService: LoginDetailsService
  ) {}

  ngOnInit(): void {}

  onSignUp() {
    this.router.navigate(["signUp"]);
  }

  toLoginPage() {
    this.router.navigate(["login"]);
  }
}
