package fG.Entity;

import fG.Enum.CouponConditionType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.*;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class CouponCondition {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer couponConditionId;

    @Enumerated(EnumType.STRING)
    private CouponConditionType conditionType;

    private String value;


}
