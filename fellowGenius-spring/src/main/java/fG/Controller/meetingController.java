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

import fG.Model.BookingDetailsModel;
import fG.Model.ScheduleTime;
import fG.Model.TutorAvailabilityScheduleModel;
import fG.Service.MeetingService;
import fG.Service.UserService;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/fellowGenius/meeting")
public class meetingController {

	@Autowired
	MeetingService meetingService;

	@Autowired
	UserService userService;

	@RequestMapping(value = "/saveMeeting")
	public boolean saveBooking(@RequestBody BookingDetailsModel booking) {
		return meetingService.saveBooking(booking);
	}

	@RequestMapping(value = "/findTutorBookings", produces = { "application/json" })
	@ResponseBody
	public List<?> findTutorBookings(String tid) {
		return meetingService.findTutorBookings(tid);
	}

	@RequestMapping(value = "/updateBookingStatus", produces = { "application/json" })
	@ResponseBody
	public boolean updateBookingStatus(String bid, String approvalStatus) {
		return meetingService.updateBookingStatus(bid, approvalStatus);
	}

	// find student pending bookings
	@RequestMapping(value = "/findStudentBookings")
	@ResponseBody
	public List<?> findStudentBookings(String studentid) {
		Integer sid = Integer.valueOf(studentid);
		List<?> bookingDetails = meetingService.findStudentBookings(sid);
		return bookingDetails;
	}

	// for fetching approved bookings list
	@RequestMapping(value = "/fetchApprovedList")
	@ResponseBody
	public List<?> fetchApprovedList(String studentid) {
		System.out.println(studentid);
		Integer sid = Integer.valueOf(studentid);
		List<?> bookingDetails = meetingService.fetchApprovedList(sid);
		System.out.println("step1" + bookingDetails);
		return bookingDetails;
	}

	// for fetching approved bookings list
	@RequestMapping(value = "/fetchApprovedListTutor")
	@ResponseBody
	public List<?> fetchApprovedStudentList(String tutorId) {
		Integer tid = Integer.valueOf(tutorId);
		List<?> bookingDetails = meetingService.fetchApprovedListTutor(tid);
		System.out.println("step1" + bookingDetails);
		return bookingDetails;
	}
	
	@RequestMapping(value="/fetchLiveMeetingListTutor")
	@ResponseBody
	public List<?> fetchLiveMeetingListTutor(String tutorId){
		Integer tid = Integer.valueOf(tutorId);
		List<?> bookingDetails = meetingService.fetchLiveMeetingListTutor(tid);
		return bookingDetails;
	}
    
	@RequestMapping(value="/fetchLiveMeetingListStudent")
	@ResponseBody
	public List<?> fetchLiveMeetingListStudent(String sid){
		Integer student_id = Integer.valueOf(sid);
		List<?> bookingDetails = meetingService.fetchLiveMeetingListStudent(student_id);
		return bookingDetails;
	}
//	-------------------------------------------------------Availablity APIs----------------------------------------------------------
	// save Schedule
	@RequestMapping("/saveSchedule")
	public void saveSchedule(@RequestBody TutorAvailabilityScheduleModel tutorAvailabilitySchedule) {
		System.out.println(tutorAvailabilitySchedule.toString());
		if (tutorAvailabilitySchedule.getTid() != null) {
			userService.saveTutorAvailabilitySchedule(tutorAvailabilitySchedule);
		} else {
			System.out.println("tid is null");
		}
	}

	// for getting tutor availability schedule
	@RequestMapping(value="/getSchedule",  produces = { "application/json" })
	@ResponseBody
	public TutorAvailabilityScheduleModel getAvailabilitySchedule(String tid) throws NumberFormatException, ParseException {
		return userService.getTutorAvailabilitySchedule(Integer.valueOf(tid));
	}
	
	@RequestMapping(value="/getTutorTimeArray", produces= {"application/json"})
	@ResponseBody
	public ArrayList<ScheduleTime> getTutorTimeAvailabilityTimeArray(String tid) {
		return userService.getTutorTimeAvailabilityTimeArray(tid);
	}
	
//	----------------------------------------------------------------------------------------------------------------------------------
}
