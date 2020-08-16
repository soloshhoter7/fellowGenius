import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { LoginDetailsService } from "../service/login-details.service";
import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";
import { OwlOptions } from "ngx-owl-carousel-o";
import { HttpClient } from "@angular/common/http";
import { throwError } from "rxjs";
export interface PhotosApi {
  albumId?: number;
  id?: number;
  title?: string;
  url?: string;
  thumbnailUrl?: string;
}

@Component({
  selector: "app-facade",
  templateUrl: "./facade.component.html",
  styleUrls: ["./facade.component.css"],
})
export class FacadeComponent implements OnInit {
  switchView: boolean = false;
  showContainer: boolean = false;
  apiData: PhotosApi;

  constructor(
    private router: Router,
    private loginDetailsService: LoginDetailsService,
    public breakpointObserver: BreakpointObserver,
    private readonly http: HttpClient
  ) {}
  // options settings for owl carousel;
  customOptions: OwlOptions = {
    loop: true,
    autoplay: true,
    center: true,
    dots: true,
    autoHeight: true,
    autoWidth: true,
    responsive: {
      0: {
        items: 1,
      },
      300: {
        items: 1,
      },
      600: {
        items: 2,
      },
      1000: {
        items: 3,
      },
    },
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
    // this.breakpointObserver
    //   .observe(["(min-width: 800px)"])
    //   .subscribe((state: BreakpointState) => {
    //     if (state.matches) {
    //       this.showContainer = true;
    //       this.switchView = false;
    //     } else {
    //       this.showContainer = false;
    //       this.switchView = true;
    //     }
    //   });
  }

  onSignUp() {
    this.router.navigate(["signUp"]);
  }

  toLoginPage() {
    this.router.navigate(["login"]);
  }
}
