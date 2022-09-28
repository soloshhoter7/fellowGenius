package fG.Utils;

import fG.Entity.BookingDetails;
import fG.Enum.MeetingStatus;
import fG.Enum.WhatsappMessageType;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

import java.util.*;

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
    public String findRoleOnBasisOfWhatsappMessageType(WhatsappMessageType messageType){
        String[] split = messageType.name().split("_",2);
        switch (split[0]){
            case "L":
                return "Learner";
            case "E":
                return "Expert";
            case "ADMIN":
                return "Admin";
            default:
                return null;
        }
    }
    public List<String> getStartAndEndTime(BookingDetails booking){
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
        return Arrays.asList(startTime,endTime);
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

    public String validAndCorrectPhoneNumber(String s){
        String result="";
        int length=s.length();
        if(length == 13 && (s.substring(0,3)).equals("+91")){
            result="91"+ s.substring(3);
        }else if (length == 12 && (s.substring(0,2)).equals("91")){
            result=s.substring(0);
        }else if(length == 11 && (s.substring(0,1).equals("0"))){
            result="91"+s.substring(1);
        }else if(length==10){
            result="91"+ s.substring(0);
        }else{
            result="Invalid";
        }
        return result;
    }
    public String parameterToJSON(List<String> parameters){
        JSONObject obj=new JSONObject();
        for(String parameter: parameters){
            obj.put(String.valueOf(parameters.indexOf(parameter)),parameter);
        }
        return obj.toString();
    }

}
