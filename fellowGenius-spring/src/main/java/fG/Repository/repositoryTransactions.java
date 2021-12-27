package fG.Repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import fG.Entity.Transactions;

public interface repositoryTransactions extends JpaRepository<Transactions, UUID> {

}
