import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { map, startWith } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AppInfo } from 'src/app/model/AppInfo';
import { Category } from 'src/app/model/category';
import { tutorProfile } from 'src/app/model/tutorProfile';
import * as bcrypt from 'bcryptjs';
import {
  expertise,
  tutorProfileDetails,
} from 'src/app/model/tutorProfileDetails';
import { HttpService } from 'src/app/service/http.service';
import { TutorService } from 'src/app/service/tutor.service';
import { togglePassword, initiateSelect2 } from '../../../../assets/js/custom';
import { UploadProfilePictureComponent } from '../upload-profile-picture/upload-profile-picture.component';
import { NgZone } from '@angular/core';
import { loginModel } from 'src/app/model/login';
import { AuthService } from 'src/app/service/auth.service';
import { LoginDetailsService } from 'src/app/service/login-details.service';
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
declare let $: any;
declare const window: any;
@Component({
  selector: 'app-sign-up-expert',
  templateUrl: './sign-up-expert.component.html',
  styleUrls: ['./sign-up-expert.component.css'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
})
export class SignUpExpertComponent implements OnInit {
  dateOfBirth = new Date();
  choosePassword;
  newPassword;
  loginEmail;
  loginModel = new loginModel();
  invalidOrganisationDetails: boolean;
  emptyProfilePicture;
  emptyEducationDetails = false;
  registeredExpert = false;
  isLoading = false;
  verificationOtp: any;
  wrongOtp: boolean;
  showPassword: boolean = false;

  ngAfterViewInit() {
    togglePassword();
    initiateSelect2();
  }
  emailValid = false;
  addExpertise = new expertise();
  profileError: string;
  pricePerHourError: boolean = false;
  minDate;
  maxDate;
  minDobDate;
  maxDobDate;

  constructor(
    public cookieService: CookieService,
    public tutorService: TutorService,
    public httpService: HttpService,
    public firebaseStorage: AngularFireStorage,
    public snackBar: MatSnackBar,
    private matDialog: MatDialog,
    private router: Router,
    private ngZone: NgZone,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private loginDetailsService: LoginDetailsService
  ) {
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 50, 0, 1);
    this.maxDate = new Date(currentYear + 2, 11, 31);
    this.minDobDate = new Date(currentYear - 70, 0, 1);
    this.maxDobDate = new Date(currentYear - 6, 11, 31);
    this.fillOptions();
  }
  invalidCompletionDate = false;
  basic = true;
  myControl = new FormControl();
  errorText: string;
  isLoading3: boolean = false;
  profilePicUploadStatus: boolean;
  duplicateExpertiseArea: boolean = false;
  duplicatePreviousOrganisation;
  duplicateEducationArea;
  verifyEmail = false;
  // mobNumberPattern = '^((\\+91-?)|0)?[0-9]{14}$';
  mobNumberPattern = '^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-s./0-9]{8,10}$';
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
  prevArrangedOrganisations: any = [];
  filteredOptions: Observable<string[]>;
  inputOrganisation;
  inputDesignation;
  currentDesignation;
  inputEducation;
  // inputCompletionDate;
  inputInstitute;
  tutorProfile = new tutorProfile();
  tutorProfileDetails = new tutorProfileDetails();
  userId;
  profilePictureUrl = '../assets/images/dummy-profile.svg';
  uploadedProfilePicture: File = null;
  priceForExpertise;
  selectedValue;
  categories: Category[] = [];
  subCategories: Category[] = [];
  filteredSubCategories: Category[] = [];
  appInfo: AppInfo[] = [];
  selectedCategory;
  selectedCategoryCount = 1;
  selectedSubCategory;
  isSelectedSubCategory;
  GSTValue;
  commission;
  actualEarning;
  invalidPicture: boolean = false;
  pictureInfo: boolean = true;
  invalidEducationDetails = false;
  jwtToken;
  invalidChoosePassword;
  inputCompletionDate = new FormControl(moment());
  textTopic = '';
  textDomain = '';
  showTextDomain: boolean = false;
  showTextTopic: boolean = false;
  otherDomainSelected: boolean = false;
  otherTopicSelected: boolean = false;
  topicNotSelected: boolean = false;
  domainNotSelected: boolean = false;
  showEditPreviousOrganisations: boolean = false;

  //------------- otpJSON---------------------------
  otpJSON = {
    email: this.tutorProfileDetails.email,
    verificationOtp: '',
  };
  enableOtpPage: boolean = false;
  ngOnInit() {
    window.scroll(0, 0);
    this.activatedRoute.queryParams.subscribe((params) => {
      this.jwtToken = params['token'];
      console.log(this.authService.isTokenExpired(this.jwtToken));
      if (this.jwtToken) {
        this.choosePassword = true;
      } else {
        this.choosePassword = false;
      }
    });

    window['angularComponentReference'] = {
      component: this,
      zone: this.ngZone,
      loadAngularFunction: (evt: any) => this.filterSCfromCateg(evt),
      changeOtherDomain: () => this.selectOtherDomain(),
      changeOtherTopic: () => this.selectOtherTopic(),
      disableEditDomainView: () => this.disableEditDomainView(),
    };
    this.getAllCategories();
    // this.getEarningAppInfo();
    $('.select2').select2({
      placeholder: {
        id: '-1', // the value of the option
        text: 'Select an option',
      },
    });

    $('.select2').on('change', function () {
      let value = $(this).val();
      if (value && value != 'Others') {
        this.selectedCategory = $(this).val();
        window.angularComponentReference.zone.run(() => {
          window.angularComponentReference.loadAngularFunction($(this).val());
        });
      }
    });

    $('#chooseCategory').on('change', function () {
      let value: string = $(this).val();
      console.log('choosen domain :', value);
      if (value == 'Others') {
        window.angularComponentReference.zone.run(() => {
          window.angularComponentReference.changeOtherDomain();
        });
      } else {
        window.angularComponentReference.zone.run(() => {
          window.angularComponentReference.disableEditDomainView();
        });
      }
    });
    $('#chooseSubCategory').on('change', function () {
      let value = $(this).val();
      console.log('choosen topic :', value);
      if (value == 'Others') {
        window.angularComponentReference.zone.run(() => {
          window.angularComponentReference.changeOtherTopic();
        });
      } else {
        window.angularComponentReference.zone.run(() => {
          window.angularComponentReference.disableEditDomainView();
        });
      }
    });

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );
  }

  checkForNumbers(form: any) {
    let regExp = /^\d+$/;
    let yoe = form.value.yearsOfExperience;
    //console.log("Years of experience is "+yoe);
    if (yoe == ' ' || yoe == undefined) {
      return true;
    } else {
      let hasNumbers = regExp.test(yoe.trim());
      //console.log(hasNumbers + ", it is a number");
      return hasNumbers;
    }
  }

  togglePasswords() {
    this.showPassword = !this.showPassword;
  }

  public _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }
  togglePreviousOrganisationsView() {
    this.showEditPreviousOrganisations = !this.showEditPreviousOrganisations;
  }
  selectOtherDomain() {
    this.duplicateExpertiseArea = false;
    this.showTextDomain = true;
    this.showTextTopic = true;
    this.otherDomainSelected = true;
  }
  selectOtherTopic() {
    this.duplicateExpertiseArea = false;
    console.log('selected other topic');
    if (this.selectedCategory) {
      this.showTextTopic = true;
      this.otherTopicSelected = true;
    } else {
      this.errorText = 'Please choose a domain !';
    }
  }
  disableEditDomainView() {
    this.showTextDomain = false;
    this.showTextTopic = false;
    this.otherDomainSelected = false;
    this.otherTopicSelected = false;
    this.textDomain = '';
    this.textTopic = '';
    console.log(this.selectedCategory);
    console.log(this.selectedSubCategory);
  }
  onDigitInput(event) {
    let element;
    if (event.code !== 'Backspace')
      element = event.srcElement.nextElementSibling;

    if (event.code === 'Backspace')
      element = event.srcElement.previousElementSibling;

    if (element == null) return;
    else element.focus();
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

  saveNewPassword() {
    this.isLoading = true;
    this.httpService
      .choosePassword(this.jwtToken, this.newPassword)
      .subscribe((res: any) => {
        if (res.response == 'password not changed' || res == null) {
          this.isLoading = false;
          this.invalidChoosePassword = true;
        } else {
          this.loginEmail = res.response;
          this.loginModel.email = this.loginEmail;
          this.loginModel.password = this.newPassword;
          this.loginModel.method = bcrypt.hashSync('manual', 1);
          this.authService.onLogin(this.loginModel);
          this.authService.getAuthStatusListener().subscribe((res) => {
            if (res == false) {
              this.isLoading = false;
              this.invalidChoosePassword = true;
            } else if (res == true) {
              if (this.loginDetailsService.getLoginType() == 'Learner') {
                this.loginDetailsService.setTrType('sign-up');
                this.toFacade();
              } else if (this.loginDetailsService.getLoginType() == 'Expert') {
                this.loginDetailsService.setTrType('sign-up');
                this.toHome();
              }
            }
          });
        }
      });
  }
  toFacade() {
    this.router.navigate(['']);
  }

  toHome() {
    this.router.navigate(['home']);
  }

  onOutput(verifyEmail: boolean) {
    console.log('Inside the output method with verify email ' + verifyEmail);
    this.enableOtpPage = false;
    this.onVerifyEmail();
  }

  onVerifyEmail() {
    this.isLoading = true;
    this.httpService
      .registerExpert(this.tutorProfileDetails)
      .subscribe((res) => {
        this.isLoading = false;
        if (res == true) {
          this.registeredExpert = true;
          this.verifyEmail = false;
        } else {
          this.isLoading = false;
          this.registeredExpert = false;
          this.verifyEmail = false;
          this.snackBar.open(
            'Expert already Registered !',
            'close',
            this.config
          );
        }
      });
  }

  appendOtp(form: NgForm) {
    let otp: string = '';
    let otp_1digit = form.value.otp_1digit;
    let otp_2digit = form.value.otp_2digit;
    let otp_3digit = form.value.otp_3digit;
    let otp_4digit = form.value.otp_4digit;
    let otp_5digit = form.value.otp_5digit;
    let otp_6digit = form.value.otp_6digit;
    otp += otp_1digit.toString();
    otp += otp_2digit.toString();
    otp += otp_3digit.toString();
    otp += otp_4digit.toString();
    otp += otp_5digit.toString();
    otp += otp_6digit.toString();

    return otp;
  }

  getEarningAppInfo() {
    this.httpService.getEarningAppInfo().subscribe((res) => {
      this.appInfo = res;
    });
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
    if (val != 'Others') {
      if (!this.selectedCategory || this.checkDomainInList(val)) {
        this.selectedCategory = val;

        this.filteredSubCategories = [];
        this.filteredSubCategories = this.subCategories.filter(
          (x) => x.category == this.selectedCategory
        );

        // this.selectedSubCategory = this.filteredSubCategories[0].subCategory;
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
        // this.selectedCategory=this.categories[0].category;
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

  formatDobFromMoment(momentDate: any) {
    let momentObject;
    if (momentDate._isAMomentObject == true) {
      momentObject = momentDate;
    } else {
      let date: Date = new Date(momentDate);
      momentObject = moment(date);
    }
    let formattedDate = moment(momentObject._d).format('DD/MM/YYYY');
    return formattedDate;
  }
  autoSaveEnteredInformation() {
    //auto save all the information for expertise, organisation, education
    this.saveExpertise();
    this.addOrganisation();
    this.addEducation();
  }
  saveExpertBasicProfile(form: any) {
    this.autoSaveEnteredInformation();
    if (this.expertises.length > 0) {
      if (this.errorText) {
        this.errorText = '';
      }
      if (this.educationQualifications.length > 0) {
        if (this.emptyEducationDetails == true)
          this.emptyEducationDetails = false;
        if (this.profilePictureUrl != '../assets/images/dummy-profile.svg') {
          // if (this.emptyProfilePicture == false) this.emptyProfilePicture = true;
          this.isLoading = true;

          this.tutorProfileDetails.contact = form.value.contact;
          console.log('User inputted DOB is ' + form.value.dob);
          this.tutorProfileDetails.dateOfBirth = this.formatDobFromMoment(
            form.value.dob
          );
          console.log(this.tutorProfileDetails.dateOfBirth);
          this.tutorProfileDetails.email = form.value.email;
          this.tutorProfileDetails.educationalQualifications =
            this.educationQualifications;
          this.tutorProfileDetails.professionalSkills =
            form.value.professionalSkills;
          this.tutorProfileDetails.fullName = form.value.fullName;
          this.tutorProfileDetails.profilePictureUrl = this.profilePictureUrl;
          this.tutorProfileDetails.bookingId = this.tutorProfile.bookingId;
          this.tutorProfileDetails.institute = this.getInstitute();
          this.tutorProfileDetails.areaOfExpertise = this.expertises;
          this.tutorProfileDetails.linkedInProfile = form.value.linkedInProfile;
          this.tutorProfileDetails.yearsOfExperience =
            form.value.yearsOfExperience;
          this.tutorProfileDetails.currentOrganisation =
            form.value.currentOrganisation;
          this.tutorProfileDetails.currentDesignation =
            form.value.currentDesignation;
          this.tutorProfileDetails.previousOrganisations =
            this.previousOraganisations;
          this.tutorProfileDetails.description = form.value.description;
          this.tutorProfileDetails.speciality = form.value.speciality;
          this.tutorProfileDetails.upiID = form.value.upiID;
          this.tutorProfileDetails.gst = form.value.gst;
          console.log(this.tutorProfileDetails);
          this.httpService
            .checkUser(this.tutorProfileDetails.email)
            .subscribe((res) => {
              if (res == true) {
                this.isLoading = false;
                this.isLoading = false;
                this.registeredExpert = false;
                this.verifyEmail = false;
                this.snackBar.open(
                  'Email already Registered !',
                  'close',
                  this.config
                );
              } else {
                this.httpService
                  .verifyEmail(this.tutorProfileDetails.email)
                  .subscribe((res) => {
                    this.verificationOtp = res['response'];

                    this.otpJSON.verificationOtp = this.verificationOtp;
                    this.otpJSON.email = this.tutorProfileDetails.email;
                    this.enableOtpPage = true;
                    this.isLoading = false;
                    this.verifyEmail = true;
                  });
              }
            });
        } else {
          this.emptyProfilePicture = true;
          let el = document.getElementById('photoBox');
          el.scrollIntoView();
        }
      } else {
        this.emptyEducationDetails = true;
        let el = document.getElementById('educationBox');
        el.scrollIntoView();
      }
    } else {
      this.errorText = 'Enter atleast one area of Expertise !';
      let el = document.getElementById('domainBox');
      el.scrollIntoView();
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
      if (arr[1] == brr[1]) {
        return true;
      }
    }
    return false;
  }
  organisationDuplicacyCheck(fields: any, item: string) {
    console.log(item, fields);
    const arr = item.split('@');

    for (let i = 0; i < fields.length; i++) {
      const brr = fields[i].split('@');
      if (arr[0] == brr[0] && arr[1] == brr[1]) {
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
            if (this.emptyProfilePicture == true)
              this.emptyProfilePicture = false;
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

  // save expertise for multiple domains
  saveExpertise() {
    if (this.tutorProfileDetails.price1) {
      this.pricePerHourError = false;
    }
    this.addExpertise = new expertise();
    if (!this.otherDomainSelected && !this.otherTopicSelected) {
      if (this.selectedCategory != '' && this.selectedCategory != null) {
        if (this.selectedSubCategory) {
          this.topicNotSelected = false;
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
              this.addExpertise.price = parseInt(
                this.tutorProfileDetails.price1
              );
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
          this.topicNotSelected = true;
          this.errorText = 'Please add Topic !';
        }
      }
    } else if (this.otherDomainSelected == true) {
      if (this.textDomain == '' && this.textTopic == '') {
        this.topicNotSelected = true;
        this.domainNotSelected = true;
        this.errorText = 'Please enter domain and topic name !';
      } else if (this.textDomain == '') {
        this.domainNotSelected = true;
        this.errorText = 'Please enter domain name !';
      } else if (this.textTopic == '') {
        this.topicNotSelected = true;
        this.errorText = 'Please enter topic name !';
      } else if (this.textTopic != '' && this.textDomain != '') {
        this.domainNotSelected = false;
        this.topicNotSelected = false;
        this.errorText = '';
        if (!this.expertiseDuplicacyCheck(this.textDomain, this.textTopic)) {
          this.addExpertise.category = this.textDomain;
          this.addExpertise.subCategory = this.textTopic;
          if (this.tutorProfileDetails.price1 != null) {
            this.addExpertise.price = parseInt(this.tutorProfileDetails.price1);
            this.expertises.push(this.addExpertise);
            $('.select2').val('').trigger('change');
            this.expertises.reverse();
            this.textDomain = '';
            this.textTopic = '';
            this.selectedCategory = '';
            this.selectedSubCategory = '';
            this.priceForExpertise = '';
            this.showTextDomain = false;
            this.showTextTopic = false;
            this.otherDomainSelected = false;
            this.otherTopicSelected = false;
            if (this.duplicateExpertiseArea == true) {
              this.duplicateExpertiseArea = false;
            }
          } else {
            this.pricePerHourError = true;
          }
        } else {
          this.duplicateExpertiseArea = true;
          this.textDomain = '';
          this.textTopic = '';
          this.priceForExpertise = '';
        }
      }
    } else if (this.otherTopicSelected == true) {
      if (this.tutorProfileDetails.price1 != null) {
        if (this.selectedCategory) {
          this.domainNotSelected = false;
          if (this.textTopic != '') {
            console.log(this.selectedCategory + ':' + this.textTopic);
            this.topicNotSelected = false;
            this.errorText = '';
            if (
              !this.expertiseDuplicacyCheck(
                this.selectedCategory,
                this.textTopic
              )
            ) {
              this.addExpertise.category = this.selectedCategory;
              this.addExpertise.subCategory = this.textTopic;

              this.addExpertise.price = parseInt(
                this.tutorProfileDetails.price1
              );
              this.expertises.push(this.addExpertise);
              $('.select2').val('').trigger('change');
              this.expertises.reverse();
              this.textDomain = '';
              this.textTopic = '';
              this.selectedCategory = '';
              this.selectedSubCategory = '';
              this.priceForExpertise = '';
              this.showTextDomain = false;
              this.showTextTopic = false;
              this.otherDomainSelected = false;
              this.otherTopicSelected = false;
              if (this.duplicateExpertiseArea == true) {
                this.duplicateExpertiseArea = false;
              }
            } else {
              this.duplicateExpertiseArea = true;
              this.textDomain = '';
              this.textTopic = '';
              this.priceForExpertise = '';
            }
          } else {
            this.errorText = 'Please enter a topic name !';
            this.topicNotSelected = true;
          }
          console.log('we have a selected category !');
        } else {
          this.errorText = 'Please choose a domain !';
          this.domainNotSelected = true;
        }
      } else {
        this.pricePerHourError = true;
      }
    }
  }
  deleteExpertise(index: any) {
    var area = this.expertises[index];
    if (confirm('Are you sure you want to delete ?')) {
      this.expertises.splice(index, 1);
    }
  }

  addOrganisation() {
    if (this.inputOrganisation && this.inputDesignation) {
      if (this.invalidOrganisationDetails == true) {
        this.invalidOrganisationDetails = false;
      }
      let orgString = this.inputDesignation + ' @ ' + this.inputOrganisation;
      if (
        !this.organisationDuplicacyCheck(
          this.previousOraganisations,
          orgString
        ) &&
        !(
          this.inputOrganisation ==
            this.tutorProfileDetails.currentOrganisation &&
          this.inputDesignation == this.tutorProfileDetails.currentDesignation
        )
      ) {
        console.log('here');
        let org = {
          organisation: this.inputOrganisation,
          designation: this.inputDesignation,
        };
        this.previousOraganisations.push(
          this.inputDesignation + ' @ ' + this.inputOrganisation
        );
        console.log(this.previousOraganisations);
        this.prevArrangedOrganisations.push(org);
        this.inputOrganisation = '';
        this.inputDesignation = '';
        // this.togglePreviousOrganisationsView();
        if (this.duplicatePreviousOrganisation == true) {
          this.duplicatePreviousOrganisation = false;
        }
      } else {
        this.inputOrganisation = '';
        this.inputDesignation = '';
        this.duplicatePreviousOrganisation = true;
      }
    } else {
      // this.invalidOrganisationDetails = true;
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
      console.log(dateString);
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
      this.invalidEducationDetails = true;
    }
  }
  deleteEducation(index: any) {
    this.educationQualifications.splice(index, 1);
  }
}
