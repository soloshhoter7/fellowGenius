package fG.Entity;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;

import fG.Model.expertise;
import lombok.Data;

@Entity
@Data
public class PendingTutorProfileDetails {
	
	@Id
    @GeneratedValue (strategy = GenerationType.AUTO)
	Integer id;
	String fullName;
	String institute;
	String email;
	String contact;
	String dateOfBirth;
	@Lob
	@Column(columnDefinition="BLOB")
	ArrayList<String> educationalQualifications;
	
	String price1;
	String price2;
	String price3;
	String  description;
	String  speciality;
	String  profilePictureUrl;
	String professionalSkills;
	String currentOrganisation;
	String currentDesignation;
	@Column(columnDefinition="BLOB")
	ArrayList<String> previousOrganisations;
	
	@Column(columnDefinition="BLOB")
	ArrayList<expertise> areaOfExpertise;
	
	Integer yearsOfExperience;
	String linkedInProfile;
	String upiId;
	String gst;

	@Override
	public String toString() {
		return "PendingTutorProfileDetails [id=" + id + ", fullName=" + fullName + ", institute=" + institute
				+ ", email=" + email + ", contact=" + contact + ", dateOfBirth=" + dateOfBirth
				+ ", educationalQualifications=" + educationalQualifications + ", price1=" + price1 + ", price2="
				+ price2 + ", price3=" + price3 + ", description=" + description + ", speciality=" + speciality
				+ ", profilePictureUrl=" + profilePictureUrl + ", professionalSkills=" + professionalSkills
				+ ", currentOrganisation=" + currentOrganisation + ", currentDesignation=" + currentDesignation
				+ ", previousOrganisations=" + previousOrganisations + ", areaOfExpertise=" + areaOfExpertise
				+ ", yearsOfExperience=" + yearsOfExperience + ", linkedInProfile=" + linkedInProfile + ", upiId="
				+ upiId + ", gst=" + gst + "]";
	}


}
