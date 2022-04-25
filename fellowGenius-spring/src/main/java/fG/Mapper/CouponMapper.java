package fG.Mapper;

import com.google.gson.Gson;
import fG.Entity.Coupon;
import fG.Entity.CouponCondition;
import fG.Entity.Event;
import fG.Model.*;
import fG.Repository.repositoryCouponCondition;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.springframework.beans.factory.annotation.Autowired;

import java.nio.charset.StandardCharsets;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Mapper(componentModel="spring")
public abstract class CouponMapper {

    @Autowired
    private repositoryCouponCondition repositoryCouponCondition;

    @Mapping(target = "code",source = "couponCode")
    @Mapping(target = "startDate",source = "startDate",qualifiedByName = "parseDate")
    @Mapping(target = "endDate",source = "endDate",qualifiedByName = "parseDate")
    @Mapping(target = "privilegesJSON",source = "couponPrivileges",qualifiedByName = "JSONToString")
    @Mapping(target = "couponCondition",source = "couponConditions",qualifiedByName = "parseCouponConditions")
    @Mapping(target="couponConsumersCount",source="consumersCount",defaultValue = "0")
    public abstract Coupon DtoToEntity(CouponPayload couponDto);

    @Named("JSONToString")
    public String JSONToString(List<CouponPrivileges> couponPrivileges){

        return new Gson().toJson(couponPrivileges);
    }
    @Named("parseDate")
    public Date parseDate(String stringDate){

        SimpleDateFormat dateformat= new SimpleDateFormat("dd/MM/yyyy hh:mm:ss");
        Date date=null;
        try {
            date= dateformat.parse(stringDate);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return date;
    }

    @Named("parseDateToString")
    public String parseDateToString(Date date){
        SimpleDateFormat dateformat= new SimpleDateFormat("dd/MM/yyyy hh:mm:ss");

        String stringDate=dateformat.format(date);

        return stringDate;
    }

    @Named("parseCouponConditions")
    public List<CouponCondition> parseCouponConditions(CouponConditionPayload[] couponConditionModelList){
        List<CouponCondition> couponConditionList=new ArrayList<>();
        for(CouponConditionPayload couponConditionModel:couponConditionModelList){
            CouponCondition couponCondition=new CouponCondition();
            couponCondition.setConditionType(couponConditionModel.getCouponConditionType());
            couponCondition.setValue(couponConditionModel.getValue());
            CouponCondition savedCouponCondition= repositoryCouponCondition.save(couponCondition);
            couponConditionList.add(savedCouponCondition);
        }
        return couponConditionList;
    }



    @Named("StringToUUID")
    public UUID stringToUUID(String eventId){
        UUID eventid=UUID.nameUUIDFromBytes(eventId.getBytes(StandardCharsets.UTF_8));
        return eventid;
    }

    @Named("UUIDToString")
    public String UUIDToString(UUID eventID){
        String eventId=eventID.toString();
        return eventId;
    }



}
