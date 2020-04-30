package fG.DAO;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import fG.Entity.BookingDetails;
import fG.Repository.repositoryBooking;

@Component
public class MeetingDao {
    
	@Autowired
	repositoryBooking repBooking;
	
	// for saving booking in database
	public boolean saveBooking(BookingDetails booking) {
		repBooking.save(booking);
		return true;
	}

	public List<?> findTutorBookings(String tid) {
			return repBooking.bookingExist(tid);
	}

	public boolean updateBookingStatus(Integer bid,String approvalStatus) {
		repBooking.saveUpdate(bid, approvalStatus);
		return true;
	}
	
	public List<?> findStudentBookings(Integer sid) {
		return repBooking.findStudentBookings(sid);
	}

	public List<?> fetchApprovedList(Integer sid) {
		System.out.println("Step 2" + repBooking.fetchApprovedList(sid));
		return repBooking.fetchApprovedList(sid);
		
	}

	public List<?> fetchApprovedListTutor(Integer tid) {
		System.out.println("Step 2" + repBooking.fetchApprovedList(tid));
		return repBooking.fetchApprovedListTutor(tid);
		
	}
}
