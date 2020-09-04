package fG.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import fG.Entity.StudentLogin;

@Repository
public interface repositoryStudentLogin extends JpaRepository<StudentLogin, String>{

	@Query(value = "SELECT * FROM student_login WHERE email=?1", nativeQuery = true)   
	StudentLogin emailExist(String email);
	
	@Query(value = "SELECT * FROM student_login WHERE email=?1 AND password=?2", nativeQuery = true)   
	StudentLogin validation(String email, String password);
	
	@Query(value = "SELECT * FROM student_login WHERE sid=?1", nativeQuery = true)
	StudentLogin idExists(Integer sid);

}
