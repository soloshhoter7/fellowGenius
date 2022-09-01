package fG.Entity;

import fG.Enum.EventStatus;
import fG.Enum.EventType;
import lombok.Data;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

import java.util.ArrayList;
import java.util.Date;
import javax.persistence.*;
import java.util.List;
import java.util.UUID;

@Entity
@Data
public class Event {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(
            name = "UUID",
            strategy = "org.hibernate.id.UUIDGenerator"
    )
    @Column(name = "eventId",length=16,updatable = false, nullable = false)
    private UUID eventId;

    @Enumerated(EnumType.STRING)
    private EventType eventType;

    private Date eventStartTime;

    private Date eventEndTime;

    @OneToMany(cascade = CascadeType.MERGE, fetch = FetchType.LAZY)
    @LazyCollection(LazyCollectionOption.FALSE)
    private List<Users> participants = new ArrayList<>();

    private String eventTitle;

    private String eventDescription;

    private String eventLink;

    private String eventPassword;

    private String eventVenue;

    @OneToMany(cascade = CascadeType.MERGE, fetch = FetchType.LAZY)
    @LazyCollection(LazyCollectionOption.FALSE)
    private List<Users> hosts = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    private EventStatus eventStatus;

    private String bannerUrl;

    private String eventDomain;
    public Event() {
    }

    public Event(UUID eventId, EventType eventType, Date eventStartTime, Date eventEndTime, List<Users> participants, String eventTitle, String eventDescription, String eventLink, String eventPassword, String eventVenue, List<Users> hosts, EventStatus eventStatus, String bannerUrl, String eventDomain) {
        this.eventId = eventId;
        this.eventType = eventType;
        this.eventStartTime = eventStartTime;
        this.eventEndTime = eventEndTime;
        this.participants = participants;
        this.eventTitle = eventTitle;
        this.eventDescription = eventDescription;
        this.eventLink = eventLink;
        this.eventPassword = eventPassword;
        this.eventVenue = eventVenue;
        this.hosts = hosts;
        this.eventStatus = eventStatus;
        this.bannerUrl = bannerUrl;
        this.eventDomain = eventDomain;
    }

    @Override
    public String toString() {
        return "Event{" +
                "eventId=" + eventId +
                ", eventType=" + eventType +
                ", eventStartTime=" + eventStartTime +
                ", eventEndTime=" + eventEndTime +
                ", participants=" + participants +
                ", eventTitle='" + eventTitle + '\'' +
                ", eventDescription='" + eventDescription + '\'' +
                ", eventLink='" + eventLink + '\'' +
                ", eventPassword='" + eventPassword + '\'' +
                ", eventVenue='" + eventVenue + '\'' +
                ", hosts=" + hosts +
                ", eventStatus=" + eventStatus +
                ", bannerUrl='" + bannerUrl + '\'' +
                ", eventDomain='" + eventDomain + '\'' +
                '}';
    }
}
