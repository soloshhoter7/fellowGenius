package fG.Repository;

import java.util.ArrayList;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import fG.Entity.TutorProfileDetails;

@Repository
public interface repositoryTutorProfileDetails extends JpaRepository<TutorProfileDetails, Integer>{
	
	@Transactional
	@Modifying
	@Query(value = "UPDATE tutor_profile_details SET full_name=?1,subject1=?2,subject2=?3,subject3=?4,price1=?5,price2=?6,price3=?7,study_institution=?8,major_subject=?9,graduation_year=?10,work_title=?11,work_institution=?12,description=?13,rating=?14,review_count=?15,lesson_completed=?16,profile_picture_url=?17,profile_completed=?18,grade_level=?19 WHERE tid=?20", nativeQuery = true)
    void saveUpdate(String fullName, String subject1,
                    String subject2, String subject3, String price1, String price2, String price3,
                    String studyInstitution, String majorSubject, String graduationYear,
                    String workTitle, String workInstitution, String description, Integer rating,
                    Integer reviewCount, Integer lessonCompleted, String profilePictureUrl, Integer profileCompleted,
                    String gradeLevel,
                    Integer tid);
   
	@Query(value = "SELECT * FROM tutor_profile_details WHERE tid=?1", nativeQuery = true)
	TutorProfileDetails idExist(Integer tid);
	
	@Query(value = "SELECT * FROM tutor_profile_details WHERE booking_id=?1", nativeQuery = true)
	TutorProfileDetails bookingIdExist(Integer bookingId);
	
	@Transactional
	@Modifying
	@Query(value ="UPDATE tutor_profile_details SET profile_completed=?1 where tid =?2", nativeQuery = true)
	void updateProfileCompleted(Integer profileCompleted,Integer tid);
	
	@Transactional
	@Modifying
	@Query(value ="UPDATE tutor_profile_details SET ?1 where tid =?2", nativeQuery = true)
    void saveUpdateNew(Object query, Integer tid);

	@Query(value = "SELECT * FROM tutor_profile_details WHERE rating >=90 AND profile_completed=100 AND (subject1 = ?1 OR subject2 = ?1 OR subject3 =?1)", nativeQuery = true)
    ArrayList<TutorProfileDetails> fetchTopTutorList(String subject);

	@Query(value="SELECT * FROM tutor_profile_details WHERE profile_completed = 100", nativeQuery = true)
    List<TutorProfileDetails> findAllTutors();

	@Modifying
	@Transactional
	@Query(value ="UPDATE tutor_profile_details SET review_count = review_count +1 WHERE booking_id =?1" ,nativeQuery =true)
	void updateReviewCount(Integer bookingId);

	@Query(value="SELECT * FROM tutor_profile_details WHERE rating >= ?1", nativeQuery = true)
    List<TutorProfileDetails> searchByRatings(Integer ratings);

}
