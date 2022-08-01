package fG.Repository;

import java.time.LocalDateTime;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import fG.Entity.BookingDetails;
import fG.Entity.UserActivity;

@Repository
public interface repositoryBooking extends JpaRepository<BookingDetails,Integer>{
	
	@Query(value = "SELECT * FROM booking_details WHERE created_date > now() - interval 1 week", nativeQuery = true)   
	List<BookingDetails> findLast1WeekMeetings();
	
	@Query(value = "SELECT * FROM booking_details WHERE created_date > now() - interval 24 hour", nativeQuery = true)   
	List<BookingDetails> findTodayMeetings();
	
	@Query(value = "SELECT * FROM booking_details WHERE created_date > now() - interval 1 month", nativeQuery = true)   
	List<BookingDetails> findLast1MonthMeetings();
	
	@Query(value = "SELECT * FROM booking_details WHERE bid=?1",nativeQuery=true)
	BookingDetails bidExists(Integer bid);
	
	@Query(value = "SELECT * FROM booking_details WHERE meeting_id=?1",nativeQuery=true)
	BookingDetails meetingIdExists(String id);
	
	@Query(value = "SELECT * FROM booking_details WHERE tutor_id=?1 AND approval_status='Pending'", nativeQuery = true)   
	List<BookingDetails> bookingExist(String tutorId);
	
	@Transactional
	@Modifying
	@Query(value = "UPDATE booking_details SET approval_status=?2 WHERE bid=?1", nativeQuery = true)
	public void saveUpdate(Integer bid,String approvalStatus);

	@Query(value= "SELECT * FROM booking_details WHERE student_id=?1 AND approval_status='Pending'", nativeQuery=true)
	List<BookingDetails> findStudentBookings(Integer sid);

	@Query(value= "SELECT * FROM booking_details WHERE student_id=?1 AND approval_status='Accepted'", nativeQuery=true)
	List<BookingDetails> fetchApprovedList(Integer sid);
	
	@Query(value= "SELECT * FROM booking_details WHERE tutor_id=?1 AND approval_status='Accepted'", nativeQuery=true)
	List<BookingDetails> fetchApprovedListTutor(Integer tid);

	@Query(value= "SELECT * FROM booking_details WHERE tutor_id=?1 AND approval_status='live'", nativeQuery=true)
	List<BookingDetails> fetchLiveMeetingListTutor(Integer tid);
    
	@Query(value= "SELECT * FROM booking_details WHERE student_id=?1 AND approval_status='live'", nativeQuery=true)
	List<BookingDetails> fetchLiveMeetingListStudent(Integer sid);

	@Query(value= "SELECT * FROM booking_details WHERE tutor_id=?1 AND NOT approval_status='Pending'", nativeQuery=true)
	List<BookingDetails> fetchAllTutorBookings(Integer tid);
	
	@Query(value= "SELECT * FROM booking_details WHERE tutor_id=?1 AND NOT approval_status='cancelled'", nativeQuery=true)
	List<BookingDetails> findAllTutorBookings(Integer tid);
	@Query(value= "SELECT * FROM booking_details WHERE student_id=?1 AND NOT approval_status='Pending'", nativeQuery=true)
	List<BookingDetails> fetchAllStudentBookings(Integer sid);

	@Transactional
	@Modifying
	@Query(value = "UPDATE booking_details SET approval_status='cancelled' WHERE bid=?1", nativeQuery = true)
	Integer deleteMyBooking(Integer bookingId);

	@Transactional
	@Modifying
	@Query(value="DELETE FROM booking_details WHERE bid=?1",nativeQuery = true)
	void deleteBooking(Integer bookingId);
	
	@Query(value= "SELECT * FROM booking_details WHERE student_id=?1", nativeQuery=true)
	List<BookingDetails> fetchAllLinkedTutors(Integer userId);

	@Query(value= "SELECT * FROM booking_details WHERE student_id=?1 &&  NOT (approval_status='Pending' OR approval_status='Accepted') && rating = 0", nativeQuery=true)
	List<BookingDetails> fetchPendingReviewsList(Integer studentId);
	
	@Query(value= "SELECT * FROM booking_details WHERE student_id=?1 &&  NOT (approval_status='Pending' OR approval_status='Accepted')", nativeQuery=true)
	List<BookingDetails> fetchCompletedBookingStudent(Integer studentId);
	
	@Query(value= "SELECT * FROM booking_details WHERE tutor_id=?1 &&  NOT (approval_status='Pending' OR approval_status='Accepted')", nativeQuery=true)
	List<BookingDetails> fetchCompletedBookingExpert(Integer tid);
	
	@Query(value= "SELECT * FROM booking_details WHERE tutor_id=?1 &&  NOT approval_status='Pending' && NOT (rating = 0 OR rating = -1)", nativeQuery=true)
	List<BookingDetails> fetchExpertRecentReviews(Integer tutorId);

	@Query(value= "SELECT * FROM booking_details WHERE tutor_id=?1 && NOT (approval_status='Pending' OR approval_status='cancelled') && created_date BETWEEN ?2 and ?3", nativeQuery=true)
	List<BookingDetails> fetchExpertMeetingsBetweenTwoDates(Integer tid,LocalDateTime start,LocalDateTime end);
	
	@Query(value= "SELECT * FROM booking_details WHERE date_of_meeting=?1", nativeQuery=true)
	List<BookingDetails> fetchBookingsForDate(String date);
	
	@Transactional
	@Modifying
	@Query(value = "UPDATE booking_details SET rating=?2, review_text=?3 WHERE meeting_id=?1", nativeQuery = true)
	void saveTutorRatings(String meetingId, Integer rating, String reviewText);

}

