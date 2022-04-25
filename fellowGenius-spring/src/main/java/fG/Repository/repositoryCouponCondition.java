package fG.Repository;

import fG.Entity.CouponCondition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface repositoryCouponCondition extends JpaRepository<CouponCondition,Integer> {
}
