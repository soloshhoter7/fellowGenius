package fG.Model;

public class ReferralDataModel {

	private String userId;
	
	private String fullName;
	
	private String referredUser;
	
	private String expertCode;
	
	private String signUpTime;
	
	private String platformType;

	public ReferralDataModel() {
		super();
		// TODO Auto-generated constructor stub
	}

	public ReferralDataModel(String userId, String fullName, String referredUser, String expertCode, String signUpTime,
			String platformType) {
		super();
		this.userId = userId;
		this.fullName = fullName;
		this.referredUser = referredUser;
		this.expertCode = expertCode;
		this.signUpTime = signUpTime;
		this.platformType = platformType;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getFullName() {
		return fullName;
	}

	public void setFullName(String fullName) {
		this.fullName = fullName;
	}

	public String getReferredUser() {
		return referredUser;
	}

	public void setReferredUser(String referredUser) {
		this.referredUser = referredUser;
	}

	public String getExpertCode() {
		return expertCode;
	}

	public void setExpertCode(String expertCode) {
		this.expertCode = expertCode;
	}

	public String getSignUpTime() {
		return signUpTime;
	}

	public void setSignUpTime(String signUpTime) {
		this.signUpTime = signUpTime;
	}

	public String getPlatformType() {
		return platformType;
	}

	public void setPlatformType(String platformType) {
		this.platformType = platformType;
	}

	@Override
	public String toString() {
		return "ReferralDataModel [userId=" + userId + ", fullName=" + fullName + ", referredUser=" + referredUser
				+ ", expertCode=" + expertCode + ", signUpTime=" + signUpTime + ", platformType=" + platformType + "]";
	}
	
	
}
