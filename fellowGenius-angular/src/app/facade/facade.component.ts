import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginDetailsService } from '../service/login-details.service';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-facade',
  templateUrl: './facade.component.html',
  styleUrls: ['./facade.component.css'],
})
export class FacadeComponent implements OnInit {
  constructor(
    private router: Router,
    private loginDetailsService: LoginDetailsService,
    public breakpointObserver: BreakpointObserver,
    private readonly http: HttpClient
  ) {}
  switchView: boolean = false;
  showContainer: boolean = false;
  reviewsView = true;
  myControl = new FormControl();
  options: string[] = [
    'Mathematics',
    'English',
    'Science',
    'Social Science',
    'History',
    'Political Science',
    'Geography',
    'Physics',
    'Chemistry',
  ];
  filteredOptions: Observable<string[]>;

  selectedSubject;
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
      800: {
        items: 3,
      },
      1000: {
        items: 3,
      },
      1300: {
        items: 4,
      },
    },
  };
  //arrray for carousel
  slidesStore = [
    {
      id: 1,
      src: '../../assets/images/bulb.jpeg',
      alt: 'Image_1',
      title: 'Image_1',
    },
    {
      id: 2,
      src: '../../assets/images/bulb.jpeg',
      alt: 'Image_2',
      title: 'Image_3',
    },
    {
      id: 3,
      src: '../../assets/images/bulb.jpeg',
      alt: 'Image_3',
      title: 'Image_3',
    },
    {
      id: 4,
      src: '../../assets/images/bulb.jpeg',
      alt: 'Image_4',
      title: 'Image_4',
    },
    {
      id: 5,
      src: '../../assets/images/bulb.jpeg',
      alt: 'Image_5',
      title: 'Image_5',
    },
    {
      id: 6,
      src: '../../assets/images/bulb.jpeg',
      alt: 'Image_6',
      title: 'Image_6',
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
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );
  }

  switchReviewsView() {
    this.reviewsView = !this.reviewsView;
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  displaySelectedSubjects() {
    if (this.selectedSubject) {
      this.router.navigate(['searchResults']);
    }
  }
  onSignUp() {
    this.router.navigate(['signUp']);
  }

  toLoginPage() {
    this.router.navigate(['login']);
  }
}
