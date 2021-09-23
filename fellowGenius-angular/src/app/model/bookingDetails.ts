import { Time } from '@angular/common';

export class bookingDetails {
  public bid: number;
  public endTimeHour: number;
  public endTimeMinute: number;
  public duration: number;
  public dateOfMeeting: string;
  public startTimeHour: number;
  public startTimeMinute: number;
  public description: string;
  public studentId: number;
  public tutorId: number;
  public meetingId: string;
  public studentName: string;
  public tutorName: string;
  public approvalStatus: string = 'Pending';
  public isLive: boolean = false;
  public timeLeft: String = '';
  public bookingCase: number;
  public subject: string;
  public rating: number;
  public reviewText: string;
  public amount: number;
  public tutorProfilePictureUrl: string;
   razorpay_payment_id;
   razorpay_order_id;
   razorpay_signature;
   expertCode
  public isRescheduled;
  public domain;
}
