import { Component, NgZone, OnInit } from '@angular/core';
import { StudentProfileModel } from 'src/app/model/studentProfile';
import { StudentService } from 'src/app/service/student.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NgForm } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { finalize } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';
import { HttpService } from '../../service/http.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { UploadProfilePictureComponent } from 'src/app/facade/sign-up/upload-profile-picture/upload-profile-picture.component';
import { Router } from '@angular/router';
import { ɵZoneScheduler } from '@angular/fire';
import { HomeComponent } from '../home.component';
import { Category } from 'src/app/model/category';
import moment from 'moment';

@Component({
  selector: 'app-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.css'],
})
export class StudentProfileComponent implements OnInit {
  constructor(
    private studentService: StudentService,
    private matDialog: MatDialog,
    private snackBar: MatSnackBar,
    private firebaseStorage: AngularFireStorage,
    private httpService: HttpService,
    private router: Router,
    private zone: NgZone,
    private home: HomeComponent
  ) {
    const currentYear = new Date().getFullYear();
    this.dobStartDate = new Date(currentYear - 60, 0, 1);
    this.dobEndDate = new Date(currentYear - 6, 11, 31);
  }
  dobStartDate: Date;
  dobEndDate: Date;
  isLoading3: boolean = false;
  profilePicUploadStatus: boolean;
  duplicateArea;
  config: MatSnackBarConfig = {
    duration: 2000,
    horizontalPosition: 'center',
    verticalPosition: 'top',
  };
  studentProfile: StudentProfileModel;
  myControl = new FormControl();
  options: string[] = [];
  filteredOptions: Observable<string[]>;
  // learningAreas = new Array(3);
  subCategories: Category[] = [];
  index: Number;
  learningArea;
  learningAreas: string[] = [];
  profilePictureUrl = '../../../assets/images/default-user-image.png';
  uploadedProfilePicture: File = null;
  mobNumberPattern = '^((\\+91-?)|0)?[0-9]{10}$';
  passwordPattern =
    '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,12}$';
  snackBarConfig: MatSnackBarConfig = {
    duration: 15000,
    horizontalPosition: 'center',
    verticalPosition: 'top',
    panelClass: ['snackbar'],
  };
  invalidPicture: boolean = false;
  pictureInfo: boolean = true;
  emptyProfilePicture;
  ngOnInit(): void {
    this.fillOptions();
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );
    this.index = 1;
    // this.openNav();
    // this.disableSub = true;
    this.studentProfile = this.studentService.getStudentProfileDetails();
    if (this.studentProfile.profilePictureUrl != null) {
      this.profilePictureUrl = this.studentProfile.profilePictureUrl;
    }
    if (this.studentProfile.learningAreas != null) {
      this.learningAreas = this.studentProfile.learningAreas;
    }
    this.handleRefresh();
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
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
  cancelForm() {
    location.reload();
  }
  addLearningArea() {
    if (!this.duplicacyCheck(this.learningAreas, this.learningArea)) {
      this.learningAreas.push(this.learningArea);
      this.learningArea = '';
      if (this.duplicateArea == true) {
        this.duplicateArea = false;
      }
    } else {
      this.duplicateArea = true;
      this.learningArea = '';
    }
  }

  subtractLearningArea(index: any) {
    var subject = this.learningAreas[index];
    if (confirm('Are you sure you want to delete this learning area?')) {
      this.httpService
        .subtractArea(this.studentProfile.sid, 'Learner', subject)
        .subscribe();
      this.learningAreas.splice(index, 1);
    }
  }

  // navAction(index) {
  //   if (index % 2 == 1) {
  //     this.index = index + 1;
  //     this.closeNav();
  //   } else {
  //     this.index = index + 1;
  //     this.openNav();
  //   }
  // }
  formatDobFromMoment(momentDate: any) {
    // console.log(momentDate);
    let formattedDate = moment(momentDate._d).format('DD/MM/YYYY');
    return formattedDate;
  }
  saveStudentProfile(form: NgForm) {
    this.studentProfile.contact = form.value.contact;
    console.log(this.formatDobFromMoment(form.value.dob));
    this.studentProfile.dateOfBirth = this.formatDobFromMoment(form.value.dob);
    this.studentProfile.fullName = form.value.fullName;
    this.studentProfile.linkedInProfile = form.value.linkedInProfile;
    this.studentProfile.learningAreas = this.learningAreas;
    this.studentProfile.profilePictureUrl = this.profilePictureUrl;
    this.studentProfile.yearsOfExperience = form.value.yearsOfExperience;
    this.studentProfile.highestQualification = form.value.highestQualification;
    this.studentProfile.currentOrganisation = form.value.currentOrganisation;
    this.studentProfile.currentDesignation = form.value.currentDesignation;
    this.studentProfile.upiID = form.value.upiID;
    if (this.learningAreasDuplicacyCheck(this.learningAreas)) {
      this.httpService
        .updateStudentProfile(this.studentProfile)
        .subscribe((res) => {
          this.studentService.setStudentProfileDetails(this.studentProfile);
          this.home.calculateStudentProfilePercentage();
          this.zone.run(() => {
            this.snackBar.open(
              'information saved successfully !',
              'close',
              this.config
            );
            // this.router.navigate(['/home/student-dashboard']);
          });
        });
    } else {
    }
  }

  learningAreasDuplicacyCheck(fields: string[]) {
    for (var i = 0; i < fields.length - 1; i++) {
      for (var j = i + 1; j < fields.length; j++) {
        if (fields[i] == fields[j]) {
          return false;
        }
      }
    }
    return true;
  }

  duplicacyCheck(fields: string[], item: string) {
    return fields.includes(item);
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
      var blob: Blob = this.b64toBlob(data, this.uploadedProfilePicture.type);
      var image: File = new File([blob], this.uploadedProfilePicture.name, {
        type: this.uploadedProfilePicture.type,
        lastModified: Date.now(),
      });
      this.uploadedProfilePicture = image;
      this.uploadProfilePicture();
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
  handleRefresh() {
    if (!this.studentProfile.sid) {
      setTimeout(() => {
        this.studentProfile = this.studentService.getStudentProfileDetails();
        if (this.studentProfile.profilePictureUrl != null) {
          this.profilePictureUrl = this.studentProfile.profilePictureUrl;
        }
        if (this.studentProfile.learningAreas != null) {
          this.learningAreas = this.studentProfile.learningAreas;
        }
      }, 1000);
    }
  }
}
