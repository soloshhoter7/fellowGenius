package fG.Entity;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class TutorVerification {
   @Id
   Integer tid;
   String country;
   String state;
   String idType;
   String idNumber;
   String idDocUrl;
   String educationType;
   String educationInstitution;
   String fieldOfStudy;
   String educationDocUrl;
public Integer getTid() {
	return tid;
}
public void setTid(Integer tid) {
	this.tid = tid;
}
public String getCountry() {
	return country;
}
public void setCountry(String country) {
	this.country = country;
}
public String getState() {
	return state;
}
public void setState(String state) {
	this.state = state;
}
public String getIdType() {
	return idType;
}
public void setIdType(String idType) {
	this.idType = idType;
}
public String getIdNumber() {
	return idNumber;
}
public void setIdNumber(String idNumber) {
	this.idNumber = idNumber;
}
public String getIdDocUrl() {
	return idDocUrl;
}
public void setIdDocUrl(String idDocUrl) {
	this.idDocUrl = idDocUrl;
}
public String getEducationType() {
	return educationType;
}
public void setEducationType(String educationType) {
	this.educationType = educationType;
}
public String getEducationInstitution() {
	return educationInstitution;
}
public void setEducationInstitution(String educationInstitution) {
	this.educationInstitution = educationInstitution;
}
public String getFieldOfStudy() {
	return fieldOfStudy;
}
public void setFieldOfStudy(String fieldOfStudy) {
	this.fieldOfStudy = fieldOfStudy;
}
public String getEducationDocUrl() {
	return educationDocUrl;
}
public void setEducationDocUrl(String educationDocUrl) {
	this.educationDocUrl = educationDocUrl;
}
@Override
public String toString() {
	return "tutorVerification [tid=" + tid + ", country=" + country + ", state=" + state + ", idType=" + idType
			+ ", idNumber=" + idNumber + ", idDocUrl=" + idDocUrl + ", educationType=" + educationType
			+ ", educationInstitution=" + educationInstitution + ", fieldOfStudy=" + fieldOfStudy + ", educationDocUrl="
			+ educationDocUrl + "]";
}
   
   
}
