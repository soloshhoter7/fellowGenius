import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { YearService } from '@syncfusion/ej2-angular-schedule';
import { filtersApplied } from 'src/app/model/filtersApplied';
import { tutorProfileDetails } from 'src/app/model/tutorProfileDetails';

@Component({
  selector: 'app-filters-dialog',
  templateUrl: './filters-dialog.component.html',
  styleUrls: ['./filters-dialog.component.css'],
})
export class FiltersDialogComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<FiltersDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.allFiltersApplied = data.allFiltersApplied;
    this.subjectFiltersApplied = data.subjectFiltersApplied;
    this.priceFiltersApplied = data.priceFiltersApplied;
    this.ratingFilterApplied = data.ratingFiltersApplied;
  }

  ngOnInit(): void {

  }
  closeDialog() {
    this.dialogRef.close();
  }

  allFiltersApplied: filtersApplied = new filtersApplied();
  subjects: string[];
  // arrayToShow: tutorProfileDetails[];

  subjectFiltersApplied = [];
  priceFiltersApplied = [];
  ratingFilterApplied = [];
  deletionElementFinder = [];
  elementsToBeDeleted = [];

  applyFilters() {
    var data = {
      operation: 'apply',
      subjectFilters: this.subjectFiltersApplied,
      priceFiltersApplied: this.priceFiltersApplied,
      ratingFilterApplied: this.ratingFilterApplied,
      allFiltersApplied: this.allFiltersApplied,
    };
    this.dialogRef.close(data);
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
}
