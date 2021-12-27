package fG.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import fG.Entity.RefundBookings;

@Repository
public interface repositoryRefundBookings extends JpaRepository<RefundBookings,Integer>{

}
