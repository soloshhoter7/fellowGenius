package fG.Repository;

import fG.Entity.Coupon;
import fG.Enum.CouponEligibleConsumers;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface repositoryCoupon extends JpaRepository<Coupon, UUID> {
    @Query(value = "SELECT * FROM coupon WHERE start_date < now() AND end_date > now()  AND coupon_eligible_consumers=?1",
            nativeQuery = true)
    List<Coupon> findCouponsByConsumers(String eligibleConsumers);

    @Query(value="SELECT * from coupon where code=?1",nativeQuery = true)
    Coupon couponCodeExists(String couponCode);
}
