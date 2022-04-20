package fG.Service;

import fG.Entity.Event;
import fG.Entity.Users;
import fG.Mapper.EventMapper;
import fG.Model.EventModel;
import fG.Repository.repositoryEvent;
import fG.Repository.repositoryUsers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class EventService {

    @Autowired
    private repositoryEvent repEvent;

    @Autowired
    private EventMapper eventMapper;

    @Autowired
    private repositoryUsers repUsers;
    public EventModel saveEvent(EventModel eventDto){
        System.out.println(eventDto);
        Event event=eventMapper.DtoToEntity(eventDto);

        Event savedEvent=repEvent.save(event);
        EventModel savedEventModel=eventMapper.EntityToDto(savedEvent);
        System.out.println(savedEventModel);
        return savedEventModel;
    }


    public List<EventModel> getUpcomingEvents() {

        List<EventModel> upcomingEvents=new ArrayList<>();

        List<Event> allEvents=repEvent.findAll();

        Date currentDate=new Date();
        if(allEvents!=null){
            for(Event event:allEvents){
                if(currentDate.compareTo(event.getEventStartTime())<=0){
                    //current date is less than event start date
                    EventModel eventDto=eventMapper.EntityToDto(event);
                    upcomingEvents.add(eventDto);
                }
            }
        }

        return upcomingEvents;
    }

    public boolean addParticipant(String email, String eventId) {

        UUID eventID=UUID.fromString(eventId);
        System.out.println(eventID);

        Users user=repUsers.emailExist(email);
        System.out.println("User");
        System.out.println(user);
        Event existingEvent=repEvent.findById(eventID).get();
        System.out.println("Existing event");
        System.out.println(existingEvent);
        Event newEvent=null;
        if(existingEvent!=null){
            List<Users> participants=existingEvent.getParticipants();
            participants.add(user);
            existingEvent.setParticipants(participants);
            newEvent=repEvent.save(existingEvent);
        }

        return true;
    }

    public Event addHost(String email, String eventId) {

        UUID eventID=UUID.fromString(eventId);
        System.out.println(eventID);

        Users user=repUsers.emailExist(email);

        Event existingEvent=repEvent.findById(eventID).get();
        Event newEvent=null;
        if(existingEvent!=null){
            List<Users> hosts=existingEvent.getHosts();
            hosts.add(user);
            existingEvent.setHosts(hosts);
            newEvent=repEvent.save(existingEvent);
        }

        return newEvent;
    }

    public List<EventModel> getAllEvents() {

        List<Event> allEvents=new ArrayList<>();

        allEvents=repEvent.findAll();
        List<EventModel> allEventsList=allEvents.
                stream()
                .map(eventMapper::EntityToDto)
                .collect(Collectors.toList());
        System.out.println(allEventsList);
        //System.out.println(allEvents);
        return allEventsList;
    }


}
