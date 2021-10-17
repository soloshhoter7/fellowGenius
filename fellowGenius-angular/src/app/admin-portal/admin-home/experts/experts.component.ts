import { Component, NgZone, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { Category } from 'src/app/model/category';
import { filtersApplied } from 'src/app/model/filtersApplied';
import {
  featuredExpert,
  tutorProfileDetails,
} from 'src/app/model/tutorProfileDetails';
import { FiltersDialogComponent } from 'src/app/search-results/filters-dialog/filters-dialog.component';
import { HttpService } from 'src/app/service/http.service';
import { LoginDetailsService } from 'src/app/service/login-details.service';
import { ProfileService } from 'src/app/service/profile.service';
import { initiate, initiateSelect2 } from '../../../../assets/js/custom';
declare const window: any;
@Component({
  selector: 'app-experts',
  templateUrl: './experts.component.html',
  styleUrls: ['./experts.component.css'],
})
export class ExpertsComponent implements OnInit {
  featuredExperts: featuredExpert[] = [];
  selectedExpert = new tutorProfileDetails();
  selectedExpertTopic;
  slidesStore = [
    {
      id: 1,
      imageUrl:
        'https://firebasestorage.googleapis.com/v0/b/fellowgenius-15c87.appspot.com/o/tutor_profile_picture%2F%5Bobject%20File%5D_1630739477876?alt=media&token=a590b0bc-850b-462e-ad95-9b86fca93836',
      name: 'Tejpal Singh Kang',
      specialisation: 'PIET - B.tech[CSE]',
      domain: 'Key Account Management',
      studentsCount: 50,
      sessionsCount: 98,
      rating: 85,
      review:
        'Its beautiful user interface make Experts and learner feel at home.',
    },
    {
      id: 2,
      imageUrl:
        'https://firebasestorage.googleapis.com/v0/b/fellowgenius-15c87.appspot.com/o/tutor_profile_picture%2F%5Bobject%20File%5D_1630788559940?alt=media&token=c88171bc-de02-43da-b3f7-cba3e2fe7197',
      name: 'Vikas Dabas',
      domain: 'Product Management',
      specialisation: 'PIET - B.tech[CSE]',
      review:
        'As an expert, it was an awesome experience being part of this platform. ',
      studentsCount: 30,
      sessionsCount: 46,
      rating: 90,
    },

    {
      id: 3,
      imageUrl:
        'https://firebasestorage.googleapis.com/v0/b/fellowgenius-15c87.appspot.com/o/tutor_profile_picture%2F%5Bobject%20File%5D_1631097989114?alt=media&token=ef49be5a-167a-471c-a09f-a140374268fd',
      name: 'Paawan juneja',
      domain: 'Talent Acquisition',
      specialisation: 'PIET - B.tech[CSE]',
      review:
        'I loved the experience of teaching here and the quality functionality.',
      studentsCount: 21,
      sessionsCount: 53,
      rating: 100,
    },
    {
      id: 4,
      imageUrl:
        'https://firebasestorage.googleapis.com/v0/b/fellowgenius-15c87.appspot.com/o/tutor_profile_picture%2F%5Bobject%20File%5D_1630865500585?alt=media&token=65088f67-2bdb-4273-8578-90b1f306d8fe',
      name: 'Shubham Sharma',
      domain: 'Website Development',
      specialisation: 'PIET - B.tech[CSE]',
      review:
        'I loved the experience of teaching here and the quality functionality.',
      studentsCount: 21,
      sessionsCount: 53,
      rating: 100,
    },
  ];
  searchResults: tutorProfileDetails[] = [];
  filteredArray: tutorProfileDetails[] = [];
  allFiltersApplied: filtersApplied;
  subjects: string[];
  selectedSubject;
  // arrayToShow: tutorProfileDetails[];
  isLoading: boolean = true;
  subjectFiltersApplied = [];
  priceFiltersApplied = [];
  ratingFilterApplied = [];
  domainFilterApplied = [];
  deletionElementFinder = [];
  elementsToBeDeleted = [];
  expertsCount = 0;
  callSearchBySubject: boolean;
  callSearchByPrice: boolean;
  findFromSearchResult: boolean;
  findFromFilterSearch: boolean;

  screenHeight: number;
  screenWidth: number;
  showMobileFilterView: boolean;
  showMobileFilterButton: boolean = false;
  subCategories: Category[] = [];
  categories: Category[] = [];
  constructor(
    private router: Router,
    private httpService: HttpService,
    private loginService: LoginDetailsService,
    private profileService: ProfileService,
    private matDialog: MatDialog,
    private ngZone: NgZone,
    private activatedRoute: ActivatedRoute
  ) {
    initiate();
    this.allFiltersApplied = new filtersApplied();
  }

  ngOnInit(): void {
    window.scroll(0, 0);
    this.fetchFeaturedExperts();
    this.activatedRoute.queryParams.subscribe((params) => {
      this.selectedSubject = params['subject'];
      this.allFiltersApplied.domain = this.selectedSubject;
      // this.filteredArray = this.searchResults;
      this.fetchTutorList();
      this.getCategories();
    });
    window['angularComponentReference'] = {
      component: this,
      zone: this.ngZone,
      doSearchByDomain: (evt: any) => this.searchByDomain(evt),
      doSearchBySubject: (evt: any) => this.searchBySubject(evt),
      doSearchByPrice: (evt: any) => this.searchByPrice(evt),
      doSearchByRating: (evt: any) => this.searchByRatings(evt),
      doSort: (evt: any) => this.sort(evt),
    };
    initiateSelect2();
    $('#domainFilter').on('change', function () {
      // this.selectedCategory = $(this).val();
      console.log('hey domain');

      window.angularComponentReference.zone.run(() => {
        let val = $(this).val();
        if (val != null) {
          window.angularComponentReference.doSearchByDomain(val);
        }
      });
      // // this.filteredSubCategories = [];
      // // this.filteredSubCategories = this.subCategories.filter(x=>x.category==this.selectedCategory)
    });

    $('#subjectFilter').on('change', function () {
      // this.selectedCategory = $(this).val();
      console.log('hey');

      window.angularComponentReference.zone.run(() => {
        let val = $(this).val();
        if (val != null) {
          window.angularComponentReference.doSearchBySubject(val);
        }
      });
      // // this.filteredSubCategories = [];
      // // this.filteredSubCategories = this.subCategories.filter(x=>x.category==this.selectedCategory)
    });
    $('#priceFilter').on('change', function () {
      // this.selectedCategory = $(this).val();
      console.log('hey price');

      window.angularComponentReference.zone.run(() => {
        let val = $(this).val();
        if (val != null) {
          window.angularComponentReference.doSearchByPrice(val);
        }
      });
      // // this.filteredSubCategories = [];
      // // this.filteredSubCategories = this.subCategories.filter(x=>x.category==this.selectedCategory)
    });
    $('#ratingFilter').on('change', function () {
      // this.selectedCategory = $(this).val();
      console.log('hey rating');

      window.angularComponentReference.zone.run(() => {
        let val = $(this).val();
        if (val != null) {
          window.angularComponentReference.doSearchByRating(val);
        }
      });
      // // this.filteredSubCategories = [];
      // // this.filteredSubCategories = this.subCategories.filter(x=>x.category==this.selectedCategory)
    });
    $('#sortExpert').on('change', function () {
      // this.selectedCategory = $(this).val();
      console.log('hey sort');

      window.angularComponentReference.zone.run(() => {
        let val = $(this).val();
        if (val != null) {
          window.angularComponentReference.doSort(val);
        }
      });
      // // this.filteredSubCategories = [];
      // // this.filteredSubCategories = this.subCategories.filter(x=>x.category==this.selectedCategory)
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
  }
  isFeatured(expert: tutorProfileDetails) {
    for (let i = 0; i < this.featuredExperts.length; i++) {
      if (expert.bookingId == this.featuredExperts[i].expertId) {
        return true;
      }
    }
    return false;
  }
  featureExpert(expert: tutorProfileDetails) {
    this.selectedExpert = expert;
  }
  saveFeaturedExperts() {
    let exp = new featuredExpert();
    if (this.selectedExpertTopic != null) {
      exp.expertId = this.selectedExpert.bookingId;
      exp.name = this.selectedExpert.fullName;
      exp.profilePictureUrl = this.selectedExpert.profilePictureUrl;
      exp.topic = this.selectedExpertTopic;
      exp.precedence = this.featuredExperts.length + 1;
      document.getElementById('closePopUpButton').click();
      console.log(exp);

      this.httpService.saveFeaturedExpert(exp).subscribe((res) => {
        console.log(res);
        location.reload();
      });
    }
  }
  fetchFeaturedExperts() {
    this.httpService.fetchFeaturedExperts().subscribe((res) => {
      this.featuredExperts = res;
      this.sortFeaturedExperts();
      console.log(this.featuredExperts);
    });
  }
  sortFeaturedExperts() {
    this.featuredExperts.sort((a, b) =>
      a.precedence > b.precedence ? 1 : b.precedence > a.precedence ? -1 : 0
    );
  }
  deleteFeaturedExpert(exp) {
    if (confirm('Are you sure you want to delete featured expert ?')) {
      console.log(exp);
      console.log(this.featuredExperts.indexOf(exp));
      this.featuredExperts.splice(this.featuredExperts.indexOf(exp), 1);
      this.updatePrecedences();
      this.updateFeaturedExperts();
    }
  }
  updatePrecedences() {
    let count = 1;
    for (let i = 0; i < this.featuredExperts.length; i++) {
      this.featuredExperts[i].precedence = count;
      count++;
    }
  }
  moveUp(exp) {
    console.log(exp);
    let index = this.featuredExperts.indexOf(exp);

    this.featuredExperts[index].precedence--;
    this.featuredExperts[index - 1].precedence++;
    this.updateFeaturedExperts();
  }
  moveDown(exp) {
    let index = this.featuredExperts.indexOf(exp);

    this.featuredExperts[index].precedence++;
    this.featuredExperts[index + 1].precedence--;
    this.updateFeaturedExperts();
  }
  updateFeaturedExperts() {
    this.httpService
      .updateFeaturedExperts(this.featuredExperts)
      .subscribe((res) => {
        console.log(res);

        location.reload();
      });
  }
  fetchTutorList() {
    this.httpService.getTutorList('*').subscribe((req) => {
      this.searchResults = [];
      this.filteredArray = [];
      this.searchResults = req;
      this.isLoading = false;
      this.expertsCount = this.searchResults.length;
    });
  }

  // searchResults = [ '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1' ];
  onSignUp() {
    this.router.navigate(['sign-up']);
  }
  getCategories() {
    this.httpService.getAllCategories().subscribe((res) => {
      this.categories = res;
    });
  }
  getSubCategories() {
    this.httpService.getSubCategories(this.selectedSubject).subscribe((res) => {
      this.subCategories = res;
    });
  }
  checkFilters() {
    var subjectFiltersLength, ratingFiltersLength, priceFiltersLength;
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

      if (subjectFiltersLength || priceFiltersLength || ratingFiltersLength) {
        return true;
      } else {
        return false;
      }
    } else {
      console.log('no filters');
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
  createExpertString(result: any) {
    let filteredArray = result.areaOfExpertise.filter(
      (x) => x.category == this.selectedSubject
    );
    let expertise: string = '';
    for (let i = 0; i < filteredArray.length; i++) {
      if (filteredArray[i].category == this.selectedSubject) {
        expertise += filteredArray[i].subCategory;
        if (i != filteredArray.length - 1) {
          expertise += ',';
        }
      }
    }
    return expertise;
  }
  viewProfile(profile: tutorProfileDetails) {
    this.profileService.setProfile(profile);
    this.router.navigate(['view-tutors'], {
      queryParams: { page: profile.bookingId, subject: this.selectedSubject },
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
        $('#subjectFilter').val('defaultSubject').trigger('change');
        this.filteredArray = [];
        this.filteredArray = res;
        this.calculateFilteredExpertsCount();
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
        this.calculateFilteredExpertsCount();
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
        $('#ratingFilter').val('defaultRating').trigger('change');
        this.filteredArray = res;
        this.calculateFilteredExpertsCount();
      });
    }
  }
  deleteDomain(domain) {
    if (this.domainFilterApplied.includes(domain)) {
      this.domainFilterApplied.splice(
        this.domainFilterApplied.indexOf(domain),
        1
      );
      this.allFiltersApplied.domains.splice(
        this.allFiltersApplied.domains.indexOf(domain),
        1
      );
      this.httpService.applyFilters(this.allFiltersApplied).subscribe((res) => {
        this.filteredArray = [];
        $('#domainFilter').val('defaultDomain').trigger('change');
        this.filteredArray = res;
        this.calculateFilteredExpertsCount();
      });
    }
  }
  calculateFilteredExpertsCount() {
    let filterCount =
      this.allFiltersApplied.subjects.length +
      this.allFiltersApplied.price.length +
      this.allFiltersApplied.ratings.length;
    if (filterCount != 0) {
      this.expertsCount = this.filteredArray.length;
    } else if (filterCount == 0) {
      this.expertsCount = this.searchResults.length;
    }
  }
  searchByDomain(evt) {
    var domain = evt;
    console.log(domain);
    if (domain != null) {
      this.selectedSubject = domain;
      this.getSubCategories();
      this.domainFilterApplied.push(domain);
      this.allFiltersApplied.domains.push(domain);
      this.allFiltersApplied.show = true;
    } else {
      if (this.checkFiltersApplied(this.domainFilterApplied, domain)) {
        this.domainFilterApplied.splice(
          this.domainFilterApplied.indexOf(domain),
          1
        );
        this.allFiltersApplied.domains.splice(
          this.allFiltersApplied.domains.indexOf(domain),
          1
        );
        if (this.allFiltersApplied.domains.length == 0) {
          this.allFiltersApplied.show = false;
        }
      } else {
        this.domainFilterApplied.push(domain);
        this.allFiltersApplied.domains.push(domain);
        this.allFiltersApplied.show = true;
      }
    }
    console.log(this.allFiltersApplied);
    this.httpService.applyFilters(this.allFiltersApplied).subscribe((res) => {
      this.filteredArray = [];
      this.filteredArray = res;

      $('#domainFilter').val('defaultDomain').trigger('change');
      this.expertsCount = this.filteredArray.length;
    });
  }
  searchBySubject(evt) {
    var subject = evt;
    console.log(subject);
    if (subject != null) {
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
      }console.log(this.allFiltersApplied);
      this.httpService.applyFilters(this.allFiltersApplied).subscribe((res) => {
        this.filteredArray = [];
        this.filteredArray = res;
        $('#subjectFilter').val('defaultSubject').trigger('change');
        this.expertsCount = this.filteredArray.length;
      });
    }
  }

  searchByPrice(evt) {
    console.log('called');
    var price = evt;
    if (price != null) {
      console.log('called');

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
      console.log(this.allFiltersApplied);
      this.httpService.applyFilters(this.allFiltersApplied).subscribe((res) => {
        this.filteredArray = [];
        this.filteredArray = res;
        $('#priceFilter').val('defaultPrice').trigger('change');

        this.expertsCount = this.filteredArray.length;
      });
    }
  }

  searchByRatings(evt) {
    var ratings = evt;
    if (ratings != null) {
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
        $('#ratingFilter').val('defaultRating').trigger('change');
        this.expertsCount = this.filteredArray.length;
      });
    }
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

  sort(evt) {
    if (
      this.allFiltersApplied.price.length == 0 &&
      this.allFiltersApplied.ratings.length == 0 &&
      this.allFiltersApplied.subjects.length == 0
    ) {
      if (evt.localeCompare('priceLowToHigh') == 0) {
        this.searchResults.sort((a, b) => Number(a.price1) - Number(b.price1));
      } else if (evt.localeCompare('priceHighToLow') == 0) {
        this.searchResults.sort((a, b) => Number(b.price1) - Number(a.price1));
      } else if (evt.localeCompare('ratingLowToHigh') == 0) {
        this.searchResults.sort((a, b) => a.rating - b.rating);
      } else if (evt.localeCompare('ratingHighToLow') == 0) {
        this.searchResults.sort((a, b) => b.rating - a.rating);
      }
    } else {
      if (evt.localeCompare('priceLowToHigh') == 0) {
        this.filteredArray.sort((a, b) => Number(a.price1) - Number(b.price1));
      } else if (evt.localeCompare('priceHighToLow') == 0) {
        this.filteredArray.sort((a, b) => Number(b.price1) - Number(a.price1));
      } else if (evt.localeCompare('ratingLowToHigh') == 0) {
        this.filteredArray.sort((a, b) => a.rating - b.rating);
      } else if (evt.localeCompare('ratingHighToLow') == 0) {
        this.filteredArray.sort((a, b) => b.rating - a.rating);
      }
    }
  }
}
