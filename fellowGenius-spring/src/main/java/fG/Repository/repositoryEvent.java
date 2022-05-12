package fG.Repository;

import fG.Entity.Coupon;
import fG.Entity.Event;
import fG.Entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface repositoryEvent extends JpaRepository<Event, UUID> {
	@Query(value = "SELECT * FROM event WHERE event_start_time > now() ",
            nativeQuery = true)
    List<Event> findUpcomingEvents();

}
