package fG.Model;

import fG.Enum.CouponConditionType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class CouponConditionPayload {

    private CouponConditionType couponConditionType;

    private String value;

}
