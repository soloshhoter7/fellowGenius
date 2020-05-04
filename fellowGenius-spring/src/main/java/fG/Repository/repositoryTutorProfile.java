package fG.Repository;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import fG.Entity.TutorProfile;

@Repository
public interface repositoryTutorProfile extends JpaRepository<TutorProfile, Integer>{

	@Query(value="SELECT * FROM tutor_profile where email =?1", nativeQuery =true)
	TutorProfile emailExist(String email);

	@Query(value = "SELECT * FROM tutor_profile WHERE sid=?1", nativeQuery = true)
	TutorProfile idExist(Integer tid);

	@Transactional
	@Modifying
	@Query(value = "UPDATE tutor_profile SET fullname=?1, email=?2, contact=?3, dob=?4, address_line1=?5, address_line2=?6, country=?7, state=?8, profile_picture_url=?9,city=?10 WHERE tid=?11", nativeQuery = true)
	public void updateBasicInfo(String fullname, String email, String contact, 
			String dob, String address1, String address2, String country,
			String state, String profile_Picture_url,String city, Integer tid);

}
