package fG.Controller;


import fG.Model.CouponPayload;
import fG.Model.CouponResponse;
import fG.Service.CouponService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/fellowGenius/coupon")
public class CouponController {

    @Autowired
    private CouponService couponService;

    @PostMapping(value="/create")
    public CouponResponse CreateCoupon(@RequestBody CouponPayload couponPayload){
        return couponService.createCoupon(couponPayload);

    }

    @GetMapping(value = "/fetchAllCoupons")
    public List<CouponResponse> fetchAllCoupons(){
        return couponService.fetchAllCoupons();
    }

    @GetMapping(value = "/fetchSelectiveCoupons")
    public List<CouponResponse> fetchSelectiveCoupons(String userId){
        return couponService.fetchSelectiveCoupons(userId);
    }


}
