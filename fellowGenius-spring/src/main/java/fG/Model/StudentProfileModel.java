package fG.Model;

import java.util.ArrayList;

public class StudentProfileModel {
	Integer sid;
	String fullName;
	String email;
	String dateOfBirth;
	String contact;
	String password;
	String profilePictureUrl;
	String gradeLevel;
	String linkedInProfile;
	ArrayList<String> learningAreas = new ArrayList<String>();

	

	public String getLinkedInProfile() {
		return linkedInProfile;
	}
	public void setLinkedInProfile(String linkedInProfile) {
		this.linkedInProfile = linkedInProfile;
	}
	public ArrayList<String> getLearningAreas() {
		return learningAreas;
	}
	public void setLearningAreas(ArrayList<String> learningAreas) {
		this.learningAreas = learningAreas;
	}
	public String getGradeLevel() {
		return gradeLevel;
	}
	public void setGradeLevel(String gradeLevel) {
		this.gradeLevel = gradeLevel;
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
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	
	public String getProfilePictureUrl() {
		return profilePictureUrl;
	}
	public void setProfilePictureUrl(String profilePictureUrl) {
		this.profilePictureUrl = profilePictureUrl;
	}
	@Override
	public String toString() {
		return "StudentProfileModel [sid=" + sid + ", fullName=" + fullName + ", email=" + email + ", dateOfBirth="
				+ dateOfBirth + ", contact=" + contact + ", password=" + password + ", profilePictureUrl="
				+ profilePictureUrl + ", gradeLevel=" + gradeLevel + ", linkedInProfile=" + linkedInProfile
				+ ", learningAreas=" + learningAreas + "]";
	}

}
