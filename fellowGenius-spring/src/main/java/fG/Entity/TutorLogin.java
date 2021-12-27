package fG.Entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;

@Entity
public class TutorLogin {

	@Id
	@Column(name="email",length=50)
	String email;
	String password;
	@OneToOne
	@JoinColumn(name="tid")
	private TutorProfile tutorProfile;
	

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
	public TutorProfile getTutorProfile() {
		return tutorProfile;
	}
	public void setTutorProfile(TutorProfile tutorProfile) {
		this.tutorProfile = tutorProfile;
	}
	@Override
	public String toString() {
		return "TutorLogin [email=" + email + ", password=" + password + ", tutorProfile=" + tutorProfile + "]";
	}
	
}
