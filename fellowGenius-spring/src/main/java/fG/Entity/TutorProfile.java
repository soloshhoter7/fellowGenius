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
	
	@GeneratedValue(generator = "id_seq")
	@GenericGenerator(
			name = "id_seq", 
			strategy = "fG.Service.IdGenerator")
	Integer userBookingId;
	
	@Column(name="fullname")
	String fullName;
	String email;
	@Column(name="DOB")
	String dateOfBirth;
	String contact;
	String addressLine1;
	String addressLine2;
	String country;
	String state;
	String profilePictureUrl;
	String city;
	
	public String getCity() {
		return city;
	}
	public void setCity(String city) {
		this.city = city;
	}
	public String getAddressLine1() {
		return addressLine1;
	}
	public void setAddressLine1(String addressLine1) {
		this.addressLine1 = addressLine1;
	}
	public String getAddressLine2() {
		return addressLine2;
	}
	public void setAddressLine2(String addressLine2) {
		this.addressLine2 = addressLine2;
	}
	public String getCountry() {
		return country;
	}
	public void setCountry(String country) {
		this.country = country;
	}
	public String getState() {
		return state;
	}
	public void setState(String state) {
		this.state = state;
	}
	public String getProfilePictureUrl() {
		return profilePictureUrl;
	}
	public void setProfilePictureUrl(String profilePictureUrl) {
		this.profilePictureUrl = profilePictureUrl;
	}
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
	
	public Integer getUserBookingId() {
		return userBookingId;
	}
	public void setUserBookingId(Integer userBookingId) {
		this.userBookingId = userBookingId;
	}
	@Override
	public String toString() {
		return "TutorProfile [tid=" + tid + ", userBookingId=" + userBookingId + ", fullName=" + fullName + ", email="
				+ email + ", dateOfBirth=" + dateOfBirth + ", contact=" + contact + ", addressLine1=" + addressLine1
				+ ", addressLine2=" + addressLine2 + ", country=" + country + ", state=" + state
				+ ", profilePictureUrl=" + profilePictureUrl + ", city=" + city + "]";
	}
	
}
