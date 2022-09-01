package fG.Model;

import java.util.ArrayList;

public class TutorAvailabilityScheduleModel {
	Integer tid;
	ArrayList<ScheduleData> allAvailabilitySchedule;
	ArrayList<ScheduleData> allMeetingsSchedule;
	String fullName;
	String isAvailable;	
	
	public String getIsAvailable() {
		return isAvailable;
	}
	public void setIsAvailable(String isAvailable) {
		this.isAvailable = isAvailable;
	}
	public Integer getTid() {
		return tid;
	}
	public void setTid(Integer tid) {
		this.tid = tid;
	}
	public ArrayList<ScheduleData> getAllAvailabilitySchedule() {
		return allAvailabilitySchedule;
	}
	public void setAllAvailabilitySchedule(ArrayList<ScheduleData> allAvailabilitySchedule) {
		this.allAvailabilitySchedule = allAvailabilitySchedule;
	}
	public String getFullName() {
		return fullName;
	}
	public void setFullName(String fullName) {
		this.fullName = fullName;
	}
	
	public ArrayList<ScheduleData> getAllMeetingsSchedule() {
		return allMeetingsSchedule;
	}
	public void setAllMeetingsSchedule(ArrayList<ScheduleData> allMeetingsSchedule) {
		this.allMeetingsSchedule = allMeetingsSchedule;
	}
	@Override
	public String toString() {
		return "TutorAvailabilityScheduleModel [tid=" + tid + ", allAvailabilitySchedule=" + allAvailabilitySchedule
				+ ", allMeetingsSchedule=" + allMeetingsSchedule + ", fullName=" + fullName + ", isAvailable="
				+ isAvailable + "]";
	}
	

	
}
