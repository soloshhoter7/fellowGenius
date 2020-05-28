package fG.Model;

public class ScheduleTime {
	public String date;
	public Integer hours;
	public Integer minutes;

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
		return "ScheduleTime [date=" + date + ", hours=" + hours + ", minutes=" + minutes + "]";
	}
	
	@Override
    public boolean equals(Object anObject) {
        if (!(anObject instanceof ScheduleTime)) {
            return false;
        }
        ScheduleTime otherMember = (ScheduleTime)anObject;
        return ( (otherMember.getDate().equals(this.getDate())) && (otherMember.getHours().equals(this.getHours())) && (otherMember.getMinutes().equals(this.getMinutes())));
    }

//	 @Override
//	    public boolean equals(Object obj) {
//	        if (obj == null || !(obj instanceof ScheduleTime)) {
//	            return false;
//	        }
//	        ScheduleTime other = (ScheduleTime) obj;
//	        return this.date == other.date && this.hours == other.hours && this.minutes == other.minutes;
//	    }
//
//	    @Override
//	    public int hashCode() {
//	        final int prime = 31;
//	        int result = 1;
//	        result = prime * result + this.hours;
//	        result = prime * result + this.minutes;
//	        result = prime * result + ((name == null) ? 0 : name.hashCode());
//	        return result;
//	    }
}


