package fG.Model;

public class TutorProfileModel {
	Integer tid;
	String fullName;
	String email;
	String dateOfBirth;
	String contact;
	String password;
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
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	@Override
	public String toString() {
		return "TutorProfileModel [tid=" + tid + ", fullName=" + fullName + ", email=" + email + ", dateOfBirth="
				+ dateOfBirth + ", contact=" + contact + ", password=" + password + "]";
	}
	
	
	
	
}
