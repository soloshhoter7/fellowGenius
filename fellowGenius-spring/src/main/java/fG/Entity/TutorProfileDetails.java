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
	String name;
	String availability;
	String subject;
	String price;
	String gender;
	String college;
	String description;
	Integer rating;
	Integer reviewCount;
	Integer lessonCompleted;
	String profilePictureUrl;
	
	public Integer getTid() {
		return tid;
	}
	public void setTid(Integer tid) {
		this.tid = tid;
	}
	
	
	public String getName() {
		return name;
	}
	
	public void setName(String name) {
		this.name = name;
	}
	public String getAvailability() {
		return availability;
	}
	public void setAvailability(String availability) {
		this.availability = availability;
	}
	public String getSubject() {
		return subject;
	}
	public void setSubject(String subject) {
		this.subject = subject;
	}
	public String getPrice() {
		return price;
	}
	public void setPrice(String price) {
		this.price = price;
	}
	public String getGender() {
		return gender;
	}
	public void setGender(String gender) {
		this.gender = gender;
	}
	public String getCollege() {
		return college;
	}
	public void setCollege(String college) {
		this.college = college;
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
	@Override
	public String toString() {
		return "TutorProfileDetails [tid=" + tid + ", name=" + name + ", availability=" + availability + ", subject="
				+ subject + ", price=" + price + ", gender=" + gender + ", college=" + college + ", description="
				+ description + ", rating=" + rating + ", reviewCount=" + reviewCount + ", lessonCompleted="
				+ lessonCompleted + ", profilePictureUrl=" + profilePictureUrl + "]";
	}
		
}
