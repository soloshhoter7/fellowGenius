package fG.Controller;

import fG.Entity.Event;
import fG.Model.EventModel;
import fG.Service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/fellowGenius/event")
public class EventController {

	@Autowired
	EventService eventService;

	@PostMapping(value = "/saveEvent")
	public EventModel saveEvent(@RequestBody EventModel eventModel) {
		return eventService.saveEvent(eventModel);
	}

	@GetMapping(value = "/upcomingEvents")
	public List<EventModel> getUpcomingEventsList() {
		return eventService.getUpcomingEvents();
	}

	@GetMapping(value = "/getAllEvents")
	public List<EventModel> getAllEventsList() {
		return eventService.getAllEvents();
	}
	
	@GetMapping(value="/addHost")
	@ResponseBody
	public boolean addHost(String userId,String eventId) {
		return eventService.addHost(userId, eventId);
	}

	@GetMapping(value = "/addParticipant")
	@ResponseBody
	public boolean addParticipant(String userId, String eventId) {
		return eventService.addParticipant(userId, eventId);
	}

	@GetMapping(value = "/getEvent")
	public EventModel getEventById(String eventId) {
		return eventService.getEventById(eventId);
	}
	
	@GetMapping(value="/checkParticipant")
	@ResponseBody
	public boolean checkParticipant(String userId,String eventId) {
		return eventService.checkParticipant(userId,eventId);
	}
}
