import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../service/http.service';
import { tutorProfileDetails } from '../model/tutorProfileDetails';
import { element } from 'protractor';
import { LoginDetailsService } from '../service/login-details.service';
import { ProfileService } from '../service/profile.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css'],
})
export class SearchResultsComponent implements OnInit {
  showProfile;
  searchResults: tutorProfileDetails[] = [];
  filteredArray: tutorProfileDetails[] = [];
  // arrayToShow: tutorProfileDetails[];
  allFiltersApplied = [];
  subjectFiltersApplied = [];
  priceFiltersApplied = [];
  ratingFilterApplied = [];
  deletionElementFinder = [];
  elementsToBeDeleted = [];

  callSearchBySubject: boolean;
  callSearchByPrice: boolean;
  findFromSearchResult: boolean;
  findFromFilterSearch: boolean;
  constructor(
    private router: Router,
    private httpService: HttpService,
    private loginService: LoginDetailsService,
    private profileService: ProfileService,
    private matDialog: MatDialog,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
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

    // this.filteredArray = this.searchResults;
  }

  // searchResults = [ '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1' ];
  onSignUp() {
    this.router.navigate(['signUp']);
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

  searchByPrice($event) {
    this.callSearchBySubject = true;

    if (this.searchBySubject($event) && !this.callSearchByPrice) {
      //input is 400-599
      this.callSearchBySubject = false;
      if (this.findFromSearchResult) {
        this.findFromSearchResult = false;
        this.filteredArray = [];
        if (this.priceFiltersApplied.length == 0) {
          this.priceFiltersApplied.push($event.target.value);
          this.allFiltersApplied.push($event.target.value);
          var price = $event.target.value.split('-');
          var lowerValue = price[0];
          var higherValue = price[1];
          this.searchResults.filter((res) => {
            if (
              Number(res.price1) >= Number(lowerValue) &&
              Number(res.price1) <= Number(higherValue)
            ) {
              // this.filteredArray.push(res);
              // if (!this.checkDuplicacyOfObjectInArray(this.filteredArray, this.searchResults[this.searchResults.indexOf(res)])) {
              // this.filteredArray.push(this.searchResults[this.searchResults.indexOf(res)]);
              this.filteredArray.push(res);
              // }
            }
          });
        } else if (this.priceFiltersApplied.length == 1) {
          if (
            this.checkFiltersApplied(
              this.priceFiltersApplied,
              $event.target.value
            )
          ) {
            this.priceFiltersApplied.splice(
              this.priceFiltersApplied.indexOf($event.target.value),
              1
            );
            this.allFiltersApplied.splice(
              this.priceFiltersApplied.indexOf($event.target.value),
              1
            );
            this.filteredArray = this.searchResults;
          } else {
            this.priceFiltersApplied.push($event.target.value);
            this.allFiltersApplied.push($event.target.value);
            for (var i = 0; i < this.priceFiltersApplied.length; i++) {
              var price = this.priceFiltersApplied[i].split('-');
              var lowerValue = price[0];
              var higherValue = price[1];
              this.searchResults.filter((res) => {
                if (
                  Number(res.price1) >= Number(lowerValue) &&
                  Number(res.price1) <= Number(higherValue)
                ) {
                  if (
                    !this.checkDuplicacyOfObjectInArray(
                      this.filteredArray,
                      this.searchResults[this.searchResults.indexOf(res)]
                    )
                  ) {
                    this.filteredArray.push(
                      this.searchResults[this.searchResults.indexOf(res)]
                    );
                  }
                }
              });
            }
          }
        } else {
          if (
            this.checkFiltersApplied(
              this.priceFiltersApplied,
              $event.target.value
            )
          ) {
            this.priceFiltersApplied.splice(
              this.priceFiltersApplied.indexOf($event.target.value),
              1
            );
            this.allFiltersApplied.splice(
              this.priceFiltersApplied.indexOf($event.target.value),
              1
            );

            this.filteredArray = [];
            for (var i = 0; i < this.priceFiltersApplied.length; i++) {
              var price = this.priceFiltersApplied[i].split('-');
              var lowerValue = price[0];
              var higherValue = price[1];
              this.searchResults.filter((res) => {
                if (
                  Number(res.price1) >= Number(lowerValue) &&
                  Number(res.price1) <= Number(higherValue)
                ) {
                  // if (!this.checkDuplicacyOfObjectInArray(this.filteredArray, this.searchResults[this.searchResults.indexOf(res)])) {
                  this.filteredArray.push(res);
                  // }
                }
              });
            }
          } else {
            this.priceFiltersApplied.push($event.target.value);
            this.allFiltersApplied.push($event.target.value);
            for (var i = 0; i < this.priceFiltersApplied.length; i++) {
              var price = this.priceFiltersApplied[i].split('-');
              var lowerValue = price[0];
              var higherValue = price[1];
              this.searchResults.filter((res) => {
                if (
                  Number(res.price1) >= Number(lowerValue) &&
                  Number(res.price1) <= Number(higherValue)
                ) {
                  if (
                    !this.checkDuplicacyOfObjectInArray(
                      this.filteredArray,
                      this.searchResults[this.searchResults.indexOf(res)]
                    )
                  ) {
                    this.filteredArray.push(
                      this.searchResults[this.searchResults.indexOf(res)]
                    );
                  }
                }
              });
            }
          }
        }
      }
      if (this.findFromFilterSearch) {
        this.findFromFilterSearch = false;

        if (this.priceFiltersApplied.length == 1) {
          if (
            this.checkFiltersApplied(
              this.priceFiltersApplied,
              $event.target.value
            )
          ) {
            this.priceFiltersApplied.splice(
              this.priceFiltersApplied.indexOf($event.target.value),
              1
            );
            this.allFiltersApplied.splice(
              this.priceFiltersApplied.indexOf($event.target.value),
              1
            );
          } else {
            this.priceFiltersApplied.push($event.target.value);
            this.allFiltersApplied.push($event.target.value);
            for (var i = 0; i < this.priceFiltersApplied.length; i++) {
              var price = this.priceFiltersApplied[i].split('-');
              var lowerValue = price[0];
              var higherValue = price[1];
              this.filteredArray.filter((res) => {
                if (
                  Number(res.price1) >= Number(lowerValue) &&
                  Number(res.price1) <= Number(higherValue)
                ) {
                  this.deletionElementFinder.push(res);
                }
              });
            }
            this.filteredArray = this.deletionElementFinder;
            // this.elementsToBeDeleted =this.filteredArray.filter(x=>!this.deletionElementFinder.includes(x));
            // this.filteredArray = this.filteredArray.filter(x=>!this.elementsToBeDeleted.includes(x));
            this.elementsToBeDeleted = [];
            this.deletionElementFinder = [];
          }
        } else {
          if (
            this.checkFiltersApplied(
              this.priceFiltersApplied,
              $event.target.value
            )
          ) {
            this.priceFiltersApplied.splice(
              this.priceFiltersApplied.indexOf($event.target.value),
              1
            );
            this.allFiltersApplied.splice(
              this.priceFiltersApplied.indexOf($event.target.value),
              1
            );
            for (var i = 0; i < this.priceFiltersApplied.length; i++) {
              var price = this.priceFiltersApplied[i].split('-');
              var lowerValue = price[0];
              var higherValue = price[1];
              this.filteredArray.filter((res) => {
                if (
                  Number(res.price1) >= Number(lowerValue) &&
                  Number(res.price1) <= Number(higherValue)
                ) {
                  this.deletionElementFinder.push(res);
                }
              });
            }
            this.filteredArray = this.deletionElementFinder;
            // this.elementsToBeDeleted =this.filteredArray.filter(x=>!this.deletionElementFinder.includes(x));
            // this.filteredArray = this.filteredArray.filter(x=>!this.elementsToBeDeleted.includes(x));
            this.elementsToBeDeleted = [];
            this.deletionElementFinder = [];
          } else {
            this.priceFiltersApplied.push($event.target.value);
            this.allFiltersApplied.push($event.target.value);
            for (var i = 0; i < this.priceFiltersApplied.length; i++) {
              var price = this.priceFiltersApplied[i].split('-');
              var lowerValue = price[0];
              var higherValue = price[1];
              this.filteredArray.filter((res) => {
                if (
                  Number(res.price1) >= Number(lowerValue) &&
                  Number(res.price1) <= Number(higherValue)
                ) {
                  this.deletionElementFinder.push(res);
                }
              });
            }
            this.filteredArray = this.deletionElementFinder;
            // this.elementsToBeDeleted =this.filteredArray.filter(x=>!this.deletionElementFinder.includes(x));
            // this.filteredArray = this.filteredArray.filter(x=>!this.elementsToBeDeleted.includes(x));
            this.elementsToBeDeleted = [];
            this.deletionElementFinder = [];
          }
        }
      }
    }

    if (this.callSearchByPrice) {
      // input is subject not price
      this.callSearchByPrice = false;
      if (this.priceFiltersApplied.length == 1) {
        var price = this.priceFiltersApplied[0].split('-');
        var lowerValue = price[0];
        var higherValue = price[1];
        this.filteredArray.filter((res) => {
          if (
            Number(res.price1) < Number(lowerValue) ||
            Number(res.price1) > Number(higherValue)
          ) {
            this.filteredArray.splice(i, 1);
          }
        });
      } else {
        for (var i = 0; i < this.priceFiltersApplied.length; i++) {
          var price = this.priceFiltersApplied[i].split('-');
          var lowerValue = price[0];
          var higherValue = price[1];
          this.filteredArray.filter((res) => {
            if (
              Number(res.price1) >= Number(lowerValue) &&
              Number(res.price1) <= Number(higherValue)
            ) {
              this.deletionElementFinder.push(res);
            }
          });
        }
        this.filteredArray = this.deletionElementFinder;
        // this.elementsToBeDeleted =this.filteredArray.filter(x=>!this.deletionElementFinder.includes(x));
        // this.filteredArray = this.filteredArray.filter(x=>!this.elementsToBeDeleted.includes(x));
        this.elementsToBeDeleted = [];
        this.deletionElementFinder = [];
      }
    }
  }

  searchByRatings($event) {
    if (
      this.checkFiltersApplied(this.ratingFilterApplied, $event.target.value)
    ) {
      if (this.ratingFilterApplied.length == 1) {
        this.filteredArray = [];
        this.ratingFilterApplied.pop();
        this.allFiltersApplied.splice(
          this.allFiltersApplied.indexOf($event.target.value),
          1
        );
      } else {
        var status = false;
        for (var i = 0; i < this.ratingFilterApplied.length; i++) {
          if ($event.target.value > this.ratingFilterApplied[i]) {
            status = true;
          }
        }
        if (status) {
          this.ratingFilterApplied.splice(
            this.ratingFilterApplied.indexOf($event.target.value),
            1
          );
          this.allFiltersApplied.splice(
            this.allFiltersApplied.indexOf($event.target.value),
            1
          );
        } else {
          this.ratingFilterApplied.sort();
          var smallest = Math.min.apply(Math, this.ratingFilterApplied);
          var nextToSmallest = this.ratingFilterApplied[
            this.ratingFilterApplied.indexOf(smallest) + 2
          ];

          for (var i = this.filteredArray.length - 1; i >= 0; i--) {
            if (
              this.filteredArray[i].rating >= 20 * smallest &&
              this.filteredArray[i].rating < 20 * nextToSmallest
            ) {
              this.filteredArray.splice(i, 1);
            }
          }
          this.ratingFilterApplied.splice(
            this.ratingFilterApplied.indexOf($event.target.value),
            1
          );
          this.allFiltersApplied.splice(
            this.allFiltersApplied.indexOf($event.target.value),
            1
          );
        }
      }
    } else {
      this.ratingFilterApplied.push($event.target.value);
      this.allFiltersApplied.push($event.target.value);
      for (var i = 0; i < this.ratingFilterApplied.length; i++) {
        this.searchResults.filter((res) => {
          if (res.rating >= 20 * Number($event.target.value)) {
            if (
              !this.checkDuplicacyOfObjectInArray(
                this.filteredArray,
                this.searchResults[this.searchResults.indexOf(res)]
              )
            ) {
              this.filteredArray.push(
                this.searchResults[this.searchResults.indexOf(res)]
              );
            }
          }
        });
      }
    }
  }

  searchBySubject($event) {
    if (this.subjectFiltersApplied.length == 0 && this.callSearchBySubject) {
      //input is price
      this.filteredArray = [];
      this.callSearchBySubject = false;
      this.callSearchByPrice = false;
      this.findFromSearchResult = true;
      return true;
    }
    if (this.subjectFiltersApplied.length != 0 && this.callSearchBySubject) {
      this.filteredArray = [];
      this.callSearchBySubject = false;
      this.callSearchByPrice = false;
      // input is price
      this.findFromFilterSearch = true;
      for (var i = 0; i < this.subjectFiltersApplied.length; i++) {
        this.searchResults.filter((res) => {
          if (res.areaOfExpertise.includes(this.subjectFiltersApplied[i])) {
            if (
              !this.checkDuplicacyOfObjectInArray(
                this.filteredArray,
                this.searchResults[this.searchResults.indexOf(res)]
              )
            ) {
              this.filteredArray.push(
                this.searchResults[this.searchResults.indexOf(res)]
              );
            }
          }
        });
      }
      return true;
    }

    if (!this.callSearchBySubject) {
      // input is subject
      // this.allFiltersApplied = [];
      if (
        this.checkFiltersApplied(
          this.subjectFiltersApplied,
          $event.target.value
        )
      ) {
        if (this.subjectFiltersApplied.length == 1) {
          this.allFiltersApplied.splice(
            this.allFiltersApplied.indexOf($event.target.value),
            1
          );
          this.subjectFiltersApplied.pop();
          for (var i = this.filteredArray.length - 1; i >= 0; i--) {
            if (
              this.filteredArray[i].areaOfExpertise.includes(
                $event.target.value
              )
            ) {
              this.filteredArray.splice(i, 1);
            }
          }
        } else {
          for (var i = this.filteredArray.length - 1; i >= 0; i--) {
            if (
              this.filteredArray[i].areaOfExpertise.includes(
                $event.target.value
              )
            ) {
              if (
                this.removeOrNot(
                  this.filteredArray[i].areaOfExpertise,
                  this.subjectFiltersApplied,
                  $event.target.value
                )
              ) {
                this.filteredArray.splice(i, 1);
              }
            }
          }
          this.subjectFiltersApplied.splice(
            this.subjectFiltersApplied.indexOf($event.target.value),
            1
          );
          this.allFiltersApplied.splice(
            this.allFiltersApplied.indexOf($event.target.value),
            1
          );
        }
      } else {
        this.subjectFiltersApplied.push($event.target.value);
        this.allFiltersApplied.push($event.target.value);
        for (var i = 0; i < this.subjectFiltersApplied.length; i++) {
          this.searchResults.filter((res) => {
            if (res.areaOfExpertise.includes($event.target.value)) {
              if (
                !this.checkDuplicacyOfObjectInArray(
                  this.filteredArray,
                  this.searchResults[this.searchResults.indexOf(res)]
                )
              ) {
                this.filteredArray.push(
                  this.searchResults[this.searchResults.indexOf(res)]
                );
              }
            }
          });
        }
      }
      if (this.priceFiltersApplied.length != 0) {
        this.callSearchByPrice = true;
        this.searchByPrice($event);
      }
    }
  }

  removeOrNot(areaOfExpertise, subjectFiltersApplied, eventTarget) {
    var flag = 0;
    for (var i = 0; i < areaOfExpertise.length; i++) {
      for (var j = 0; j < subjectFiltersApplied.length; j++) {
        if (subjectFiltersApplied[j].localeCompare(eventTarget) == 0) {
          continue;
        } else {
          if (areaOfExpertise[i].localeCompare(subjectFiltersApplied[j]) == 0) {
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
    if ($event.target.value.localeCompare('sortLowToHigh') == 0) {
      if (this.allFiltersApplied.length == 0) {
        this.searchResults.sort((a, b) => Number(a.price1) - Number(b.price1));
      } else {
        this.filteredArray.sort((a, b) => Number(a.price1) - Number(b.price1));
      }
    } else if ($event.target.value.localeCompare('sortHighToLow') == 0) {
      if (this.allFiltersApplied.length == 0) {
        this.searchResults.sort((a, b) => Number(b.price1) - Number(a.price1));
      } else {
        this.filteredArray.sort((a, b) => Number(b.price1) - Number(a.price1));
      }
    }
  }
}
