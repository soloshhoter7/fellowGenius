package fG.Entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;


@Entity
public class BookingDetails {
	  @Id
	  @GeneratedValue(strategy = GenerationType.AUTO)
	  Integer bid;
	  Integer endTimeHour;
	  Integer endTimeMinute;
	  Integer duration;
	  String dateOfMeeting;	
	  Integer startTimeHour;
	  Integer startTimeMinute;
	  String description;
	  Integer studentId;
	  Integer tutorId;
	  String meetingId;
	  String approvalStatus;
	  String studentName;
	  String tutorName;
	  Integer bookingCase;
	  
	  
	public Integer getBookingCase() {
		return bookingCase;
	}
	public void setBookingCase(Integer bookingCase) {
		this.bookingCase = bookingCase;
	}
	public Integer getBid() {
		return bid;
	}
	public void setBid(Integer bid) {
		this.bid = bid;
	}
	public Integer getEndTimeHour() {
		return endTimeHour;
	}
	public void setEndTimeHour(Integer endTimeHour) {
		this.endTimeHour = endTimeHour;
	}
	public Integer getEndTimeMinute() {
		return endTimeMinute;
	}
	public void setEndTimeMinute(Integer endTimeMinute) {
		this.endTimeMinute = endTimeMinute;
	}
	public Integer getDuration() {
		return duration;
	}
	public void setDuration(Integer duration) {
		this.duration = duration;
	}
	public String getDateOfMeeting() {
		return dateOfMeeting;
	}
	public void setDateOfMeeting(String dateOfMeeting) {
		this.dateOfMeeting = dateOfMeeting;
	}
	public Integer getStartTimeHour() {
		return startTimeHour;
	}
	public void setStartTimeHour(Integer startTimeHour) {
		this.startTimeHour = startTimeHour;
	}
	public Integer getStartTimeMinute() {
		return startTimeMinute;
	}
	public void setStartTimeMinute(Integer startTimeMinute) {
		this.startTimeMinute = startTimeMinute;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public Integer getStudentId() {
		return studentId;
	}
	public void setStudentId(Integer studentId) {
		this.studentId = studentId;
	}
	public Integer getTutorId() {
		return tutorId;
	}
	public void setTutorId(Integer tutorId) {
		this.tutorId = tutorId;
	}
	public String getMeetingId() {
		return meetingId;
	}
	public void setMeetingId(String meetingId) {
		this.meetingId = meetingId;
	}
	public String getApprovalStatus() {
		return approvalStatus;
	}
	public void setApprovalStatus(String approvalStatus) {
		this.approvalStatus = approvalStatus;
	}
	
	public String getStudentName() {
		return studentName;
	}
	public void setStudentName(String studentName) {
		this.studentName = studentName;
	}
	public String getTutorName() {
		return tutorName;
	}
	public void setTutorName(String tutorName) {
		this.tutorName = tutorName;
	}
	@Override
	public String toString() {
		return "BookingDetails [bid=" + bid + ", endTimeHour=" + endTimeHour + ", endTimeMinute=" + endTimeMinute
				+ ", duration=" + duration + ", dateOfMeeting=" + dateOfMeeting + ", startTimeHour=" + startTimeHour
				+ ", startTimeMinute=" + startTimeMinute + ", description=" + description + ", studentId=" + studentId
				+ ", tutorId=" + tutorId + ", meetingId=" + meetingId + ", approvalStatus=" + approvalStatus
				+ ", studentName=" + studentName + ", tutorName=" + tutorName + ", bookingCase=" + bookingCase + "]";
	}

	
	
	  
}
