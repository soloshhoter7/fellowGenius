package fG.Model;

import fG.Enum.CouponPrivilegesType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class CouponPrivileges {

    private CouponPrivilegesType couponPrivilegesType;

    private String value;
}
