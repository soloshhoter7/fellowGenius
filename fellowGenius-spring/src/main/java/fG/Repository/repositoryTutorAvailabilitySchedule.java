package fG.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import fG.Entity.TutorAvailabilitySchedule;

@Repository
public interface repositoryTutorAvailabilitySchedule extends JpaRepository<TutorAvailabilitySchedule,Integer> {

	@Query(value = "SELECT * FROM tutor_availability_schedule WHERE tid=?1", nativeQuery = true)
	TutorAvailabilitySchedule idExist(Integer tid);
	
}
