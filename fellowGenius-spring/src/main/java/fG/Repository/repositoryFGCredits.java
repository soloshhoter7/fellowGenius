package fG.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import fG.Entity.FGCredits;

public interface repositoryFGCredits extends JpaRepository<FGCredits, Integer> {

	@Query(value = "SELECT * FROM fgcredits WHERE user_id=?1", nativeQuery = true) 
	List<FGCredits> findByUserId(Integer userId);
}
