package fG.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import fG.Entity.Notification;
@Repository
public interface repositoryNotification extends JpaRepository<Notification,Integer> {
	@Query(value = "SELECT * FROM notification WHERE notifier_id=?1", nativeQuery = true)   
	List<Notification> notificationExist(String userId);
}
