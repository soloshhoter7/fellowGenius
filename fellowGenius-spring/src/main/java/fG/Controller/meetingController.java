package fG.Controller;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import fG.Entity.BookingDetails;
import fG.Entity.ScheduleData;
import fG.Model.AuthenticationResponse;
import fG.Model.BookingDetailsModel;
import fG.Model.ScheduleTime;
import fG.Model.TutorAvailabilityScheduleModel;
import fG.Service.MeetingService;
import fG.Service.UserService;

@RestController
//@CrossOrigin(origins = "https://ng-fellowgenius.azurewebsites.net")
//@CrossOrigin(origins = "https://fellowgenius.com")
@CrossOrigin(origins = "http://localhost:4200")

@RequestMapping("/fellowGenius/meeting")
public class meetingController {

	@Autowired
	MeetingService meetingService;

	@Autowired
	UserService userService;

	// for saving booking
	@PreAuthorize("hasAuthority('Learner')")
	@RequestMapping(value = "/saveMeeting")
	public boolean saveBooking(@RequestBody BookingDetailsModel booking) {
		return meetingService.saveBooking(booking);
	}

	// delete my booking
	@PreAuthorize("hasAuthority('Learner')")
	@RequestMapping(value= "/deleteMyBooking")
	@ResponseBody
	public boolean deleteMyBooking(String bid){
		Integer bookingId = Integer.valueOf(bid);
		return meetingService.deleteMyBooking(bookingId);
	}
	// for finding tutor pending Bookings
	@PreAuthorize("hasAuthority('Expert')")
	@RequestMapping(value = "/findTutorBookings", produces = { "application/json" })
	@ResponseBody
	public List<?> findTutorBookings(String tid) throws ParseException {
		return meetingService.findTutorBookings(tid);
	}

	// for updating booking status of booking
	@RequestMapping(value = "/updateBookingStatus", produces = { "application/json" })
	@ResponseBody
	public boolean updateBookingStatus(String bid, String approvalStatus) {
		return meetingService.updateBookingStatus(bid, approvalStatus);
	}

	// find student pending bookings
	@PreAuthorize("hasAuthority('Learner')")
	@RequestMapping(value = "/findStudentBookings")
	@ResponseBody
	public List<?> findStudentBookings(String studentid) throws ParseException {
		Integer sid = Integer.valueOf(studentid);
		List<?> bookingDetails = meetingService.findStudentBookings(sid);
		return bookingDetails;
	}

	// for fetching approved bookings list
	@PreAuthorize("hasAuthority('Learner')")
	@RequestMapping(value = "/fetchApprovedList")
	@ResponseBody
	public List<?> fetchApprovedList(String studentid) throws ParseException {
		Integer sid = Integer.valueOf(studentid);
		List<?> bookingDetails = meetingService.fetchApprovedList(sid);
		return bookingDetails;
	}

	// for fetching approved bookings list
	@PreAuthorize("hasAuthority('Expert')")
	@RequestMapping(value = "/fetchApprovedListTutor")
	@ResponseBody
	public List<?> fetchApprovedStudentList(String tutorId) throws ParseException {
		Integer tid = Integer.valueOf(tutorId);
		List<?> bookingDetails = meetingService.fetchApprovedListTutor(tid);
		return bookingDetails;
	}

	// for fetching live meetings for tutors
	@PreAuthorize("hasAuthority('Expert')")
	@RequestMapping(value = "/fetchLiveMeetingListTutor")
	@ResponseBody
	public List<?> fetchLiveMeetingListTutor(String tutorId) throws ParseException {
		Integer tid = Integer.valueOf(tutorId);
		List<?> bookingDetails = meetingService.fetchLiveMeetingListTutor(tid);
		return bookingDetails;
	}

	// for fetching live meetings for student
	@PreAuthorize("hasAuthority('Learner')")
	@RequestMapping(value = "/fetchLiveMeetingListStudent")
	@ResponseBody
	public List<?> fetchLiveMeetingListStudent(String sid) throws ParseException {
		Integer student_id = Integer.valueOf(sid);
		List<?> bookingDetails = meetingService.fetchLiveMeetingListStudent(student_id);
		return bookingDetails;
	}

	// for saving Schedule
	@PreAuthorize("hasAuthority('Expert')")
	@RequestMapping("/saveSchedule")
	public void saveSchedule(@RequestBody TutorAvailabilityScheduleModel tutorAvailabilitySchedule) {
		if (tutorAvailabilitySchedule.getTid() != null) {
			userService.saveTutorAvailabilitySchedule(tutorAvailabilitySchedule);
			System.out.println("at controller ->"+tutorAvailabilitySchedule);
		} else {
			System.out.println("tid is null");
		}
	}

	// for getting tutor availability schedule
	@PreAuthorize("hasAuthority('Expert')")
	@RequestMapping(value = "/getSchedule", produces = { "application/json" })
	@ResponseBody
	public TutorAvailabilityScheduleModel getAvailabilitySchedule(String tid)
			throws NumberFormatException, ParseException {
		return userService.getTutorAvailabilitySchedule(Integer.valueOf(tid));
	}

	// for getting tutor availability tutor array
	@PreAuthorize("hasAuthority('Learner')")
	@RequestMapping(value = "/getTutorTimeArray", produces = { "application/json" })
	@ResponseBody
	public ArrayList<ScheduleTime> getTutorTimeAvailabilityTimeArray(String tid) {
		return userService.getTutorTimeAvailabilityTimeArray(tid);
	}

	// for getting student meeting schedule
	@PreAuthorize("hasAuthority('Learner')")
	@RequestMapping(value = "/getStudentSchedule", produces = { "application/json" })
	@ResponseBody
	public ArrayList<ScheduleData> getStudentSchedule(String sid) throws ParseException {
		return userService.getStudentSchedule(sid);
	}
	
	// for sending verification email
//	@PreAuthorize("hasAuthority('STUDENT') or hasAuthority('TUTOR')")
	@RequestMapping(value="/sendEmail",produces = {"application/json"})
	@ResponseBody
	public AuthenticationResponse sendEmail(String email) {
		return userService.verifyEmail(email);
	      
	}
	
	// for checking if tutor is available
	@PreAuthorize("hasAuthority('Learner')")
	@RequestMapping(value="/getTutorIsAvailable")
	@ResponseBody
	public boolean getIsAvailable(String bookingId) {
		return userService.getTutorIsAvailable(bookingId);
	}
	
	
	// for checking if booking is valid
	@PreAuthorize("hasAuthority('Learner')")
	@RequestMapping(value="/isBookingValid")
	@ResponseBody
	public boolean isBookingValid(String sh, String sm, String eh, String em, String tid, String date) {
		return meetingService.isBookingValid(Integer.valueOf(sh),Integer.valueOf(sm),Integer.valueOf(eh),Integer.valueOf(em),Integer.valueOf(tid), date);
	}
	
	@PreAuthorize("hasAuthority('Learner')")
	@RequestMapping(value="/fetchPendingReviewsList")
	@ResponseBody
	public List<BookingDetails> fetchPendingReviewsList(String sid){
		
//		System.out.println(sid);
		Integer studentId = Integer.valueOf(sid);
		return meetingService.fetchPendingReviewsList(studentId);
		
	}
	
	@PreAuthorize("hasAuthority('Learner')")
	@RequestMapping(value="/saveTutorRatings")
	@ResponseBody
	public boolean saveTutorRatings(String meetingId, Integer rating, String reviewText, String tid) {
		Integer tutid = Integer.valueOf(tid);
		return meetingService.saveTutorRatings(meetingId, rating, reviewText, tutid);
	}
	
	@RequestMapping(value="/expertRecentReviews")
	@ResponseBody
	public List<BookingDetailsModel> fetchExpertRecentReviews(String tid){
		return meetingService.fetchExpertRecentReviews(Integer.valueOf(tid));
	}
}