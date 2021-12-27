package fG.Model;

import java.util.Date;

public class UserReferralInfoModel {

	String name;
	
	String email;
	
	String userId;
	
	String status;
	
	Date timeStamp;

	public UserReferralInfoModel() {
		super();
		// TODO Auto-generated constructor stub
	}

	public UserReferralInfoModel(String name, String email, String userId, String status, Date timeStamp) {
		super();
		this.name = name;
		this.email = email;
		this.userId = userId;
		this.status = status;
		this.timeStamp = timeStamp;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public Date getTimeStamp() {
		return timeStamp;
	}

	public void setTimeStamp(Date timeStamp) {
		this.timeStamp = timeStamp;
	}

	@Override
	public String toString() {
		return "UserReferralInfo [name=" + name + ", email=" + email + ", userId=" + userId + ", status=" + status
				+ ", timeStamp=" + timeStamp + "]";
	}
	
	
}
