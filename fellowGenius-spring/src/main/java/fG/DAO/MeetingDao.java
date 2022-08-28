package fG.DAO;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import fG.Entity.BookingDetails;
import fG.Entity.RefundBookings;
import fG.Entity.TutorProfileDetails;
import fG.Repository.repositoryBooking;
import fG.Repository.repositoryRefundBookings;
import fG.Repository.repositoryTutorProfileDetails;

@Component
public class MeetingDao {

	@Autowired
	repositoryBooking repBooking;

	@Autowired
	repositoryTutorProfileDetails repTutorProfileDetails;
	
	@Autowired 
	repositoryRefundBookings repRefundBookings;
	
	// for saving booking in database
	public BookingDetails saveBooking(BookingDetails booking) {
		BookingDetails bookedMeeting=repBooking.save(booking);
		return bookedMeeting;
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
	// for fetching all bookings that are not cancelled
	public List<?> findAllTutorBookings(Integer tid) {
		return repBooking.findAllTutorBookings(tid);
	}
	// for fetching all bookings of student except pending
	public List<?> fetchAllStudentBookings(Integer sid) {
		return repBooking.fetchAllStudentBookings(sid);
	}

	// for deleting the booking if it is not accepted by the teacher
	public boolean deleteMyBooking(Integer bookingId) {
		if(repBooking.deleteMyBooking(bookingId)==1) {
			initiateRefund(bookingId);
			return true;
		}else {
			return false;
		}
		
	}
	public void initiateRefund(Integer bookingId) {
		RefundBookings ref =new RefundBookings();
		ref.setBid(repBooking.bidExists(bookingId));
		ref.setRefundStatus("PENDING");
		repRefundBookings.save(ref);
	}
	
	public List<BookingDetails> fetchPendingReviewsList(Integer studentId) {
		return repBooking.fetchPendingReviewsList(studentId);
		
	}

	public boolean saveTutorRatings(String meetingId, Integer rating, String reviewText, Integer tid) {
		System.out.println(meetingId + ":" + rating + ":" + reviewText);
		repBooking.saveTutorRatings(meetingId, rating, reviewText);
		TutorProfileDetails tutor = repTutorProfileDetails.bookingIdExist(tid);
		System.out.println(tutor);
		if(tutor!=null) {
			Integer newRating = (tutor.getRating() + rating)/2;
			tutor.setRating(newRating);
			System.out.println(tutor);
			repTutorProfileDetails.save(tutor);	
		}
		repTutorProfileDetails.updateReviewCount(tid);
		return true;
	}
}
