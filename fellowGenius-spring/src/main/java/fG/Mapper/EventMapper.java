package fG.Mapper;

import fG.Entity.Event;
import fG.Model.EventModel;
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
import java.util.UUID;

@Mapper(componentModel="spring")
public abstract class EventMapper {

    @Autowired
    private BCryptPasswordEncoder encoder;

    @Mapping(target = "eventStartTime",source = "eventStartTime",qualifiedByName = "parseDate")
    @Mapping(target = "eventEndTime",source="eventEndTime",qualifiedByName = "parseDate")
    @Mapping(target = "eventType",expression = "java(fG.Enum.EventType.WEBINAR)")
    @Mapping(target = "eventStatus",expression = "java(fG.Enum.EventStatus.UPCOMING)")
    @Mapping(target = "eventPassword",source = "eventPassword",qualifiedByName = "encodePassword")
    @Mapping(target="eventId",source = "eventId",qualifiedByName = "StringToUUID")
    public abstract Event DtoToEntity(EventModel eventDto);

    @Mapping(target = "eventStartTime",source = "eventStartTime",qualifiedByName = "parseDateToString")
    @Mapping(target = "eventEndTime",source="eventEndTime",qualifiedByName = "parseDateToString")
    @Mapping(target="eventId",source = "eventId",qualifiedByName = "UUIDToString")
    public abstract EventModel EntityToDto(Event event);

    @Named("parseDate")
    public Date parseDate(String eventStartTime){

        SimpleDateFormat dateformat= new SimpleDateFormat("dd/MM/yyyy hh:mm:ss");
        Date startDate=null;
        try {
            startDate= dateformat.parse(eventStartTime);
            System.out.println(startDate);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return startDate;
    }

    @Named("parseDateToString")
    public String parseDateToString(Date date){
        SimpleDateFormat dateformat= new SimpleDateFormat("dd/MM/yyyy hh:mm:ss");

        String stringDate=dateformat.format(date);

        return stringDate;
    }

    @Named("encodePassword")
    public String getPassword(String eventPassword){
        return encoder.encode(eventPassword);
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
