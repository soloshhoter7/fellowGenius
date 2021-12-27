package fG.Model;

import java.util.Date;

public class TimeSlot {
	Date startTime;
	Date endTime;

	public Date getStartTime() {
		return startTime;
	}

	public void setStartTime(Date startTime) {
		this.startTime = startTime;
	}

	public Date getEndTime() {
		return endTime;
	}

	public void setEndTime(Date endTime) {
		this.endTime = endTime;
	}

	public TimeSlot(Date startTime, Date endTime) {
		super();
		this.startTime = startTime;
		this.endTime = endTime;
	}

	@Override
	public String toString() {
		return "TimeSlot [startTime=" + startTime + ", endTime=" + endTime + "]";
	}

}
