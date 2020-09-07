package fG.Entity;

import java.util.ArrayList;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Lob;

import org.hibernate.annotations.GenericGenerator;

@Entity
public class StudentProfile {

	@Id
//	@GeneratedValue(strategy = GenerationType.AUTO)
	@GeneratedValue(generator = "id_seq")
	@GenericGenerator(
			name = "id_seq", 
			strategy = "fG.Service.IdGenerator")
	Integer sid;
	Integer userBookingId;
	@Column(name = "fullname")
	String fullName;
	String email;
	@Column(name = "DOB")
	String dateOfBirth;
	String contact;
	String profilePictureUrl;
	String linkProfile;
	@Lob
	@Column(columnDefinition="BLOB")
	ArrayList<String> learningAreas;

	
	
	public Integer getUserBookingId() {
		return userBookingId;
	}
	public void setUserBookingId(Integer userBookingId) {
		this.userBookingId = userBookingId;
	}
	public String getLinkProfile() {
		return linkProfile;
	}
	public void setLinkProfile(String linkProfile) {
		this.linkProfile = linkProfile;
	}
	public ArrayList<String> getLearningAreas() {
		return learningAreas;
	}
	public void setLearningAreas(ArrayList<String> learningAreas) {
		this.learningAreas = learningAreas;
	}
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
	public String getProfilePictureUrl() {
		return profilePictureUrl;
	}
	public void setProfilePictureUrl(String profilePictureUrl) {
		this.profilePictureUrl = profilePictureUrl;
	}
	@Override
	public String toString() {
		return "StudentProfile [sid=" + sid + ", userBookingId=" + userBookingId + ", fullName=" + fullName + ", email="
				+ email + ", dateOfBirth=" + dateOfBirth + ", contact=" + contact + ", profilePictureUrl="
				+ profilePictureUrl + ", linkProfile=" + linkProfile + ", learningAreas=" + learningAreas + "]";
	}


	
	
}