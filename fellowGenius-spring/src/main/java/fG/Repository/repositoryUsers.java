package fG.Repository;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import fG.Entity.Users;

public interface repositoryUsers extends JpaRepository<Users,String> {
	@Query(value = "SELECT * FROM users WHERE email=?1", nativeQuery = true)   
	Users emailExist(String email);

	@Query(value = "SELECT * FROM users WHERE user_id=?1", nativeQuery = true)
	Users idExists(Integer userId);
	
	@Transactional
	@Modifying
	@Query(value ="UPDATE users SET password=?2 where user_id =?1", nativeQuery = true)
	int updatePassword(Integer userId, String newPassword);
	
	@Query(value = "SELECT * FROM users where CONCAT(user_id, '') like %:lastFourDigits", nativeQuery = true)
	List<Users> findByLast4Digits(String lastFourDigits);
}

