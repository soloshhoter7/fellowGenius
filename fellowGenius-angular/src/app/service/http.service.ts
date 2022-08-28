import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StudentProfileModel } from '../model/studentProfile';
import { Observable } from 'rxjs';
import { StudentLoginModel } from '../model/studentLoginModel';
import { tutorLoginModel } from '../model/tutorLoginModel';
import { tutorProfile } from '../model/tutorProfile';
import {
  expertise,
  featuredExpert,
  tutorProfileDetails,
} from '../model/tutorProfileDetails';
import { bookingDetails } from '../model/bookingDetails';
import { TutorVerification } from '../model/tutorVerification';
import { socialLogin } from '../model/socialModel';
import { scheduleData } from '../model/scheduleData';
import { tutorAvailabilitySchedule } from '../model/tutorAvailabilitySchedule';
import { timezoneData } from '@syncfusion/ej2-angular-schedule';
import { ScheduleTime } from '../model/ScheduleTime';
import { registrationModel } from '../model/registration';
import { loginModel } from '../model/login';
import { filtersApplied } from '../model/filtersApplied';
import { Category } from '../model/category';
import { NotificationModel } from '../model/notification';
import { environment } from 'src/environments/environment';
import { AppInfo } from '../model/AppInfo';
import { UserActivityAnalytics } from '../model/userActivityAnalytics';
import { ActivityTimeDetails, ReferralActivityDetails, UserData } from '../model/UserData';
import { UserReferralsInfo } from '../model/userReferralsInfo';
import { adminReferralInfo } from '../model/adminReferralInfo';
import { Transaction } from '../model/Transaction';
import { CashbackEarned } from '../model/CashbackEarned';
import { FGCredits } from '../model/FGCredits';
import { CashbackInfo } from '../model/CashbackInfo';
import { ReferralActivityAnalytics } from '../model/referralActivityAnalytics';
import { map } from 'rxjs/operators';
import { Event } from '../model/Event';
import { CouponResponse } from '../model/CouponResponse';
import { FeedbackModel } from '../model/feedback';
import { isThisMonth } from 'date-fns';
@Injectable({
  providedIn: 'root',
})
export class HttpService {
  
  constructor(private http: HttpClient) {}
  backendUrl = environment.BACKEND_URL;
  filters: filtersApplied;

  updatePassword(userId, password): Observable<Object> {
    let data = {
      userId: userId.toString(),
      password: password,
    };
    return this.http.post(
      this.backendUrl + '/fellowGenius/updatePassword',
      data
    );
  }
  resetPasswordLink(email: string): Observable<Object> {
    return this.http.get(this.backendUrl + '/fellowGenius/sendResetLink', {
      params: {
        email: email,
      },
    });
  }
  checkUser(email: string): Observable<Object> {
    return this.http.get(this.backendUrl + '/fellowGenius/userExists', {
      params: {
        email: email,
      },
    });
  }

  applyFilters(
    filtersApplied: filtersApplied
  ): Observable<tutorProfileDetails[]> {
    return this.http.post<tutorProfileDetails[]>(
      this.backendUrl + '/fellowGenius/filtersApplied',
      filtersApplied
    );
  }

  // fetch pending reviewList at student dashboard
  fetchPendingReviewsList(studentid: number): Observable<bookingDetails[]> {
    return this.http.get<bookingDetails[]>(
      this.backendUrl + '/fellowGenius/meeting/fetchPendingReviewsList',
      {
        params: {
          sid: studentid.toString(),
        },
      }
    );
  }

  // fetch expert recent reviews
  fetchExpertRecentReviews(tid: number): Observable<bookingDetails[]> {
    return this.http.get<bookingDetails[]>(
      this.backendUrl + '/fellowGenius/meeting/expertRecentReviews',
      {
        params: {
          tid: tid.toString(),
        },
      }
    );
  }

  fetchBookingDetailsWithMeetingId(meetingId): Observable<bookingDetails> {
    return this.http.get<bookingDetails>(
      this.backendUrl + '/fellowGenius/meeting/fetchBookingDetailsWithId',
      {
        params: {
          meetingId: meetingId,
        },
      }
    );
  }
  meetingMemberJoined(meetingId: any, userId: number): Observable<Object> {
    return this.http.get(
      this.backendUrl + '/fellowGenius/meeting/meetingMemberJoined',
      {
        params: {
          meetingId: meetingId,
          userId: userId.toString(),
        },
      }
    );
  }
  meetingMemberLeft(meetingId: any, userId: number): Observable<Object> {
    return this.http.get(
      this.backendUrl + '/fellowGenius/meeting/meetingMemberLeft',
      {
        params: {
          meetingId: meetingId,
          userId: userId.toString(),
        },
      }
    );
  }

  // for saving student profile details
  registerUser(registrationModel: registrationModel): Observable<Object> {
    return this.http.post(
      this.backendUrl + '/fellowGenius/registerUser',
      registrationModel
    );
  }

  //verifyEmail
  verifyEmail(email: string): Observable<Object> {
    return this.http.get(this.backendUrl + '/fellowGenius/meeting/sendEmail', {
      params: {
        email: email,
      },
    });
  }
  //for updating student profile
  //UPDATED
  updateStudentProfile(studentModel: StudentProfileModel): Observable<Object> {
    return this.http.post(
      this.backendUrl + '/fellowGenius/updateStudentProfile',
      studentModel
    );
  }

  // for checking student login
  checkLogin(loginModel: loginModel): Observable<Object> {
    return this.http.post(this.backendUrl + '/authenticate', {
      email: loginModel.email,
      password: loginModel.password,
      method: loginModel.method,
    });
  }
  validateAdmin(loginModel: loginModel): Observable<Object> {
    return this.http.post(this.backendUrl + '/authenticateAdmin', {
      email: loginModel.email,
      password: loginModel.password,
      method: loginModel.method,
    });
  }

  // for	getting	student	details	after login
  getStudentDetails(userId): Observable<StudentProfileModel> {
    return this.http.get<StudentProfileModel>(
      this.backendUrl + '/fellowGenius/getStudentDetails',
      {
        params: {
          userId: userId.toString(),
        },
      }
    );
  }

  // for saving tutor profile
  saveTutorProfile(tutorModel: tutorProfile): Observable<Object> {
    return this.http.post(
      this.backendUrl + '/fellowGenius/registerTutor',
      tutorModel
    );
  }

  //for updating tutor profile after completing basic info form
  updateTutorProfile(basicInfo: tutorProfile) {
    return this.http.post(
      this.backendUrl + '/fellowGenius/updateTutorBasicInfo',
      basicInfo
    );
  }

  //for experts page
  //UPDATED
  fetchAllLinkedTutors(sid: Number): Observable<tutorProfileDetails[]> {
    return this.http.get<tutorProfileDetails[]>(
      this.backendUrl + '/fellowGenius/fetchAllLinkedTutors',
      {
        params: {
          userId: sid.toString(),
        },
      }
    );
  }
  fetchPendingExperts(): Observable<tutorProfileDetails[]> {
    return this.http.get<tutorProfileDetails[]>(
      this.backendUrl + '/fellowGenius/Admin/fetchPendingExperts'
    );
  }
  verifyExpert(id) {
    return this.http.get(this.backendUrl + '/fellowGenius/Admin/verifyExpert', {
      params: {
        id: id,
      },
    });
  }

  rejectExpert(id) {
    return this.http.get(this.backendUrl + '/fellowGenius/Admin/rejectExpert', {
      params: {
        id: id,
      },
    });
  }

  updateAndAddExpertiseArea(area: expertise): Observable<Object> {
    return this.http.get<Object>(
      this.backendUrl + '/fellowGenius/Admin/updateAndAddExpertiseArea',
      {
        params: {
          category: area.category,
          subCategory: area.subCategory,
        },
      }
    );
  }
  //for updating tutor profile details after completing tutor profile details form
  registerExpert(tutorProfileDetails: tutorProfileDetails): Observable<Object> {
    return this.http.post<Object>(
      this.backendUrl + '/fellowGenius/registerExpert',
      tutorProfileDetails
    );
  }
  updatePendingExpert(
    tutorProfileDetails: tutorProfileDetails
  ): Observable<Object> {
    return this.http.post<Object>(
      this.backendUrl + '/fellowGenius/Admin/updatePendingExpert',
      tutorProfileDetails
    );
  }
  updateTutorProfileDetails(tutorProfileDetails: tutorProfileDetails) {
    return this.http.post(
      this.backendUrl + '/fellowGenius/updateTutor',
      tutorProfileDetails
    );
  }

  updateTutorVerification(tutorVerification: TutorVerification) {
    return this.http.post(
      this.backendUrl + '/fellowGenius/updateTutorVerification',
      tutorVerification
    );
  }

  // for checking tutor login
  checkTutorLogin(tutorLoginModel: tutorLoginModel): Observable<Object> {
    return this.http.post(this.backendUrl + '/authenticateTutor', {
      email: tutorLoginModel.email,
      password: tutorLoginModel.password,
    });
  }

  // for getting tutor details after login
  getTutorDetails(userId): Observable<tutorProfile> {
    return this.http.get<tutorProfile>(
      this.backendUrl + '/fellowGenius/getTutorDetails',
      {
        params: {
          userId: userId.toString(),
        },
      }
    );
  }

  //fetch all the tutors for find tutor page
  getTutorList(subject) {
    return this.http.get<tutorProfileDetails[]>(
      this.backendUrl + '/fellowGenius/fetchTutorList',
      {
        params: {
          subject: subject.toString(),
        },
      }
    );
  }

  //fetch all the experts for admin page
  fetchExpertsList() {
    return this.http.get<tutorProfileDetails[]>(
      this.backendUrl + '/fellowGenius/Admin/fetchAllExpertsList'
    );
  }
  //fetch Top Tutors List
  fetchTopTutors(subject: string) {
    return this.http.get<tutorProfileDetails[]>(
      this.backendUrl + '/fellowGenius/fetchTopTutorList',
      {
        params: {
          subject: subject,
        },
      }
    );
  }

  //for updating booking status
  updateBookingStatus(bid: number, approvalStatus: string): Observable<Object> {
    return this.http.get(
      this.backendUrl + '/fellowGenius/meeting/updateBookingStatus',
      {
        params: {
          bid: bid.toString(),
          approvalStatus: approvalStatus,
        },
      }
    );
  }
  fetchEarningData(tid: number): Observable<Object> {
    console.log(tid);
    return this.http.get<Object>(
      this.backendUrl + '/fellowGenius/meeting/fetchEarningDataExpert',
      {
        params: {
          tid: tid.toString(),
        },
      }
    );
  }
  fetchLearnerCompletedMeetings(sid: number) {
    return this.http.get<bookingDetails[]>(
      this.backendUrl + '/fellowGenius/meeting/findStudentCompletedBookings',
      {
        params: {
          sid: sid.toString(),
        },
      }
    );
  }

  fetchExpertCompletedMeetings(tid: number) {
    console.log("Inside fetchExpert method of http service with tid " + tid);
    return this.http.get<bookingDetails[]>(
      this.backendUrl + '/fellowGenius/meeting/findTutorCompletedBookings',
      {
        params: {
          tid: tid.toString(),
        },
      }
    );
  }
  fetchBookingStatus(bid: number): Observable<Object> {
    return this.http.get(
      this.backendUrl + '/fellowGenius/meeting/fetchBookingStatus',
      {
        params: {
          bid: bid.toString(),
        },
      }
    );
  }
  getTutorProfileDetails(tid: number): Observable<tutorProfileDetails> {
    return this.http.get<tutorProfileDetails>(
      this.backendUrl + '/fellowGenius/getTutorProfileDetails',
      {
        params: {
          tid: tid.toString(),
        },
      }
    );
  }
  getAdminTutorProfileDetails(tid: number): Observable<tutorProfileDetails> {
    return this.http.get<tutorProfileDetails>(
      this.backendUrl + '/fellowGenius/Admin/getTutorProfileDetails',
      {
        params: {
          tid: tid.toString(),
        },
      }
    );
  }
  //for saving  booking Details
  saveBooking(bookingModel: bookingDetails): Observable<Object> {
    return this.http.post(
      this.backendUrl + '/fellowGenius/meeting/saveMeeting',
      bookingModel
    );
  }

  //get Tutor Meetings
  getTutorBookings(tid: number): Observable<bookingDetails[]> {
    return this.http.get<bookingDetails[]>(
      this.backendUrl + '/fellowGenius/meeting/findTutorBookings',
      {
        params: {
          tid: tid.toString(),
        },
      }
    );
  }

  // for fetching student booking list student
  findStudentBookings(sid: number) {
    return this.http.get<bookingDetails[]>(
      this.backendUrl + '/fellowGenius/meeting/findStudentBookings',
      {
        params: {
          studentid: sid.toString(),
        },
      }
    );
  }

  //delete My Booking
  deleteMyBooking(bid: number) {
    return this.http.get<bookingDetails>(
      this.backendUrl + '/fellowGenius/meeting/deleteMyBooking',
      {
        params: {
          bid: bid.toString(),
        },
      }
    );
  }

  //delete My Booking
  deleteBookingFromUrl(token, bid: number): Observable<Object> {
    return this.http.get<Object>(
      this.backendUrl + '/fellowGenius/meeting/deleteBookingFromUrl',
      {
        params: {
          token: token,
          bid: bid.toString(),
        },
      }
    );
  }

  //delete My Booking
  canRescheduleBooking(token, bid: number): Observable<Object> {
    return this.http.get<Object>(
      this.backendUrl + '/fellowGenius/meeting/rescheduleMyBooking',
      {
        params: {
          token: token,
          bid: bid.toString(),
        },
      }
    );
  }
  choosePassword(token, password): Observable<Object> {
    return this.http.post<Object>(
      this.backendUrl + '/fellowGenius/expertChoosePassword',
      {
        token: token,
        password: password,
      }
    );
  }

  //delete My Booking
  rescheduleBooking(booking: bookingDetails): Observable<Object> {
    return this.http.post(
      this.backendUrl + '/fellowGenius/meeting/updateRescheduledBooking',
      booking
    );
  }

  //generate invoice of booking
  generateInvoice(booking:bookingDetails): Observable<Blob> {
    let headerOptions = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/pdf',
      
      //   'Accept': 'application/octet-stream', // for excel file
  });
    //let requestOptions = { headers: headerOptions, responseType: 'blob' as 'blob' };
   
    return this.http.post<Blob>(
      this.backendUrl+'/fellowGenius/meeting/generateInvoiceOfBooking', 
      booking,
      {
        headers: headerOptions, responseType:'blob' as 'json'}).pipe(map(
        (response) => {
            return response;
        },
        (error) => {console.log(error.json());} 
    ));
  }

  requestToReschedule(bid: number): Observable<Object> {
    return this.http.get<Object>(
      this.backendUrl + '/fellowGenius/meeting/requestToReschedule',
      {
        params: {
          bid: bid.toString(),
        },
      }
    );
  }
  //for fetching  approved meetings student
  fetchApprovedMeetings(sid: number) {
    return this.http.get<bookingDetails[]>(
      this.backendUrl + '/fellowGenius/meeting/fetchApprovedList',
      {
        params: {
          studentid: sid.toString(),
        },
      }
    );
  }

  //for fetching approved meetings tutor
  fetchApprovedMeetingsTutor(tid: number) {
    return this.http.get<bookingDetails[]>(
      this.backendUrl + '/fellowGenius/meeting/fetchApprovedListTutor',
      {
        params: {
          tutorId: tid.toString(),
        },
      }
    );
  }

  //for fetching live meetings tutor
  fetchLiveMeetingsTutor(tid: number) {
    return this.http.get<bookingDetails[]>(
      this.backendUrl + '/fellowGenius/meeting/fetchLiveMeetingListTutor',
      {
        params: {
          tutorId: tid.toString(),
        },
      }
    );
  }

  //for fetching live meetings student
  fetchLiveMeetingsStudent(sid: number) {
    return this.http.get<bookingDetails[]>(
      this.backendUrl + '/fellowGenius/meeting/fetchLiveMeetingListStudent',
      {
        params: {
          sid: sid.toString(),
        },
      }
    );
  }

  //for saving using social login details
  saveSocialLogin(socialLogin: socialLogin): Observable<object> {
    return this.http.post(
      this.backendUrl + '/fellowGenius/registerSocialLogin',
      socialLogin
    );
  }

  //for login using social login details
  checkSocialLogin(email: string): Observable<Object> {
    return this.http.get(this.backendUrl + '/fellowGenius/ckeckSocialLogin', {
      params: {
        email: email,
      },
    });
  }

  //for editing tutorProfile details
  editTutorProfileDetails(updateTutorProfileDetails: tutorProfileDetails) {
    return this.http.post(
      this.backendUrl + '/fellowGenius/editTutorProfileDetails',
      updateTutorProfileDetails
    );
  }

  //for editing name, email, contact, dob, addressline1, addressline2
  editBasicInfo(updatedBasicInfo: tutorProfile): Observable<Object> {
    return this.http.post(
      this.backendUrl + '/fellowGenius/editTutorBasicInfo',
      updatedBasicInfo
    );
  }

  //for editing city, state, country
  editBasicProfile(updateBasicProfile: tutorProfile) {
    return this.http.post(
      this.backendUrl + '/fellowGenius/editTutorBasicInfo',
      updateBasicProfile
    );
  }

  //save ScheduleData
  saveScheduleData(tutorAvailableSchedule: tutorAvailabilitySchedule) {
    return this.http.post(
      this.backendUrl + '/fellowGenius/meeting/saveSchedule',
      tutorAvailableSchedule
    );
  }

  //getting tutor availabilitySchedule after login
  getScheduleData(tid: number): Observable<tutorAvailabilitySchedule> {
    return this.http.get<tutorAvailabilitySchedule>(
      this.backendUrl + '/fellowGenius/meeting/getSchedule',
      {
        params: {
          tid: tid.toString(),
        },
      }
    );
  }

  // getting tutor avqailable time slots
  getTutorTimeAvailabilityTimeArray(tid: number) {
    return this.http.get<ScheduleTime[]>(
      this.backendUrl + '/fellowGenius/meeting/getTutorTimeArray',
      {
        params: {
          tid: tid.toString(),
        },
      }
    );
  }

  //for updating availability status
  changeAvailabilityStatus(tid: number, isAvailable: string) {
    return this.http.get<tutorAvailabilitySchedule>(
      this.backendUrl + '/fellowGenius/changeAvailabilityStatus',
      {
        params: {
          tid: tid.toString(),
          isAavailable: isAvailable,
        },
      }
    );
  }

  // getting student meetings
  getStudentSchedule(sid: number): Observable<scheduleData[]> {
    return this.http.get<scheduleData[]>(
      this.backendUrl + '/fellowGenius/meeting/getStudentSchedule',
      {
        params: {
          sid: sid.toString(),
        },
      }
    );
  }

  getTutorIsAvailable(bookingId: number): Observable<Object> {
    return this.http.get(
      this.backendUrl + '/fellowGenius/meeting/getTutorIsAvailable',
      {
        params: {
          bookingId: bookingId.toString(),
        },
      }
    );
  }

  isBookingValid(booking: bookingDetails): Observable<Object> {
    return this.http.get(
      this.backendUrl + '/fellowGenius/meeting/isBookingValid',
      {
        params: {
          sh: booking.startTimeHour.toString(),
          sm: booking.startTimeMinute.toString(),
          eh: booking.endTimeHour.toString(),
          em: booking.endTimeMinute.toString(),
          tid: booking.tutorId.toString(),
          date: booking.dateOfMeeting,
        },
      }
    );
  }

  subtractArea(userId, role, subject): Observable<Object> {
    return this.http.get(this.backendUrl + '/fellowGenius/subtractArea', {
      params: {
        userId: userId.toString(),
        role: role,
        subject: subject,
      },
    });
  }

  fetchTutorProfileDetails(userId): Observable<tutorProfileDetails> {
    return this.http.get<tutorProfileDetails>(
      this.backendUrl + '/fellowGenius/fetchTutorProfileDetails',
      {
        params: {
          tid: userId.toString(),
        },
      }
    );
  }
  fetchBookingTutorProfileDetails(bookingId): Observable<tutorProfileDetails> {
    return this.http.get<tutorProfileDetails>(
      this.backendUrl + '/fellowGenius/fetchBookingTutorProfileDetails',
      {
        params: {
          bookingId: bookingId.toString(),
        },
      }
    );
  }

  addNewCategory(category: Category): Observable<Object> {
    return this.http.post<Object>(
      this.backendUrl + '/fellowGeniu/Admin/addCategories',
      {
        category: category.category,
        subCategory: category.subCategory,
      }
    );
  }
  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(
      this.backendUrl + '/fellowGenius/getAllCategories'
    );
  }
  addNewSubCategory(category: Category): Observable<Object> {
    return this.http.post<Object>(
      this.backendUrl + '/fellowGenius/Admin/addSubCategories',
      {
        category: category.category,
        subCategory: category.subCategory,
      }
    );
  }
  getSubCategories(category: string): Observable<Category[]> {
    return this.http.get<Category[]>(
      this.backendUrl + '/fellowGenius/getSubCategories',
      {
        params: {
          category: category,
        },
      }
    );
  }
  getAllSubCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(
      this.backendUrl + '/fellowGenius/getAllSubCategories'
    );
  }
  fetchNotifications(userId: string): Observable<NotificationModel[]> {
    return this.http.get<NotificationModel[]>(
      this.backendUrl + '/fellowGenius/fetchNotifications',
      {
        params: {
          userId: userId,
        },
      }
    );
  }

  getEarningAppInfo(): Observable<AppInfo[]> {
    return this.http.get<AppInfo[]>(
      this.backendUrl + '/fellowGenius/getEarningsAppInfo'
    );
  }

  getRedeemedCreditPercentage(): Observable<AppInfo>{
    return this.http.get<AppInfo>(
      this.backendUrl+'/fellowGenius/getRedeemedCreditPercentage'
    )
  }

  
  
  randomApi(): Observable<Object> {
    return this.http.get<Object>(this.backendUrl + '/fellowGenius/randomapi');
  }

  fetchUserAnalytics(): Observable<UserActivityAnalytics> {
    return this.http.get<UserActivityAnalytics>(
      this.backendUrl + '/fellowGenius/Admin/fetchUserDataAnalytics'
    );
  }
  fetchAllUserData(): Observable<UserData> {
    return this.http.get<UserData>(
      this.backendUrl + '/fellowGenius/Admin/fetchAllUsersData'
    );
  }
  fetchAllLoginData(): Observable<ActivityTimeDetails[]> {
    return this.http.get<ActivityTimeDetails[]>(
      this.backendUrl + '/fellowGenius/Admin/fetchAllLoginData'
    );
  }
  fetchAllSignUpData(): Observable<ActivityTimeDetails[]> {
    return this.http.get<ActivityTimeDetails[]>(
      this.backendUrl + '/fellowGenius/Admin/fetchAllSignUpData'
    );
  }
  fetchAllMeetingsData(): Observable<bookingDetails[]> {
    return this.http.get<bookingDetails[]>(
      this.backendUrl + '/fellowGenius/Admin/fetchAllMeetingData'
    );
  }
  fetchFeaturedExperts(): Observable<featuredExpert[]> {
    return this.http.get<featuredExpert[]>(
      this.backendUrl + '/fellowGenius/Admin/fetchFeaturedExperts'
    );
  }
  saveFeaturedExpert(expert: featuredExpert): Observable<Object> {
    return this.http.post<Object>(
      this.backendUrl + '/fellowGenius/Admin/saveFeaturedExperts',
      expert
    );
  }
  deleteFeaturedExpert(expert: featuredExpert): Observable<Object> {
    return this.http.post<Object>(
      this.backendUrl + '/fellowGenius/Admin/deleteFeaturedExperts',
      expert
    );
  }
  updateFeaturedExperts(experts: featuredExpert[]): Observable<Object> {
    return this.http.post<Object>(
      this.backendUrl + '/fellowGenius/Admin/updateFeaturedExperts',
      experts
    );
  }
  findPendingExpertById(id: string): Observable<tutorProfileDetails> {
    return this.http.get<tutorProfileDetails>(
      this.backendUrl + '/fellowGenius/Admin/findPendingExpertById',
      {
        params: {
          id: id,
        },
      }
    );
  }
  notifyExpertNoSchedule(id: string): Observable<Object> {
    return this.http.get<Object>(
      this.backendUrl + '/fellowGenius/notifyExpert',
      {
        params: {
          tid: id,
        },
      }
    );
  }
  notifyAllExpertsWithNoSchedule(users: string[]): Observable<Object> {
    return this.http.get<Object>(
      this.backendUrl + '/fellowGenius/Admin/notifyAllExpertsWithNoSchedule',
      {
        params: {
          users: users,
        },
      }
    );
  }

  sendReferInviteMail(
    users: string[],
    referCode: string,
    senderEmail: string
  ): Observable<Object> {
    return this.http.get<Object>(
      this.backendUrl + '/fellowGenius/sendReferInviteMail',
      {
        params: {
          users: users,
          referCode: referCode,
          senderEmail: senderEmail,
        },
      }
    );
  }
  getUserReferralInfo(userId: string): Observable<UserReferralsInfo[]> {
    return this.http.get<UserReferralsInfo[]>(
      this.backendUrl + '/fellowGenius/getUserReferralInfo',
      {
        params: {
          userId: userId,
        },
      }
    );
  }

  getFGCreditsOfUser(userId:string):Observable<number>{
    return this.http.get<number>(
      this.backendUrl + '/fellowGenius/getFGCreditsOfUser',
      {
        params:{
          userId:userId,
        }
      }
    )
  }

  getFGCreditsTableOfUser(userId:string):Observable<FGCredits[]>{
    return this.http.get<FGCredits[]>(
      this.backendUrl+'/fellowGenius/getFGCreditsTableOfUser',
      {
       params: {
         userId:userId,
       } 
      }
    )
  }

  getCashbackEarnedOfUser(userId:string):Observable<CashbackEarned>{
    return this.http.get<CashbackEarned>(
      this.backendUrl + '/fellowGenius/getCashbackEarnedOfUser',{
        params:{
          userId:userId,
        }
      })
  }

  getCashbackTableOfUser(userId:string):Observable<CashbackInfo[]>{
    return this.http.get<CashbackInfo[]>(
     this.backendUrl+'/fellowGenius/getCashbackTableOfUser',{
       params: {
        userId:userId, 
       }
     } 
    )
  }

  fetchAllAppInfo():Observable<AppInfo[]> {
    return this.http.get<AppInfo[]>(this.backendUrl+'/fellowGenius/Admin/fetchAllAppInfo');
  }

  updateAppInfo(appInfo:AppInfo):Observable<AppInfo> {
    return this.http.post<AppInfo>(this.backendUrl + '/fellowGenius/Admin/updateAppInfo',appInfo);
  }

  fetchAdminReferralInfo():Observable<adminReferralInfo[]> {
    return this.http.get<adminReferralInfo[]>(this.backendUrl+'/fellowGenius/Admin/fetchAdminReferralInfo');
  }

  fetchPendingTransactionsInfo():Observable<Transaction[]>{
    return this.http.get<Transaction[]>(this.backendUrl+'/fellowGenius/Admin/fetchPendingTransactionInfo');
  }

  fetchPendingExpertPaidTransactionsInfo():Observable<Transaction[]>{
    return this.http.get<Transaction[]>(this.backendUrl+'/fellowGenius/Admin/fetchUnpaidExperts');
  }

  fetchPreviousTransactionsInfo():Observable<Transaction[]>{
    return this.http.get<Transaction[]>(this.backendUrl+'/fellowGenius/Admin/fetchPreviousTransactionsInfo');
  }

  addTransaction(transaction:Transaction):Observable<Object>{
    return this.http.post<Object>(this.backendUrl+'/fellowGenius/Admin/addTransaction',transaction);
  }

  fetchReferralAnalytics(): Observable<ReferralActivityAnalytics> {
    return this.http.get<ReferralActivityAnalytics>(
      this.backendUrl + '/fellowGenius/Admin/fetchReferralDataAnalytics'
    );
  }

  fetchAllReferralData(): Observable<ReferralActivityDetails[]> {
    return this.http.get<ReferralActivityDetails[]>(
      this.backendUrl + '/fellowGenius/Admin/fetchAllReferralData'
    );
  }

  saveContactusDetails(contact:any):Observable<Object>{
    return this.http.post(
      this.backendUrl + '/fellowGenius/saveContactUsMessage',
      contact
    );
  }

  addUserToEvent(userId:string,eventId:string):Observable<Object>{
    return this.http.get(
      this.backendUrl+'/fellowGenius/event/addParticipant',
      {
        params: {
         userId:userId,
         eventId:eventId
        }
      } 
    );
  }

  checkUserForEvent(userId:string,eventId:string):Observable<Object>{
    return this.http.get(
      this.backendUrl+'/fellowGenius/event/checkParticipant',
      {
        params: {
         userId:userId,
         eventId:eventId
        }
      } 
    );
  }

  getUpcomingEvents():Observable<Event[]>{
    return this.http.get<Event[]>(
      this.backendUrl+'/fellowGenius/event/upcomingEvents'
    );
  }

  saveEvents(event:Event):Observable<Event>{
    return this.http.post<Event>(
      this.backendUrl+'/fellowGenius/event/saveEvent',
      event
    );
  }

  getEvent(eventId: string): Observable<Event>{
    return this.http.get<Event>(
      this.backendUrl+'/fellowGenius/event/getEvent',{
        params: {
          eventId:eventId
         }
      }
    )
  }

  

  //coupon controllers

  fetchSelectiveCoupons(userId: string): Observable<CouponResponse[]>{
    return this.http.get<CouponResponse[]>(
      this.backendUrl + '/fellowGenius/coupon/fetchSelectiveCoupons',
      {
        params: {
         userId: userId
        }
      } 
    )
  }
  saveFeedback(feedback:FeedbackModel): Observable<Object> {
    return this.http.post(
      this.backendUrl + '/fellowGenius/meeting/saveFeedback',
      feedback
    );
  }
  isFeedbackEligible(meetingId,userId):Observable<Object>{
    return this.http.get<Object>(this.backendUrl+'/fellowGenius/meeting/isFeedbackEligible',{
      params:{
        meetingId:meetingId,
        userId:userId
      }
    })
  }
}
