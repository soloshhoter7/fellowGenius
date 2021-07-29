package fG.Model;

public class BookingDetailsModel {
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
  String meetingId;
  String approvalStatus;
  String studentName;
  String tutorName;
  Integer bookingCase;
  String subject;
  Integer amount;
  Integer rating;
  String reviewText;
  String razorpay_payment_id;
  String razorpay_order_id;
  String razorpay_signature;
  String tutorProfilePictureUrl;
  String isRescheduled;
  
public String getTutorProfilePictureUrl() {
	return tutorProfilePictureUrl;
}
public void setTutorProfilePictureUrl(String tutorProfilePictureUrl) {
	this.tutorProfilePictureUrl = tutorProfilePictureUrl;
}
public String getSubject() {
	return subject;
}
public void setSubject(String subject) {
	this.subject = subject;
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

@Override
public String toString() {
	return "BookingDetailsModel [bid=" + bid + ", endTimeHour=" + endTimeHour + ", endTimeMinute=" + endTimeMinute
			+ ", duration=" + duration + ", dateOfMeeting=" + dateOfMeeting + ", startTimeHour=" + startTimeHour
			+ ", startTimeMinute=" + startTimeMinute + ", description=" + description + ", studentId=" + studentId
			+ ", tutorId=" + tutorId + ", meetingId=" + meetingId + ", approvalStatus=" + approvalStatus
			+ ", studentName=" + studentName + ", tutorName=" + tutorName + ", bookingCase=" + bookingCase
			+ ", subject=" + subject + ", amount=" + amount + ", rating=" + rating + ", reviewText=" + reviewText
			+ ", razorpay_payment_id=" + razorpay_payment_id + ", razorpay_order_id=" + razorpay_order_id
			+ ", razorpay_signature=" + razorpay_signature + ", tutorProfilePictureUrl=" + tutorProfilePictureUrl + "]";
}


  	
}
