package fG.Entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class StudentProfile {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	Integer sid;
	@Column(name = "fullname")
	String fullName;
	String email;
	@Column(name = "DOB")
	String dateOfBirth;
	String contact;
//	@Column(name = "userName")
//	String userName;
//	String password;
	
	public Integer getSid() {
		return sid;
	}
	public void setSid(Integer sid) {
		this.sid = sid;
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
	public String getDateOfBirth() {
		return dateOfBirth;
	}
	public void setDateOfBirth(String dateOfBirth) {
		this.dateOfBirth = dateOfBirth;
	}
	public String getContact() {
		return contact;
	}
	public void setContact(String contact) {
		this.contact = contact;
	}
//	public String getUserName() {
//		return userName;
//	}
//	public void setUserName(String userName) {
//		this.userName = userName;
//	}
//	public String getPassword() {
//		return password;
//	}
//	public void setPassword(String password) {
//		this.password = password;
//	}
	@Override
	public String toString() {
		return "studentProfile [sid=" + sid + ", fullName=" + fullName + ", email=" + email + ", dateOfBirth="
				+ dateOfBirth + ", contact=" + contact + "]";
	}
	
}
