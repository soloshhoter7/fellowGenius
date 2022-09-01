package fG.Service;

import fG.Entity.BookingDetails;
import fG.Entity.StudentProfile;
import fG.Entity.TutorProfile;
import fG.Entity.TutorProfileDetails;
import fG.Enum.MeetingStatus;
import fG.Enum.WhatsappMessageType;
import fG.Model.TaskDefinition;
import fG.Repository.repositoryBooking;
import fG.Repository.repositoryStudentProfile;
import fG.Repository.repositoryTutorProfile;
import fG.Repository.repositoryTutorProfileDetails;
import fG.Utils.MiscellaneousUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Configurable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;



@Configurable
@Service
public class TaskDefinitionBean implements Runnable{
    private final List<TaskDefinition> taskDefinitionArrayList = new ArrayList<>();

    @Autowired
    repositoryBooking repBooking;

    @Autowired
    repositoryStudentProfile repStudentProfile;

    @Autowired
    repositoryTutorProfileDetails repTutorProfileDetails;

    @Autowired
    repositoryTutorProfile repTutorProfile;

    @Autowired
    MiscellaneousUtils miscUtils;

    @Autowired
     MailService mailService;

    @Autowired
    SchedulerService schedulerService;

    @Autowired
    NotificationService notificationService;

    @Override
    public void run() {
        if(!taskDefinitionArrayList.isEmpty()) {
            TaskDefinition taskDefinition = taskDefinitionArrayList.remove(0);
            BookingDetails b = repBooking.meetingIdExists(taskDefinition.getData());
            if(b!=null&& miscUtils.checkIfCronValid(taskDefinition.getCronExpression())==0){
                Integer learnerId = b.getStudentId();
                StudentProfile learner = repStudentProfile.idExist(learnerId);
                TutorProfile expertProfile = repTutorProfile.findByBookingId(b.getTutorId());
                TutorProfileDetails expert = repTutorProfileDetails.bookingIdExist(b.getTutorId());
                switch (taskDefinition.getActionType()) {
                    case MEETING_NOTIFICATION_15:
                        mailService.meetingPrior15MinuteNotification(learner.getEmail(), "Learner", b);
                        mailService.meetingPrior15MinuteNotification(expertProfile.getEmail(), "Expert", b);
                        break;
                    case CHECK_IF_PENDING_STATUS_ADMIN_2HR:
                        if(b.getApprovalStatus().equals(MeetingStatus.PENDING)){
                            notificationService.sendMeetingWhatsappNotifications(b.getMeetingId(), WhatsappMessageType.ADMIN_MEETING_STATUS_PENDING);
                        }
                        break;
                    case MEETING_COMPLETION:
                            b.setApprovalStatus(miscUtils.findMeetingStatus(b));
                            if (b.getApprovalStatus().equals(MeetingStatus.COMPLETED)) {
                                b.setApprovalStatus(MeetingStatus.COMPLETED);
                                learner.setLessonCompleted(learner.getLessonCompleted() + 1);
                                expert.setLessonCompleted(expert.getLessonCompleted() + 1);
                                repStudentProfile.save(learner);
                                repTutorProfileDetails.save(expert);
                            }
                            repBooking.save(b);
                            notificationService.sendMeetingWhatsappNotifications(b.getMeetingId(),WhatsappMessageType.ADMIN_MEETING_COMPLETION);
                        break;
                }
                schedulerService.removeFromJobsMap(taskDefinition);
            }
        }
    }

    public List<TaskDefinition> getAllTaskDefinitions(){
        return taskDefinitionArrayList;
    }
    public void setTaskDefinition(TaskDefinition taskDefinition){
        if(!this.taskDefinitionArrayList.contains(taskDefinition)){
            this.taskDefinitionArrayList.add(taskDefinition);
            taskDefinitionArrayList.sort((o1, o2) -> (int) (miscUtils.cronToDate(o1.getCronExpression()).getTime() - miscUtils.cronToDate(o2.getCronExpression()).getTime()));
        }
    }
}
