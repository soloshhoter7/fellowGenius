package fG.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import fG.DAO.MeetingDao;
import fG.Entity.BookingDetails;
import fG.Model.BookingDetailsModel;

@Service
public class MeetingService {
	
	@Autowired
	MeetingDao meetingDao;

	public boolean saveBooking(BookingDetailsModel bookingModel) {
		BookingDetails booking = new BookingDetails();
		booking.setDateOfMeeting(bookingModel.getDateOfMeeting());
		booking.setDescription(bookingModel.getDescription());
		booking.setDuration(bookingModel.getDuration());
		booking.setEndTimeHour(bookingModel.getEndTimeHour());
		booking.setEndTimeMinute(bookingModel.getEndTimeMinute());
		booking.setMeetingId(bookingModel.getMeetingId());
		booking.setStartTimeHour(bookingModel.getStartTimeHour());
		booking.setStartTimeMinute(bookingModel.getStartTimeMinute());
		booking.setStudentId(bookingModel.getStudentId());
		booking.setTutorId(bookingModel.getTutorId());
		booking.setStudentName(bookingModel.getStudentName());
		booking.setTutorName(bookingModel.getTutorName());
		booking.setApprovalStatus(bookingModel.getApprovalStatus());
		return meetingDao.saveBooking(booking);
	}

	public List<?> findTutorBookings(String tid) {
		return meetingDao.findTutorBookings(tid);
	}

	public boolean updateBookingStatus(String bid, String approvalStatus) {
		return meetingDao.updateBookingStatus(Integer.valueOf(bid),approvalStatus);
	}
	
	//for finding students pending bookings
	public List<?> findStudentBookings(Integer sid){
		return meetingDao.findStudentBookings(sid);
	}
	
    // fetch approved bookings students
	public List<?> fetchApprovedList(Integer sid) {
		return meetingDao.fetchApprovedList(sid);
	}
	
	public List<?> fetchApprovedListTutor(Integer tid) {
		return meetingDao.fetchApprovedListTutor(tid);
	}
    // fetch live bookings tutor
	public List<?> fetchLiveMeetingListTutor(Integer tid) {
		return meetingDao.fetchLiveMeetingListTutor(tid);
	}
   
	public List<?>  fetchLiveMeetingListStudent(Integer sid){
		return meetingDao.fetchLiveMeetingListStudent(sid);
	}
}
