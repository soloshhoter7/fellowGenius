package fG.Entity;

import lombok.Data;

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
@Data
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
