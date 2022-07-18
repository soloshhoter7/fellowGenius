package fG.Service;

import fG.Entity.BookingDetails;
import fG.Entity.StudentProfile;
import fG.Entity.TutorProfileDetails;
import fG.Model.TaskDefinition;
import fG.Repository.repositoryBooking;
import fG.Repository.repositoryStudentProfile;
import fG.Repository.repositoryTutorProfileDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;



@Service
public class TaskDefinitionBean implements Runnable{
    private TaskDefinition taskDefinition;

    @Autowired
    repositoryBooking repBooking;

    @Autowired
    repositoryStudentProfile repStudentProfile;

    @Autowired
    repositoryTutorProfileDetails repTutorProfileDetails;
    @Override
    public void run() {
        switch (taskDefinition.getActionType()){
            case MEETING_COMPLETION:
                BookingDetails b = repBooking.meetingIdExists(taskDefinition.getData());
                Integer learnerId = b.getStudentId();
                StudentProfile learner = repStudentProfile.idExist(learnerId);
                TutorProfileDetails expert = repTutorProfileDetails.bookingIdExist(b.getTutorId());

                if(b!=null){
                    if (b.getExpertJoinTime() == null) {
                        b.setApprovalStatus("expert_absent");
                    } else if (b.getLearnerJoinTime() == null) {
                        b.setApprovalStatus("learner_absent");
                    } else if (b.getExpertJoinTime() != null && b.getExpertLeavingTime() != null
                            && b.getLearnerJoinTime() != null && b.getLearnerLeavingTime() != null) {
                        b.setApprovalStatus("completed");
                        learner.setLessonCompleted(learner.getLessonCompleted()+1);
                        expert.setLessonCompleted(expert.getLessonCompleted()+1);
                        repStudentProfile.save(learner);
                        repTutorProfileDetails.save(expert);
                    }else if(b.getExpertJoinTime()==null&&b.getLearnerJoinTime()==null) {
                        b.setApprovalStatus("No one joined");
                    }
                }

        }
    }
    public TaskDefinition getTaskDefinition(){
        return taskDefinition;
    }
    public void setTaskDefinition(TaskDefinition taskDefinition){
        this.taskDefinition=taskDefinition;
    }
}
