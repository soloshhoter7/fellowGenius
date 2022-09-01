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

import lombok.Data;
import org.hibernate.annotations.GenericGenerator;

@Entity
@Data
public class StudentProfile {

	@Id
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
    Integer lessonCompleted=0;

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