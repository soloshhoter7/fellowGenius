package fG.Mapper;

import fG.Entity.BookingDetails;
import fG.Model.BookingDetailsModel;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.text.SimpleDateFormat;

@Mapper(componentModel="spring")
public abstract class BookingDetailsMapper {

    @Mapping(target="creationTime",source = "bookingDetails",
            qualifiedByName = "getBookingCreationTime" )
    @Mapping(target = "startTime",source="bookingDetails",
    qualifiedByName = "getStartTime")
    @Mapping(target = "endTime",source="bookingDetails",
            qualifiedByName = "getEndTime")
    @Mapping(target="expertJoinTime",source = "bookingDetails",
    qualifiedByName = "getExpertJoinTime")
    @Mapping(target="expertLeavingTime",source = "bookingDetails",
            qualifiedByName = "getExpertLeavingTime")
    @Mapping(target = "learnerJoinTime",source = "bookingDetails",
    qualifiedByName = "getLearnerJoinTime")
    @Mapping(target="learnerLeavingTime",source="bookingDetails",
    qualifiedByName = "getLearnerLeavingTime")
    public abstract BookingDetailsModel EntityToDto(BookingDetails bookingDetails);

    public abstract BookingDetails DtoToEntity(BookingDetailsModel bookingDetailsModel);

    @Named("getBookingCreationTime")
    public String getBookingCreationTime(BookingDetails bookingDetails){
        SimpleDateFormat sdf = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");
        return sdf.format(bookingDetails.getCreatedDate());
    }

    @Named("getStartTime")
    public String getStartTime(BookingDetails bookingDetails){
        return bookingDetails.getStartTimeHour()+":"+bookingDetails.getStartTimeMinute();
    }

    @Named("getEndTime")
    public String getEndTime(BookingDetails bookingDetails){
        return bookingDetails.getEndTimeHour()+":"+bookingDetails.getEndTimeHour();
    }

    @Named("getExpertJoinTime")
    public String getExpertJoinTime(BookingDetails bookingDetails){
        SimpleDateFormat sdf = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");
        if (bookingDetails.getExpertJoinTime() != null) {
            return sdf.format(bookingDetails.getExpertJoinTime());
        }else{
            return null;
        }
    }

    @Named("getExpertLeavingTime")
    public String getExpertLeavingTime(BookingDetails bookingDetails){
        SimpleDateFormat sdf = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");
        if (bookingDetails.getExpertLeavingTime() != null) {
            return sdf.format(bookingDetails.getExpertLeavingTime());
        }else{
            return null;
        }
    }

    @Named("getLearnerJoinTime")
    public String getLearnerJoinTime(BookingDetails bookingDetails){
        SimpleDateFormat sdf = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");
        if (bookingDetails.getLearnerJoinTime() != null) {
            return sdf.format(bookingDetails.getLearnerJoinTime());
        }else{
            return null;
        }
    }

    @Named("getLearnerLeavingTime")
    public String getLearnerLeavingTime(BookingDetails bookingDetails){
        SimpleDateFormat sdf = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");
        if (bookingDetails.getLearnerLeavingTime() != null) {
            return sdf.format(bookingDetails.getLearnerLeavingTime());
        }else{
            return null;
        }
    }
}
