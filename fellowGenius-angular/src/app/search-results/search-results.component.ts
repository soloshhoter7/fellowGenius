import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../service/http.service';
import { tutorProfileDetails } from '../model/tutorProfileDetails';
import { element } from 'protractor';
import { LoginDetailsService } from '../service/login-details.service';
import { ProfileService } from '../service/profile.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { HostListener } from '@angular/core';
import { Subject } from 'rxjs';
import { filtersApplied } from '../model/filtersApplied';
import { subject } from '../model/subject';
import { FiltersDialogComponent } from './filters-dialog/filters-dialog.component';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css'],
})
export class SearchResultsComponent implements OnInit {
  searchResults: tutorProfileDetails[] = [];
  filteredArray: tutorProfileDetails[] = [];
  allFiltersApplied: filtersApplied;
  subjects: string[];
  selectedSubject;
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
  showMobileFilterButton: boolean = false;

  constructor(
    private router: Router,
    private httpService: HttpService,
    private loginService: LoginDetailsService,
    private profileService: ProfileService,
    private matDialog: MatDialog,
    private activatedRoute: ActivatedRoute,
  ) {
    this.getScreenSize();
    this.allFiltersApplied = new filtersApplied();
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
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
    this.activatedRoute.queryParams.subscribe((params) => {
      this.selectedSubject = params['subject'];
    });
    if (window.screen.width <= 500) {
      this.showMobileFilterButton = true;
      this.showMobileFilterView = true;
    } else {
      this.showMobileFilterButton = false;
      this.showMobileFilterView = false;
    }

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
  checkFilters() {
    var subjectFiltersLength,ratingFiltersLength,priceFiltersLength;
    if (this.allFiltersApplied) {
      if (this.allFiltersApplied.subjects) {
        if (this.allFiltersApplied.subjects.length != 0) {
          subjectFiltersLength = true;
        } else {
          subjectFiltersLength = false;
        }
      }
      if (this.allFiltersApplied.price) {
        if (this.allFiltersApplied.price.length != 0) {
          priceFiltersLength = true;
        } else {
          priceFiltersLength = false;
        }
      }
      if (this.allFiltersApplied.ratings) {
        if (this.allFiltersApplied.ratings.length != 0) {
          ratingFiltersLength = true;
        } else {
          ratingFiltersLength = false;
        }
      }
      // console.log(subjectFiltersLength);
      // console.log(priceFiltersLength);
      // console.log(ratingFiltersLength);
      if(subjectFiltersLength||priceFiltersLength||ratingFiltersLength){
        return true;
      }else{
        return false;
      }
    }else{
      console.log('no filters')
      return false;
    }
  }
  showFilters() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.data = {
      subjectFiltersApplied: this.subjectFiltersApplied,
      priceFiltersApplied: this.priceFiltersApplied,
      ratingFiltersApplied: this.ratingFilterApplied,
      allFiltersApplied: this.allFiltersApplied,
    };
    // this.showMobileFilterView = !this.showMobileFilterView;
    // this.matDialog.open(FiltersDialogComponent);
    const dialogRef = this.matDialog.open(FiltersDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((data) => {
      if (data.operation == 'apply') {
        if (data.subjectFilters != null) {
          for (let subject of data.subjectFilters) {
            if (!this.subjectFiltersApplied.includes(subject)) {
              this.subjectFiltersApplied.push(subject);
            }
          }
        }

        if (data.priceFiltersApplied != null) {
          for (let price of data.priceFiltersApplied) {
            if (!this.priceFiltersApplied.includes(price)) {
              this.priceFiltersApplied.push(price);
            }
          }
        }
        if (data.ratingFilterApplied != null) {
          for (let rating of data.ratingFilterApplied) {
            if (!this.ratingFilterApplied.includes(rating)) {
              this.ratingFilterApplied.push(rating);
            }
          }
        }

        this.allFiltersApplied = data.allFiltersApplied;
        // console.log(this.checkFilters())
        this.httpService
          .applyFilters(this.allFiltersApplied)
          .subscribe((res) => {
            this.filteredArray = [];
            this.filteredArray = res;
          });
      }
    });
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
    this.httpService.getTutorList(this.selectedSubject).subscribe((req) => {
      this.searchResults = req;
    });
  }

  subjectContains(subject) {
    // var subject = $event.target.value;
    return this.subjectFiltersApplied.includes(subject);
  }

  priceContains(price) {
    return this.priceFiltersApplied.includes(price);
  }
  ratingContains(rating) {
    return this.ratingFilterApplied.includes(rating);
  }
  deleteSubject(subject) {
    if (this.subjectFiltersApplied.includes(subject)) {
      this.subjectFiltersApplied.splice(
        this.subjectFiltersApplied.indexOf(subject),
        1
      );
      this.allFiltersApplied.subjects.splice(
        this.allFiltersApplied.subjects.indexOf(subject),
        1
      );
      this.httpService.applyFilters(this.allFiltersApplied).subscribe((res) => {
        this.filteredArray = [];
        this.filteredArray = res;
      });
    }
  }

  deletePrice(price) {
    if (this.priceFiltersApplied.includes(price)) {
      this.priceFiltersApplied.splice(
        this.priceFiltersApplied.indexOf(price),
        1
      );
      this.allFiltersApplied.price.splice(
        this.priceFiltersApplied.indexOf(price),
        1
      );
      this.httpService.applyFilters(this.allFiltersApplied).subscribe((res) => {
        this.filteredArray = [];
        this.filteredArray = res;
      });
    }
  }
  deleteRating(rating) {
    if (this.ratingFilterApplied.includes(rating)) {
      this.ratingFilterApplied.splice(
        this.ratingFilterApplied.indexOf(rating),
        1
      );
      this.allFiltersApplied.ratings.splice(
        this.allFiltersApplied.ratings.indexOf(rating * 20),
        1
      );
      this.httpService.applyFilters(this.allFiltersApplied).subscribe((res) => {
        this.filteredArray = [];
        this.filteredArray = res;
      });
    }
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
      this.filteredArray = [];
      this.filteredArray = res;
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
      this.filteredArray = [];
      this.filteredArray = res;
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
      this.filteredArray = [];
      this.filteredArray = res;
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

  clearAllFilters() {
    window.location.reload();
  }

  sort($event) {
    if (
      this.allFiltersApplied.price.length == 0 &&
      this.allFiltersApplied.ratings.length == 0 &&
      this.allFiltersApplied.subjects.length == 0
    ) {
      if ($event.target.value.localeCompare('sortLowToHigh') == 0) {
        this.searchResults.sort((a, b) => Number(a.price1) - Number(b.price1));
      } else if ($event.target.value.localeCompare('sortHighToLow') == 0) {
        this.searchResults.sort((a, b) => Number(b.price1) - Number(a.price1));
      }
    } else {
      if ($event.target.value.localeCompare('sortLowToHigh') == 0) {
        this.filteredArray.sort((a, b) => Number(a.price1) - Number(b.price1));
      } else if ($event.target.value.localeCompare('sortHighToLow') == 0) {
        this.filteredArray.sort((a, b) => Number(b.price1) - Number(a.price1));
      }
    }
  }
}
