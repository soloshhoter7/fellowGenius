package fG.Entity;

import fG.Enum.CouponEligibleConsumers;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Coupon {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(
            name = "UUID",
            strategy = "org.hibernate.id.UUIDGenerator"
    )
    @Column(name = "couponId",length = 16,updatable = false, nullable = false)
    private UUID couponId;

    private String code;

    @Column(length = 1000)
    private String description;

    private Date startDate;

    private Date endDate;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name="created_date",updatable=false)
    final Date createdDate= new Date();

    private String host;

    private String privilegesJSON;

    @OneToMany(cascade = CascadeType.MERGE, fetch = FetchType.LAZY)
    @LazyCollection(LazyCollectionOption.FALSE)
    private List<CouponCondition> couponCondition=new ArrayList<>();

    @Enumerated(EnumType.STRING)
    private CouponEligibleConsumers couponEligibleConsumers;

    private int couponConsumersCount;
}
