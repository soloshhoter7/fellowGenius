package fG.Entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import org.hibernate.annotations.GenericGenerator;

@Entity
public class TutorProfile {

	@Id
	@GeneratedValue(generator = "id_seq")
	@GenericGenerator(
			name = "id_seq", 
			strategy = "fG.Service.IdGenerator")
	Integer tid;
	
	Integer bookingId;
	
	@Column(name="fullname")
	String fullName;
	String email;
	@Column(name="DOB")
	String dateOfBirth;
	String contact;
	String profilePictureUrl;
	public Integer getTid() {
		return tid;
	}
	public void setTid(Integer tid) {
		this.tid = tid;
	}
	
	public Integer getBookingId() {
		return bookingId;
	}
	public void setBookingId(Integer bookingId) {
		this.bookingId = bookingId;
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
	public String getProfilePictureUrl() {
		return profilePictureUrl;
	}
	public void setProfilePictureUrl(String profilePictureUrl) {
		this.profilePictureUrl = profilePictureUrl;
	}
	@Override
	public String toString() {
		return "TutorProfile [tid=" + tid + ", bookingId=" + bookingId + ", fullName=" + fullName + ", email=" + email
				+ ", dateOfBirth=" + dateOfBirth + ", contact=" + contact + ", profilePictureUrl=" + profilePictureUrl
				+ "]";
	}
	
	
	
	
	
}
