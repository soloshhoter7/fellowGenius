package fG.Repository;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import fG.Entity.BookingDetails;

@Repository
public interface repositoryBooking extends JpaRepository<BookingDetails,Integer>{
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
}

