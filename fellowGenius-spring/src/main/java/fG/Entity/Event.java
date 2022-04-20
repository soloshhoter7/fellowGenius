package fG.Entity;

import fG.Enum.EventStatus;
import fG.Enum.EventType;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

import java.util.ArrayList;
import java.util.Date;
import javax.persistence.*;
import java.util.List;
import java.util.UUID;

@Entity
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

    public Event() {
    }

    public Event(UUID eventId, EventType eventType, Date eventStartTime, Date eventEndTime, List<Users> participants, String eventTitle, String eventDescription, String eventLink, String eventPassword, String eventVenue, List<Users> hosts, EventStatus eventStatus, String bannerUrl) {
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
    }

    public UUID getEventId() {
        return eventId;
    }

    public void setEventId(UUID eventId) {
        this.eventId = eventId;
    }

    public EventType getEventType() {
        return eventType;
    }

    public void setEventType(EventType eventType) {
        this.eventType = eventType;
    }

    public Date getEventStartTime() {
        return eventStartTime;
    }

    public void setEventStartTime(Date eventStartTime) {
        this.eventStartTime = eventStartTime;
    }

    public Date getEventEndTime() {
        return eventEndTime;
    }

    public void setEventEndTime(Date eventEndTime) {
        this.eventEndTime = eventEndTime;
    }

    public List<Users> getParticipants() {
        return participants;
    }

    public void setParticipants(List<Users> participants) {
        this.participants = participants;
    }

    public String getEventTitle() {
        return eventTitle;
    }

    public void setEventTitle(String eventTitle) {
        this.eventTitle = eventTitle;
    }

    public String getEventDescription() {
        return eventDescription;
    }

    public void setEventDescription(String eventDescription) {
        this.eventDescription = eventDescription;
    }

    public String getEventLink() {
        return eventLink;
    }

    public void setEventLink(String eventLink) {
        this.eventLink = eventLink;
    }

    public String getEventPassword() {
        return eventPassword;
    }

    public void setEventPassword(String eventPassword) {
        this.eventPassword = eventPassword;
    }

    public String getEventVenue() {
        return eventVenue;
    }

    public void setEventVenue(String eventVenue) {
        this.eventVenue = eventVenue;
    }

    public List<Users> getHosts() {
        return hosts;
    }

    public void setHosts(List<Users> hosts) {
        this.hosts = hosts;
    }

    public EventStatus getEventStatus() {
        return eventStatus;
    }

    public void setEventStatus(EventStatus eventStatus) {
        this.eventStatus = eventStatus;
    }

    public String getBannerUrl() {
        return bannerUrl;
    }

    public void setBannerUrl(String bannerUrl) {
        this.bannerUrl = bannerUrl;
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
                '}';
    }

}
