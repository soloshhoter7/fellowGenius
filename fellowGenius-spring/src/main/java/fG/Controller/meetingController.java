package fG.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import fG.Model.BookingDetailsModel;
import fG.Service.MeetingService;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/fellowGenius/meeting")
public class meetingController {
	
	@Autowired
	MeetingService meetingService;
	
	@RequestMapping(value="/saveMeeting")
	public boolean saveBooking(@RequestBody BookingDetailsModel booking) {
	     return meetingService.saveBooking(booking);
	}
	
	@RequestMapping(value="/findTutorBookings",produces= {"application/json"})
	@ResponseBody
	public List<?> findTutorBookings(String tid) {
		return meetingService.findTutorBookings(tid);
	}
	@RequestMapping(value="/updateBookingStatus",produces= {"application/json"})
	@ResponseBody
	public boolean updateBookingStatus(String bid,String approvalStatus) {
		return meetingService.updateBookingStatus(bid,approvalStatus);
	}
//	---------------------------------------------------
	//find student pending bookings 
	@RequestMapping(value="/findStudentBookings")
	@ResponseBody
	public List<?> findStudentBookings(String studentid){
		Integer sid = Integer.valueOf(studentid);
		List<?> bookingDetails = meetingService.findStudentBookings(sid);
		return bookingDetails;
	}
	
	// for fetching approved bookings list
	@RequestMapping(value="/fetchApprovedList")
	@ResponseBody
	public List<?> fetchApprovedList(String studentid){
		System.out.println(studentid);
		Integer sid = Integer.valueOf(studentid);
		List<?> bookingDetails = meetingService.fetchApprovedList(sid);
		System.out.println("step1" + bookingDetails);
		return bookingDetails;
	}
	
	// for fetching approved bookings list
		@RequestMapping(value="/fetchApprovedListTutor")
		@ResponseBody
		public List<?> fetchApprovedStudentList(String tutorId){
			Integer tid = Integer.valueOf(tutorId);
			List<?> bookingDetails = meetingService.fetchApprovedListTutor(tid);
			System.out.println("step1" + bookingDetails);
			return bookingDetails;
		}

}
