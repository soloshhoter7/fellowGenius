package fG.Model;

public class StudentLoginModel {
	Integer sid;
	String email;
	String password;

	public Integer getUserId() {
		return sid;
	}
	public void setUserId(Integer sid) {
		this.sid = sid;
	}

	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public Integer getSid() {
		return sid;
	}
	public void setSid(Integer sid) {
		this.sid = sid;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	
}
