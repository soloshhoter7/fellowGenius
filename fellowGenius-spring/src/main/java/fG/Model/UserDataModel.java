package fG.Model;

public class UserDataModel {
	String userId;
	String fullName;
	String role;
	String email;
	String expertises;
	String expertCode;
	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	
	public String getRole() {
		return role;
	}
	public void setRole(String role) {
		this.role = role;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getFullName() {
		return fullName;
	}
	public void setFullName(String fullName) {
		this.fullName = fullName;
	} 
	
	public String getExpertises() {
		return expertises;
	}
	public void setExpertises(String expertises) {
		this.expertises = expertises;
	}
	
	public String getExpertCode() {
		return expertCode;
	}
	public void setExpertCode(String expertCode) {
		this.expertCode = expertCode;
	}
	@Override
	public String toString() {
		return "UserDataModel [userId=" + userId + ", fullName=" + fullName + ", role=" + role + ", email=" + email
				+ ", expertises=" + expertises + ", expertCode=" + expertCode + "]";
	}
	
	
	
}
