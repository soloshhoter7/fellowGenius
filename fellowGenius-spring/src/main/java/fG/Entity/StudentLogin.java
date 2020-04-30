package fG.Entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;


@Entity
public class StudentLogin {
	@Id
	@Column(name="email",length=50)
	String email;

	String password;
     
	@OneToOne
	@JoinColumn(name="sid")
	private StudentProfile studentProfile;
	
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	
	public StudentProfile getStudentProfile() {
		return studentProfile;
	}
	public void setStudentProfile(StudentProfile studentProfile) {
		this.studentProfile = studentProfile;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	@Override
	public String toString() {
		return "StudentLogin [email=" + email + ", password=" + password + ", studentProfile=" + studentProfile + "]";
	}
	
	
	
	
}
