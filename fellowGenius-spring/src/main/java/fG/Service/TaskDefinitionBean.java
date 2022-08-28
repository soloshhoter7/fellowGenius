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
import org.hibernate.service.spi.InjectService;
import org.springframework.beans.factory.BeanFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Configurable;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Scope;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.LinkedList;
import java.util.Map;
import java.util.Queue;
import java.util.concurrent.ScheduledFuture;


@Configurable
@Service
public class TaskDefinitionBean implements Runnable{
    private final Queue<TaskDefinition> taskDefinitionsQueue = new LinkedList<>();

    @Autowired
    private repositoryBooking repBooking;

    @Autowired
    private repositoryStudentProfile repStudentProfile;

    @Autowired
    private repositoryTutorProfileDetails repTutorProfileDetails;

    @Autowired
    private repositoryTutorProfile repTutorProfile;

    @Autowired
    private MiscellaneousUtils miscUtils;

    @Autowired
    private MailService mailService;

    @Autowired
    SchedulerService schedulerService;

    @Autowired
    NotificationService notificationService;

    @Override
    public void run() {
        if(!taskDefinitionsQueue.isEmpty()) {
            TaskDefinition taskDefinition = taskDefinitionsQueue.remove();
            BookingDetails b = repBooking.meetingIdExists(taskDefinition.getData());
            Integer learnerId = b.getStudentId();
            StudentProfile learner = repStudentProfile.idExist(learnerId);
            TutorProfile expertProfile = repTutorProfile.findByBookingId(b.getTutorId());
            TutorProfileDetails expert = repTutorProfileDetails.bookingIdExist(b.getTutorId());
            switch (taskDefinition.getActionType()) {
                case MEETING_NOTIFICATION_15:
                    mailService.meetingPrior15MinuteNotification(learner.getEmail(), "Learner", b);
                    mailService.meetingPrior15MinuteNotification(expertProfile.getEmail(), "Expert", b);
                case CHECK_IF_PENDING_STATUS_ADMIN_2HR:
                    if(b.getApprovalStatus().equals(MeetingStatus.PENDING)){
                        notificationService.sendWhatsappNotifications(b.getMeetingId(), WhatsappMessageType.ADMIN_MEETING_STATUS_PENDING);
                    }
                case MEETING_COMPLETION:
                    if (b != null) {
                        b.setApprovalStatus(miscUtils.findMeetingStatus(b));
                        if (b.getApprovalStatus().equals(MeetingStatus.COMPLETED)) {
                            b.setApprovalStatus(MeetingStatus.COMPLETED);
                            learner.setLessonCompleted(learner.getLessonCompleted() + 1);
                            expert.setLessonCompleted(expert.getLessonCompleted() + 1);
                            repStudentProfile.save(learner);
                            repTutorProfileDetails.save(expert);
                        }
                        repBooking.save(b);
                        notificationService.sendWhatsappNotifications(b.getMeetingId(),WhatsappMessageType.ADMIN_MEETING_COMPLETION);
                    }
            }
            schedulerService.removeFromJobsMap(taskDefinition);
        }
    }

    public TaskDefinition getLatestTaskDefinition(){
        return taskDefinitionsQueue.remove();
    }
    public Queue<TaskDefinition> getAllTaskDefinitions(){
        return taskDefinitionsQueue;
    }
    public void setTaskDefinition(TaskDefinition taskDefinition){
        this.taskDefinitionsQueue.add(taskDefinition);
    }
}
