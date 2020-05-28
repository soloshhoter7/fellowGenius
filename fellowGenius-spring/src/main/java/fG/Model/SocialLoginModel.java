package fG.Model;

public class SocialLoginModel {

	Integer tid;
	String fullName;
	String email;
	String id;
	public Integer getTid() {
		return tid;
	}
	public void setTid(Integer tid) {
		this.tid = tid;
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
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	@Override
	public String toString() {
		return "SocialLoginModel [tid=" + tid + ", fullName=" + fullName + ", email=" + email + ", id=" + id + "]";
	}
	

	
}
