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
import { Category } from '../model/category';
import { initiateSelect2 } from 'src/assets/js/custom';
import { stringify } from '@angular/compiler/src/util';
import { NgZone } from '@angular/core';
declare const window: any;
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
  isLoading:boolean =true;
  subjectFiltersApplied = [];
  priceFiltersApplied = [];
  ratingFilterApplied = [];
  deletionElementFinder = [];
  elementsToBeDeleted = [];
  expertsCount=0;
  callSearchBySubject: boolean;
  callSearchByPrice: boolean;
  findFromSearchResult: boolean;
  findFromFilterSearch: boolean;

  screenHeight: number;
  screenWidth: number;
  showMobileFilterView: boolean;
  showMobileFilterButton: boolean = false;
  subCategories:Category[]=[];
  constructor(
    private router: Router,
    private httpService: HttpService,
    private loginService: LoginDetailsService,
    private profileService: ProfileService,
    private matDialog: MatDialog,
    private ngZone: NgZone,
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
    window.scroll(0,0);
    this.activatedRoute.queryParams.subscribe((params) => {
      this.selectedSubject = params['subject'];
      // this.filteredArray = this.searchResults;
      this.fetchTutorList();
      this.getSubCategories();
    });
    window['angularComponentReference'] = {
      component: this,
      zone: this.ngZone,
      doSearchBySubject: (evt: any) => this.searchBySubject(evt),
      doSearchByPrice: (evt: any) => this.searchByPrice(evt),
      doSearchByRating: (evt: any) => this.searchByRatings(evt),
      doSort:(evt:any)=> this.sort(evt)
    };
    initiateSelect2();
    $('#subjectFilter').on('change', function () {
      // this.selectedCategory = $(this).val();
      console.log('hey')

      window.angularComponentReference.zone.run(() => {
        let val = $(this).val();
        if(val!=null){
          window.angularComponentReference.doSearchBySubject(val);
        }
      });
      // // this.filteredSubCategories = [];
      // // this.filteredSubCategories = this.subCategories.filter(x=>x.category==this.selectedCategory)
    });
    $('#priceFilter').on('change', function () {
      // this.selectedCategory = $(this).val();
      console.log('hey price')

     
      window.angularComponentReference.zone.run(() => {
        let val = $(this).val();
        if(val!=null){
          window.angularComponentReference.doSearchByPrice(val);
        }
      });
      // // this.filteredSubCategories = [];
      // // this.filteredSubCategories = this.subCategories.filter(x=>x.category==this.selectedCategory)
    });
    $('#ratingFilter').on('change', function () {
      // this.selectedCategory = $(this).val();
      console.log('hey rating')

   
      window.angularComponentReference.zone.run(() => {
         let val = $(this).val();
        if(val!=null){
          window.angularComponentReference.doSearchByRating(val);
        };
      });
      // // this.filteredSubCategories = [];
      // // this.filteredSubCategories = this.subCategories.filter(x=>x.category==this.selectedCategory)
    });
    $('#sortExpert').on('change', function () {
      // this.selectedCategory = $(this).val();
      console.log('hey sort')

   
      window.angularComponentReference.zone.run(() => {
         let val = $(this).val();
        if(val!=null){
          window.angularComponentReference.doSort(val);
        };
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
 
  fetchTutorList() {
  
    this.httpService.getTutorList(this.selectedSubject).subscribe((req) => {
      this.searchResults=[];
      this.filteredArray=[];
      this.searchResults = req;
      this.isLoading=false;
      this.expertsCount=this.searchResults.length
    });
  }

  // searchResults = [ '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1' ];
  onSignUp() {
    this.router.navigate(['sign-up']);
  }
  getSubCategories(){
    if(this.selectedSubject!=null){
      this.httpService.getSubCategories(this.selectedSubject).subscribe((res)=>{
        this.subCategories=res;
      });
  }
    
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
  createExpertString(result:any){
    let filteredArray =  result.areaOfExpertise.filter(
      (x) => x.category == this.selectedSubject
    );
    let expertise:string='';
    for(let i=0;i<filteredArray.length;i++){
      if(filteredArray[i].category==this.selectedSubject){
        expertise+=filteredArray[i].subCategory;
        if(i!=filteredArray.length-1){
          expertise+=',';
        }
      }
      
    }
    return expertise;
  }
  viewProfile(profile: tutorProfileDetails) {
    this.profileService.setProfile(profile);
    this.router.navigate(['view-tutors'], {
      queryParams: { page: profile.bookingId,subject:this.selectedSubject },
    });
  }

  // openDialogProfile() {
  // 	this.matDialog.open(TutorProfileComponent, {
  // 		height: '90vh',
  // 		width: '70vw'
  // 	});
  // }
 
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
  calculateFilteredExpertsCount(){
    let filterCount= this.allFiltersApplied.subjects.length+this.allFiltersApplied.price.length+this.allFiltersApplied.ratings.length;
    if(filterCount!=0){
      this.expertsCount=this.filteredArray.length;
    }else if(filterCount==0){
      this.expertsCount=this.searchResults.length;
    }
    
  }
  searchBySubject(evt) {
    var subject = evt;
    console.log(subject);
    if(subject!=null){
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
        $('#subjectFilter').val('defaultSubject').trigger('change');
        this.expertsCount=this.filteredArray.length;
      });
    }
    
  }

  searchByPrice(evt) {
    console.log('called')
    var price = evt;
    if(price!=null){
      console.log('called')
     
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
        $('#priceFilter').val('defaultPrice').trigger('change');
       
        this.expertsCount=this.filteredArray.length;
      });
    }
    
  }

  searchByRatings(evt) {
  
    var ratings = evt;
    if(ratings!=null){
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
      this.expertsCount=this.filteredArray.length;
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
      } else if (evt.localeCompare('ratingLowToHigh') == 0){
        this.searchResults.sort((a,b) => a.rating - b.rating);
      } else if (evt.localeCompare('ratingHighToLow') == 0){
        this.searchResults.sort((a,b) => b.rating - a.rating);
      }
    } else {
      if (evt.localeCompare('priceLowToHigh') == 0) {
        this.filteredArray.sort((a, b) => Number(a.price1) - Number(b.price1));
      } else if (evt.localeCompare('priceHighToLow') == 0) {
        this.filteredArray.sort((a, b) => Number(b.price1) - Number(a.price1));
      } else if (evt.localeCompare('ratingLowToHigh') == 0){
        this.filteredArray.sort((a,b) => a.rating - b.rating);
      } else if (evt.localeCompare('ratingHighToLow') == 0){
        this.filteredArray.sort((a,b) => b.rating - a.rating);
      }
    }
  }
}
