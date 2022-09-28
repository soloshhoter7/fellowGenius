package fG.Service;

import fG.Entity.BookingDetails;
import fG.Entity.StudentProfile;
import fG.Entity.TutorProfile;
import fG.Entity.Users;
import fG.Enum.MeetingStatus;
import fG.Enum.WhatsappMessageType;
import fG.Repository.*;
import fG.Utils.MiscellaneousUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.HttpEntityMethodProcessor;

import java.util.ArrayList;
import java.util.List;

import static java.lang.Integer.parseInt;

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
    private repositoryUsers repUsers;

    @Autowired
    private WhatsappService whatsappService;

    @Autowired
    private MiscellaneousUtils miscUtils;


    public void sendAdminWhatsappNotifications(String meetingId, WhatsappMessageType messageType){
        BookingDetails booking = repBooking.meetingIdExists(meetingId);
        if(booking!=null){
            MeetingStatus bookingStatus = booking.getApprovalStatus();
            List<String> meetingTimings = miscUtils.getStartAndEndTime(booking);
            String slot = booking.getDateOfMeeting()+" at "+meetingTimings.get(0)+" - "+meetingTimings.get(1);
            String message = "";
            String bookingDetails = "Meeting Id :"+booking.getMeetingId()+" " +
                    " Learner :"+booking.getStudentName()+" " +
                    " Expert :"+booking.getTutorName()+" " +
                    " Time :"+slot+"" +
                    " Learner Number :"+repStudentProfile.idExist(booking.getStudentId()).getContact()+"" +
                    " Expert Number :"+repTutorProfile.idExist(repTutorProfileDetails.bookingIdExist(booking.getTutorId()).getTid()).getContact();
            switch(messageType.name()){
                case "ADMIN_MEETING_BOOKED":
                    message+="Hey Admin, a new meeting has been booked with following details "+bookingDetails+"" +
                            " Amount : INR "+booking.getAmount();
                    break;
                case "ADMIN_MEETING_COMPLETION":
                    message+="Hey Admin, meeting with following details :"+bookingDetails+"" +
                            " has been completed with status as :"+bookingStatus.name();
                    break;
                case "ADMIN_MEETING_STATUS_PENDING":
                    message+="Hey Admin, meeting with following details : "+bookingDetails+"" +
                            "is still PENDING. please ask the Expert to approve.";
                    break;
                case "ADMIN_MEETING_STARTS_15MIN":
                    message+="Hey Admin, meeting with following details : "+bookingDetails+"" +
                            " starts in 15 minutes.";
                    break;
            }
            whatsappService.initiateWhatsAppMessage(message);

        }
    }
    public void sendUserWhatsappMessage(Users user, String meetingId, WhatsappMessageType messageType){
        BookingDetails booking = null;
        String learnerMeetingDetails = "";
        String expertMeetingDetails ="";
        String recipientName="";
        String recipientPhoneNumber="";
        String recipientRole = miscUtils.findRoleOnBasisOfWhatsappMessageType(messageType);
        if(meetingId!=null){
            booking = repBooking.meetingIdExists(meetingId);
            List<String> meetingTimings = miscUtils.getStartAndEndTime(booking);
            learnerMeetingDetails = booking.getTutorName()+" at "+meetingTimings.get(0)+" on "+booking.getDateOfMeeting()+" for "+booking.getSubject();
            expertMeetingDetails = booking.getStudentName()+" at "+meetingTimings.get(0)+" on "+booking.getDateOfMeeting()+" for "+booking.getSubject();
        }
        List<String> parameters = new ArrayList<>();

          switch(recipientRole){
              case "Learner":
                  if(user!=null){
                      StudentProfile studentProfile = repStudentProfile.idExist(user.getUserId());
                      recipientName = studentProfile.getFullName();
                      recipientPhoneNumber = studentProfile.getContact();
                  }else if(meetingId!=null) {
                      recipientPhoneNumber = repStudentProfile.idExist(booking.getStudentId()).getContact();
                  }
                  break;
              case "Expert":
                  if(user!=null){
                      TutorProfile tutorProfile = repTutorProfile.idExist(user.getUserId());
                      recipientName = tutorProfile.getFullName();
                      recipientPhoneNumber = tutorProfile.getContact();
                  }else if(meetingId!=null){
                      recipientPhoneNumber = repTutorProfile.findByBookingId(booking.getTutorId()).getContact();
                  }
                  break;
              default:
                  break;
          }
        switch(messageType.name()){
            case "L_REG":
            case "E_PROFILE_VERIFY":
                parameters.add(recipientName);
                break;
            case "L_MEET_CREATE":
                assert booking != null;
                parameters.add(booking.getStudentName());
                parameters.add(learnerMeetingDetails);
                parameters.add("INR "+booking.getAmount());
                break;
            case "L_MEET_CONFIRM":
                assert booking != null;
                parameters.add(booking.getStudentName());
                parameters.add(learnerMeetingDetails);

                break;
            case "L_MEET_E_START":
            case "L_MEET_REMIND_15":
                assert booking != null;
                parameters.add(booking.getStudentName());
                parameters.add(booking.getTutorName());
                break;
            case "E_MEET_REQUEST":
            case "E_MEET_REQUEST_REMIND_180":
                assert booking != null;
                parameters.add(booking.getTutorName());
                parameters.add(expertMeetingDetails);
                break;
            case "E_MEET_REMIND_15":
                assert booking != null;
                parameters.add(booking.getTutorName());
                parameters.add(booking.getStudentName());
                break;
            default:
                break;
        }
        whatsappService.sendPlainTextTemplateMessages(messageType.name(),parameters,recipientPhoneNumber);
    }
}
