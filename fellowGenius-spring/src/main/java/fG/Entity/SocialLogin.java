package fG.Entity;

import javax.persistence.Column;
import javax.persistence.Entity;

import javax.persistence.Id;

@Entity
public class SocialLogin {
	@Id
	@Column(length=50)
	String id;
	Integer tid;
	String fullName;
	String email;
	
	
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
		return "SocialLogin [tid=" + tid + ", fullName=" + fullName + ", email=" + email + ", id=" + id + "]";
	}
	
	

}
