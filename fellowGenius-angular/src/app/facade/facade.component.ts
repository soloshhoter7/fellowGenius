import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { LoginDetailsService } from "../service/login-details.service";
import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";
import { OwlOptions } from "ngx-owl-carousel-o";
@Component({
  selector: "app-facade",
  templateUrl: "./facade.component.html",
  styleUrls: ["./facade.component.css"],
})
export class FacadeComponent implements OnInit {
  switchView: boolean = false;
  showContainer: boolean = false;
  constructor(
    private router: Router,
    private loginDetailsService: LoginDetailsService,
    public breakpointObserver: BreakpointObserver
  ) {}
  // options settings for owl carousel
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    navText: ["Previous", "Next"],
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 2,
      },
      740: {
        items: 3,
      },
      940: {
        items: 3,
      },
    },
    nav: true,
  };
  //arrray for carousel
  slidesStore = [
    {
      id: 1,
      src: "../../assets/images/bulb.jpeg",
      alt: "Image_1",
      title: "Image_1",
    },
    {
      id: 2,
      src: "../../assets/images/bulb.jpeg",
      alt: "Image_2",
      title: "Image_3",
    },
    {
      id: 3,
      src: "../../assets/images/bulb.jpeg",
      alt: "Image_3",
      title: "Image_3",
    },
    {
      id: 4,
      src: "../../assets/images/bulb.jpeg",
      alt: "Image_4",
      title: "Image_4",
    },
    {
      id: 5,
      src: "../../assets/images/bulb.jpeg",
      alt: "Image_5",
      title: "Image_5",
    },
    {
      id: 6,
      src: "../../assets/images/bulb.jpeg",
      alt: "Image_6",
      title: "Image_6",
    },
  ];

  ngOnInit(): void {
    this.breakpointObserver
      .observe(["(min-width: 800px)"])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.showContainer = true;
          this.switchView = false;
        } else {
          this.showContainer = false;
          this.switchView = true;
        }
      });
  }

  onSignUp() {
    this.router.navigate(["signUp"]);
  }

  // onLoginStudent() {
  // 	this.loginDetailsService.setLoginType('student');
  // 	this.router.navigate([ 'login' ]);
  // }

  // onLoginTutor() {
  // 	this.loginDetailsService.setLoginType('tutor');
  // 	this.router.navigate([ 'login' ]);
  // }
  toLoginPage() {
    this.router.navigate(["login"]);
  }
}
