package fG.Utils;

import fG.Entity.BookingDetails;
import fG.Enum.MeetingStatus;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class MiscellaneousUtils {
    public String generateCronExpression(int date,int month,int hours,int minutes,int seconds){
        return seconds+" "+minutes+" "+hours+" "+date+" "+month+" ?";
//        return "0 12 10 19 8 ?";
    }

    public MeetingStatus findMeetingStatus(BookingDetails b) {
        if (b.isCancelled()) {
            return MeetingStatus.CANCELLED;
        } else if(b.getExpertJoinTime()==null&&b.getLearnerJoinTime()==null) {
            return MeetingStatus.UNAVAILABLE;
        }else if (b.getExpertJoinTime() == null) {
            return MeetingStatus.EXPERT_ABSENT;
        } else if (b.getLearnerJoinTime() == null) {
            return MeetingStatus.LEARNER_ABSENT;
        } else if (b.getExpertJoinTime() != null && b.getExpertLeavingTime() != null
                && b.getLearnerJoinTime() != null && b.getLearnerLeavingTime() != null) {
            return MeetingStatus.COMPLETED;
        }else {
            return MeetingStatus.INAPPROPRIATE;
        }
    }

    public Map<Integer,Integer> subtractFromTime(Integer minutes,Integer startHour,Integer startMinutes){
        Map<Integer,Integer> hoursAndMinutes = new HashMap<>();
        Integer totalMinutes = (startHour*60)+startMinutes;
        Integer resultMinutes = totalMinutes-minutes;
        hoursAndMinutes.put((int) Math.floor(resultMinutes/60),resultMinutes%60);
        return hoursAndMinutes;
    }
    public Integer checkDiffBtwTimeInMinutes(Date d1, Date d2){
        long diff = d2.getTime() - d1.getTime();
        return (int)(diff / (60 * 1000) % 60);
    }
}
