package fG.Model;

import fG.Enum.CouponEligibleConsumers;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class CouponPayload {

    private String couponCode;

    private String description;

    private String startDate; //dd/mm/yyyy hh:mm:ss

    private String endDate;

    private String host;

    private CouponConditionPayload[] couponConditions;

    private List<CouponPrivileges> couponPrivileges;

    private CouponEligibleConsumers couponEligibleConsumers;

}
