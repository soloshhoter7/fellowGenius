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

import fG.Configuration.JwtUtil;
import fG.Entity.BookingDetails;
import fG.Entity.ScheduleData;
import fG.Model.AuthenticationResponse;
import fG.Model.BookingDetailsModel;
import fG.Model.BookingStatus;
import fG.Model.EarningDataModel;
import fG.Model.ResponseModel;
import fG.Model.ScheduleTime;
import fG.Model.TutorAvailabilityScheduleModel;
import fG.Service.MeetingService;
import fG.Service.UserService;

@RestController
//@CrossOrigin(origins = "${crossOrigin}")
//@CrossOrigin(origins = {"https://fellowgenius.com","https://www.fellowgenius.com"})

@RequestMapping("/fellowGenius/meeting")
public class MeetingController {

	@Autowired
	MeetingService meetingService;

	@Autowired
	UserService userService;
	
	@Autowired
	private JwtUtil jwtUtil;

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
	public ResponseModel deleteMyBooking(String bid) throws ParseException{
		Integer bookingId = Integer.valueOf(bid);
		return meetingService.deleteMyBooking(bookingId);
	}
	
	
	@RequestMapping(value= "/deleteBookingFromUrl")
	@ResponseBody
	public ResponseModel deleteBookingFromUrl(String token,String bid) throws ParseException{
		System.out.println(token+"    "+bid);
		Integer bookingId = Integer.valueOf(bid);
		String userId = null;
		if(token!=null) {
			System.out.println("entered here");
			userId =  jwtUtil.extractUsername(token);
			return meetingService.deleteBookingFromUrl(userId,bookingId);
		}else {
			return null;
		}	
	}
	
	@PreAuthorize("hasAuthority('Expert')")
	@RequestMapping(value= "/requestToReschedule")
	@ResponseBody
	public boolean requestToReschedule(String bid) throws ParseException{
		Integer bookingId = Integer.valueOf(bid);
		return meetingService.requestToReschedule(bookingId);
		
	}
	
	@PreAuthorize("hasAuthority('Learner')")
	@RequestMapping(value= "/rescheduleMyBooking")
	@ResponseBody
	public ResponseModel rescheduleMyBooking(String token,String bid) throws ParseException{
		Integer bookingId = Integer.valueOf(bid);
		String userId = null;
		if(token!=null) {
			userId =  jwtUtil.extractUsername(token);
			return meetingService.canRescheduleMyBooking(userId,bookingId);
		}else {
			return null;
		}	
	}
	
	@PreAuthorize("hasAuthority('Learner')")
	@RequestMapping(value= "/updateRescheduledBooking")
	@ResponseBody
	public ResponseModel updateRescheduledBooking(@RequestBody BookingDetailsModel booking) throws ParseException{
		return meetingService.updateRescheduledBooking(booking);
	}
	
	// for finding tutor pending Bookingss
	@PreAuthorize("hasAuthority('Expert')")
	@RequestMapping(value = "/findTutorBookings", produces = { "application/json" })
	@ResponseBody
	public List<?> findTutorBookings(String tid) throws ParseException {
		return meetingService.findTutorBookings(tid);
	}

	@PreAuthorize("hasAuthority('Learner') or hasAuthority('TUTOR')")
	@RequestMapping(value = "/findTutorCompletedBookings", produces = { "application/json" })
	@ResponseBody
	public List<?> findTutorCompletedBookings(String tid) throws ParseException {
		return meetingService.findTutorCompletedBookings(tid);
	}
	@PreAuthorize("hasAuthority('Learner')")
	@RequestMapping(value = "/findStudentCompletedBookings", produces = { "application/json" })
	@ResponseBody
	public List<?> findStudentCompletedBookings(String sid) throws ParseException {
		return meetingService.findStudentCompletedBookings(sid);
	}
	// for updating booking status of booking
	@RequestMapping(value = "/updateBookingStatus", produces = { "application/json" })
	@ResponseBody
	public boolean updateBookingStatus(String bid, String approvalStatus) {
		return meetingService.updateBookingStatus(bid, approvalStatus);
	}
	
	// for getting booking status of booking
//	@PreAuthorize("hasAuthority('Expert')")
		@RequestMapping(value = "/fetchBookingStatus", produces = { "application/json" })
		@ResponseBody
		public BookingStatus fetchBookingStatus(String bid ) {
		
			BookingStatus bk=new BookingStatus();
			bk.setStatus(meetingService.fetchBookingStatus(bid));
			return bk;
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
	
//	@PreAuthorize("hasAuthority('Expert')")
//	@RequestMapping(value = "/fetchEarningDataTutor")
//	@ResponseBody
//	public EarningDataModel fetchEarningData(String tutorId) throws ParseException {
//		Integer tid = Integer.valueOf(tutorId);
//		return meetingService.fetchEarningData(tid);
//	}
	@PreAuthorize("hasAuthority('Expert')")
	@RequestMapping(value = "/fetchEarningDataExpert")
	@ResponseBody
	public EarningDataModel fetchEarningData(String tid) throws ParseException {
		 return meetingService.fetchEarningData(tid);
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
	public boolean isBookingValid(String sh, String sm, String eh, String em, String tid, String date) throws NumberFormatException, ParseException {
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
	
	@PreAuthorize("hasAuthority('Learner')")
	@RequestMapping(value="/expertRecentReviews")
	@ResponseBody
	public List<BookingDetailsModel> fetchExpertRecentReviews(String tid){
		return meetingService.fetchExpertRecentReviews(Integer.valueOf(tid));
	}
	
	@RequestMapping(value="/fetchBookingDetailsWithId")
	@ResponseBody
	public BookingDetailsModel fetchBookingDetailsWithId(String meetingId){
		return meetingService.fetchBookingDetailsWithId(meetingId);
	}
	@PreAuthorize("hasAuthority('Learner') or hasAuthority('Expert')")
	@RequestMapping(value="/meetingMemberJoined")
	@ResponseBody
	public void meetingMemberJoined(String meetingId,String userId) throws ParseException {
		meetingService.meetingMemberJoined(meetingId,userId);
	}
	@PreAuthorize("hasAuthority('Learner') or hasAuthority('Expert')")
	@RequestMapping(value="/meetingMemberLeft")
	@ResponseBody
	public void meetingMemberLeft(String meetingId,String userId) throws ParseException {
		meetingService.meetingMemberLeft(meetingId,userId);
	}
	
	@RequestMapping(value="/checkTutorAvailable")
	@ResponseBody
	public void checkTutorAvailable(Integer sh, Integer sm, Integer eh, Integer em, Integer tid, String date) throws ParseException {
		meetingService.checkIfExpertIsAvailableInTime(sh, sm, eh, em, tid, date);
	}
//	@RequestMapping(value="/hitit")
//	@ResponseBody
//	public void hit(){
//		meetingService.calculateRemainingTimeToCancel();
//	}
}