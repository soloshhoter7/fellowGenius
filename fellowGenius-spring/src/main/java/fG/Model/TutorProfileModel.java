package fG.Model;

public class TutorProfileModel {
	Integer tid;
	Integer bookingId;
	String fullName;
	String email;
	String dateOfBirth;
	String contact;
	String profilePictureUrl;
	
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
	public String getProfilePictureUrl() {
		return profilePictureUrl;
	}
	public void setProfilePictureUrl(String profilePictureUrl) {
		this.profilePictureUrl = profilePictureUrl;
	}
	
	public Integer getBookingId() {
		return bookingId;
	}
	public void setBookingId(Integer bookingId) {
		this.bookingId = bookingId;
	}
	@Override
	public String toString() {
		return "TutorProfileModel [tid=" + tid + ", bookingId=" + bookingId + ", fullName=" + fullName + ", email="
				+ email + ", dateOfBirth=" + dateOfBirth + ", contact=" + contact + ", profilePictureUrl="
				+ profilePictureUrl + "]";
	}
	
}
