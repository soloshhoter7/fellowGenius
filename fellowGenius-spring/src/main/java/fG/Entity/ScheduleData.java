package fG.Entity;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import com.google.gson.Gson;

public class ScheduleData {
	public Integer Id;
	public String Subject;
	public String comments;
	public String StartTime;
	public String EndTime;
	public boolean IsAllDay;
	public String RecurrenceRule;
	public String RecurrenceException;
	public String Guid;
	public Integer RecurrenceID;

	public Integer getId() {
		return Id;
	}

	public void setId(Integer id) {
		Id = id;
	}

	public String getSubject() {
		return Subject;
	}

	public void setSubject(String subject) {
		Subject = subject;
	}

	public String getComments() {
		return comments;
	}

	public void setComments(String comments) {
		this.comments = comments;
	}

	public String getStartTime() {
		return StartTime;
	}

	public void setStartTime(String startTime) {
		StartTime = startTime;
	}

	public String getEndTime() {
		return EndTime;
	}

	public void setEndTime(String endTime) {
		EndTime = endTime;
	}

	public boolean isIsAllDay() {
		return IsAllDay;
	}

	public void setIsAllDay(boolean isAllDay) {
		IsAllDay = isAllDay;
	}

	public String getRecurrenceRule() {
		return RecurrenceRule;
	}

	public void setRecurrenceRule(String recurrenceRule) {
		RecurrenceRule = recurrenceRule;
	}

	public String getRecurrenceException() {
		return RecurrenceException;
	}

	public void setRecurrenceException(String recurrenceException) {
		RecurrenceException = recurrenceException;
	}

	public String getGuid() {
		return Guid;
	}

	public void setGuid(String guid) {
		Guid = guid;
	}

	public Integer getRecurrenceID() {
		return RecurrenceID;
	}

	public void setRecurrenceId(Integer recurrenceID) {
		RecurrenceID = recurrenceID;
	}

	public String serialize() {
		return new Gson().toJson(this);
	}

	@Override
	public String toString() {
		return "ScheduleData [Id=" + Id + ", Subject=" + Subject + ", comments=" + comments + ", StartTime=" + StartTime
				+ ", EndTime=" + EndTime + ", IsAllDay=" + IsAllDay + ", RecurrenceRule=" + RecurrenceRule
				+ ", RecurrenceException=" + RecurrenceException + ", Guid=" + Guid + ", RecurrenceId=" + RecurrenceID
				+ "]";
	}

}
