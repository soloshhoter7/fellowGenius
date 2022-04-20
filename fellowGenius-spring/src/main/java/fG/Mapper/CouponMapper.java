package fG.Mapper;

import fG.Entity.Coupon;
import fG.Entity.Event;
import fG.Model.CouponPayload;
import fG.Model.EventModel;
import org.mapstruct.Mapper;

@Mapper(componentModel="spring")
public abstract class CouponMapper {


    public abstract Coupon DtoToEntity(CouponPayload couponDto);
}
