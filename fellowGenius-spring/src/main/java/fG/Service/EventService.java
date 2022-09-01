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
    repositoryEvent repEvent;

    @Autowired
    EventMapper eventMapper;

    @Autowired
    repositoryUsers repUsers;

    public EventModel saveEvent(EventModel eventDto){
        Event event=eventMapper.DtoToEntity(eventDto);
        repEvent.save(event);
        return eventDto;
    }


    public List<EventModel> getUpcomingEvents() {

        List<EventModel> upcomingEvents=new ArrayList<>();

        List<Event> repUpcomingEvents=repEvent.findUpcomingEvents();
        
        if(repUpcomingEvents!=null) {
        	upcomingEvents=repUpcomingEvents.stream()
        			.map(eventMapper::EntityToDto)
        			.collect(Collectors.toList());
        }
        
        return upcomingEvents;
    }

    public boolean addParticipant(String userId, String eventId) {

        Users user=repUsers.idExists(Integer.parseInt(userId));
       
        Event existingEvent=repEvent.findById(UUID.fromString(eventId)).get();

        List<Users> participants=existingEvent.getParticipants();
        participants.add(user);
        existingEvent.setParticipants(participants);
        repEvent.save(existingEvent);

        return true;
    }

    public boolean addHost(String userId, String eventId) {

        UUID eventID=UUID.fromString(eventId);
       
        Users user=repUsers.idExists(Integer.parseInt(userId));

        Event existingEvent=repEvent.findById(eventID).get();

        if(user.getRole().equals("Expert")){
            List<Users> hosts=existingEvent.getHosts();
            hosts.add(user);
            existingEvent.setHosts(hosts);
            repEvent.save(existingEvent);
            return true;
        }

        return false;
    }

    public List<EventModel> getAllEvents() {

        List<Event> allEvents = repEvent.findAll();
        List<EventModel> allEventsList=allEvents.
                stream()
                .map(eventMapper::EntityToDto)
                .collect(Collectors.toList());
        return allEventsList;
    }


	public EventModel getEventById(String eventId) {
		// TODO Auto-generated method stub
		EventModel eventModel;
		Event event=repEvent.findById(UUID.fromString(eventId)).get();

        eventModel=eventMapper.EntityToDto(event);
        return eventModel;
	}


	public boolean checkParticipant(String userId, String eventId) {
		// TODO Auto-generated method stub
		
		 Users user=repUsers.idExists(Integer.parseInt(userId));
	       
	     Event existingEvent=repEvent.findById(UUID.fromString(eventId)).get();

        List<Users> participants=existingEvent.getParticipants();

        return participants.contains(user);
    }


}
