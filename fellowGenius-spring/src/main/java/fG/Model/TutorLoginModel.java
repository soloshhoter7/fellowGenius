package fG.Model;

public class TutorLoginModel {
	
	Integer tid;
	String email;
	String password;
	public Integer getTid() {
		return tid;
	}
	public void setTid(Integer tid) {
		this.tid = tid;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	@Override
	public String toString() {
		return "TutorLoginModel [tid=" + tid + ", email=" + email + ", password=" + password + "]";
	}
	
}
