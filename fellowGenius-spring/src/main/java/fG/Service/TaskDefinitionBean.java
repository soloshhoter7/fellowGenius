package fG.Service;

import fG.Entity.*;
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
import java.util.*;
import java.util.concurrent.ScheduledFuture;


@Configurable
@Service
public class TaskDefinitionBean implements Runnable{
    private final List<TaskDefinition> taskDefinitionArrayList = new ArrayList<>();

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
                            notificationService.sendWhatsappNotifications(b.getMeetingId(), WhatsappMessageType.ADMIN_MEETING_STATUS_PENDING);
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
                            notificationService.sendWhatsappNotifications(b.getMeetingId(),WhatsappMessageType.ADMIN_MEETING_COMPLETION);
                        break;
                }
                schedulerService.removeFromJobsMap(taskDefinition);
            }
        }
    }

    public TaskDefinition getLatestTaskDefinition(){
        return taskDefinitionArrayList.remove(0);
    }
    public List<TaskDefinition> getAllTaskDefinitions(){
        return taskDefinitionArrayList;
    }
    public void setTaskDefinition(TaskDefinition taskDefinition){
        if(!this.taskDefinitionArrayList.contains(taskDefinition)){
            this.taskDefinitionArrayList.add(taskDefinition);
            Collections.sort(taskDefinitionArrayList, new Comparator<TaskDefinition>() {

                @Override
                public int compare(TaskDefinition o1, TaskDefinition o2) {
                    return 0;
                }
            });
        }
    }
}
