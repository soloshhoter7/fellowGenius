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
     
	public BookingDetails findBooking(Integer bid) {
		return repBooking.bidExists(bid);
	}
	// for finding tutor bookings and approval status is pending
	public List<?> findTutorBookings(String tid) {
		return repBooking.bookingExist(tid);
	}

	// for updating booking status
	public boolean updateBookingStatus(Integer bid, String approvalStatus) {
		repBooking.saveUpdate(bid, approvalStatus);
		return true;
	}

	// for finding student Bookings and approval status is pending
	public List<?> findStudentBookings(Integer sid) {
		return repBooking.findStudentBookings(sid);
	}

	// for finding student Bookings and approval status is accepted
	public List<?> fetchApprovedList(Integer sid) {
		System.out.println(repBooking.fetchApprovedList(sid));
		return repBooking.fetchApprovedList(sid);

	}

	// for finding tutor Bookings and approval status is accepted
	public List<?> fetchApprovedListTutor(Integer tid) {
		System.out.println(repBooking.fetchApprovedList(tid));
		return repBooking.fetchApprovedListTutor(tid);

	}

	// for fetching live meetings list of tutor
	public List<?> fetchLiveMeetingListTutor(Integer tid) {
		return repBooking.fetchLiveMeetingListTutor(tid);
	}

	// for fetching live meeting list of student
	public List<?> fetchLiveMeetingListStudent(Integer sid) {
		return repBooking.fetchLiveMeetingListStudent(sid);
	}

	// for fetching all bookings for tutor except pending
	public List<?> fetchAllTutorBookings(Integer tid) {
		return repBooking.fetchAllTutorBookings(tid);
	}

	// for fetching all bookings of student except pending
	public List<?> fetchAllStudentBookings(Integer sid) {
		return repBooking.fetchAllStudentBookings(sid);
	}

	// for deleting the booking if it is not accepted by the teacher
	public boolean deleteMyBooking(Integer bookingId) {
		System.out.println(bookingId);
		if(repBooking.deleteMyBooking(bookingId)==1) {
			return true;
		}else {
			return false;
		}
		
	}
}
