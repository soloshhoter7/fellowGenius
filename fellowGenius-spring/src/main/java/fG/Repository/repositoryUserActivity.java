package fG.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import fG.Entity.UserActivity;

public interface repositoryUserActivity extends JpaRepository<UserActivity,Integer> {
	
	@Query(value = "SELECT * FROM user_activity WHERE created_date > now() - interval 1 week AND type='login'", nativeQuery = true)   
	List<UserActivity> findLast1WeekLogins();
	
	@Query(value = "SELECT * FROM user_activity WHERE created_date > now() - interval 24 hour AND type='login'", nativeQuery = true)   
	List<UserActivity> findTodayLogins();
	
	@Query(value = "SELECT * FROM user_activity WHERE created_date > now() - interval 1 month AND type='login'", nativeQuery = true)   
	List<UserActivity> findLast1MonthLogins();
	
	@Query(value = "SELECT * FROM user_activity WHERE created_date > now() - interval 1 week AND type='signup'", nativeQuery = true)   
	List<UserActivity> findLast1WeekSignUp();
	
	@Query(value = "SELECT * FROM user_activity WHERE created_date > now() - interval 24 hour AND type='signup'", nativeQuery = true)   
	List<UserActivity> findTodaySignUp();
	
	@Query(value = "SELECT * FROM user_activity WHERE created_date > now() - interval 1 month AND type='signup'", nativeQuery = true)   
	List<UserActivity> findLast1MonthSignUp();
}
