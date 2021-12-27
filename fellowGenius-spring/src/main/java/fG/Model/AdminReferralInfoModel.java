package fG.Model;

import java.util.ArrayList;
import java.util.Arrays;

public class AdminReferralInfoModel {
	
	private ReferrerInfoModel referrerInfo;

	private ArrayList<UserReferralInfoModel> userReferredInfo;
	
	private ArrayList<BookingDetailsModel> meetingsSetupInfo;
	
	private Integer referrerPaymentDue;
	
	private ArrayList<BookingDetailsModel> meetingsCompletedInfo;
	

	public AdminReferralInfoModel() {
		super();
		// TODO Auto-generated constructor stub
	}

	public AdminReferralInfoModel(ReferrerInfoModel referrerInfo, ArrayList<UserReferralInfoModel> userReferredInfo,
			ArrayList<BookingDetailsModel> meetingsSetupInfo,Integer referrerPaymentDue
			,ArrayList<BookingDetailsModel> meetingsCompletedInfo) {
		super();
		this.referrerInfo = referrerInfo;
		this.userReferredInfo = userReferredInfo;
		this.meetingsSetupInfo = meetingsSetupInfo;
		this.referrerPaymentDue=referrerPaymentDue;
		this.meetingsCompletedInfo=meetingsCompletedInfo;
	}

	public ReferrerInfoModel getReferrerInfo() {
		return referrerInfo;
	}

	public void setReferrerInfo(ReferrerInfoModel referrerInfo) {
		this.referrerInfo = referrerInfo;
	}

	public ArrayList<UserReferralInfoModel> getUserReferredInfo() {
		return userReferredInfo;
	}

	public void setUserReferredInfo(ArrayList<UserReferralInfoModel> userReferredInfo) {
		this.userReferredInfo = userReferredInfo;
	}

	public ArrayList<BookingDetailsModel> getMeetingsSetupInfo() {
		return meetingsSetupInfo;
	}

	public void setMeetingsSetupInfo(ArrayList<BookingDetailsModel> meetingsSetupInfo) {
		this.meetingsSetupInfo = meetingsSetupInfo;
	}
	
	public Integer getReferrerPaymentDue() {
		return referrerPaymentDue;
	}

	public void setReferrerPaymentDue(Integer referrerPaymentDue) {
		this.referrerPaymentDue=referrerPaymentDue;
	}
	
	
	public ArrayList<BookingDetailsModel> getMeetingsCompletedInfo() {
		return meetingsCompletedInfo;
	}

	public void setMeetingsCompletedInfo(ArrayList<BookingDetailsModel> meetingsCompletedInfo) {
		this.meetingsCompletedInfo = meetingsCompletedInfo;
	}

	@Override
	public String toString() {
		return "AdminReferralInfoModel [referrerInfo=" + referrerInfo + ", userReferredInfo=" + userReferredInfo
				+ ", meetingsSetupInfo=" + meetingsSetupInfo + ", referrerPaymentDue=" + referrerPaymentDue
				+ ", meetingsCompletedInfo=" + meetingsCompletedInfo + "]";
	}

	
}
