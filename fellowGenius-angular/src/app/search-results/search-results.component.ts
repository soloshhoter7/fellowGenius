import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../service/http.service';
import { tutorProfileDetails } from '../model/tutorProfileDetails';
import { element } from 'protractor';
import { LoginDetailsService } from '../service/login-details.service';
import { ProfileService } from '../service/profile.service';
import { MatDialog } from '@angular/material/dialog';
import { HostListener } from '@angular/core';
import { Subject } from 'rxjs';
import { filtersApplied } from '../model/filtersApplied';
import { subject } from '../model/subject';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css'],
})
export class SearchResultsComponent implements OnInit {
  searchResults: tutorProfileDetails[] = [];
  filteredArray: tutorProfileDetails[] = [];
  allFiltersApplied: filtersApplied = new filtersApplied();
  subjects: string[];
  // arrayToShow: tutorProfileDetails[];

  subjectFiltersApplied = [];
  priceFiltersApplied = [];
  ratingFilterApplied = [];
  deletionElementFinder = [];
  elementsToBeDeleted = [];

  callSearchBySubject: boolean;
  callSearchByPrice: boolean;
  findFromSearchResult: boolean;
  findFromFilterSearch: boolean;

  screenHeight: number;
  screenWidth: number;
  showMobileFilterView: boolean;
  showMobileFilterButton: boolean;

  constructor(
    private router: Router,
    private httpService: HttpService,
    private loginService: LoginDetailsService,
    private profileService: ProfileService,
    private matDialog: MatDialog,
    private activatedRoute: ActivatedRoute
  ) {
    this.getScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    console.log('in get screen size');
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 500) {
      this.showMobileFilterButton = true;
      this.showMobileFilterView = true;
    } else {
      this.showMobileFilterButton = false;
      this.showMobileFilterView = false;
    }
  }

  ngOnInit(): void {
    console.log(this.allFiltersApplied.show);

    if (window.screen.width <= 500) {
      console.log(this.screenWidth);
      console.log('size<500');
      this.showMobileFilterButton = true;
      this.showMobileFilterView = true;
    } else {
      this.showMobileFilterButton = false;
      this.showMobileFilterView = false;
    }

    this.fetchTutorList();
    // console.log("login type ->" + this.loginService.getLoginType());
    this.callSearchBySubject = false;
    this.callSearchByPrice = false;
    this.findFromSearchResult = false;
    this.findFromFilterSearch = false;

    // this.searchResults = [
    //   {
    //     tid: 1234,
    //     areaOfExpertise: ["Mathematics", "English", "Physics"],
    //     currentOrganisation: "Google",
    //     description: "I have an experience of 10 years aksjh a hj hdjkh jkj ahd ajkh adkah da djkajs d ak jk j sdlks k kl kls kk k",
    //     educationalQualifications: ["Btech(CSE)", "HTML", "CSS"],
    //     fullName: "Ajay Verma",
    //     institute: "Panipat Institute of Engineering and Technology",
    //     lessonCompleted: 0,
    //     linkedInProfile: "Ajay.linkedin",
    //     previousOrganisations: ["PeopleStrong Pvt. Ltd"],
    //     price1: "400",
    //     price2: "400",
    //     price3: "400",
    //     professionalSkills: "Angular, JAVA",
    //     profileCompleted: 100,
    //     profilePictureUrl: null,
    //     rating: 90,
    //     reviewCount: 10,
    //     speciality: "Angular, JAVA",
    //     yearsOfExperience: 10,
    //   },
    //   {
    //     tid: 3578,
    //     areaOfExpertise: ["Mathematics", "Chemistry", "Physics"],
    //     currentOrganisation: "Google",
    //     description: "I have an experience of 10 years",
    //     educationalQualifications: ["Btech(CSE)", "HTML", "CSS"],
    //     fullName: "Shubham Verma",
    //     institute: "Panipat Institute of Engineering and Technology",
    //     lessonCompleted: 0,
    //     linkedInProfile: "AJay.linkedin",
    //     previousOrganisations: ["PeopleStrong Pvt. Ltd"],
    //     price1: "800",
    //     price2: "400",
    //     price3: "400",
    //     professionalSkills: "Angular, JAVA",
    //     profileCompleted: 100,
    //     profilePictureUrl: null,
    //     rating: 70,
    //     reviewCount: 10,
    //     speciality: "Angular, JAVA",
    //     yearsOfExperience: 10,
    //   },
    //   {
    //     tid: 3572,
    //     areaOfExpertise: ["Chemistry", "English", "Physics"],
    //     currentOrganisation: "Google",
    //     description: "I have an experience of 10 years",
    //     educationalQualifications: ["Btech(CSE)", "HTML", "CSS"],
    //     fullName: "Muskan Verma",
    //     institute: "Panipat Institute of Engineering and Technology",
    //     lessonCompleted: 0,
    //     linkedInProfile: "Muskan.linkedin",
    //     previousOrganisations: ["PeopleStrong Pvt. Ltd"],
    //     price1: "500",
    //     price2: "400",
    //     price3: "400",
    //     professionalSkills: "Angular, JAVA",
    //     profileCompleted: 100,
    //     profilePictureUrl: null,
    //     rating: 50,
    //     reviewCount: 10,
    //     speciality: "Angular, JAVA",
    //     yearsOfExperience: 10,
    //   },
    //   {
    //     tid: 8754,
    //     areaOfExpertise: ["Science", "English"],
    //     currentOrganisation: "Google",
    //     description: "I have an experience of 10 years",
    //     educationalQualifications: ["Btech(CSE)", "HTML", "CSS"],
    //     fullName: "Abhinav Tyagi",
    //     institute: "Panipat Institute of Engineering and Technology",
    //     lessonCompleted: 0,
    //     linkedInProfile: "Abhinav.linkedin",
    //     previousOrganisations: ["PeopleStrong Pvt. Ltd"],
    //     price1: "200",
    //     price2: "400",
    //     price3: "400",
    //     professionalSkills: "Angular, JAVA",
    //     profileCompleted: 100,
    //     profilePictureUrl: null,
    //     rating: 20,
    //     reviewCount: 10,
    //     speciality: "Angular, JAVA",
    //     yearsOfExperience: 10,
    //   },
    // ];

    this.fetchTutorList();

    this.filteredArray = this.searchResults;
  }

  // searchResults = [ '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1' ];
  onSignUp() {
    this.router.navigate(['signUp']);
  }

  showFilters() {
    this.showMobileFilterView = !this.showMobileFilterView;
  }
  toLoginPage() {
    this.router.navigate(['login']);
  }

  viewProfile(profile: tutorProfileDetails) {
    this.profileService.setProfile(profile);
    this.router.navigate(['viewTutors'], {
      queryParams: { page: profile.tid },
    });
  }

  // openDialogProfile() {
  // 	this.matDialog.open(TutorProfileComponent, {
  // 		height: '90vh',
  // 		width: '70vw'
  // 	});
  // }
  fetchTutorList() {
    this.httpService.getTutorList().subscribe((req) => {
      this.searchResults = req;
    });
  }

  searchBySubject($event) {
    var subject = $event.target.value;
    if (this.subjectFiltersApplied.length == 0) {
      this.subjectFiltersApplied.push(subject);
      this.allFiltersApplied.subjects.push(subject);
      this.allFiltersApplied.show = true;
    } else {
      if (this.checkFiltersApplied(this.subjectFiltersApplied, subject)) {
        this.subjectFiltersApplied.splice(
          this.subjectFiltersApplied.indexOf(subject),
          1
        );
        this.allFiltersApplied.subjects.splice(
          this.allFiltersApplied.subjects.indexOf(subject),
          1
        );
        if (this.allFiltersApplied.subjects.length == 0) {
          this.allFiltersApplied.show = false;
        }
      } else {
        this.subjectFiltersApplied.push(subject);
        this.allFiltersApplied.subjects.push(subject);
        this.allFiltersApplied.show = true;
      }
    }
    this.httpService.applyFilters(this.allFiltersApplied).subscribe((res) => {
      // console.log(res.valueOf());
      // this.filteredArray = res;
      // console.log(res.toString().length == undefined);
    });
  }

  searchByPrice($event) {
    var price = $event.target.value;
    if (this.priceFiltersApplied.length == 0) {
      this.priceFiltersApplied.push(price);
      this.allFiltersApplied.price.push(price);
      this.allFiltersApplied.show = true;
    } else {
      if (this.checkFiltersApplied(this.priceFiltersApplied, price)) {
        this.priceFiltersApplied.splice(
          this.priceFiltersApplied.indexOf(price),
          1
        );
        this.allFiltersApplied.price.splice(
          this.allFiltersApplied.price.indexOf(price),
          1
        );
        if (this.allFiltersApplied.price.length == 0) {
          this.allFiltersApplied.show = false;
        }
      } else {
        this.priceFiltersApplied.push(price);
        this.allFiltersApplied.price.push(price);
        this.allFiltersApplied.show = true;
      }
    }
    this.httpService.applyFilters(this.allFiltersApplied).subscribe((res) => {
      console.log(res);
    });
  }

  searchByRatings($event) {
    var ratings = $event.target.value;
    if (this.ratingFilterApplied.length == 0) {
      this.ratingFilterApplied.push(ratings);
      this.allFiltersApplied.ratings.push(ratings * 20);
      this.allFiltersApplied.show = true;
    } else {
      if (this.checkFiltersApplied(this.ratingFilterApplied, ratings)) {
        this.ratingFilterApplied.splice(
          this.ratingFilterApplied.indexOf(ratings),
          1
        );
        this.allFiltersApplied.ratings.splice(
          this.allFiltersApplied.ratings.indexOf(ratings * 20),
          1
        );
        if (this.allFiltersApplied.ratings.length == 0) {
          this.allFiltersApplied.show = false;
        }
      } else {
        this.ratingFilterApplied.push(ratings);
        this.allFiltersApplied.ratings.push(ratings * 20);
        this.allFiltersApplied.show = true;
      }
    }
    this.httpService.applyFilters(this.allFiltersApplied).subscribe((res) => {
      console.log(res);
    });
  }

  removeOrNot(areaOfExpertise, subjectFiltersApplied, eventTarget) {
    var flag = 0;
    for (var i = 0; i < areaOfExpertise.length; i++) {
      for (var j = 0; j < subjectFiltersApplied.length; j++) {
        if (subjectFiltersApplied[j].localeCompare(eventTarget) == 0) {
          continue;
        } else {
          if (
            areaOfExpertise[i].area.localeCompare(subjectFiltersApplied[j]) == 0
          ) {
            flag = 1;
            break;
          }
        }
      }
    }
    if (flag == 0) {
      return true;
    } else {
      return false;
    }
  }

  checkFiltersApplied(array, selectedValue) {
    if (array.includes(selectedValue)) {
      return true;
    }
  }

  checkDuplicacyOfObjectInArray(array, object) {
    if (
      array.filter((e) => JSON.stringify(e) === JSON.stringify(object)).length >
      0
    ) {
      return true;
    }
  }

  sort($event) {
    console.log('in sort');
    if ($event.target.value.localeCompare('sortLowToHigh') == 0) {
      if (!this.allFiltersApplied.show) {
        this.searchResults.sort((a, b) => Number(a.price1) - Number(b.price1));
      } else {
        this.filteredArray.sort((a, b) => Number(a.price1) - Number(b.price1));
      }
    } else if ($event.target.value.localeCompare('sortHighToLow') == 0) {
      if (this.allFiltersApplied.show) {
        this.searchResults.sort((a, b) => Number(b.price1) - Number(a.price1));
      } else {
        this.filteredArray.sort((a, b) => Number(b.price1) - Number(a.price1));
      }
    }
  }
}
