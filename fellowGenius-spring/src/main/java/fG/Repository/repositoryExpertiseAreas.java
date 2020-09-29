package fG.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import fG.Entity.ExpertiseAreas;
import fG.Entity.TutorProfile;
import fG.Entity.TutorProfileDetails;

@Repository
public interface repositoryExpertiseAreas extends JpaRepository<ExpertiseAreas,Long> {
		@Transactional
	 	@Modifying 
	    @Query(value = "DELETE FROM expertise_areas WHERE user_id = ?1 AND subject =?2",nativeQuery = true) // if want to write nativequery then mask nativeQuery  as true
	    int deleteSubject(int userId,String subject);

//		@Query(value = "SELECT * from expertise_areas WHERE subject = ?1", nativeQuery = true)
//		ExpertiseAreas searchBySubject(String subject);
		
		@Query(value = "SELECT * from expertise_areas WHERE subject = ?1", nativeQuery = true)
		List<ExpertiseAreas> searchBySubject(String subject);
		
		@Query(value = "SELECT * from expertise_areas WHERE subject = ?1", nativeQuery = true)
		List<ExpertiseAreas> searchSubject(String subject);

		//Search By price using id
		@Query(value = "SELECT * from expertise_areas WHERE id = ?3 AND price BETWEEN ?1 AND ?2", nativeQuery = true)
		ExpertiseAreas searchByPrice(Integer lowerValue, Integer higherValue, Long id);
		
		//Search By price without id
		@Query(value = "SELECT * from expertise_areas WHERE price BETWEEN ?1 AND ?2", nativeQuery = true)
		List<ExpertiseAreas> searchPrice(Integer lowerValue, Integer higherValue);

		@Query(value = "SELECT user_id from expertise_areas WHERE subject = ?1", nativeQuery = true)
		TutorProfileDetails searchBySubjectTutors(String subject);

}
