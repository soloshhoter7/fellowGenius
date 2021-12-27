package fG.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import fG.Entity.UserReferrals;
import fG.Entity.Users;

public interface repositoryUserReferrals extends JpaRepository<UserReferrals, Users> {
	
	@Query(value = "SELECT * FROM user_referrals WHERE user_id=?1", nativeQuery = true) 
	UserReferrals findByUserId(Integer userId);
	
	
}
