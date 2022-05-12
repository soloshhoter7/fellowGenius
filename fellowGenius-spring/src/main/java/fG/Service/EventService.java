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
import java.util.stream.Collector;
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
        
        Event newEvent=null;
        if(existingEvent!=null){
            List<Users> participants=existingEvent.getParticipants();
            participants.add(user);
            existingEvent.setParticipants(participants);
            newEvent=repEvent.save(existingEvent);
        }

        return true;
    }

    public boolean addHost(String userId, String eventId) {

        UUID eventID=UUID.fromString(eventId);
       
        Users user=repUsers.idExists(Integer.parseInt(userId));

        Event existingEvent=repEvent.findById(eventID).get();
        Event newEvent=null;
        if(existingEvent!=null&&user.getRole().equals("Expert")){
            List<Users> hosts=existingEvent.getHosts();
            hosts.add(user);
            existingEvent.setHosts(hosts);
            newEvent=repEvent.save(existingEvent);
            return true;
        }

        return false;
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


	public EventModel getEventById(String eventId) {
		// TODO Auto-generated method stub
		EventModel eventModel=null;
		Event event=repEvent.findById(UUID.fromString(eventId)).get();
		
		if(event!=null) {
			eventModel=eventMapper.EntityToDto(event);
		}
		return eventModel;
	}


	public boolean checkParticipant(String userId, String eventId) {
		// TODO Auto-generated method stub
		
		 Users user=repUsers.idExists(Integer.parseInt(userId));
	       
	     Event existingEvent=repEvent.findById(UUID.fromString(eventId)).get();
	     
	     if(existingEvent!=null) {
	    	 List<Users> participants=existingEvent.getParticipants();
	    	 
	    	 if(participants.contains(user)) {
	    		 System.out.println("Already booked");
	    		 return true;
	    	 }
	     }
		return false;
	}


}
