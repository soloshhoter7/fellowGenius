package fG.Repository;

import java.util.ArrayList;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import fG.Entity.TutorAvailabilitySchedule;

@Repository
public interface repositoryTutorAvailabilitySchedule extends JpaRepository<TutorAvailabilitySchedule,Integer> {

	@Query(value = "SELECT * FROM tutor_availability_schedule WHERE tid=?1", nativeQuery = true)
	TutorAvailabilitySchedule idExist(Integer tid);

	@Transactional
	@Modifying
	@Query(value = "UPDATE tutor_availability_schedule SET is_available=?1 WHERE tid=?2", nativeQuery = true)
	void changeAvailabilityStatus(String availabilityStatus, int tid);

	@Query(value = "SELECT * FROM tutor_availability_schedule WHERE tid=?1 AND is_available='yes'", nativeQuery = true)
	TutorAvailabilitySchedule fetchAvailableTutor(Integer tid);
}
