package fG.Model;

public class registrationModel {

	 String fullName;
	 String email;
	 String contact;
	 String password;
	 String role;
	 String socialId;
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
	public String getRole() {
		return role;
	}
	public void setRole(String role) {
		this.role = role;
	}
	
	public String getSocialId() {
		return socialId;
	}
	public void setSocialId(String socialId) {
		this.socialId = socialId;
	}
	@Override
	public String toString() {
		return "registrationModel [fullName=" + fullName + ", email=" + email + ", contact=" + contact + ", password="
				+ password + ", role=" + role + ", socialId=" + socialId + "]";
	}
	
	 
}
