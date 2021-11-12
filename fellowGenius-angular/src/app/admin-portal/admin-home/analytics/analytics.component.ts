import { Component, OnInit } from '@angular/core';
import { UserActivityAnalytics } from 'src/app/model/userActivityAnalytics';
import { ActivityTimeDetails, UserData } from 'src/app/model/UserData';
import { HttpService } from 'src/app/service/http.service';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css'],
})
export class AnalyticsComponent implements OnInit {
  constructor(private httpService: HttpService) {}
  userAnalytics: UserActivityAnalytics;
  userData: UserData[] = [];
  loginData: ActivityTimeDetails[] = [];
  signUpData: ActivityTimeDetails[] = [];
  meetingData: ActivityTimeDetails[] = [];
  options = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: false,
    headers: [
      'User Id',
      'Full Name',
      'Role',
      'Email',
      'Expert Code',
      'Expertises',
      'Upi_Id',
    ],
    showTitle: true,
    title: 'user data',
    useBom: false,
    removeNewLines: true,
    keys: [
      'userId',
      'fullName',
      'role',
      'email',
      'expertCode',
      'expertises',
      'upiID',
    ],
  };
  loginDataOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: false,
    headers: ['User Id', 'Full Name', 'Role', 'Login Time'],
    showTitle: true,
    title: 'Login data',
    useBom: false,
    removeNewLines: true,
    keys: ['userId', 'fullName', 'role', 'loginTime'],
  };
  signUpDataOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: false,
    headers: ['User Id', 'Full Name', 'Role', 'Sign Up Time', 'Referral Code'],
    showTitle: true,
    title: 'Sign up data',
    useBom: false,
    removeNewLines: true,
    keys: ['userId', 'fullName', 'role', 'signUpTime', 'referralCode'],
  };
  meetingDataOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: false,
    headers: [
      'Meeting Code',
      'Domain',
      'Topic',
      'Expert User Id',
      'Expert Name',
      'Expert Joining Time',
      'Expert Leaving Time',
      'Referral Code',
      'Learner User Id',
      'Learner Name',
      'Learner Joining Time',
      'Learner Leaving Time',
      'Meeting Creation Time',
      'Date of Meeting',
      'Start Time',
      'End Time',
      'Duration (in minutes)',
      'Payment Id',
      'Amount',
      'Status',
      'isRescheduled'
    ],
    showTitle: true,
    title: 'Meeting Details',
    useBom: false,
    removeNewLines: true,
    keys: [
      'meetingId',
      'domain',
      'subject',
      'tutorId',
      'tutorName',
      'expertJoinTime',
      'expertLeavingTime',
      'expertCode',
      'studentId',
      'studentName',
      'learnerJoinTime',
      'learnerLeavingTime',
      'creationTime',
      'dateOfMeeting',
      'startTime',
      'endTime',
      'duration',
      'razorpay_payment_id',
      'amount',
      'approvalStatus',
      'isRescheduled'
    ],
  };

  ngOnInit(): void {
    this.downloadUserData();
    this.downloadLoginData();
    this.downloadSignUpData();
    this.downloadMeetingData();
    this.fetchAnalytics();
  }

  fetchAnalytics() {
    this.httpService.fetchUserAnalytics().subscribe((res) => {
      this.userAnalytics = res;
      console.log(this.userAnalytics);
    });
  }
  downloadUserData() {
    this.httpService.fetchAllUserData().subscribe((res: any) => {
      this.userData = res;
      console.log(this.userData);
    });
  }
  downloadLoginData() {
    this.httpService.fetchAllLoginData().subscribe((res: any) => {
      this.loginData = res;
      console.log(this.loginData);
    });
  }
  downloadSignUpData() {
    this.httpService.fetchAllSignUpData().subscribe((res: any) => {
      this.signUpData = res;
      console.log(this.signUpData);
    });
  }
  downloadMeetingData() {
    this.httpService.fetchAllMeetingsData().subscribe((res: any) => {
      this.meetingData = res;
      console.log(this.meetingData);
    });
  }
}
