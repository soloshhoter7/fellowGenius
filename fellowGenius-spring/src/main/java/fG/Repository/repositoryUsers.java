package fG.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import fG.Entity.Users;

public interface repositoryUsers extends JpaRepository<Users,String> {
	@Query(value = "SELECT * FROM users WHERE email=?1", nativeQuery = true)   
	Users emailExist(String email);

	@Query(value = "SELECT * FROM users WHERE user_id=?1", nativeQuery = true)
	Users idExists(Integer userId);
}

