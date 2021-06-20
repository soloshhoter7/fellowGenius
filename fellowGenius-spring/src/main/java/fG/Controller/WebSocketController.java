package fG.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import fG.Service.MeetingService; 

@Controller
//@CrossOrigin(origins = "https://ng-fellowgenius.azurewebsites.net")
//@CrossOrigin(origins = "https://fellowgenius.com")
@CrossOrigin(origins = "http://localhost:4200")

public class WebSocketController {
	@Autowired
	private SimpMessageSendingOperations messagingTemplate;
	@Autowired
	private MeetingService service;
	
	// for error handling
	@MessageExceptionHandler
    public String handleException(Throwable exception) {
        messagingTemplate.convertAndSend("/errors", exception.getMessage());
	    return exception.getMessage();
    }
	
	public String sendMeetingNotificationWebSocket(@DestinationVariable String userId,@Payload String Notification) {
		
		this.messagingTemplate.convertAndSend("/user/Notifications/"+userId, Notification);
		System.out.println("notification sending to "+userId+" as : "+Notification);
		return Notification;
	}
	
	// sending whiteBoard data 
	@MessageMapping("/sendData/{bookingId}")
	@SendTo("/inbox/whiteBoard/{bookingId}")
	public String onReceivedCoordinates(@Payload String coordinates) {
		return coordinates;
	}
	
	@MessageMapping("/sendNotification/{userId}")
	@SendTo("/user/Notifications/{userId}")
	public String sendmessage(@DestinationVariable String userId, @Payload String message) {
		JsonObject msg= new JsonParser().parse(message).getAsJsonObject();
		System.out.println(msg);
		service.saveNotification(msg);
		return "updateNotification";
	}
	// for chatting inside the meeting
	@MessageMapping("/sendChat/{bookingId}")
	@SendTo("/inbox/MeetingChat/{bookingId}")
	public String onReceivedMeetingChat(@DestinationVariable String bookingId, @Payload String message) {
		return message;
	}
	
	
	// sending files inside the meeting
	@MessageMapping("/sendFile/{bookingId}")
	@SendTo("/inbox/MeetingChat/{bookingId}")
	public String onRecievedFile(@DestinationVariable String bookingId,@Payload String file) {
		return file;
	}
	
//	@MessageMapping("/sendNotification/{bookingId}")
//	@SendTo("/user/Notifications/{userId}")
//	public String sendMeetingNotificationWebSocket(@DestinationVariable String userId,@Payload String Notification) {
//		System.out.println("notification sending to "+userId+" as : "+Notification);
//		return Notification;
//	}
//	
}

