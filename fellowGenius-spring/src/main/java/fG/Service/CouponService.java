package fG.Service;

import com.google.gson.Gson;
import fG.Entity.BookingDetails;
import fG.Entity.Coupon;
import fG.Entity.CouponCondition;
import fG.Entity.StudentProfile;
import fG.Enum.CouponEligibleConsumers;
import fG.Model.CouponConditionPayload;
import fG.Model.CouponPayload;
import fG.Model.CouponPrivileges;
import fG.Model.CouponResponse;
import fG.Repository.repositoryCoupon;
import fG.Repository.repositoryCouponCondition;
import fG.Repository.repositoryStudentProfile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CouponService {

    @Autowired
    repositoryCoupon repCoupon;

    @Autowired
    repositoryStudentProfile repStudentProfile;

    @Autowired
    repositoryCouponCondition repositoryCouponCondition;

    public CouponResponse createCoupon(CouponPayload couponPayload) {
        CouponResponse couponResponse=new CouponResponse();
        Coupon coupon=PayloadToEntity(couponPayload);
        if(repCoupon.couponCodeExists(coupon.getCode())==null){
            Coupon savedCoupon=repCoupon.save(coupon);
            couponResponse=couponToDto(savedCoupon);
        }

        return couponResponse;
    }

    public Coupon PayloadToEntity(CouponPayload couponPayload){
        Coupon coupon=new Coupon();
        coupon.setCode(couponPayload.getCouponCode());
        coupon.setDescription(couponPayload.getDescription());
        coupon.setStartDate(StringToDate(couponPayload.getStartDate()));
        coupon.setEndDate(StringToDate(couponPayload.getEndDate()));
        coupon.setHost(couponPayload.getHost());


        List<CouponPrivileges> couponPrivilegesList=couponPayload.getCouponPrivileges();

        coupon.setPrivilegesJSON(new Gson().toJson(couponPrivilegesList));

        CouponConditionPayload[] couponConditionModelList=couponPayload.getCouponConditions();
        List<CouponCondition> couponConditionList=new ArrayList<>();
        for(CouponConditionPayload couponConditionModel:couponConditionModelList){
            CouponCondition couponCondition=new CouponCondition();
            couponCondition.setConditionType(couponConditionModel.getCouponConditionType());
            couponCondition.setValue(couponConditionModel.getValue());
            CouponCondition savedCouponCondition=repositoryCouponCondition.save(couponCondition);
            couponConditionList.add(savedCouponCondition);
        }

        coupon.setCouponCondition(couponConditionList);

        coupon.setCouponEligibleConsumers(couponPayload.getCouponEligibleConsumers());

        coupon.setCouponConsumersCount(0);

        return coupon;
    }

    public Date StringToDate(String stringDate){

        SimpleDateFormat dateformat= new SimpleDateFormat("dd/MM/yyyy hh:mm:ss");
        Date date=null;
        try {
            date= dateformat.parse(stringDate);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return date;
    }

    public List<CouponResponse> fetchAllCoupons(){
        List<CouponResponse> couponResponses;
        List<Coupon> couponsListsAll=repCoupon.findCouponsByConsumers(CouponEligibleConsumers.ALL.toString());
        couponResponses=couponsListsAll.stream().map(this::couponToDto).collect(Collectors.toList());
        return couponResponses;
    }

    public List<CouponResponse> fetchSelectiveCoupons(String userId) {
        List<Coupon> couponsList=new ArrayList<>();
        List<CouponResponse> couponResponses;
        List<Coupon> couponsListValidSelective=repCoupon.findCouponsByConsumers(CouponEligibleConsumers.SELECTIVE.toString());
        for(Coupon coupon: couponsListValidSelective){
                    //check for conditions
                    List<CouponCondition> couponConditions=coupon.getCouponCondition();
                    boolean flag=true;
                    for(CouponCondition couponCondition:couponConditions){
                        if ("NUMBEROFBOOKINGS".equals(couponCondition.getConditionType().toString())) {
                            //check if no of bookings is equal to value given
                            StudentProfile studentProfile = repStudentProfile.idExist(Integer.valueOf(userId));
                            if (studentProfile.getLessonCompleted() > Integer.parseInt(couponCondition.getValue())) {
                                flag = false;
                            }
                        }
                    }
                    if(flag){ //it means conditions are checked

                        couponsList.add(coupon);
                    }
                }

        couponResponses=couponsList.stream().map(this::couponToDto).collect(Collectors.toList());
        return couponResponses;
    }

    public CouponResponse couponToDto(Coupon coupon){

        CouponResponse couponResponse=new CouponResponse();
        couponResponse.setCouponId(coupon.getCouponId().toString());
        couponResponse.setCode(coupon.getCode());
        couponResponse.setDescription(coupon.getDescription());
        couponResponse.setPrivilegesJSON(coupon.getPrivilegesJSON());

        return couponResponse;
    }

    public void incrementConsumerCount(String couponId){

        Coupon coupon=repCoupon.findById(UUID.fromString(couponId)).get();

        coupon.setCouponConsumersCount(coupon.getCouponConsumersCount()+1);
        repCoupon.save(coupon);

    }

    public void deleteCouponById(String couponId) {

        Coupon coupon=repCoupon.findById(UUID.fromString(couponId)).get();

        repCoupon.delete(coupon);
    }

}
