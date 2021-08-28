import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StudentProfileModel } from '../model/studentProfile';
import { Observable } from 'rxjs';
import { StudentLoginModel } from '../model/studentLoginModel';
import { tutorLoginModel } from '../model/tutorLoginModel';
import { tutorProfile } from '../model/tutorProfile';
import { tutorProfileDetails } from '../model/tutorProfileDetails';
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
      this.backendUrl+'/fellowGenius/updatePassword',
      data
    );
  }
  resetPasswordLink(email: string): Observable<Object> {
    return this.http.get(
      this.backendUrl+'/fellowGenius/sendResetLink',
      {
        params: {
          email: email,
        },
      }
    );
  }
  checkUser(email: string): Observable<Object> {
    return this.http.get(
      this.backendUrl+'/fellowGenius/userExists',
      {
        params: {
          email: email,
        },
      }
    );
  }

  applyFilters(
    filtersApplied: filtersApplied
  ): Observable<tutorProfileDetails[]> {
    return this.http.post<tutorProfileDetails[]>(
      this.backendUrl+'/fellowGenius/filtersApplied',
      filtersApplied
    );
  }

  // fetch pending reviewList at student dashboard
  fetchPendingReviewsList(studentid: number): Observable<bookingDetails[]> {
    return this.http.get<bookingDetails[]>(
      this.backendUrl+'/fellowGenius/meeting/fetchPendingReviewsList',
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
      this.backendUrl+'/fellowGenius/meeting/expertRecentReviews',
      {
        params: {
          tid: tid.toString(),
        },
      }
    );
  }

  // save ratings and review to backend
  giveFeedback(
    meetingId: any,
    rating: number,
    review: string,
    tid: number
  ): Observable<Object> {
    return this.http.get(
      this.backendUrl+'/fellowGenius/meeting/saveTutorRatings',
      {
        params: {
          meetingId: meetingId,
          rating: rating.toString(),
          reviewText: review,
          tid: tid.toString(),
        },
      }
    );
  }

  // for saving student profile details
  registerUser(registrationModel: registrationModel): Observable<Object> {
    return this.http.post(
      this.backendUrl+'/fellowGenius/registerUser',
      registrationModel
    );
  }

  //verifyEmail
  verifyEmail(email: string): Observable<Object> {
    return this.http.get(
      this.backendUrl+'/fellowGenius/meeting/sendEmail',
      {
        params: {
          email: email,
        },
      }
    );
  }
  //for updating student profile
  //UPDATED
  updateStudentProfile(studentModel: StudentProfileModel): Observable<Object> {
    return this.http.post(
      this.backendUrl+'/fellowGenius/updateStudentProfile',
      studentModel
    );
  }

  // for checking student login
  checkLogin(loginModel: loginModel): Observable<Object> {
    return this.http.post(this.backendUrl+'/authenticate', {
      email: loginModel.email,
      password: loginModel.password,
      method:loginModel.method
    });
  }

  // for	getting	student	details	after login
  getStudentDetails(userId): Observable<StudentProfileModel> {
    return this.http.get<StudentProfileModel>(
      this.backendUrl+'/fellowGenius/getStudentDetails',
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
      this.backendUrl+'/fellowGenius/registerTutor',
      tutorModel
    );
  }

  //for updating tutor profile after completing basic info form
  updateTutorProfile(basicInfo: tutorProfile) {
    return this.http.post(
      this.backendUrl+'/fellowGenius/updateTutorBasicInfo',
      basicInfo
    );
  }

  //for experts page
  //UPDATED
  fetchAllLinkedTutors(sid: Number): Observable<tutorProfileDetails[]> {
    return this.http.get<tutorProfileDetails[]>(
      this.backendUrl+'/fellowGenius/fetchAllLinkedTutors',
      {
        params: {
          userId: sid.toString(),
        },
      }
    );
  }
  fetchPendingExperts():Observable<tutorProfileDetails[]>{
    return this.http.get<tutorProfileDetails[]>(
      this.backendUrl+'/fellowGenius/fetchPendingExperts'
    );
  }
  verifyExpert(id){
    return this.http.get(this.backendUrl+'/fellowGenius/verifyExpert',{
      params:{
        id:id
      }
    })
  }
  //for updating tutor profile details after completing tutor profile details form
  registerExpert(tutorProfileDetails: tutorProfileDetails):Observable<Object> {
    return this.http.post<Object>(
      this.backendUrl+'/fellowGenius/registerExpert',
      tutorProfileDetails
    );
  }
  updateTutorProfileDetails(tutorProfileDetails: tutorProfileDetails) {
    return this.http.post(
      this.backendUrl+'/fellowGenius/updateTutor',
      tutorProfileDetails
    );
  }

  updateTutorVerification(tutorVerification: TutorVerification) {
    return this.http.post(
      this.backendUrl+'/fellowGenius/updateTutorVerification',
      tutorVerification
    );
  }

  // for checking tutor login
  checkTutorLogin(tutorLoginModel: tutorLoginModel): Observable<Object> {
    return this.http.post(
      this.backendUrl+'/authenticateTutor',
      {
        email: tutorLoginModel.email,
        password: tutorLoginModel.password,
      }
    );
  }

  // for getting tutor details after login
  getTutorDetails(userId): Observable<tutorProfile> {
    return this.http.get<tutorProfile>(
      this.backendUrl+'/fellowGenius/getTutorDetails',
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
      this.backendUrl+'/fellowGenius/fetchTutorList',{
        params:{
          subject:subject.toString()
        }
      }
    );
  }

  //fetch Top Tutors List
  fetchTopTutors(subject: string) {
    return this.http.get<tutorProfileDetails[]>(
      this.backendUrl+'/fellowGenius/fetchTopTutorList',
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
      this.backendUrl+'/fellowGenius/meeting/updateBookingStatus',
      {
        params: {
          bid: bid.toString(),
          approvalStatus: approvalStatus,
        },
      }
    );
  }
  fetchEarningData(tid:number):Observable<Object>{
    console.log(tid);
    return this.http.get<Object>(
      this.backendUrl+'/fellowGenius/meeting/fetchEarningDataExpert',
      {
        params: {
          tid: tid.toString()
        },
      }
    );
  }
  fetchBookingStatus(bid:number):Observable<Object>{
    return this.http.get(this.backendUrl+'/fellowGenius/meeting/fetchBookingStatus',
    {
      params:{
        bid:bid.toString()
      },
    },
    );
  }
  getTutorProfileDetails(tid: number): Observable<tutorProfileDetails> {
    return this.http.get<tutorProfileDetails>(
      this.backendUrl+'/fellowGenius/getTutorProfileDetails',
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
      this.backendUrl+'/fellowGenius/meeting/saveMeeting',
      bookingModel
    );
  }

  //get Tutor Meetings
  getTutorBookings(tid: number): Observable<bookingDetails[]> {
    return this.http.get<bookingDetails[]>(
      this.backendUrl+'/fellowGenius/meeting/findTutorBookings',
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
      this.backendUrl+'/fellowGenius/meeting/findStudentBookings',
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
      this.backendUrl+'/fellowGenius/meeting/deleteMyBooking',
      {
        params: {
          bid: bid.toString(),
        },
      }
    );
  }

  //delete My Booking
  deleteBookingFromUrl(token,bid: number):Observable<Object> {
    return this.http.get<Object>(
      this.backendUrl+'/fellowGenius/meeting/deleteBookingFromUrl',
      {
        params: {
          token:token,
          bid: bid.toString(),
        },
      }
    );
  }

  //delete My Booking
  canRescheduleBooking(token,bid: number):Observable<Object> {
    return this.http.get<Object>(
      this.backendUrl+'/fellowGenius/meeting/rescheduleMyBooking',
      {
        params: {
          token:token,
          bid: bid.toString(),
        },
      }
    );
  }
choosePassword(token,password):Observable<Object> {
    return this.http.post<Object>(
      this.backendUrl+'/fellowGenius/expertChoosePassword',
      {
        "token":token,
        "password":password
      }
    );
  }

   //delete My Booking
   rescheduleBooking(booking:bookingDetails):Observable<Object> {
    return this.http.post(
      this.backendUrl+'/fellowGenius/meeting/updateRescheduledBooking',
      booking
    );
  }

  requestToReschedule(bid:number):Observable<Object>{
    return this.http.get<Object>(
      this.backendUrl+'/fellowGenius/meeting/requestToReschedule',
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
      this.backendUrl+'/fellowGenius/meeting/fetchApprovedList',
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
      this.backendUrl+'/fellowGenius/meeting/fetchApprovedListTutor',
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
      this.backendUrl+'/fellowGenius/meeting/fetchLiveMeetingListTutor',
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
      this.backendUrl+'/fellowGenius/meeting/fetchLiveMeetingListStudent',
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
      this.backendUrl+'/fellowGenius/registerSocialLogin',
      socialLogin
    );
  }

  //for login using social login details
  checkSocialLogin(email: string): Observable<Object> {
    return this.http.get(
      this.backendUrl+'/fellowGenius/ckeckSocialLogin',
      {
        params: {
          email: email,
        },
      }
    );
  }

  //for editing tutorProfile details
  editTutorProfileDetails(updateTutorProfileDetails: tutorProfileDetails) {
    return this.http.post(
      this.backendUrl+'/fellowGenius/editTutorProfileDetails',
      updateTutorProfileDetails
    );
  }

  //for editing name, email, contact, dob, addressline1, addressline2
  editBasicInfo(updatedBasicInfo: tutorProfile): Observable<Object> {
    return this.http.post(
      this.backendUrl+'/fellowGenius/editTutorBasicInfo',
      updatedBasicInfo
    );
  }

  //for editing city, state, country
  editBasicProfile(updateBasicProfile: tutorProfile) {
    return this.http.post(
      this.backendUrl+'/fellowGenius/editTutorBasicInfo',
      updateBasicProfile
    );
  }

  //save ScheduleData
  saveScheduleData(tutorAvailableSchedule: tutorAvailabilitySchedule) {
    return this.http.post(
      this.backendUrl+'/fellowGenius/meeting/saveSchedule',
      tutorAvailableSchedule
    );
  }

  //getting tutor availabilitySchedule after login
  getScheduleData(tid: number): Observable<tutorAvailabilitySchedule> {
    return this.http.get<tutorAvailabilitySchedule>(
      this.backendUrl+'/fellowGenius/meeting/getSchedule',
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
      this.backendUrl+'/fellowGenius/meeting/getTutorTimeArray',
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
      this.backendUrl+'/fellowGenius/changeAvailabilityStatus',
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
      this.backendUrl+'/fellowGenius/meeting/getStudentSchedule',
      {
        params: {
          sid: sid.toString(),
        },
      }
    );
  }

  getTutorIsAvailable(bookingId: number): Observable<Object> {
    return this.http.get(
      this.backendUrl+'/fellowGenius/meeting/getTutorIsAvailable',
      {
        params: {
          bookingId: bookingId.toString(),
        },
      }
    );
  }

  isBookingValid(booking: bookingDetails): Observable<Object> {
    return this.http.get(
      this.backendUrl+'/fellowGenius/meeting/isBookingValid',
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
    return this.http.get(
      this.backendUrl+'/fellowGenius/subtractArea',
      {
        params: {
          userId: userId.toString(),
          role: role,
          subject: subject,
        },
      }
    );
  }

  fetchTutorProfileDetails(userId): Observable<tutorProfileDetails> {
    return this.http.get<tutorProfileDetails>(
      this.backendUrl+'/fellowGenius/fetchTutorProfileDetails',
      {
        params: {
          tid: userId.toString(),
        },
      }
    );
  }
  fetchBookingTutorProfileDetails(bookingId): Observable<tutorProfileDetails> {
    return this.http.get<tutorProfileDetails>(
      this.backendUrl+'/fellowGenius/fetchBookingTutorProfileDetails',
      {
        params: {
          bookingId: bookingId.toString(),
        },
      }
    );
  }
  
  addNewCategory(category:Category):Observable<Object>{
    return this.http.post<Object>(this.backendUrl+'/fellowGenius/addCategories',{
      category:category.category,
      subCategory:category.subCategory
    });
  }
  getAllCategories():Observable<Category[]>{
    return this.http.get<Category[]>(this.backendUrl+'/fellowGenius/getAllCategories');
  }
  addNewSubCategory(category:Category):Observable<Object>{
    return this.http.post<Object>(this.backendUrl+'/fellowGenius/addSubCategories',
    {
      category:category.category,
      subCategory:category.subCategory
    })
  }
  getSubCategories(category:string):Observable<Category[]>{
    return this.http.get<Category[]>(this.backendUrl+'/fellowGenius/getSubCategories',
    {
      params:{
        category:category
      }
    })
  }
  getAllSubCategories():Observable<Category[]>{
    return this.http.get<Category[]>(this.backendUrl+'/fellowGenius/getAllSubCategories');
  }
  fetchNotifications(userId:string):Observable<NotificationModel[]>{
    return this.http.get<NotificationModel[]>(this.backendUrl+'/fellowGenius/fetchNotifications',{
      params:{
        userId:userId
      }
    })
  }

  getEarningAppInfo():Observable<AppInfo[]>{
    return this.http.get<AppInfo[]>(this.backendUrl+'/fellowGenius/getEarningsAppInfo');
  }
  randomApi():Observable<Object>{
    return this.http.get<Object>(this.backendUrl+'/fellowGenius/randomapi');
  }

  fetchUserAnalytics():Observable<UserActivityAnalytics>{
    return this.http.get<UserActivityAnalytics>(this.backendUrl+'/fellowGenius/fetchUserDataAnalytics');
  }
}
