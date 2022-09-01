package fG.Utils;

import fG.Entity.BookingDetails;
import fG.Enum.MeetingStatus;
import org.springframework.stereotype.Service;

import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class MiscellaneousUtils {
    public String generateCronExpression(int date,int month,int hours,int minutes,int seconds){
        return seconds+" "+minutes+" "+hours+" "+date+" "+month+" ?";
//        return "0 12 10 19 8 ?";
    }
    public int checkIfCronValid(String cron){
            Date cronDate = cronToDate(cron);
            Calendar cal = Calendar.getInstance();
            cal.set(Calendar.SECOND,0);
            cal.set(Calendar.MILLISECOND,0);
            Date currentDate = cal.getTime();
            return cronDate.compareTo(currentDate);
    }
    public Date cronToDate(String cron){
        String[] cronSplit = cron.split("\\s+");
        return getDate(Integer.parseInt(cronSplit[4]),Integer.parseInt(cronSplit[3]),Integer.parseInt(cronSplit[2]),Integer.parseInt(cronSplit[1]),Integer.parseInt(cronSplit[0]));
    }
    public static Date getDate( int month, int day, int hour, int minute, int second) {
        Calendar cal = Calendar.getInstance();
        //month is decremented by 1 because january is considered as 0th month
        cal.set(Calendar.MONTH,month-1);
        cal.set(Calendar.DAY_OF_MONTH, day);
        cal.set(Calendar.HOUR_OF_DAY, hour);
        cal.set(Calendar.MINUTE, minute);
        cal.set(Calendar.SECOND, second);
        cal.set(Calendar.MILLISECOND, 0);
        return cal.getTime();
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
        int resultMinutes = totalMinutes-minutes;
        hoursAndMinutes.put((int) Math.floor(resultMinutes/60),resultMinutes%60);
        return hoursAndMinutes;
    }
    public Integer checkDiffBtwTimeInMinutes(Date d1, Date d2){
        long diff = d2.getTime() - d1.getTime();
        return (int)(diff / (60 * 1000) % 60);
    }
}
