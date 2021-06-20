import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  addExpertise = new expertise();
  profileError: string;
  constructor(
    public cookieService: CookieService,
    public tutorService: TutorService,
    public httpService: HttpService,
    public firebaseStorage: AngularFireStorage,
    public snackBar: MatSnackBar,
    public matDialog: MatDialog,
    private router:Router
  ) {
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
  mobNumberPattern = '^((\\+91-?)|0)?[0-9]{10}$';
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
  tutorProfile = new tutorProfile();
  tutorProfileDetails = new tutorProfileDetails();
  userId;
  profilePictureUrl = '../../../assets/images/default-user-image.png';
  uploadedProfilePicture: File = null;
  priceForExpertise;
  selectedValue;
  categories:Category[] = [];
  subCategories:Category[] = [];
  selectedCategory;
  selectedSubCategory;
  ngOnInit() {
    this.getAllCategories();
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );
    if (this.tutorService.getTutorProfileDetails().profileCompleted) {
      this.tutorProfile = this.tutorService.getTutorDetials();
      this.tutorProfileDetails = this.tutorService.getTutorProfileDetails();
      if (this.tutorProfileDetails.educationalQualifications != null) {
        this.educationQualifications = this.tutorProfileDetails.educationalQualifications;
      }
      if (this.tutorProfileDetails.areaOfExpertise != null) {
        this.expertises = this.tutorProfileDetails.areaOfExpertise;
      }
      if (this.tutorProfileDetails.previousOrganisations != null) {
        this.previousOraganisations = this.tutorProfileDetails.previousOrganisations;
      }
      if (this.tutorProfileDetails.profilePictureUrl != null) {
        this.profilePictureUrl = this.tutorProfileDetails.profilePictureUrl;
      }
    } else {
      setTimeout(() => {
        this.tutorProfile = this.tutorService.getTutorDetials();
        this.tutorProfileDetails = this.tutorService.getTutorProfileDetails();
        if (this.tutorProfileDetails.educationalQualifications != null) {
          this.educationQualifications = this.tutorProfileDetails.educationalQualifications;
        }
        if (this.tutorProfileDetails.areaOfExpertise != null) {
          this.expertises = this.tutorProfileDetails.areaOfExpertise;
        }
        if (this.tutorProfileDetails.previousOrganisations != null) {
          this.previousOraganisations = this.tutorProfileDetails.previousOrganisations;
        }
        if (this.tutorProfileDetails.profilePictureUrl != null) {
          this.profilePictureUrl = this.tutorProfileDetails.profilePictureUrl;
        }
      }, 1000);
    }
  }

  public _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }
  
  fillOptions(){
this.httpService.getAllSubCategories().subscribe((res)=>{
        this.subCategories = res;
        if(this.subCategories.length>0){
          for(var i=0;i<this.subCategories.length;i++){
            this.options.push(this.subCategories[i].subCategory);
          }
        }
      })
  }
  filterSCfromCateg(){
    return this.subCategories.filter(x=>x.category==this.selectedCategory)
  }
  getAllCategories(){
    this.httpService.getAllCategories().subscribe((res)=>{
      let categories:Category[] = res;
      if(categories.length>0){
        for(var i=0;i<categories.length;i++){
          let categ=new Category();
          categ.category=categories[i].category
          this.categories.push(categ);
          // this.selectedValue=this.categories[0].category;
        }
      }
      this.httpService.getAllSubCategories().subscribe((res)=>{
        this.subCategories = res;
      })
     console.log(this.categories);
    });
  }
  
  saveExpertBasicProfile(form: any) {
    this.userId = this.cookieService.get('userId');
    if (this.userId) {
      this.tutorProfile.tid = this.userId;
      this.tutorProfile.contact = form.value.contact;
      this.tutorProfile.dateOfBirth = form.value.dob;
      this.tutorProfile.fullName = form.value.fullName;
      this.tutorProfile.bookingId = this.tutorService.getTutorDetials().bookingId;
      this.tutorProfile.profilePictureUrl = this.profilePictureUrl;
      this.tutorProfileDetails.tid = this.userId;
      this.tutorProfileDetails.educationalQualifications = this.educationQualifications;
      this.tutorProfileDetails.professionalSkills =
        form.value.professionalSkills;
      this.tutorProfileDetails.fullName = this.tutorProfile.fullName;
      this.tutorProfileDetails.profilePictureUrl = this.profilePictureUrl;
      this.tutorProfileDetails.bookingId = this.tutorProfile.bookingId
      this.httpService
        .updateTutorProfile(this.tutorProfile)
        .subscribe((res) => {
          this.tutorService.setTutorDetails(this.tutorProfile);
          this.httpService
            .updateTutorProfileDetails(this.tutorProfileDetails)
            .subscribe(() => {
              if (this.tutorProfileDetails.profileCompleted < 50) {
                this.tutorProfileDetails.profileCompleted = 50;
              }
              this.tutorService.setTutorProfileDetails(
                this.tutorProfileDetails
              );
              this.snackBar.open(
                'Information saved Successfully !',
                'close',
                this.config
              );
              this.advancedProfileToggle();
            });
        });
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
        this.tutorProfileDetails.previousOrganisations = this.previousOraganisations;
        this.tutorProfileDetails.description = form.value.description;
        this.tutorProfileDetails.speciality = form.value.speciality;
        this.tutorProfileDetails.bookingId = this.tutorService.getTutorProfileDetails().bookingId;
        if (this.tutorProfileDetails.profileCompleted == 50) {
          this.tutorProfileDetails.profileCompleted = 100;
        }
        console.log('informations saved',this.tutorProfileDetails);
        this.httpService
          .updateTutorProfileDetails(this.tutorProfileDetails)
          .subscribe((res) => {
            this.tutorService.setTutorProfileDetails(this.tutorProfileDetails);
            this.snackBar.open(
              'Information saved Successfully !',
              'close',
              this.config
            );
            this.router.navigate(['/home/tutorDashboard']);
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
  duplicacyCheck(fields: Object[], item: string) {
    return fields.includes(item);
  }
  expertiseDuplicacyCheck(category,subcategory) {
    for (let expertise of this.expertises) {
      if (expertise.category == category && expertise.subCategory == subcategory) {
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
      if(data==null){
        this.isLoading3=false;
      }else{
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
            var tutorProfileDetails: tutorProfileDetails = this.tutorService.getTutorProfileDetails();
            this.profilePictureUrl = url;
            tutorProfileDetails.profilePictureUrl = this.profilePictureUrl;
            this.httpService
              .editTutorProfileDetails(tutorProfileDetails)
              .subscribe((res) => {
                var tutProfile: tutorProfile = this.tutorService.getTutorDetials();
                tutProfile.profilePictureUrl = this.profilePictureUrl;
                this.httpService
                  .editBasicProfile(tutProfile)
                  .subscribe((res) => {
                    this.tutorProfile.profilePictureUrl = this.profilePictureUrl;
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
  findSubCategory(sc){
    let category;
   if(sc){
     console.log("selected subcategory",this.selectedSubCategory);
     for(let i =0;i<this.subCategories.length;i++){
      if(this.subCategories[i].subCategory == sc){
        return this.subCategories[i].category;
      }
     }
   }else{
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
    this.addExpertise = new expertise();
    if (!this.expertiseDuplicacyCheck(this.selectedCategory,this.selectedSubCategory)) {
      this.addExpertise.category = this.selectedCategory;
      this.addExpertise.subCategory = this.selectedSubCategory;
      this.addExpertise.price = this.priceForExpertise;
      this.expertises.push(this.addExpertise);
      this.selectedCategory = '';
      this.selectedSubCategory = '';
      this.priceForExpertise = '';

      if (this.duplicateExpertiseArea == true) {
        this.duplicateExpertiseArea = false;
      }
    } else {
      this.duplicateExpertiseArea = true;
      this.selectedExpertise = '';
      this.selectedSubCategory = '';
      this.priceForExpertise = '';
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
    if (
      !this.duplicacyCheck(this.previousOraganisations, this.inputOrganisation)
    ) {
      this.previousOraganisations.push(this.inputOrganisation);
      this.inputOrganisation = '';
      if (this.duplicatePreviousOrganisation == true) {
        this.duplicatePreviousOrganisation = false;
      }
    } else {
      this.inputOrganisation = '';
      this.duplicatePreviousOrganisation = true;
    }
  }

  deleteOrganisation(index: any) {
    this.previousOraganisations.splice(index, 1);
  }

  addEducation() {
    if (
      !this.duplicacyCheck(this.educationQualifications, this.inputEducation)
    ) {
      this.educationQualifications.push(this.inputEducation);
      this.inputEducation = '';
      if (this.duplicateEducationArea == true) {
        this.duplicateEducationArea = false;
      }
    } else {
      this.inputEducation = '';
      this.duplicateEducationArea = true;
    }
  }
  deleteEducation(index: any) {
    this.educationQualifications.splice(index, 1);
  }
}
