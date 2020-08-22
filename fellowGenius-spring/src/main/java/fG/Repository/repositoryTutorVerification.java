package fG.Repository;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import fG.Entity.TutorVerification;

@Repository
public interface repositoryTutorVerification extends JpaRepository<TutorVerification, Integer> {
	@Transactional
	@Modifying
	@Query(value = "UPDATE tutor_verification SET country=?1,state=?2,id_type=?3,id_number=?4,id_doc_url=?5,education_type=?6,education_institution=?7,field_of_study=?8,education_doc_url=?9 WHERE tid=?10", nativeQuery = true)
	public void updateTutorVerification(String country, String state, String idType, 
			String idNumber, String idDocUrl, String educationType, String educationInstitution,
			String fieldOfStudy, String educationDocUrl , Integer tid);

}
