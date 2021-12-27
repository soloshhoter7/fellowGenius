package fG.Model;

public class ReferrerInfoModel {

	private String userId;
	
	private String fullName;
	
	private String email;

	public ReferrerInfoModel() {
		super();
		// TODO Auto-generated constructor stub
	}

	public ReferrerInfoModel(String userId, String fullName, String email) {
		super();
		this.userId = userId;
		this.fullName = fullName;
		this.email = email;
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

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	@Override
	public String toString() {
		return "ReferrerInfo [userId=" + userId + ", fullName=" + fullName + ", email=" + email + "]";
	}
	
	
}
