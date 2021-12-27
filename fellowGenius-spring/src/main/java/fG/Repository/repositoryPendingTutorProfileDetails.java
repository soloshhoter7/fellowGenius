package fG.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import fG.Entity.Notification;
import fG.Entity.PendingTutorProfileDetails;
@Repository
public interface repositoryPendingTutorProfileDetails extends JpaRepository<PendingTutorProfileDetails,Integer> {
	@Query(value = "SELECT * FROM pending_tutor_profile_details WHERE email=?1", nativeQuery = true)   
	PendingTutorProfileDetails emailExist(String email);
	
	@Query(value = "SELECT * FROM pending_tutor_profile_details WHERE id=?1", nativeQuery = true)   
	PendingTutorProfileDetails idExist(Integer id);


}
