package fG.Model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
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
  Integer paidAmount; //actual amount paid by user after applying credits if any
  Integer rating;
  String reviewText;
  String razorpay_payment_id;
  String razorpay_order_id;
  String razorpay_signature;
  String tutorProfilePictureUrl;
  String isRescheduled;
  String domain;
  String expertCode;
  String creationTime;
  String startTime;
  String endTime;
  String expertJoinTime;
  String learnerJoinTime;
  String expertLeavingTime;
  String learnerLeavingTime;
  String couponCode;

  	
}
