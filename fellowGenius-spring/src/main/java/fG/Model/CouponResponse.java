package fG.Model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class CouponResponse {

    private String couponId;

    private String code;

    private String description;

    private String privilegesJSON;

}
