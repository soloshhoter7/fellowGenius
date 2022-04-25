package fG.Entity;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.GenericGenerator;
import org.springframework.data.annotation.CreatedDate;

import fG.Model.ScheduleTime;


@Entity
public class BookingDetails implements Serializable{
	private static final long serialVersionUID = 1L;
	@Id
	@GeneratedValue(generator = "id_seq")
	@GenericGenerator(
			name = "id_seq", 
			strategy = "fG.Service.IdGenerator")
	  Integer bid;
	  Integer endTimeHour;
	  Integer endTimeMinute;
	  Integer duration;
	  String dateOfMeeting;	
	  Integer startTimeHour;
	  Integer startTimeMinute;
	  String description;
	  Integer studentId;
	  Integer tutorId;
	  @Column(name = "meeting_id", unique = true, nullable = false)
	  String meetingId;
	  String approvalStatus;
	  String studentName;
	  String tutorName;
	  Integer bookingCase;
	  String Subject;
	  String domain;
	  Integer rating;
	  String reviewText;
	  String razorpay_payment_id;
	  String razorpay_order_id;
	  String razorpay_signature;
	  Integer amount;
	  Integer paidAmount;
	  String tutorProfilePictureUrl;
	  String isRescheduled="false";
	  Date expertJoinTime;
	  Date learnerJoinTime;
	  Date expertLeavingTime;
	  Date learnerLeavingTime;
	  boolean isLearnerFeedbackDone = false;
	  boolean isExpertFeedbackDone = false;
	  String expertCode;
	  @CreationTimestamp
		@CreatedDate
		@Temporal(TemporalType.TIMESTAMP)
		@Column(name="created_date")
		Date createdDate;

	  String couponCode;

	public String getTutorProfilePictureUrl() {
		return tutorProfilePictureUrl;
	}
	public void setTutorProfilePictureUrl(String tutorProfilePictureUrl) {
		this.tutorProfilePictureUrl = tutorProfilePictureUrl;
	}

	public void setPaidAmount(Integer paidAmount) {
		this.paidAmount = paidAmount;
	}

	public String getCouponCode() {
		return couponCode;
	}

	public void setCouponCode(String couponCode) {
		this.couponCode = couponCode;
	}

	public String getSubject() {
		return Subject;
	}
	public void setSubject(String subject) {
		Subject = subject;
	}
	public Integer getBookingCase() {
		return bookingCase;
	}
	public void setBookingCase(Integer bookingCase) {
		this.bookingCase = bookingCase;
	}
	public Integer getBid() {
		return bid;
	}
	public void setBid(Integer bid) {
		this.bid = bid;
	}
	public Integer getEndTimeHour() {
		return endTimeHour;
	}
	public void setEndTimeHour(Integer endTimeHour) {
		this.endTimeHour = endTimeHour;
	}
	public Integer getEndTimeMinute() {
		return endTimeMinute;
	}
	public void setEndTimeMinute(Integer endTimeMinute) {
		this.endTimeMinute = endTimeMinute;
	}
	public Integer getDuration() {
		return duration;
	}
	public void setDuration(Integer duration) {
		this.duration = duration;
	}
	public String getDateOfMeeting() {
		return dateOfMeeting;
	}
	public void setDateOfMeeting(String dateOfMeeting) {
		this.dateOfMeeting = dateOfMeeting;
	}
	public Integer getStartTimeHour() {
		return startTimeHour;
	}
	public void setStartTimeHour(Integer startTimeHour) {
		this.startTimeHour = startTimeHour;
	}
	public Integer getStartTimeMinute() {
		return startTimeMinute;
	}
	public void setStartTimeMinute(Integer startTimeMinute) {
		this.startTimeMinute = startTimeMinute;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public Integer getStudentId() {
		return studentId;
	}
	public void setStudentId(Integer studentId) {
		this.studentId = studentId;
	}
	public Integer getTutorId() {
		return tutorId;
	}
	public void setTutorId(Integer tutorId) {
		this.tutorId = tutorId;
	}
	public String getMeetingId() {
		return meetingId;
	}
	public void setMeetingId(String meetingId) {
		this.meetingId = meetingId;
	}
	public String getApprovalStatus() {
		return approvalStatus;
	}
	public void setApprovalStatus(String approvalStatus) {
		this.approvalStatus = approvalStatus;
	}
	
	public String getStudentName() {
		return studentName;
	}
	public void setStudentName(String studentName) {
		this.studentName = studentName;
	}
	public String getTutorName() {
		return tutorName;
	}
	public void setTutorName(String tutorName) {
		this.tutorName = tutorName;
	}
	public Integer getRating() {
		return rating;
	}
	public void setRating(Integer rating) {
		this.rating = rating;
	}
	public String getReviewText() {
		return reviewText;
	}
	public void setReviewText(String reviewText) {
		this.reviewText = reviewText;
	}
	public String getRazorpay_payment_id() {
		return razorpay_payment_id;
	}
	public void setRazorpay_payment_id(String razorpay_payment_id) {
		this.razorpay_payment_id = razorpay_payment_id;
	}
	public String getRazorpay_order_id() {
		return razorpay_order_id;
	}
	public void setRazorpay_order_id(String razorpay_order_id) {
		this.razorpay_order_id = razorpay_order_id;
	}
	public String getRazorpay_signature() {
		return razorpay_signature;
	}
	public void setRazorpay_signature(String razorpay_signature) {
		this.razorpay_signature = razorpay_signature;
	}
	
	public Integer getAmount() {
		return amount;
	}
	public void setAmount(Integer amount) {
		this.amount = amount;
	}
	
	public String getIsRescheduled() {
		return isRescheduled;
	}
	public void setIsRescheduled(String isRescheduled) {
		this.isRescheduled = isRescheduled;
	}
	
	public String getDomain() {
		return domain;
	}
	public void setDomain(String domain) {
		this.domain = domain;
	}
	
	public Date getExpertJoinTime() {
		return expertJoinTime;
	}
	public void setExpertJoinTime(Date expertJoinTime) {
		this.expertJoinTime = expertJoinTime;
	}
	public Date getLearnerJoinTime() {
		return learnerJoinTime;
	}
	public void setLearnerJoinTime(Date learnerJoinTime) {
		this.learnerJoinTime = learnerJoinTime;
	}
	public Date getExpertLeavingTime() {
		return expertLeavingTime;
	}
	public void setExpertLeavingTime(Date expertLeavingTime) {
		this.expertLeavingTime = expertLeavingTime;
	}
	public Date getLearnerLeavingTime() {
		return learnerLeavingTime;
	}
	public void setLearnerLeavingTime(Date learnerLeavingTime) {
		this.learnerLeavingTime = learnerLeavingTime;
	}
	
	public String getExpertCode() {
		return expertCode;
	}
	public void setExpertCode(String expertCode) {
		this.expertCode = expertCode;
	}
	public Date getCreatedDate() {
		return createdDate;
	}
	public void setCreatedDate(Date createdDate) {
		this.createdDate = createdDate;
	}
	
	public Integer getPaidAmount() {
		return paidAmount;
	}
	public void setPaidamount(Integer paidAmount) {
		this.paidAmount = paidAmount;
	}
	public static long getSerialversionuid() {
		return serialVersionUID;
	}
	
	@Override
	public boolean equals(Object anObject) {
		if (!(anObject instanceof BookingDetails)) {
			return false;
		}
		BookingDetails otherMember = (BookingDetails) anObject;
		return ((otherMember.getBid().equals(this.getBid())));
	}
	
	@Override
	public String toString() {
		return "BookingDetails [bid=" + bid + ", endTimeHour=" + endTimeHour + ", endTimeMinute=" + endTimeMinute
				+ ", duration=" + duration + ", dateOfMeeting=" + dateOfMeeting + ", startTimeHour=" + startTimeHour
				+ ", startTimeMinute=" + startTimeMinute + ", description=" + description + ", studentId=" + studentId
				+ ", tutorId=" + tutorId + ", meetingId=" + meetingId + ", approvalStatus=" + approvalStatus
				+ ", studentName=" + studentName + ", tutorName=" + tutorName + ", bookingCase=" + bookingCase
				+ ", Subject=" + Subject + ", domain=" + domain + ", rating=" + rating + ", reviewText=" + reviewText
				+ ", razorpay_payment_id=" + razorpay_payment_id + ", razorpay_order_id=" + razorpay_order_id
				+ ", razorpay_signature=" + razorpay_signature + ", amount=" + amount + ", paidAmount=" + paidAmount
				+ ", tutorProfilePictureUrl=" + tutorProfilePictureUrl + ", isRescheduled=" + isRescheduled
				+ ", expertJoinTime=" + expertJoinTime + ", learnerJoinTime=" + learnerJoinTime + ", expertLeavingTime="
				+ expertLeavingTime + ", learnerLeavingTime=" + learnerLeavingTime + ", expertCode=" + expertCode
				+ ", createdDate=" + createdDate + "]";
	}
	
	

}
