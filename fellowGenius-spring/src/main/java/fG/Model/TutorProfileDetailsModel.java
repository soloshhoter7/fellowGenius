package fG.Model;

import java.util.ArrayList;
import java.util.List;

public class TutorProfileDetailsModel {
	Integer tid;
	Integer bookingId;
	String fullName;
	String email;
	String contact;
	String dateOfBirth;
	String institute;
	ArrayList<String> educationalQualifications;
	String price1;
	String price2;
	String price3;
	String  description;
	String  speciality;
	Integer rating;
	Integer reviewCount;
	Integer lessonCompleted;
	String  profilePictureUrl;
	String professionalSkills;
	String currentOrganisation;
	String currentDesignation;
	ArrayList<String> previousOrganisations = new ArrayList<>();
	ArrayList<expertise> areaOfExpertise = new ArrayList<expertise>();;
	Integer profileCompleted;
	Integer yearsOfExperience;
	String linkedInProfile;
	String gst;
	String upiID;
	String lastLogin;
	Boolean isWeeklyCalendarUpdated;
	public Integer getTid() {
		return tid;
	}
	public String getLastLogin() {
		return lastLogin;
	}
	public void setLastLogin(String lastLogin) {
		this.lastLogin = lastLogin;
	}
	public Boolean getIsWeeklyCalendarUpdated() {
		return isWeeklyCalendarUpdated;
	}
	public void setIsWeeklyCalendarUpdated(Boolean isWeeklyCalendarUpdated) {
		this.isWeeklyCalendarUpdated = isWeeklyCalendarUpdated;
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
	public String getInstitute() {
		return institute;
	}
	public void setInstitute(String institute) {
		this.institute = institute;
	}
	public ArrayList<String> getEducationalQualifications() {
		return educationalQualifications;
	}
	public void setEducationalQualifications(ArrayList<String> educationalQualifications) {
		this.educationalQualifications = educationalQualifications;
	}
	public String getPrice1() {
		return price1;
	}
	public void setPrice1(String price1) {
		this.price1 = price1;
	}
	public String getPrice2() {
		return price2;
	}
	public void setPrice2(String price2) {
		this.price2 = price2;
	}
	public String getPrice3() {
		return price3;
	}
	public void setPrice3(String price3) {
		this.price3 = price3;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getSpeciality() {
		return speciality;
	}
	public void setSpeciality(String speciality) {
		this.speciality = speciality;
	}
	public Integer getRating() {
		return rating;
	}
	public void setRating(Integer rating) {
		this.rating = rating;
	}
	public Integer getReviewCount() {
		return reviewCount;
	}
	public void setReviewCount(Integer reviewCount) {
		this.reviewCount = reviewCount;
	}
	public Integer getLessonCompleted() {
		return lessonCompleted;
	}
	public void setLessonCompleted(Integer lessonCompleted) {
		this.lessonCompleted = lessonCompleted;
	}
	public String getProfilePictureUrl() {
		return profilePictureUrl;
	}
	public void setProfilePictureUrl(String profilePictureUrl) {
		this.profilePictureUrl = profilePictureUrl;
	}
	public String getProfessionalSkills() {
		return professionalSkills;
	}
	public void setProfessionalSkills(String professionalSkills) {
		this.professionalSkills = professionalSkills;
	}
	public String getCurrentOrganisation() {
		return currentOrganisation;
	}
	public void setCurrentOrganisation(String currentOrganisation) {
		this.currentOrganisation = currentOrganisation;
	}
	public ArrayList<String> getPreviousOrganisations() {
		return previousOrganisations;
	}
	public void setPreviousOrganisations(ArrayList<String> previousOrganisations) {
		this.previousOrganisations = previousOrganisations;
	}

	public ArrayList<expertise> getAreaOfExpertise() {
		return areaOfExpertise;
	}
	public void setAreaOfExpertise(ArrayList<expertise> areaOfExpertise) {
		this.areaOfExpertise = areaOfExpertise;
	}
	public Integer getProfileCompleted() {
		return profileCompleted;
	}
	public void setProfileCompleted(Integer profileCompleted) {
		this.profileCompleted = profileCompleted;
	}
	public Integer getYearsOfExperience() {
		return yearsOfExperience;
	}
	public void setYearsOfExperience(Integer yearsOfExperience) {
		this.yearsOfExperience = yearsOfExperience;
	}
	public String getLinkedInProfile() {
		return linkedInProfile;
	}
	public void setLinkedInProfile(String linkedInProfile) {
		this.linkedInProfile = linkedInProfile;
	}
	
	public Integer getBookingId() {
		return bookingId;
	}
	public void setBookingId(Integer bookingId) {
		this.bookingId = bookingId;
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
	public String getDateOfBirth() {
		return dateOfBirth;
	}
	public void setDateOfBirth(String dateOfBirth) {
		this.dateOfBirth = dateOfBirth;
	}
	public String getCurrentDesignation() {
		return currentDesignation;
	}
	public void setCurrentDesignation(String currentDesignation) {
		this.currentDesignation = currentDesignation;
	}

	public String getUpiID() {
		return upiID;
	}
	public void setUpiID(String upiID) {
		this.upiID = upiID;
	}
	public String getGst() {
		return gst;
	}
	public void setGst(String gst) {
		this.gst = gst;
	}
	@Override
	public String toString() {
		return "TutorProfileDetailsModel [tid=" + tid + ", bookingId=" + bookingId + ", fullName=" + fullName
				+ ", email=" + email + ", contact=" + contact + ", dateOfBirth=" + dateOfBirth + ", institute="
				+ institute + ", educationalQualifications=" + educationalQualifications + ", price1=" + price1
				+ ", price2=" + price2 + ", price3=" + price3 + ", description=" + description + ", speciality="
				+ speciality + ", rating=" + rating + ", reviewCount=" + reviewCount + ", lessonCompleted="
				+ lessonCompleted + ", profilePictureUrl=" + profilePictureUrl + ", professionalSkills="
				+ professionalSkills + ", currentOrganisation=" + currentOrganisation + ", currentDesignation="
				+ currentDesignation + ", previousOrganisations=" + previousOrganisations + ", areaOfExpertise="
				+ areaOfExpertise + ", profileCompleted=" + profileCompleted + ", yearsOfExperience="
				+ yearsOfExperience + ", linkedInProfile=" + linkedInProfile + ", gst=" + gst + ", upiID=" + upiID
				+ "]";
	}
	
	
	
}
