package fG.Entity;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.*;

import fG.Enum.MeetingStatus;
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
	  Integer startTimeHour;
	  Integer startTimeMinute;
	  Integer studentId;
	  Integer tutorId;
	  Integer amount;
	  Integer paidAmount;
	  Integer bookingCase;
	  Integer rating;

	  @Enumerated(EnumType.STRING)
	  MeetingStatus approvalStatus;

	  String dateOfMeeting;
	  String description;
	  String studentName;
	  String tutorName;
	  String Subject;
	  String domain;
	  String reviewText;
	  String razorpay_payment_id;
	  String razorpay_order_id;
	  String razorpay_signature;
	  String tutorProfilePictureUrl;
	  String expertCode;
 	  String couponCode;
	  @Column(name = "meeting_id", unique = true, nullable = false)
	  String meetingId;

	  boolean isExpertPaid=false;

	  String expertTransactionId;

	  @Lob
	  String learnerFeedBack;
	  @Lob
	  String expertFeedback;

	  @CreationTimestamp
	  @CreatedDate
	  @Temporal(TemporalType.TIMESTAMP)
	  @Column(name="created_date")
	  Date createdDate;
	  Date expertJoinTime;
	  Date learnerJoinTime;
	  Date expertLeavingTime;
	  Date learnerLeavingTime;

	  boolean isRescheduled=false;
	  boolean isCancelled=false;

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
