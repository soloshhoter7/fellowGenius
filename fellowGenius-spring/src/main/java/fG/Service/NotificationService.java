package fG.Service;

import fG.Entity.BookingDetails;
import fG.Enum.MeetingStatus;
import fG.Enum.WhatsappMessageType;
import fG.Repository.repositoryBooking;
import fG.Repository.repositoryStudentProfile;
import fG.Repository.repositoryTutorProfile;
import fG.Repository.repositoryTutorProfileDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {
    @Autowired
    private repositoryBooking repBooking;

    @Autowired
    private repositoryTutorProfile repTutorProfile;

    @Autowired
    private repositoryStudentProfile repStudentProfile;

    @Autowired
    private repositoryTutorProfileDetails repTutorProfileDetails;

    @Autowired
    private WhatsappService whatsappService;

    public void sendWhatsappNotifications(String meetingId, WhatsappMessageType messageType){
        BookingDetails booking = repBooking.meetingIdExists(meetingId);
        if(booking!=null){
            MeetingStatus bookingStatus = booking.getApprovalStatus();
            String startTime="",endTime="";
            if (booking.getStartTimeMinute().equals(0)) {
                startTime += booking.getStartTimeHour()+":00";
            } else {
                startTime += booking.getStartTimeHour()+ ":" + booking.getStartTimeMinute();
            }
            if (booking.getEndTimeMinute().equals(0)) {
                endTime += booking.getEndTimeHour() +":00" ;
            } else {
                endTime += booking.getEndTimeHour()+":" + booking.getEndTimeMinute();
            }
            String slot = booking.getDateOfMeeting()+" at "+startTime+" - "+endTime;
            String message = "";
            String bookingDetails = "Meeting Id :"+booking.getMeetingId()+" " +
                    "Learner :"+booking.getStudentName()+" " +
                    "Expert :"+booking.getTutorName()+" " +
                    "Time :"+slot+"" +
                    "Learner Number :"+repStudentProfile.idExist(booking.getStudentId()).getContact()+"" +
                    "Expert Number :"+repTutorProfile.idExist(repTutorProfileDetails.bookingIdExist(booking.getTutorId()).getTid()).getContact();
            switch(messageType){
                case ADMIN_MEETING_BOOKED:
                    message+="Hey Admin, a new meeting has been booked with following details "+bookingDetails+"" +
                            " Amount : INR "+booking.getAmount();
                case ADMIN_MEETING_COMPLETION:
                    message+="Hey Admin, meeting with following details :"+bookingDetails+"" +
                            " has been completed with status as :"+bookingStatus.name();
                case ADMIN_MEETING_STATUS_PENDING:
                    message+="Hey Admin, meeting with following details : "+bookingDetails+"" +
                            "is still PENDING. please ask the Expert to approve.";
                case ADMIN_MEETING_STARTS_15MIN:
                    message+="Hey Admin, meeting with following details : "+bookingDetails+"" +
                            " starts in 15 minutes.";
            }
            whatsappService.initiateWhatsAppMessage(message);

        }
    }
}
