package fG.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import fG.Entity.LearningAreasCount;

@Repository
public interface repositoryLearningAreasCount extends JpaRepository<LearningAreasCount, String> {

	@Modifying
	@Transactional
	@Query(value ="UPDATE learning_areas_count SET count = count +1 WHERE learning_area =?1" ,nativeQuery =true)
	void learningAreasCount(String learnAreas);
	
}
