package fG.Service;

import fG.Entity.TaskDefinitionDetails;
import fG.Model.TaskDefinition;
import fG.Repository.repositoryTaskDefinitions;
import fG.Utils.MiscellaneousUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.support.CronTrigger;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import javax.annotation.Resource;

import java.util.*;
import java.util.concurrent.ScheduledFuture;

@Service
public class SchedulerService {
    @Autowired
    private TaskScheduler taskScheduler;

    @Autowired
    repositoryTaskDefinitions repTaskDefinitions;

    Map<String, ScheduledFuture<?>> jobsMap = new HashMap<>();

    Map<String, TaskDefinitionDetails> taskDefinitions = new HashMap<>();

    @Autowired
    TaskDefinitionBean taskDefinitionBean;

    private UUID uuid;

    public String scheduleATask(TaskDefinition taskDefinition){
        String jobId = UUID.randomUUID().toString();
        taskDefinition.setId(jobId);
        taskDefinitionBean.setTaskDefinition(taskDefinition);
        Runnable tasklet = taskDefinitionBean;
        System.out.println("Scheduling task with job id: " + jobId + " and cron expression: " + taskDefinition.getCronExpression());
        ScheduledFuture<?> scheduledTask = taskScheduler.schedule(tasklet, new CronTrigger(taskDefinition.getCronExpression(), TimeZone.getTimeZone(TimeZone.getDefault().getID())));
        TaskDefinitionDetails taskDefinitionDetails = new TaskDefinitionDetails(jobId,taskDefinition.getCronExpression(),taskDefinition.getActionType(),taskDefinition.getData());
        taskDefinitions.put(jobId,taskDefinitionDetails);
        jobsMap.put(jobId, scheduledTask);
        return jobsMap.toString();
    }

    public String fetchAllJobs() {
        return jobsMap.toString();
    }
public void removeScheduledTask(String jobId){
    ScheduledFuture<?> scheduledTask = jobsMap.get(jobId);
    if(scheduledTask!=null){
        scheduledTask.cancel(true);
        jobsMap.put(jobId,null);
    }
}

    public void removeFromJobsMap(TaskDefinition taskDefinition){
        jobsMap.remove(taskDefinition.getId());
        taskDefinitions.remove(taskDefinition.getId());
    }

    @PreDestroy
    public void saveAllTasksBeforeDestroying(){
        for (Map.Entry<String,TaskDefinitionDetails> task : taskDefinitions.entrySet()) {
                if(!jobsMap.containsKey(task.getKey())){
                    taskDefinitions.remove(task.getKey());
                }
        }
        System.out.println("Before closing the application");
        for (Map.Entry<String,ScheduledFuture<?>> task : jobsMap.entrySet()){
            if(!task.getValue().isDone()){
                repTaskDefinitions.save(taskDefinitions.get(task.getKey()));
            }
        }
        jobsMap.clear();
        taskDefinitions.clear();
    }

    @PostConstruct
    public void fetchAllTasks(){
        List<TaskDefinitionDetails> taskDefinitionDetailsList = repTaskDefinitions.findAll();
        if(taskDefinitionDetailsList.size()>0){
            for(TaskDefinitionDetails td : taskDefinitionDetailsList){
                TaskDefinition taskDefinition = new TaskDefinition();
                taskDefinition.setCronExpression(td.getCronExpression());
                taskDefinition.setData(td.getData());
                taskDefinition.setActionType(td.getActionType());
                taskDefinition.setId(td.getId());
                scheduleATask(taskDefinition);
            }
            repTaskDefinitions.deleteAll();
        }
    }

}
