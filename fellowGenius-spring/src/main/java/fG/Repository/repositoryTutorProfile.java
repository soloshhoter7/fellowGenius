package fG.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import fG.Entity.TutorProfile;

@Repository
public interface repositoryTutorProfile extends JpaRepository<TutorProfile, Integer>{

	@Query(value="SELECT * FROM tutor_profile where email =?1", nativeQuery =true)
	TutorProfile emailExist(String email);

	@Query(value = "SELECT * FROM tutor_profile WHERE sid=?1", nativeQuery = true)
	TutorProfile idExist(Integer tid);
}
