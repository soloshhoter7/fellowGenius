package fG.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import fG.Entity.StudentProfile;

@Repository
public interface repositoryStudentProfile extends JpaRepository<StudentProfile, Integer> {	

	@Query(value = "SELECT * FROM student_profile WHERE email=?1", nativeQuery = true)   
	StudentProfile emailExist(String email);
	
	@Query(value = "SELECT * FROM student_profile WHERE sid=?1", nativeQuery = true)
	StudentProfile idExist(Integer id);
	
}
