package fG.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import fG.Entity.TutorLogin;

@Repository
public interface repositoryTutorLogin extends JpaRepository<TutorLogin, String> {

	@Query(value = "SELECT * FROM tutor_login WHERE email=?1", nativeQuery = true)   
	TutorLogin emailExist(String email);

	@Query(value = "SELECT * FROM tutor_login WHERE email=?1 AND password=?2", nativeQuery = true)
	TutorLogin validation(String email, String password);

}
