package fG.Model;

public class updatePasswordModel {
 
	String userId;
	String password;
	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	@Override
	public String toString() {
		return "updatePasswordModel [userId=" + userId + ", password=" + password + "]";
	}
	
}
