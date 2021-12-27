package fG.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import fG.Entity.LearningAreas;

@Repository
public interface repositoryLearningAreas extends JpaRepository<LearningAreas, Long> {
	
	@Transactional
 	@Modifying 
    @Query(value = "DELETE FROM learning_areas WHERE user_id = ?1 AND subject =?2",nativeQuery = true) // if want to write nativequery then mask nativeQuery  as true
    int deleteSubject(int userId,String subject);
}
