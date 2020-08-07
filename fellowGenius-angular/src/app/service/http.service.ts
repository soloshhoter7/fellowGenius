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

@Injectable({
	providedIn: 'root'
})
export class HttpService {
	constructor(private http: HttpClient) {}
	// for saving student profile details
	saveStudentProfile(studentModel: StudentProfileModel): Observable<Object> {
		return this.http.post('http://localhost:5000/fellowGenius/registerStudent', studentModel);
	}

	//verifyEmail
	verifyEmail(email: string): Observable<Object> {
		return this.http.get('http://localhost:5000/fellowGenius/meeting/sendEmail', {
			params: {
				email: email
			}
		});
	}
	//for updating student profile
	updateStudentProfile(studentModel: StudentProfileModel): Observable<Object> {
		return this.http.post('http://localhost:5000/fellowGenius/updateStudentProfile', studentModel);
	}

	// for checking student login
	checkLogin(studentLoginModel: StudentLoginModel): Observable<Object> {
		return this.http.post('http://localhost:5000/authenticateStudent', {
			email: studentLoginModel.email,
			password: studentLoginModel.password
		});
	}

	// for	getting	student	details	after login
	getStudentDetails(userId): Observable<StudentProfileModel> {
		return this.http.get<StudentProfileModel>('http://localhost:5000/fellowGenius/getStudentDetails', {
			params: {
				userId: userId.toString()
			}
		});
	}

	// for saving tutor profile
	saveTutorProfile(tutorModel: tutorProfile): Observable<Object> {
		return this.http.post('http://localhost:5000/fellowGenius/registerTutor', tutorModel);
	}

	//for updating tutor profile after completing basic info form
	updateTutorProfile(basicInfo: tutorProfile) {
		return this.http.post('http://localhost:5000/fellowGenius/updateTutorBasicInfo', basicInfo);
	}

	//for updating tutor profile details after completing tutor profile details form
	updateTutorProfileDetails(tutorProfileDetails: tutorProfileDetails) {
		return this.http.post('http://localhost:5000/fellowGenius/updateTutor', tutorProfileDetails);
	}

	updateTutorVerification(tutorVerification: TutorVerification) {
		return this.http.post('http://localhost:5000/fellowGenius/updateTutorVerification', tutorVerification);
	}

	// for checking tutor login
	checkTutorLogin(tutorLoginModel: tutorLoginModel): Observable<Object> {
		return this.http.post('http://localhost:5000/authenticateTutor', {
			email: tutorLoginModel.email,
			password: tutorLoginModel.password
		});
	}

	// for getting tutor details after login
	getTutorDetails(userId): Observable<tutorProfile> {
		return this.http.get<tutorProfile>('http://localhost:5000/fellowGenius/getTutorDetails', {
			params: {
				userId: userId.toString()
			}
		});
	}

	//fetch all the tutors for find tutor page
	getTutorList() {
		return this.http.get<tutorProfileDetails[]>('http://localhost:5000/fellowGenius/fetchTutorList');
	}

	//fetch Top Tutors List
	fetchTopTutors(subject: string) {
		return this.http.get<tutorProfileDetails[]>('http://localhost:5000/fellowGenius/fetchTopTutorList', {
			params: {
				subject: subject
			}
		});
	}

	//for updating booking status
	updateBookingStatus(bid: number, approvalStatus: string): Observable<Object> {
		return this.http.get('http://localhost:5000/fellowGenius/meeting/updateBookingStatus', {
			params: {
				bid: bid.toString(),
				approvalStatus: approvalStatus
			}
		});
	}

	getTutorProfileDetails(tid: number): Observable<tutorProfileDetails> {
		return this.http.get<tutorProfileDetails>('http://localhost:5000/fellowGenius/getTutorProfileDetails', {
			params: {
				tid: tid.toString()
			}
		});
	}

	//for saving  booking Details
	saveBooking(bookingModel: bookingDetails): Observable<Object> {
		return this.http.post('http://localhost:5000/fellowGenius/meeting/saveMeeting', bookingModel);
	}

	//get Tutor Meetings
	getTutorBookings(tid: number): Observable<bookingDetails[]> {
		return this.http.get<bookingDetails[]>('http://localhost:5000/fellowGenius/meeting/findTutorBookings', {
			params: {
				tid: tid.toString()
			}
		});
	}

	// for fetching student booking list student
	findStudentBookings(sid: number) {
		return this.http.get<bookingDetails[]>('http://localhost:5000/fellowGenius/meeting/findStudentBookings', {
			params: {
				studentid: sid.toString()
			}
		});
	}

	//delete My Booking
	deleteMyBooking(bid: number) {
		return this.http.get<bookingDetails>('http://localhost:5000/fellowGenius/meeting/deleteMyBooking', {
			params: {
				bid: bid.toString()
			}
		});
	}

	//for fetching  approved meetings student
	fetchApprovedMeetings(sid: number) {
		return this.http.get<bookingDetails[]>('http://localhost:5000/fellowGenius/meeting/fetchApprovedList', {
			params: {
				studentid: sid.toString()
			}
		});
	}

	//for fetching approved meetings tutor
	fetchApprovedMeetingsTutor(tid: number) {
		return this.http.get<bookingDetails[]>('http://localhost:5000/fellowGenius/meeting/fetchApprovedListTutor', {
			params: {
				tutorId: tid.toString()
			}
		});
	}

	//for fetching live meetings tutor
	fetchLiveMeetingsTutor(tid: number) {
		return this.http.get<bookingDetails[]>('http://localhost:5000/fellowGenius/meeting/fetchLiveMeetingListTutor', {
			params: {
				tutorId: tid.toString()
			}
		});
	}

	//for fetching live meetings student
	fetchLiveMeetingsStudent(sid: number) {
		return this.http.get<
			bookingDetails[]
		>('http://localhost:5000/fellowGenius/meeting/fetchLiveMeetingListStudent', {
			params: {
				sid: sid.toString()
			}
		});
	}

	//for saving using social login details
	saveSocialLogin(socialLogin: socialLogin): Observable<object> {
		return this.http.post('http://localhost:5000/fellowGenius/registerSocialLogin', socialLogin);
	}

	//for login using social login details
	checkSocialLogin(email: string): Observable<Object> {
		return this.http.get('http://localhost:5000/fellowGenius/ckeckSocialLogin', {
			params: {
				email: email
			}
		});
	}

	//for editing tutorProfile details
	editTutorProfileDetails(updateTutorProfileDetails: tutorProfileDetails) {
		return this.http.post('http://localhost:5000/fellowGenius/editTutorProfileDetails', updateTutorProfileDetails);
	}

	//for editing name, email, contact, dob, addressline1, addressline2
	editBasicInfo(updatedBasicInfo: tutorProfile): Observable<Object> {
		return this.http.post('http://localhost:5000/fellowGenius/editTutorBasicInfo', updatedBasicInfo);
	}

	//for editing city, state, country
	editBasicProfile(updateBasicProfile: tutorProfile) {
		return this.http.post('http://localhost:5000/fellowGenius/editTutorBasicInfo', updateBasicProfile);
	}

	//save ScheduleData
	saveScheduleData(tutorAvailableSchedule: tutorAvailabilitySchedule) {
		return this.http.post('http://localhost:5000/fellowGenius/meeting/saveSchedule', tutorAvailableSchedule);
	}

	//getting tutor availabilitySchedule after login
	getScheduleData(tid: number): Observable<tutorAvailabilitySchedule> {
		return this.http.get<tutorAvailabilitySchedule>('http://localhost:5000/fellowGenius/meeting/getSchedule', {
			params: {
				tid: tid.toString()
			}
		});
	}

	// getting tutor avqailable time slots
	getTutorTimeAvailabilityTimeArray(tid: number) {
		return this.http.get<ScheduleTime[]>('http://localhost:5000/fellowGenius/meeting/getTutorTimeArray', {
			params: {
				tid: tid.toString()
			}
		});
	}

	//for updating availability status
	changeAvailabilityStatus(tid: number, isAvailable: string) {
		return this.http.get<tutorAvailabilitySchedule>('http://localhost:5000/fellowGenius/changeAvailabilityStatus', {
			params: {
				tid: tid.toString(),
				isAavailable: isAvailable
			}
		});
	}

	// getting student meetings
	getStudentSchedule(sid: number): Observable<scheduleData[]> {
		return this.http.get<scheduleData[]>('http://localhost:5000/fellowGenius/meeting/getStudentSchedule', {
			params: {
				sid: sid.toString()
			}
		});
	}

	getTutorIsAvailable(tid: number): Observable<Object> {
		return this.http.get('http://localhost:5000/fellowGenius/meeting/getTutorIsAvailable', {
			params: {
				tid: tid.toString()
			}
		});
	}

	isBookingValid(booking: bookingDetails): Observable<Object> {
		return this.http.get('http://localhost:5000/fellowGenius/meeting/isBookingValid', {
			params: {
				sh: booking.startTimeHour.toString(),
				sm: booking.startTimeMinute.toString(),
				eh: booking.endTimeHour.toString(),
				em: booking.endTimeMinute.toString(),
				tid: booking.tutorId.toString(),
				date: booking.dateOfMeeting
			}
		});
	}
}
