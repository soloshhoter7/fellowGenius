package fG.Controller;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import fG.Entity.ScheduleData;
import fG.Model.BookingDetailsModel;
import fG.Model.ScheduleTime;
import fG.Model.TutorAvailabilityScheduleModel;
import fG.Service.MeetingService;
import fG.Service.UserService;

import java.util.Properties;
import java.util.Random;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

@RestController
@CrossOrigin(origins = "https://fellowgenius.com")
//@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/fellowGenius/meeting")
public class meetingController {

	@Autowired
	MeetingService meetingService;

	@Autowired
	UserService userService;

	// for saving booking
	@RequestMapping(value = "/saveMeeting")
	public boolean saveBooking(@RequestBody BookingDetailsModel booking) {
		return meetingService.saveBooking(booking);
	}

	// delete my booking
	@RequestMapping(value= "/deleteMyBooking")
	@ResponseBody
	public boolean deleteMyBooking(String bid){
		Integer bookingId = Integer.valueOf(bid);
		return meetingService.deleteMyBooking(bookingId);
	}
	// for finding tutor pending Bookings
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
	@RequestMapping(value = "/findStudentBookings")
	@ResponseBody
	public List<?> findStudentBookings(String studentid) throws ParseException {
		Integer sid = Integer.valueOf(studentid);
		List<?> bookingDetails = meetingService.findStudentBookings(sid);
		return bookingDetails;
	}

	// for fetching approved bookings list
	@RequestMapping(value = "/fetchApprovedList")
	@ResponseBody
	public List<?> fetchApprovedList(String studentid) throws ParseException {
		Integer sid = Integer.valueOf(studentid);
		List<?> bookingDetails = meetingService.fetchApprovedList(sid);
		return bookingDetails;
	}

	// for fetching approved bookings list
	@RequestMapping(value = "/fetchApprovedListTutor")
	@ResponseBody
	public List<?> fetchApprovedStudentList(String tutorId) throws ParseException {
		Integer tid = Integer.valueOf(tutorId);
		List<?> bookingDetails = meetingService.fetchApprovedListTutor(tid);
		return bookingDetails;
	}

	// for fetching live meetings for tutors
	@RequestMapping(value = "/fetchLiveMeetingListTutor")
	@ResponseBody
	public List<?> fetchLiveMeetingListTutor(String tutorId) throws ParseException {
		Integer tid = Integer.valueOf(tutorId);
		List<?> bookingDetails = meetingService.fetchLiveMeetingListTutor(tid);
		return bookingDetails;
	}

	// for fetching live meetings for student
	@RequestMapping(value = "/fetchLiveMeetingListStudent")
	@ResponseBody
	public List<?> fetchLiveMeetingListStudent(String sid) throws ParseException {
		Integer student_id = Integer.valueOf(sid);
		List<?> bookingDetails = meetingService.fetchLiveMeetingListStudent(student_id);
		return bookingDetails;
	}

	// for saving Schedule
	@RequestMapping("/saveSchedule")
	public void saveSchedule(@RequestBody TutorAvailabilityScheduleModel tutorAvailabilitySchedule) {
		if (tutorAvailabilitySchedule.getTid() != null) {
			userService.saveTutorAvailabilitySchedule(tutorAvailabilitySchedule);
		} else {
			System.out.println("tid is null");
		}
	}

	// for getting tutor availability schedule
	@RequestMapping(value = "/getSchedule", produces = { "application/json" })
	@ResponseBody
	public TutorAvailabilityScheduleModel getAvailabilitySchedule(String tid)
			throws NumberFormatException, ParseException {
		return userService.getTutorAvailabilitySchedule(Integer.valueOf(tid));
	}

	// for getting tutor availability tutor array
	@RequestMapping(value = "/getTutorTimeArray", produces = { "application/json" })
	@ResponseBody
	public ArrayList<ScheduleTime> getTutorTimeAvailabilityTimeArray(String tid) {
		return userService.getTutorTimeAvailabilityTimeArray(tid);
	}

	// for getting student meeting schedule
	@RequestMapping(value = "/getStudentSchedule", produces = { "application/json" })
	@ResponseBody
	public ArrayList<ScheduleData> getStudentSchedule(String sid) throws ParseException {
		return userService.getStudentSchedule(sid);
	}
	
	// for sending verification email
	@RequestMapping(value="/sendEmail")
	@ResponseBody
	public String sendEmail(String email) {
		return userService.verifyEmail(email);
	      
	}
	
	// for checking if tutor is available
	@RequestMapping(value="/getTutorIsAvailable")
	@ResponseBody
	public boolean getIsAvailable(String tid) {
		return userService.getTutorIsAvailable(tid);
	}
	
	
	// for checking if booking is valid
	@RequestMapping(value="/isBookingValid")
	@ResponseBody
	public boolean isBookingValid(String sh, String sm, String eh, String em, String tid, String date) {
		return meetingService.isBookingValid(Integer.valueOf(sh),Integer.valueOf(sm),Integer.valueOf(eh),Integer.valueOf(em),Integer.valueOf(tid), date);
	}
}