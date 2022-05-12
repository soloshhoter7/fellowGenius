package fG.Model;

import fG.Entity.Users;
import fG.Enum.EventStatus;
import fG.Enum.EventType;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@ToString
public class EventModel {

    private String eventId;

    private EventType eventType;

    private String eventStartTime;

    private String eventEndTime;

    private String eventTitle;

    private String eventDescription;

    private String eventLink;

    private String eventPassword;

    private String eventVenue;

    private EventStatus eventStatus;

    private String bannerUrl;

    private String hostUserId;


    public EventModel() {
    }

    public EventModel(String eventId, EventType eventType, String eventStartTime, String eventEndTime, List<Users> participants, String eventTitle, String eventDescription, String eventLink, String eventPassword, String eventVenue, List<Users> hosts, EventStatus eventStatus, String bannerUrl) {
        this.eventId = eventId;
        this.eventType = eventType;
        this.eventStartTime = eventStartTime;
        this.eventEndTime = eventEndTime;
        this.eventTitle = eventTitle;
        this.eventDescription = eventDescription;
        this.eventLink = eventLink;
        this.eventPassword = eventPassword;
        this.eventVenue = eventVenue;
        this.eventStatus = eventStatus;
        this.bannerUrl = bannerUrl;
    }
}
