package fG.Entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;

@Entity
public class TutorProfile {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	Integer tid;
	@Column(name="fullname")
	String fullName;
	String email;
	@Column(name="DOB")
	String dateOfBirth;
	String contact;
	
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
	@Override
	public String toString() {
		return "TutorProfileModel [tid=" + tid + ", fullName=" + fullName + ", email=" + email + ", dateOfBirth="
				+ dateOfBirth + ", contact=" + contact + "]";
	}
	
}
