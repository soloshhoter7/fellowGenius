package fG.Model;

import java.util.ArrayList;

public class EarningDataModel {
	Integer totalLearners;
	Integer totalEarnings;
	ArrayList<KeyValueModel> weeklyData;
	ArrayList<KeyValueModel> MonthlyData;
	ArrayList<KeyValueModel> YearlyData;
	public Integer getTotalEarnings() {
		return totalEarnings;
	}
	public void setTotalEarnings(Integer totalEarnings) {
		this.totalEarnings = totalEarnings;
	}
	public ArrayList<KeyValueModel> getWeeklyData() {
		return weeklyData;
	}
	public void setWeeklyData(ArrayList<KeyValueModel> weeklyData) {
		this.weeklyData = weeklyData;
	}
	public ArrayList<KeyValueModel> getMonthlyData() {
		return MonthlyData;
	}
	public void setMonthlyData(ArrayList<KeyValueModel> monthlyData) {
		MonthlyData = monthlyData;
	}
	public ArrayList<KeyValueModel> getYearlyData() {
		return YearlyData;
	}
	public void setYearlyData(ArrayList<KeyValueModel> yearlyData) {
		YearlyData = yearlyData;
	}
	public Integer getTotalLearners() {
		return totalLearners;
	}
	public void setTotalLearners(Integer totalLearners) {
		this.totalLearners = totalLearners;
	}
	@Override
	public String toString() {
		return "EarningDataModel [totalLearners=" + totalLearners + ", totalEarnings=" + totalEarnings + ", weeklyData="
				+ weeklyData + ", MonthlyData=" + MonthlyData + ", YearlyData=" + YearlyData + "]";
	}

	
	
}
