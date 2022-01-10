package fG.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import fG.Entity.ReferralActivity;

public interface repositoryReferralActivity extends JpaRepository<ReferralActivity, Integer> {
	
	@Query(value = "SELECT * FROM referral_activity WHERE type='MAIL' ", nativeQuery = true)
	List<ReferralActivity> findAllMailActivities();

	@Query(value = "SELECT * FROM referral_activity WHERE type='LINKEDIN' ", nativeQuery = true)
	List<ReferralActivity> findAllLinkedinActivities();
	
	@Query(value = "SELECT * FROM referral_activity WHERE type='WHATSAPP' ", nativeQuery = true)
	List<ReferralActivity> findAllWhatsappActivities();
	
	
}
