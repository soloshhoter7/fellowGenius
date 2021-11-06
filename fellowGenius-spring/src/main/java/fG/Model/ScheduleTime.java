package fG.Model;

public class ScheduleTime {
	public String date;
	public Integer hours;
	public Integer minutes;
	public Integer totalMinutes;
	public Integer frame;

	public Integer getTotalMinutes() {
		return totalMinutes;
	}

	public void setTotalMinutes(Integer totalMinutes) {
		this.totalMinutes = totalMinutes;
	}

	public String getDate() {
		return date;
	}

	public void setDate(String date) {
		this.date = date;
	}

	public Integer getHours() {
		return hours;
	}

	public void setHours(Integer hours) {
		this.hours = hours;
	}

	public Integer getMinutes() {
		return minutes;
	}

	public void setMinutes(Integer minutes) {
		this.minutes = minutes;
	}


	@Override
	public String toString() {
		return "ScheduleTime [date=" + date + ", hours=" + hours + ", minutes=" + minutes + ", totalMinutes="
				+ totalMinutes + ", frame=" + frame + "]";
	}

	public Integer getFrame() {
		return frame;
	}

	public void setFrame(Integer frame) {
		this.frame = frame;
	}

//	@Override
//	public boolean equals(Object anObject) {
//		if (!(anObject instanceof ScheduleTime)) {
//			return false;
//		}
//		ScheduleTime otherMember = (ScheduleTime) anObject;
//		return ((otherMember.getDate().equals(this.getDate())) && (otherMember.getHours().equals(this.getHours()))
//				&& (otherMember.getMinutes().equals(this.getMinutes()))
//				&& (otherMember.getFrame().equals(this.getFrame())));
//	}
	
	@Override
	public boolean equals(Object anObject) {
		if (!(anObject instanceof ScheduleTime)) {
			return false;
		}
		ScheduleTime otherMember = (ScheduleTime) anObject;
		return ((otherMember.getDate().equals(this.getDate())) && (otherMember.getHours().equals(this.getHours()))
				&& (otherMember.getMinutes().equals(this.getMinutes())));
	}

}
