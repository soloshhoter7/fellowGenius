package fG.Entity;

import java.util.ArrayList;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Lob;


@Entity
public class TutorAvailabilitySchedule {
	@Id
	Integer tid;
	@Lob
	@Column(columnDefinition="BLOB")
	ArrayList<String> allAvailabilitySchedule;
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
	
	public String getFullName() {
		return fullName;
	}

	public ArrayList<String> getAllAvailabilitySchedule() {
		return allAvailabilitySchedule;
	}
	public void setAllAvailabilitySchedule(ArrayList<String> allAvailabilitySchedule) {
		this.allAvailabilitySchedule = allAvailabilitySchedule;
	}
	public void setFullName(String fullName) {
		this.fullName = fullName;
	}
	@Override
	public String toString() {
		return "TutorAvailabilitySchedule [tid=" + tid + ", allAvailabilitySchedule=" + allAvailabilitySchedule
				+ ", fullName=" + fullName + ", isAvailable=" + isAvailable + "]";
	}
	

	
	
	
}
