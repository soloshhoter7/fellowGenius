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

    @RequestMapping(value="/save")
    public EventModel saveEvent(@RequestBody EventModel eventModel){
        return eventService.saveEvent(eventModel);
    }

    @RequestMapping(value="/upcomingEvents")
    public List<EventModel> getUpcomingEventsList(){
        return eventService.getUpcomingEvents();
    }

    @RequestMapping(value="/getAllEvents")
    public List<EventModel> getAllEventsList(){
        return eventService.getAllEvents();
    }
    @RequestMapping(value="/addParticipant")
    @ResponseBody
    public boolean addParticipant(String email,String eventId){
        return eventService.addParticipant(email,eventId);
    }
}
