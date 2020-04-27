import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StudentProfileModel } from '../model/studentProfile';
import { Observable } from 'rxjs';
import { StudentLoginModel } from '../model/studentLoginModel';
import { tutorLoginModel } from '../model/tutorLoginModel';
import { tutorProfile } from '../model/tutorProfile';
import { tutorProfileDetails } from '../model/tutorProfileDetails';
import { bookingDetails } from '../model/bookingDetails';

@Injectable({
	providedIn: 'root'
})
export class HttpService {
	constructor(private http: HttpClient) {}
	// for saving student profile details
	saveStudentProfile(studentModel: StudentProfileModel): Observable<Object> {
		return this.http.post('http://localhost:8080/fellowGenius/registerStudent', studentModel);
	}
	// for checking student login
	checkLogin(studentLoginModel: StudentLoginModel): Observable<Object> {
		return this.http.post('http://localhost:8080/fellowGenius/loginStudent', studentLoginModel);
	}
	// for	getting	student	details	after login
	getStudentDetails(studentLoginModel: StudentLoginModel): Observable<StudentProfileModel> {
		return this.http.get<StudentProfileModel>('http://localhost:8080/fellowGenius/getStudentDetails', {
			params: {
				email: studentLoginModel.email
			}
		});
	}
	// for saving tutor profile
	saveTutorProfile(tutorModel: tutorProfile): Observable<Object> {
		return this.http.post('http://localhost:8080/fellowGenius/registerTutor', tutorModel);
	}
	// for checking tutor login
	checkTutorLogin(tutorLoginModel: tutorLoginModel): Observable<Object> {
		return this.http.post('http://localhost:8080/fellowGenius/loginTutor', tutorLoginModel);
	}
	// for getting tutor details after login
	getTutorDetails(tutorLoginModel: tutorLoginModel): Observable<tutorProfile> {
		return this.http.get<tutorProfile>('http://localhost:8080/fellowGenius/getTutorDetails', {
			params: {
				email: tutorLoginModel.email
			}
		});
	}
	//fetch all the tutors for find tutor page
	getTutorList() {
		return this.http.get<tutorProfileDetails[]>('http://localhost:8080/fellowGenius/fetchTutorList');
	}
	//for saving  booking Details
	saveBooking(bookingModel: bookingDetails): Observable<Object> {
		return this.http.post('http://localhost:8080/fellowGenius/meeting/saveMeeting', bookingModel);
	}
	//get Tutor Meetings
	getTutorBookings(tid: number) {
		return this.http.get<bookingDetails[]>('http://localhost:8080/fellowGenius/meeting/findTutorBookings', {
			params: {
				tid: tid.toString()
			}
		});
	}
	updateBookingStatus(bid: number, approvalStatus: string): Observable<Object> {
		return this.http.get('http://localhost:8080/fellowGenius/meeting/updateBookingStatus', {
			params: {
				bid: bid.toString(),
				approvalStatus: approvalStatus
			}
		});
	}

	// for fetching student booking list
	findStudentBookings(sid: number) {
		return this.http.get<bookingDetails[]>('http://localhost:8080/fellowGenius/meeting/findStudentBookings', {
			params: {
				studentid: sid.toString()
			}
		});
	}

	fetchApprovedMeetings(sid: number) {
		return this.http.get<bookingDetails[]>('http://localhost:8080/fellowGenius/meeting/fetchApprovedList', {
			params: {
				studentid: sid.toString()
			}
		});
	}
	fetchApprovedMeetingsTutor(tid: number) {
		return this.http.get<bookingDetails[]>('http://localhost:8080/fellowGenius/meeting/fetchApprovedListTutor', {
			params: {
				tutorId: tid.toString()
			}
		});
	}
}
