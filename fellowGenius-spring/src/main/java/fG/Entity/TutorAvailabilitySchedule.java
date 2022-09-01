package fG.Entity;

import lombok.Data;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Lob;


@Entity
@Data
public class TutorAvailabilitySchedule implements Serializable {
	private static final long serialVersionUID = 1L;
	@Id
	Integer tid;
	@Lob
	@Column(columnDefinition="BLOB")
	ArrayList<String> allAvailabilitySchedule;
	String fullName;
	String isAvailable;
	Date noScheduleNotificationTime;

	@Override
	public String toString() {
		return "TutorAvailabilitySchedule [tid=" + tid + ", allAvailabilitySchedule=" + allAvailabilitySchedule
				+ ", fullName=" + fullName + ", isAvailable=" + isAvailable + ", noScheduleNotificationTime="
				+ noScheduleNotificationTime + "]";
	}

	
}
