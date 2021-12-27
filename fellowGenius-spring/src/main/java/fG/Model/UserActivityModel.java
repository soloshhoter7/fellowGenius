package fG.Model;

import fG.Entity.UserActivity;

public class UserActivityModel {
	String userId;
	String fullName;
	String role;
	String loginTime;
	String signUpTime;
	String referralCode;
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
	public String getRole() {
		return role;
	}
	public void setRole(String role) {
		this.role = role;
	}
	public String getLoginTime() {
		return loginTime;
	}
	public void setLoginTime(String loginTime) {
		this.loginTime = loginTime;
	}
	public String getSignUpTime() {
		return signUpTime;
	}
	public void setSignUpTime(String signUpTime) {
		this.signUpTime = signUpTime;
	}
	public String getReferralCode() {
		return referralCode;
	}
	public void setReferralCode(String referralCode) {
		this.referralCode = referralCode;
	}
	@Override
	public String toString() {
		return "UserActivityModel [userId=" + userId + ", fullName=" + fullName + ", role=" + role + ", loginTime="
				+ loginTime + ", signUpTime=" + signUpTime + ", referralCode=" + referralCode + "]";
	}
	@Override
	public boolean equals(Object anObject) {
		if (!(anObject instanceof UserActivity)) {
			return false;
		}
		UserActivity otherMember = (UserActivity) anObject;
		return (otherMember.getId().equals(this.userId));
	}
}
