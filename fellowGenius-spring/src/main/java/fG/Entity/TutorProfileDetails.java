package fG.Entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;

@Entity
public class TutorProfileDetails {
	@Id
    Integer tid;
	String fullName;
	public String subject1;
	String subject2;
	String subject3;
	String price1;
	String price2;
	String price3;
	String studyInstitution;
	String majorSubject;
	String graduationYear;
	String  workTitle;
	String  workInstitution;
	String  description;
	String  speciality;
	Integer rating;
	Integer reviewCount;
    Integer lessonCompleted;
	String  profilePictureUrl;
	Integer profileCompleted;
	String gradeLevel;
	
	
	public String getSpeciality() {
		return speciality;
	}
	public void setSpeciality(String speciality) {
		this.speciality = speciality;
	}
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
	public String getSubject1() {
		return subject1;
	}
	public void setSubject1(String subject1) {
		this.subject1 = subject1;
	}
	public String getSubject2() {
		return subject2;
	}
	public void setSubject2(String subject2) {
		this.subject2 = subject2;
	}
	public String getSubject3() {
		return subject3;
	}
	public void setSubject3(String subject3) {
		this.subject3 = subject3;
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
	public String getStudyInstitution() {
		return studyInstitution;
	}
	public void setStudyInstitution(String studyInstitution) {
		this.studyInstitution = studyInstitution;
	}
	public String getMajorSubject() {
		return majorSubject;
	}
	public void setMajorSubject(String majorSubject) {
		this.majorSubject = majorSubject;
	}
	public String getGraduationYear() {
		return graduationYear;
	}
	public void setGraduationYear(String graduationYear) {
		this.graduationYear = graduationYear;
	}
	public String getWorkTitle() {
		return workTitle;
	}
	public void setWorkTitle(String workTitle) {
		this.workTitle = workTitle;
	}
	public String getWorkInstitution() {
		return workInstitution;
	}
	public void setWorkInstitution(String workInstitution) {
		this.workInstitution = workInstitution;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
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
	public Integer getProfileCompleted() {
		return profileCompleted;
	}
	public void setProfileCompleted(Integer profileCompleted) {
		this.profileCompleted = profileCompleted;
	}
	
	public String getGradeLevel() {
		return gradeLevel;
	}
	public void setGradeLevel(String gradeLevel) {
		this.gradeLevel = gradeLevel;
	}
	@Override
	public String toString() {
		return "TutorProfileDetails [tid=" + tid + ", fullName=" + fullName + ", subject1=" + subject1 + ", subject2="
				+ subject2 + ", subject3=" + subject3 + ", price1=" + price1 + ", price2=" + price2 + ", price3="
				+ price3 + ", studyInstitution=" + studyInstitution + ", majorSubject=" + majorSubject
				+ ", graduationYear=" + graduationYear + ", workTitle=" + workTitle + ", workInstitution="
				+ workInstitution + ", description=" + description + ", speciality=" + speciality + ", rating=" + rating
				+ ", reviewCount=" + reviewCount + ", lessonCompleted=" + lessonCompleted + ", profilePictureUrl="
				+ profilePictureUrl + ", profileCompleted=" + profileCompleted + ", gradeLevel=" + gradeLevel + "]";
	}
	
}
