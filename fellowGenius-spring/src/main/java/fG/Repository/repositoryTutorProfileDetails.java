package fG.Repository;

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
	@Query(value = "UPDATE tutor_profile_details SET name=?1, availability=?2, subject=?3, gender=?4, price=?5, college=?6, description=?7, rating=?8, reviewCount=?9, lessonCompleted=?10, profilePictureUrl=?11 WHERE tid=?12", nativeQuery = true)
	public boolean saveUpdate(String name, String availability, String subject, 
			String gender, String price, String college, String description,
			Integer rating, Integer reviewCount, Integer lessonCompleted,
			String profilePictureUrl, Integer tid);

}
