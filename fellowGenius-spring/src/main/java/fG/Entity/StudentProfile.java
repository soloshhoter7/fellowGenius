package fG.Entity;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.OneToMany;

import org.hibernate.annotations.GenericGenerator;

@Entity
public class StudentProfile {

	@Id
//	@GeneratedValue(strategy = GenerationType.AUTO)
	@GeneratedValue(generator = "id_seq")
	@GenericGenerator(name = "id_seq", strategy = "fG.Service.IdGenerator")
	Integer sid;
	Integer userBookingId;
	@Column(name = "fullname")
	String fullName;
	String email;
	@Column(name = "DOB")
	String dateOfBirth;
	String contact;
	String profilePictureUrl;
	String linkedInProfile;
	Integer yearsOfExperience;
	String currentOrganisation;
	String currentDesignation;
	String highestQualification;
	String expertCode;
	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "userId")
	Set<LearningAreas> learningAreas = new HashSet<>();
    String upiID;
    
	public Integer getUserBookingId() {
		return userBookingId;
	}

	public void setUserBookingId(Integer userBookingId) {
		this.userBookingId = userBookingId;
	}

	public String getLinkedInProfile() {
		return linkedInProfile;
	}

	public void setLinkedInProfile(String linkedInProfile) {
		this.linkedInProfile = linkedInProfile;
	}

	public Set<LearningAreas> getLearningAreas() {
		return learningAreas;
	}

	public void setLearningAreas(Set<LearningAreas> learningAreas) {
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

	public Integer getYearsOfExperience() {
		return yearsOfExperience;
	}

	public void setYearsOfExperience(Integer yearsOfExperience) {
		this.yearsOfExperience = yearsOfExperience;
	}

	public String getCurrentOrganisation() {
		return currentOrganisation;
	}

	public void setCurrentOrganisation(String currentOrganisation) {
		this.currentOrganisation = currentOrganisation;
	}

	public String getCurrentDesignation() {
		return currentDesignation;
	}

	public void setCurrentDesignation(String currentDesignation) {
		this.currentDesignation = currentDesignation;
	}

	public String getHighestQualification() {
		return highestQualification;
	}

	public void setHighestQualification(String highestQualification) {
		this.highestQualification = highestQualification;
	}

	public String getExpertCode() {
		return expertCode;
	}

	public void setExpertCode(String expertCode) {
		this.expertCode = expertCode;
	}

	public String getUpiID() {
		return upiID;
	}

	public void setUpiID(String upiID) {
		this.upiID = upiID;
	}

	@Override
	public String toString() {
		return "StudentProfile [sid=" + sid + ", userBookingId=" + userBookingId + ", fullName=" + fullName + ", email="
				+ email + ", dateOfBirth=" + dateOfBirth + ", contact=" + contact + ", profilePictureUrl="
				+ profilePictureUrl + ", linkedInProfile=" + linkedInProfile + ", yearsOfExperience="
				+ yearsOfExperience + ", currentOrganisation=" + currentOrganisation + ", currentDesignation="
				+ currentDesignation + ", highestQualification=" + highestQualification + ", expertCode=" + expertCode
				+ ", learningAreas=" + learningAreas + ", upiID=" + upiID + "]";
	}

	

}