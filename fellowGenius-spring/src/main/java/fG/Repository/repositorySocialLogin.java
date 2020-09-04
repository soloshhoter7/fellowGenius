package fG.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import fG.Entity.SocialLogin;

public interface repositorySocialLogin extends JpaRepository<SocialLogin, Integer>{

	
	@Query(value="SELECT * FROM social_login WHERE email=?1", nativeQuery = true)
	SocialLogin checkSocialLogin(String email);

	@Query(value="SELECT * FROM social_login WHERE id=?1", nativeQuery = true)
	SocialLogin fetchTid(String socialLoginId);
	
	@Query(value="SELECT * FROM social_login WHERE email=?1", nativeQuery = true)
	boolean emailExists(String email);

}
