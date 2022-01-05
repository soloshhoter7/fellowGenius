package fG.Repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import fG.Entity.Transactions;
import fG.Entity.UserReferrals;

public interface repositoryTransactions extends JpaRepository<Transactions, UUID> {

	@Query(value = "SELECT * FROM transactions WHERE user_id=?1", nativeQuery = true) 
	Transactions findByUserId(Integer userId);
}
