package fG.Entity;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.OneToMany;

@Entity
public class TutorProfileDetails {
	@Id
	Integer tid;
	Integer bookingId;
	String fullName;
	String institute;
	
	@Lob
	@Column(columnDefinition="BLOB")
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
	@Column(columnDefinition="BLOB")
	ArrayList<String> previousOrganisations;
	
	@OneToMany(cascade = CascadeType.ALL,
			fetch = FetchType.LAZY,
			mappedBy ="userId")
	Set<ExpertiseAreas> areaOfExpertise = new HashSet<>();
	
	Integer profileCompleted;
	Integer yearsOfExperience;
	String linkedInProfile;
	String upiId;
	String gst;
	boolean verified;
	Integer rescheduleRequests=0;
	String currentDesignation;
	Integer earning=0;
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
	public Set<ExpertiseAreas> getAreaOfExpertise() {
		return areaOfExpertise;
	}
	public void setAreaOfExpertise(Set<ExpertiseAreas> areaOfExpertise) {
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
	
	public Integer getRescheduleRequests() {
		return rescheduleRequests;
	}
	public void setRescheduleRequests(Integer rescheduleRequests) {
		this.rescheduleRequests = rescheduleRequests;
	}
	
	public String getUpiId() {
		return upiId;
	}
	public void setUpiId(String upiId) {
		this.upiId = upiId;
	}
	public boolean isVerified() {
		return verified;
	}
	public void setVerified(boolean verified) {
		this.verified = verified;
	}
	public String getCurrentDesignation() {
		return currentDesignation;
	}
	public void setCurrentDesignation(String currentDesignation) {
		this.currentDesignation = currentDesignation;
	} 
	
	public Integer getEarning() {
		return earning;
	}
	public void setEarning(Integer earning) {
		this.earning = earning;
	}
	
	public String getGst() {
		return gst;
	}
	public void setGst(String gst) {
		this.gst = gst;
	}
	@Override
	public String toString() {
		return "TutorProfileDetails [tid=" + tid + ", bookingId=" + bookingId + ", fullName=" + fullName
				+ ", institute=" + institute + ", educationalQualifications=" + educationalQualifications + ", price1="
				+ price1 + ", price2=" + price2 + ", price3=" + price3 + ", description=" + description
				+ ", speciality=" + speciality + ", rating=" + rating + ", reviewCount=" + reviewCount
				+ ", lessonCompleted=" + lessonCompleted + ", profilePictureUrl=" + profilePictureUrl
				+ ", professionalSkills=" + professionalSkills + ", currentOrganisation=" + currentOrganisation
				+ ", previousOrganisations=" + previousOrganisations + ", areaOfExpertise=" + areaOfExpertise
				+ ", profileCompleted=" + profileCompleted + ", yearsOfExperience=" + yearsOfExperience
				+ ", linkedInProfile=" + linkedInProfile + "]";
	}
	

	
}
