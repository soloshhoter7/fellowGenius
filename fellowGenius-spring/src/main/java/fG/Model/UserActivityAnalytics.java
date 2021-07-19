package fG.Model;

public class UserActivityAnalytics {
		
	Integer dailyLoginCount;
	Integer weeklyLoginCount;
	Integer monthlyLoginCount;
	Integer dailySignUpCount;
	Integer weeklySignUpCount;
	Integer monthlySignUpCount;
	Integer UsersCount;
	Integer dailyMeetingsSetup;
	Integer weeklyMeetingSetup;
	Integer MonthlyMeetingSetup;
	public Integer getDailyLoginCount() {
		return dailyLoginCount;
	}
	public void setDailyLoginCount(Integer dailyLoginCount) {
		this.dailyLoginCount = dailyLoginCount;
	}
	public Integer getWeeklyLoginCount() {
		return weeklyLoginCount;
	}
	public void setWeeklyLoginCount(Integer weeklyLoginCount) {
		this.weeklyLoginCount = weeklyLoginCount;
	}
	public Integer getMonthlyLoginCount() {
		return monthlyLoginCount;
	}
	public void setMonthlyLoginCount(Integer monthlyLoginCount) {
		this.monthlyLoginCount = monthlyLoginCount;
	}
	public Integer getDailySignUpCount() {
		return dailySignUpCount;
	}
	public void setDailySignUpCount(Integer dailySignUpCount) {
		this.dailySignUpCount = dailySignUpCount;
	}
	public Integer getWeeklySignUpCount() {
		return weeklySignUpCount;
	}
	public void setWeeklySignUpCount(Integer weeklySignUpCount) {
		this.weeklySignUpCount = weeklySignUpCount;
	}
	public Integer getMonthlySignUpCount() {
		return monthlySignUpCount;
	}
	public void setMonthlySignUpCount(Integer monthlySignUpCount) {
		this.monthlySignUpCount = monthlySignUpCount;
	}
	public Integer getUsersCount() {
		return UsersCount;
	}
	public void setUsersCount(Integer usersCount) {
		UsersCount = usersCount;
	}
	public Integer getDailyMeetingsSetup() {
		return dailyMeetingsSetup;
	}
	public void setDailyMeetingsSetup(Integer dailyMeetingsSetup) {
		this.dailyMeetingsSetup = dailyMeetingsSetup;
	}
	public Integer getWeeklyMeetingSetup() {
		return weeklyMeetingSetup;
	}
	public void setWeeklyMeetingSetup(Integer weeklyMeetingSetup) {
		this.weeklyMeetingSetup = weeklyMeetingSetup;
	}
	public Integer getMonthlyMeetingSetup() {
		return MonthlyMeetingSetup;
	}
	public void setMonthlyMeetingSetup(Integer monthlyMeetingSetup) {
		MonthlyMeetingSetup = monthlyMeetingSetup;
	}
	@Override
	public String toString() {
		return "UserActivityAnalytics [dailyLoginCount=" + dailyLoginCount + ", weeklyLoginCount=" + weeklyLoginCount
				+ ", monthlyLoginCount=" + monthlyLoginCount + ", dailySignUpCount=" + dailySignUpCount
				+ ", weeklySignUpCount=" + weeklySignUpCount + ", monthlySignUpCount=" + monthlySignUpCount
				+ ", UsersCount=" + UsersCount + ", dailyMeetingsSetup=" + dailyMeetingsSetup + ", weeklyMeetingSetup="
				+ weeklyMeetingSetup + ", MonthlyMeetingSetup=" + MonthlyMeetingSetup + "]";
	}
	
	

}
