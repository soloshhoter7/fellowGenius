package fG.Mapper;

import fG.Entity.Event;
import fG.Entity.Users;
import fG.Model.EventModel;
import fG.Repository.repositoryTutorProfileDetails;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.nio.charset.StandardCharsets;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Mapper(componentModel="spring")
public abstract class EventMapper {

    @Autowired
    private BCryptPasswordEncoder encoder;

    @Autowired
    private repositoryTutorProfileDetails repTutorProfileDetails;

    @Mapping(target = "eventStartTime",source = "eventStartTime",qualifiedByName = "parseDate")
    @Mapping(target = "eventEndTime",source="eventEndTime",qualifiedByName = "parseDate")
    @Mapping(target = "eventType",expression = "java(fG.Enum.EventType.WEBINAR)")
    @Mapping(target = "eventStatus",expression = "java(fG.Enum.EventStatus.UPCOMING)")
    @Mapping(target="eventId",source = "eventId",qualifiedByName = "StringToUUID")
    public abstract Event DtoToEntity(EventModel eventDto);

    @Mapping(target = "eventStartTime",source = "eventStartTime",qualifiedByName = "parseDateToString")
    @Mapping(target = "eventEndTime",source="eventEndTime",qualifiedByName = "parseDateToString")
    @Mapping(target="eventId",source = "eventId",qualifiedByName = "UUIDToString")
    @Mapping(target="hostUserId",source ="hosts",qualifiedByName = "setHostId")

    public abstract EventModel EntityToDto(Event event);

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
    @Named("setHostId")
    public String setHostId(List<Users> hosts){
        if(hosts.size()>0){
            return repTutorProfileDetails.idExist(hosts.get(0).getUserId()).getBookingId().toString();
        }
        return "";
    }
    @Named("parseDateToString")
    public String parseDateToString(Date date){
        SimpleDateFormat dateformat= new SimpleDateFormat("dd/MM/yyyy hh:mm:ss");

        String stringDate=dateformat.format(date);

        return stringDate;
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
