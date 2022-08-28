package fG.Entity;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.*;

import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.GenericGenerator;
import org.springframework.data.annotation.CreatedDate;

import fG.Model.ScheduleTime;

@Getter
@Setter
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

	  boolean isExpertPaid=false;

	  String expertTransactionId;

	  @Lob
	  String learnerFeedBack;
	  @Lob
	  String expertFeedback;
	  String expertCode;
	  @CreationTimestamp
	  @CreatedDate
	  @Temporal(TemporalType.TIMESTAMP)
	  @Column(name="created_date")
	  Date createdDate;
	  String couponCode;

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
