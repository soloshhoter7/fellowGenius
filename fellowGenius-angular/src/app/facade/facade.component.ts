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
      imageUrl: '../../assets/images/suyashKejriwal.jpg',
      name: 'Suyash Kejriwal',
      specialisation: 'PIET - B.tech[CSE]',
      studentsCount: 50,
      sessionsCount: 98,
      rating: 85,
      review:
        'Fellowgenius is a standalone peer to peer online classes platform. its beautiful user interface make Experts and learner feel at home. it is a great platform to promote online educators.',
    },
    {
      id: 2,
      imageUrl: '../../assets/images/vaibhav.jpeg',
      name: 'Vaibhav Vishal Jha',
      specialisation: 'PIET - B.tech[CSE]',
      review:
        'As a teaching expert, it was an awesome experience being a part of this wonderful platform. The layout is very clean anyone would appreciate its simplicity',
      studentsCount: 30,
      sessionsCount: 46,
      rating: 90,
    },
    {
      id: 3,
      imageUrl: '../../assets/images/ajayVerma.jpg',
      name: 'Ajay Verma',
      specialisation: 'PIET - B.tech[CSE]',
      review:
        'I really loved the experience of teaching here, not only the quality of the platform but also the ease to understand its functionality. Most of the features are self explanatory here, Good job guyz',
      studentsCount: 21,
      sessionsCount: 53,
      rating: 100,
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
