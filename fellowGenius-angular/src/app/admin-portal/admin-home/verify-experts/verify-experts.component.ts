import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { timeStamp } from 'console';
import { Subject } from 'rxjs';
import { Category } from 'src/app/model/category';
import {
  expertise,
  tutorProfileDetails,
} from 'src/app/model/tutorProfileDetails';
import { HttpService } from 'src/app/service/http.service';

@Component({
  selector: 'app-verify-experts',
  templateUrl: './verify-experts.component.html',
  styleUrls: ['./verify-experts.component.css'],
})
export class VerifyExpertsComponent implements OnInit {
  constructor(
    private httpService: HttpService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.getAllCategories();
  }
  config: MatSnackBarConfig = {
    duration: 5000,
    horizontalPosition: 'center',
    verticalPosition: 'top',
    panelClass: ['snackbar'],
  };
  loadingText='';
  pendingExperts: tutorProfileDetails[] = [];
  isLoading = false;
  selectedValue;
  categoryInput;
  subCategoryInput;
  categories: Category[] = [];
  subCategories: Category[] = [];
  filteredSubCategories: Category[] = [];
  categoriesChanged = new Subject<Category[]>();
  selectedExpert;
  editedDomain = '';
  editedTopic = '';

  selectedAreaCategory;
  chosenAreaCategory;
  chosenAreaSubCategory;
  selectedAreaIndex;
  ngOnInit(): void {
    this.fetchPendingExperts();
  }
  ngAfterViewInit() {
    this.getAllCategories();
  }
  isSubCategoryValid(area: Category) {
    if (area.category == this.selectedAreaCategory) {
      return true;
    } else {
      return false;
    }
  }
  domainChange(area: expertise) {
    let domain = area.category;
    this.filteredSubCategories = [];
    for (let i = 0; i < this.subCategories.length; i++) {
      if (this.subCategories[i].category == domain) {
        this.filteredSubCategories.push(this.subCategories[i]);
      }
    }
  }
  fetchPendingExperts() {
    this.categoriesChanged.subscribe((res) => {
      this.httpService.fetchPendingExperts().subscribe((res) => {
        this.pendingExperts = res;

        for (let i = 0; i < this.pendingExperts.length; i++) {
          let expertises: expertise[] = [];
          let expert: tutorProfileDetails = this.pendingExperts[i];
          expert.pendingAreaOfExpertise = [];
          for (
            let j = 0;
            j < this.pendingExperts[i].areaOfExpertise.length;
            j++
          ) {
            let area = new expertise();
            area = this.pendingExperts[i].areaOfExpertise[j];
            if (this.isOtherExpertise(area)) {
              area.corrExpertiseId = j;
              expert.pendingAreaOfExpertise.push(area);
            }
          }
        }
      });
    });
  }

  updateAndAddArea(area: expertise, expert, index) {
    console.log(area);
    console.log('expert areas before updation ==>', expert.areaOfExpertise);
    this.httpService.updateAndAddExpertiseArea(area).subscribe((res) => {
      if (res == true) {
        area.isLoading = false;
        console.log(expert);

        expert.areaOfExpertise[area.corrExpertiseId].category = area.category;
        expert.areaOfExpertise[area.corrExpertiseId].subCategory =
          area.subCategory;
        console.log(expert.upiId);
        expert.upiID = expert.upiId;
        this.httpService.updatePendingExpert(expert).subscribe(() => {
          expert.pendingAreaOfExpertise.splice(index, 1);
          console.log(
            'expert areas before updation ==>',
            expert.areaOfExpertise
          );
          this.snackBar.open(
            'Area Approved Successfully !',
            'close',
            this.config
          );
        });
      }
    });
  }

  approveDomain(area: expertise, expert, index) {
    console.log(area, expert);
    if (area.isChoosable == true) {
      console.log('area was chosen');
      console.log(this.chosenAreaCategory, this.chosenAreaSubCategory);
      expert.areaOfExpertise[area.corrExpertiseId].category =
        this.chosenAreaSubCategory.category;
      expert.areaOfExpertise[area.corrExpertiseId].subCategory =
        this.chosenAreaSubCategory.subCategory;
      expert.upiID = expert.upiId;
      this.httpService.updatePendingExpert(expert).subscribe(() => {
        expert.pendingAreaOfExpertise.splice(index, 1);
        console.log('expert areas before updation ==>', expert.areaOfExpertise);
        this.snackBar.open(
          'Area Approved Successfully !',
          'close',
          this.config
        );
      });
    } else if (area.isEditable == true) {
      console.log('area was edited !');
      this.updateAndAddArea(area, expert, index);
    } else if (!area.isChoosable && !area.isEditable) {
      console.log('area is default !');
      this.updateAndAddArea(area, expert, index);
    }
    area.isLoading = true;
  }
  editDomain(area: expertise) {
    area.isChoosable = false;
    area.isEditable = true;
  }
  mapToExisting(area: expertise, expert: tutorProfileDetails) {
    area.isEditable = false;
    this.selectedExpert = expert;
    this.selectedAreaCategory = area;
    area.isChoosable = true;
  }
  verifyExpert(el, index) {
    if (confirm('Are you sure you want to VERIFY the expert?')) {
      this.isLoading = true;
      this.loadingText="Verifying Expert ...";
      this.httpService.verifyExpert(el.id).subscribe((res) => {
        console.log('expert verified');
        this.snackBar.open(
          'Expert verified Successfully !',
          'close',
          this.config
        );
        this.pendingExperts.splice(index, 1);
        this.isLoading = false;
      });
    }
  }
  reject(el, index) {
    console.log(el, index);
    if (confirm('Are you sure you want to REJECT the expert ?')) {
      this.isLoading = true;
      this.loadingText="Rejecting Expert ...";
      this.httpService.rejectExpert(el.id).subscribe((res) => {
        console.log('expert rejected');
        this.snackBar.open(
          'Expert rejected Successfully !',
          'close',
          this.config
        );
        this.pendingExperts.splice(index, 1);
        this.isLoading = false;
      });
    }
  }
  viewProfile(el, index) {
    this.router.navigate(['../home/pending-expert-profile'], {
      queryParams: { page: el.id },
    });
  }
  getAllCategories() {
    this.httpService.getAllCategories().subscribe((res) => {
      let categories: Category[] = res;
      if (categories.length > 0) {
        for (var i = 0; i < categories.length; i++) {
          let categ = new Category();
          categ.category = categories[i].category;
          this.categories.push(categ);
          this.selectedValue = this.categories[0].category;
        }
      }
      this.httpService.getAllSubCategories().subscribe((res) => {
        this.subCategories = res;
        this.categoriesChanged.next(this.subCategories.slice());
      });
    });
  }
  isOtherExpertise(area) {
    let domainFlag: boolean = true;
    let topicFlag: boolean = true;

    for (let i = 0; i < this.categories.length; i++) {
      if (this.categories[i] == area.category) {
        domainFlag = false;
      }
    }
    for (let i = 0; i < this.subCategories.length; i++) {
      if (this.subCategories[i].subCategory == area.subCategory) {
        topicFlag = false;
      }
    }
    if (domainFlag && topicFlag) {
      return true;
    } else {
      return false;
    }
  }
}
