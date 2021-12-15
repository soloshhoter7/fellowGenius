import { Component, NgZone, OnInit } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ElementRef, ViewChild } from '@angular/core';
import {
  FormControl,
  NgForm,
  FormGroup,
  FormBuilder,
  Validators,
  FormGroupDirective,
} from '@angular/forms';
import {
  MatAutocompleteSelectedEvent,
  MatAutocomplete,
} from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { TutorService } from 'src/app/service/tutor.service';
import { tutorProfile } from 'src/app/model/tutorProfile';
import { HttpService } from 'src/app/service/http.service';
import {
  expertise,
  tutorProfileDetails,
} from 'src/app/model/tutorProfileDetails';
import { AngularFireStorage } from '@angular/fire/storage';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { finalize } from 'rxjs/operators';
import { TutorVerification } from 'src/app/model/tutorVerification';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { UploadProfilePictureComponent } from 'src/app/facade/sign-up/upload-profile-picture/upload-profile-picture.component';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Category } from 'src/app/model/category';
import { ThrowStmt } from '@angular/compiler';
import { AppInfo } from 'src/app/model/AppInfo';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
// import * as moment from 'moment';
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment, Moment } from 'moment';
// const moment = _rollupMoment || _moment;
const moment = _rollupMoment || _moment;
// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
declare let $: any;
declare const window: any;
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  addExpertise = new expertise();
  profileError: string;
  pricePerHourError: boolean = false;
  invalidOrganisationDetails: boolean;
  inputDesignation: string;
  inputInstitute: any;
  invalidEducationDetails: boolean;
  invalidCompletionDate: boolean;
  emptyEducationDetails: boolean;
  minDate;
  maxDate;
  constructor(
    public cookieService: CookieService,
    public tutorService: TutorService,
    public httpService: HttpService,
    public firebaseStorage: AngularFireStorage,
    public snackBar: MatSnackBar,
    public matDialog: MatDialog,
    private router: Router,
    private ngZone: NgZone
  ) {
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 50, 0, 1);
    this.maxDate = new Date(currentYear + 2, 11, 31);
    this.fillOptions();
  }

  basic = true;
  myControl = new FormControl();
  errorText: string;
  isLoading3: boolean = false;
  profilePicUploadStatus: boolean;
  duplicateExpertiseArea;
  duplicatePreviousOrganisation;
  duplicateEducationArea;
  mobNumberPattern = '^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]{8,10}$';
  passwordPattern =
    '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,12}$';
  @ViewChild('basicProfile') basicProfile: FormGroupDirective;
  config: MatSnackBarConfig = {
    duration: 2000,
    horizontalPosition: 'center',
    verticalPosition: 'top',
  };
  options: string[] = [];
  //data fields
  selectedExpertise;
  expertises: expertise[] = [];
  educationQualifications: string[] = [];
  previousOraganisations: string[] = [];
  filteredOptions: Observable<string[]>;
  inputOrganisation;
  inputEducation;
  inputCompletionDate = new FormControl(moment());
  tutorProfile = new tutorProfile();
  tutorProfileDetails = new tutorProfileDetails();
  userId;
  profilePictureUrl = '../../../assets/images/default-user-image.png';
  uploadedProfilePicture: File = null;
  priceForExpertise;
  selectedValue;
  categories: Category[] = [];
  subCategories: Category[] = [];
  filteredSubCategories: Category[] = [];
  appInfo: AppInfo[] = [];
  selectedCategory;
  selectedSubCategory;

  selectedCategoryCount = 1;

  isSelectedSubCategory;
  GSTValue;
  commission;
  actualEarning;
  invalidPicture: boolean = false;
  pictureInfo: boolean = true;
  emptyProfilePicture;
  prevArrangedOrganisations: any = [];
  userDob: any;

  ngOnInit() {
    window['angularComponentReference'] = {
      component: this,
      zone: this.ngZone,
      loadAngularFunction: (evt: any) => this.filterSCfromCateg(evt),
    };
    this.getAllCategories();

    $('.select2').select2({});
    $('.select2').on('change', function () {
      this.selectedCategory = $(this).val();

      window.angularComponentReference.zone.run(() => {
        window.angularComponentReference.loadAngularFunction($(this).val());
      });
      // this.filteredSubCategories = [];
      // this.filteredSubCategories = this.subCategories.filter(x=>x.category==this.selectedCategory)
    });
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );
    if (this.tutorService.getTutorProfileDetails().profileCompleted) {
      this.tutorProfile = this.tutorService.getTutorDetials();
      this.userDob=this.userDob=this.formatDateFromString(this.tutorProfile.dateOfBirth);
      console.log(this.userDob);
      console.log(this.tutorProfileDetails)
      this.tutorProfileDetails = this.tutorService.getTutorProfileDetails();
      if (this.tutorProfileDetails.educationalQualifications != null) {
        this.educationQualifications =
          this.tutorProfileDetails.educationalQualifications;
      }
      if (this.tutorProfileDetails.areaOfExpertise != null) {
        this.expertises = this.tutorProfileDetails.areaOfExpertise;
      }
      if (this.tutorProfileDetails.previousOrganisations != null) {
        this.previousOraganisations =
          this.tutorProfileDetails.previousOrganisations;
      }
      if (this.tutorProfileDetails.profilePictureUrl != null) {
        this.profilePictureUrl = this.tutorProfileDetails.profilePictureUrl;
      }

      console.log(this.tutorProfileDetails);
      this.getEarningAppInfo();
    } else {
      setTimeout(() => {
        this.tutorProfile = this.tutorService.getTutorDetials();
        this.userDob=this.formatDateFromString(this.tutorProfile.dateOfBirth);
        console.log(this.userDob);
        console.log(this.tutorProfile);
        this.tutorProfileDetails = this.tutorService.getTutorProfileDetails();
        if (this.tutorProfileDetails.educationalQualifications != null) {
          this.educationQualifications =
            this.tutorProfileDetails.educationalQualifications;
        }
        if (this.tutorProfileDetails.areaOfExpertise != null) {
          this.expertises = this.tutorProfileDetails.areaOfExpertise;
        }
        if (this.tutorProfileDetails.previousOrganisations != null) {
          this.previousOraganisations =
            this.tutorProfileDetails.previousOrganisations;
        }
        if (this.tutorProfileDetails.profilePictureUrl != null) {
          this.profilePictureUrl = this.tutorProfileDetails.profilePictureUrl;
        }
        console.log(this.tutorProfileDetails);
        this.getEarningAppInfo();
      }, 1000);
    }
  }



  formatDateFromString(dateString){
    //  Convert a "dd/MM/yyyy" string into a Date object
    let d = dateString.split("/");
    let dat = new Date(d[2] + '/' + d[1] + '/' + d[0]);
    return dat;    
  }

  public _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }
  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.inputCompletionDate.value;
    ctrlValue.year(normalizedYear.year());
    this.inputCompletionDate.setValue(ctrlValue);
  }

  chosenMonthHandler(
    normalizedMonth: Moment,
    datepicker: MatDatepicker<Moment>
  ) {
    const ctrlValue = this.inputCompletionDate.value;
    ctrlValue.month(normalizedMonth.month());
    this.inputCompletionDate.setValue(ctrlValue);
    datepicker.close();
  }
  getEarningAppInfo() {
    this.httpService.getEarningAppInfo().subscribe((res) => {
      this.appInfo = res;
      console.log(this.appInfo);
      if (
        this.tutorProfileDetails.price1 != null &&
        this.appInfo[0] != null &&
        this.appInfo[1] != null
      ) {
        console.log('here');
        this.onPercentChange(parseInt(this.tutorProfileDetails.price1));
      }
    });
  }
  onDomainChange(value) {
    console.log('selected');
    console.log(value);
  }
  onTopicChange(value) {
    console.log('selected');
    console.log(value);
  }
  onPercentChange(percent: number) {
    if (this.appInfo[0] != null && this.appInfo[1] != null) {
      let gstMultiplier = 1 + parseFloat(this.appInfo[1].value) / 100;
      let commissionMultiplier = 1 + parseFloat(this.appInfo[0].value) / 100;
      // console.log(gstMultiplier,this.appInfo[0].value)
      this.GSTValue = Math.abs(this.round(percent / gstMultiplier - percent));
      this.commission = Math.abs(
        this.round(
          percent / gstMultiplier / commissionMultiplier -
            percent / gstMultiplier
        )
      );
      this.actualEarning = Math.abs(
        this.round(percent - this.GSTValue - this.commission)
      );
      // this.GSTValue=this.round((percent*(gstMultiplier))-percent);
      // this.commission=Math.abs(this.round(percent/commissionMultiplier-percent));
    }
  }
  round(num) {
    var m = Number((Math.abs(num) * 100).toPrecision(15));
    return (Math.round(m) / 100) * Math.sign(num);
  }
  fillOptions() {
    this.httpService.getAllSubCategories().subscribe((res) => {
      this.subCategories = res;
      if (this.subCategories.length > 0) {
        for (var i = 0; i < this.subCategories.length; i++) {
          this.options.push(this.subCategories[i].subCategory);
        }
      }
    });
  }
  checkDomainInList(val) {
    for (let categ of this.categories) {
      if (categ.category == val) {
        return true;
      }
    }
    return false;
  }
  filterSCfromCateg(val) {
    if (!this.selectedCategory || this.checkDomainInList(val)) {
      this.selectedCategory = val;

      this.filteredSubCategories = [];
      this.filteredSubCategories = this.subCategories.filter(
        (x) => x.category == this.selectedCategory
      );

      this.selectedSubCategory = this.filteredSubCategories[0].subCategory;
      if (this.selectedCategoryCount > 1) {
        this.isSelectedSubCategory = true;
      } else {
        this.isSelectedSubCategory = false;
      }
      this.selectedCategoryCount++;
    } else {
      this.selectedSubCategory = val;
      this.isSelectedSubCategory = true;
    }
  }
  getAllCategories() {
    this.httpService.getAllCategories().subscribe((res) => {
      let categories: Category[] = res;
      if (categories.length > 0) {
        for (var i = 0; i < categories.length; i++) {
          let categ = new Category();
          categ.category = categories[i].category;
          this.categories.push(categ);
          // this.selectedValue=this.categories[0].category;
        }
      }
      this.httpService.getAllSubCategories().subscribe((res) => {
        this.subCategories = res;
      });
    });
  }

  calculateProfileCompleted() {
    let completeFields: number = 0;
    let totalFields: number = 13;
    if (this.tutorProfile.fullName != null) completeFields += 1;
    if (this.tutorProfile.dateOfBirth != null) completeFields += 1;
    if (this.tutorProfile.contact != null) completeFields += 1;
    if (this.tutorProfileDetails.currentOrganisation != null)
      completeFields += 1;
    if (this.expertises.length > 0) completeFields += 1;
    if (this.tutorProfileDetails.previousOrganisations.length > 0)
      completeFields += 1;
    if (this.tutorProfileDetails.institute != null) completeFields += 1;
    if (this.tutorProfileDetails.educationalQualifications.length > 0)
      completeFields += 1;
    if (this.tutorProfileDetails.professionalSkills != null)
      completeFields += 1;
    if (this.tutorProfileDetails.yearsOfExperience != null) completeFields += 1;
    if (this.tutorProfileDetails.description != null) completeFields += 1;
    if (this.tutorProfileDetails.speciality != null) completeFields += 1;
    if (this.tutorProfileDetails.linkedInProfile != null) completeFields += 1;
    return this.round(completeFields / totalFields) * 100;
  }
  getInstitute() {
    return this.educationQualifications[0].split(':')[0];
  }
  formatDobFromMoment(momentDate: any){
     console.log(momentDate);
     let formattedDate = moment(momentDate._d).format('DD/MM/YYYY');
     return formattedDate;
   }
  saveExpertBasicProfile(form: any) {
    console.log(form);
    console.log(form.value.userDob);
    this.userId = this.cookieService.get('userId');
    if (this.userId && this.expertises.length > 0) {
      this.tutorProfile.tid = this.userId;
      this.tutorProfile.contact = form.value.contact;
      this.tutorProfile.dateOfBirth =this.formatDobFromMoment(form.value.userDob) ;
      console.log(this.tutorProfile.dateOfBirth);
      this.tutorProfile.fullName = form.value.fullName;
      this.tutorProfile.bookingId =
        this.tutorService.getTutorDetials().bookingId;
      this.tutorProfile.profilePictureUrl = this.profilePictureUrl;

      console.log(this.tutorProfile);

      this.tutorProfileDetails.tid = this.userId;
      this.tutorProfileDetails.educationalQualifications =
        this.educationQualifications;
      this.tutorProfileDetails.professionalSkills =
        form.value.professionalSkills;
      this.tutorProfileDetails.fullName = this.tutorProfile.fullName;
      this.tutorProfileDetails.profilePictureUrl = this.profilePictureUrl;
      this.tutorProfileDetails.bookingId = this.tutorProfile.bookingId;

      this.tutorProfileDetails.areaOfExpertise = this.expertises;
      this.tutorProfileDetails.linkedInProfile = form.value.linkedInProfile;
      this.tutorProfileDetails.yearsOfExperience = form.value.yearsOfExperience;
      this.tutorProfileDetails.currentOrganisation =
        form.value.currentOrganisation;
      this.tutorProfileDetails.previousOrganisations =
        this.previousOraganisations;
      this.tutorProfileDetails.description = form.value.description;
      this.tutorProfileDetails.speciality = form.value.speciality;
      this.tutorProfileDetails.bookingId =
        this.tutorService.getTutorProfileDetails().bookingId;
      this.tutorProfileDetails.institute = this.getInstitute();
      this.tutorProfileDetails.currentDesignation =
        form.value.currentDesignation;
      this.tutorProfileDetails.upiID = form.value.upiID;
      this.tutorProfileDetails.gst = form.value.gst;
      console.log(this.tutorProfileDetails);

      this.calculateProfileCompleted();
      this.httpService
        .updateTutorProfile(this.tutorProfile)
        .subscribe((res) => {
          this.tutorService.setTutorDetails(this.tutorProfile);
          this.tutorProfileDetails.profileCompleted =
            this.calculateProfileCompleted();
          this.httpService
            .updateTutorProfileDetails(this.tutorProfileDetails)
            .subscribe(() => {
              // if (this.tutorProfileDetails.profileCompleted < 40) {
              // this.tutorProfileDetails.profileCompleted = this.calculateProfileCompleted();
              // }
              this.tutorService.setTutorProfileDetails(
                this.tutorProfileDetails
              );
              this.snackBar.open(
                'Information saved Successfully !',
                'close',
                this.config
              );
              // this.advancedProfileToggle();
              // this.router.navigate(['/home/tutor-dashboard']);
            });
        });
    } else {
      this.errorText = 'Enter atleast one area of Expertise !';
    }
  }

  saveExpertAdvancedProfile(form: any) {
    if (this.tutorProfileDetails.profileCompleted >= 50) {
      this.userId = this.cookieService.get('userId');
      if (this.userId && this.expertises.length > 0) {
        this.tutorProfileDetails.institute = form.value.Institute;
        this.tutorProfileDetails.areaOfExpertise = this.expertises;
        this.tutorProfileDetails.linkedInProfile = form.value.linkedInProfile;
        this.tutorProfileDetails.yearsOfExperience =
          form.value.yearsOfExperience;
        this.tutorProfileDetails.currentOrganisation =
          form.value.currentOrganisation;
        this.tutorProfileDetails.previousOrganisations =
          this.previousOraganisations;
        this.tutorProfileDetails.description = form.value.description;
        this.tutorProfileDetails.speciality = form.value.speciality;
        this.tutorProfileDetails.bookingId =
          this.tutorService.getTutorProfileDetails().bookingId;
        if (this.tutorProfileDetails.profileCompleted == 50) {
          this.tutorProfileDetails.profileCompleted = 100;
        }
        this.httpService
          .updateTutorProfileDetails(this.tutorProfileDetails)
          .subscribe((res) => {
            this.tutorService.setTutorProfileDetails(this.tutorProfileDetails);
            this.snackBar.open(
              'Information saved Successfully !',
              'close',
              this.config
            );
            this.router.navigate(['/home/tutor-dashboard']);
          });
      } else {
        this.errorText = 'Enter atleast one area of Expertise !';
      }
    } else {
    }
  }

  cancelForm() {
    location.reload();
  }
  duplicacyCheck(fields: any, item: string) {
    const arr = item.split(':');

    for (let i = 0; i < fields.length; i++) {
      const brr = fields[i].split(':');
      if (arr[0] == brr[0]) {
        return true;
      }
    }
    return false;
  }
  organisationDuplicacyCheck(fields: any, item: string) {
    const arr = item.split('&');

    for (let i = 0; i < fields.length; i++) {
      const brr = fields[i].split('&');
      if (arr[0] == brr[0]) {
        console.log(arr[0], brr[0]);
        console.log('Matched !!');
        return true;
      }
    }
    return false;
  }
  expertiseDuplicacyCheck(category, subcategory) {
    for (let expertise of this.expertises) {
      if (
        expertise.category == category &&
        expertise.subCategory == subcategory
      ) {
        return true;
      }
    }
    return false;
  }
  profilePictureChange(event) {
    // this.profilePictureDisabled = true;
    this.uploadedProfilePicture = <File>event.target.files[0];
    this.isLoading3 = true;

    // this.profilePictureDisabled = true;
    this.uploadedProfilePicture = <File>event.target.files[0];
    const fileSize = Math.round(this.uploadedProfilePicture.size / 1024);
    const fileType = this.uploadedProfilePicture.type;

    if (fileSize > 3072 || !fileType.includes('image')) {
      this.invalidPicture = true;
      this.isLoading3 = false;
    } else {
      this.invalidPicture = false;
      const reader = new FileReader();
      var imageSrc;
      // var Image: File = evt.target.files[0];

      if (event.target.files && event.target.files.length) {
        this.uploadedProfilePicture = event.target.files[0];
        reader.readAsDataURL(this.uploadedProfilePicture);
        reader.onload = () => {
          imageSrc = reader.result as string;
          this.openDialog(imageSrc);
        };
      }
    }

    // this.uploadProfilePicture();
  }
  openDialog(imageSrc) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.data = {
      image: this.uploadedProfilePicture,
      imageSrc: imageSrc,
    };
    // this.dialog.open(UploadProfilePictureComponent, dialogConfig);
    const dialogRef = this.matDialog.open(
      UploadProfilePictureComponent,
      dialogConfig
    );
    dialogRef.afterClosed().subscribe((data) => {
      if (data == null) {
        this.isLoading3 = false;
      } else {
        var blob: Blob = this.b64toBlob(data, this.uploadedProfilePicture.type);
        var image: File = new File([blob], this.uploadedProfilePicture.name, {
          type: this.uploadedProfilePicture.type,
          lastModified: Date.now(),
        });
        this.uploadedProfilePicture = image;
        this.uploadProfilePicture();
      }
    });
  }
  b64toBlob(dataURI, fileType) {
    var byteString = atob(dataURI.split(',')[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);

    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: fileType });
  }
  profilePictureChangeCompleted(event) {
    this.uploadedProfilePicture = <File>event.target.files[0];
    var filePath = `tutor_profile_picture/${
      this.uploadedProfilePicture
    }_${new Date().getTime()}`;
    const fileRef = this.firebaseStorage.ref(filePath);
    this.firebaseStorage
      .upload(filePath, this.uploadedProfilePicture)
      .snapshotChanges()
      .pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            var tutorProfileDetails: tutorProfileDetails =
              this.tutorService.getTutorProfileDetails();
            this.profilePictureUrl = url;
            tutorProfileDetails.profilePictureUrl = this.profilePictureUrl;
            this.httpService
              .editTutorProfileDetails(tutorProfileDetails)
              .subscribe((res) => {
                var tutProfile: tutorProfile =
                  this.tutorService.getTutorDetials();
                tutProfile.profilePictureUrl = this.profilePictureUrl;
                this.httpService
                  .editBasicProfile(tutProfile)
                  .subscribe((res) => {
                    this.tutorProfile.profilePictureUrl =
                      this.profilePictureUrl;
                    this.snackBar.open(
                      'Image Uploaded successfully',
                      'close',
                      this.config
                    );
                  });
              });
          });
        })
      )
      .subscribe();
  }
  //for uploading profile picture
  uploadProfilePicture() {
    var filePath = `tutor_profile_picture/${
      this.uploadedProfilePicture
    }_${new Date().getTime()}`;
    const fileRef = this.firebaseStorage.ref(filePath);
    this.firebaseStorage
      .upload(filePath, this.uploadedProfilePicture)
      .snapshotChanges()
      .pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            this.profilePicUploadStatus = true;
            this.isLoading3 = false;
            this.pictureInfo = false;
            this.profilePictureUrl = url;
            this.snackBar.open(
              'Image Uploaded successfully',
              'close',
              this.config
            );
          });
        })
      )
      .subscribe();
  }

  basicProfileToggle() {
    this.basic = true;
  }
  advancedProfileToggle() {
    if (this.tutorService.tutorProfileDetails.profileCompleted < 50) {
      this.profileError = 'Complete basic profile first !';
    } else {
      this.basic = false;
    }
  }
  findSubCategory(sc) {
    let category;
    if (sc) {
      for (let i = 0; i < this.subCategories.length; i++) {
        if (this.subCategories[i].subCategory == sc) {
          return this.subCategories[i].category;
        }
      }
    } else {
      return null;
    }
  }
  // saveExpertise() {
  //   this.addExpertise = new expertise();
  //   this.selectedSubCategory = this.selectedExpertise;
  //   this.selectedCategory = this.findSubCategory(this.selectedSubCategory);
  //   console.log(this.selectedCategory);
  //   if (!this.expertiseDuplicacyCheck(this.selectedCategory,this.selectedSubCategory)) {
  //     this.addExpertise.category = this.selectedCategory;
  //     this.addExpertise.subCategory = this.selectedSubCategory;
  //     this.addExpertise.price = this.priceForExpertise;
  //     this.expertises.push(this.addExpertise);
  //     this.selectedExpertise = '';
  //     this.priceForExpertise = '';

  //     if (this.duplicateExpertiseArea == true) {
  //       this.duplicateExpertiseArea = false;
  //     }
  //   } else {
  //     this.duplicateExpertiseArea = true;
  //     this.selectedExpertise = '';
  //     this.priceForExpertise = '';
  //   }
  // }

  // save expertise for multiple domains
  saveExpertise() {
    if (this.tutorProfileDetails.price1) {
      this.pricePerHourError = false;
    }
    this.addExpertise = new expertise();

    if (this.selectedSubCategory) {
      this.errorText = '';
      if (
        !this.expertiseDuplicacyCheck(
          this.selectedCategory,
          this.selectedSubCategory
        )
      ) {
        this.addExpertise.category = this.selectedCategory;
        this.addExpertise.subCategory = this.selectedSubCategory;

        if (this.tutorProfileDetails.price1 != null) {
          this.addExpertise.price = parseInt(this.tutorProfileDetails.price1);
          this.expertises.push(this.addExpertise);
          $('.select2').val('').trigger('change');
          this.expertises.reverse();
          this.selectedCategory = '';
          this.selectedSubCategory = '';
          this.priceForExpertise = '';
          if (this.duplicateExpertiseArea == true) {
            this.duplicateExpertiseArea = false;
          }
        } else {
          this.pricePerHourError = true;
        }
      } else {
        this.duplicateExpertiseArea = true;
        this.selectedExpertise = '';
        this.selectedSubCategory = '';
        this.priceForExpertise = '';
      }
    } else {
      this.errorText = 'Please add Topic !';
    }
  }

  deleteExpertise(index: any) {
    var area = this.expertises[index];
    if (confirm('Are you sure you want to delete ?')) {
      this.httpService
        .subtractArea(this.tutorProfile.tid, 'Expert', area.subCategory)
        .subscribe();
      this.expertises.splice(index, 1);
    }
  }

  addOrganisation() {
    if (this.inputOrganisation && this.inputDesignation) {
      if (this.invalidOrganisationDetails == true) {
        this.invalidOrganisationDetails = false;
      }
      if (
        !this.organisationDuplicacyCheck(
          this.previousOraganisations,
          this.inputOrganisation
        )
      ) {
        let org = {
          organisation: this.inputOrganisation,
          designation: this.inputDesignation,
        };
        this.previousOraganisations.push(
          this.inputDesignation + ' @ ' + this.inputOrganisation
        );
        this.prevArrangedOrganisations.push(org);
        this.inputOrganisation = '';
        this.inputDesignation = '';
        if (this.duplicatePreviousOrganisation == true) {
          this.duplicatePreviousOrganisation = false;
        }
      } else {
        this.inputOrganisation = '';
        this.inputDesignation = '';
        this.duplicatePreviousOrganisation = true;
      }
    } else {
      this.invalidOrganisationDetails = true;
    }
  }

  deleteOrganisation(index: any) {
    let organisation = this.prevArrangedOrganisations[index].organisation;
    let designation = this.prevArrangedOrganisations[index].designation;
    let orgDes: string = organisation + '&' + designation;
    this.prevArrangedOrganisations.splice(index, 1);
    this.previousOraganisations.splice(
      this.previousOraganisations.indexOf(orgDes, 0),
      1
    );
  }

  getMonthYearString(val) {
    let momentVariable = moment(val.value._d, 'YYYY-MM-DD');
    return momentVariable.format('MMMM YYYY');
  }
  addEducation() {
    if (
      this.inputEducation &&
      this.inputCompletionDate &&
      this.inputInstitute
    ) {
      let dateString = this.getMonthYearString(this.inputCompletionDate);
      if (this.invalidEducationDetails == true) {
        this.invalidEducationDetails = false;
      }
      if (this.invalidCompletionDate == true) {
        this.invalidCompletionDate = false;
      }
      if (this.emptyEducationDetails == true)
        this.emptyEducationDetails = false;
      if (
        !this.duplicacyCheck(
          this.educationQualifications,
          this.inputInstitute + ' : ' + this.inputEducation + ' : ' + dateString
        )
      ) {
        this.educationQualifications.push(
          this.inputInstitute + ' : ' + this.inputEducation + ' : ' + dateString
        );
        this.inputEducation = '';
        this.inputCompletionDate = new FormControl(moment());
        this.inputInstitute = '';
        if (this.duplicateEducationArea == true) {
          this.duplicateEducationArea = false;
        }
      } else {
        this.inputEducation = '';
        this.inputCompletionDate = new FormControl(moment());
        this.inputInstitute = '';
        this.duplicateEducationArea = true;
      }
    } else {
      console.log('called');
      this.invalidEducationDetails = true;
    }
  }
  deleteEducation(index: any) {
    this.educationQualifications.splice(index, 1);
  }
}
