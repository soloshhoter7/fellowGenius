package fG.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.transaction.Transaction;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import fG.Entity.BookingDetails;
import fG.Entity.Transactions;
import fG.Entity.UserReferrals;
import fG.Entity.Users;
import fG.Model.AdminReferralInfoModel;
import fG.Model.BookingDetailsModel;
import fG.Model.ReferrerInfoModel;
import fG.Model.TransactionsModel;
import fG.Model.TutorProfileDetailsModel;
import fG.Model.TutorProfileModel;
import fG.Model.UserReferralInfoModel;
import fG.Repository.repositoryTransactions;
import fG.Repository.repositoryUserReferrals;
import fG.Repository.repositoryUsers;

@Service
public class AdminService {
	
	@Autowired
	UserService userService;
	
	@Autowired
	repositoryUserReferrals repUserReferrals;
	
	@Autowired
	repositoryUsers repUsers;
	
	@Autowired 
	repositoryTransactions repTransactions;

	public TutorProfileDetailsModel getTutorProfileDetails(Integer tid) {
		TutorProfileDetailsModel tut = new TutorProfileDetailsModel();
		TutorProfileModel tutP = new TutorProfileModel();
		tut = userService.getTutorProfileDetails(tid);
		tutP = userService.getTutorDetails(tid.toString());
		tut.setEmail(tutP.getEmail());
		tut.setDateOfBirth(tutP.getDateOfBirth());
		tut.setContact(tutP.getContact());
		return tut;
	}

	public ArrayList<AdminReferralInfoModel> getAdminReferralInfo() {
		
		// TODO Auto-generated method stub
		ArrayList<AdminReferralInfoModel> adminReferralInfoList=
				new ArrayList<AdminReferralInfoModel>();
		List<UserReferrals> userReferralsList=repUserReferrals.findAll();
		//System.out.println(userReferralsList);
		
		for(UserReferrals userReferral:userReferralsList) {
			//1st part-referrer info
			Users referrerUser=userReferral.getUser();
			ReferrerInfoModel referrerUserModel=new ReferrerInfoModel();
			referrerUserModel.setUserId(String.valueOf(referrerUser.getUserId()));
			referrerUserModel.setEmail(referrerUser.getEmail());
			referrerUserModel.setFullName(userService.fetchUserName(referrerUser.getUserId(),referrerUser.getRole()));
			//System.out.println(ReferrerUserModel);
			
			//2nd part-userReferredInfo
			ArrayList<UserReferralInfoModel> userReferredInfoList=
					new ArrayList<UserReferralInfoModel>();
			List<Users> referredUsers=userReferral.getReferCompleted();
			for(Users referredUser:referredUsers) {
				UserReferralInfoModel userReferredInfoObject=new UserReferralInfoModel();
				userReferredInfoObject.setUserId(String.valueOf(referredUser.getUserId()));
				userReferredInfoObject.setEmail(referredUser.getEmail());
				userReferredInfoObject.setName(userService.fetchUserName(referredUser.getUserId(),referredUser.getRole()));
				
				userReferredInfoList.add(userReferredInfoObject);
			}
						
			//3rd part
			ArrayList<BookingDetailsModel> meetingSetupInfoList=
					new ArrayList<BookingDetailsModel>();
			List<BookingDetails> referredUsersMeetingsSetup=userReferral.getMeetingSetup();
			for(BookingDetails referredUsersMeetingSetup:referredUsersMeetingsSetup) {
				BookingDetailsModel meetingSetupInfoObject=new BookingDetailsModel();
				meetingSetupInfoObject.setBid(referredUsersMeetingSetup.getBid());
				meetingSetupInfoObject.setStudentName(referredUsersMeetingSetup.getStudentName());
				meetingSetupInfoObject.setTutorName(referredUsersMeetingSetup.getTutorName());
				meetingSetupInfoObject.setStartTimeHour(referredUsersMeetingSetup.getStartTimeHour());
				meetingSetupInfoObject.setStartTimeMinute(referredUsersMeetingSetup.getStartTimeMinute());
				meetingSetupInfoObject.setEndTimeHour(referredUsersMeetingSetup.getEndTimeHour());
				meetingSetupInfoObject.setEndTimeMinute(referredUsersMeetingSetup.getEndTimeMinute());
				meetingSetupInfoObject.setDuration(referredUsersMeetingSetup.getDuration());
				meetingSetupInfoObject.setAmount(referredUsersMeetingSetup.getAmount());
				meetingSetupInfoObject.setDateOfMeeting(referredUsersMeetingSetup.getDateOfMeeting());
				meetingSetupInfoList.add(meetingSetupInfoObject);
			}
			
			//4th part-referrerPaymentDue
			Integer referrerPaymentDue=userReferral.getPaymentDue();
			
			
			//5th part-meetingsCompleted
			ArrayList<BookingDetailsModel> meetingCompletedInfoList=
					new ArrayList<BookingDetailsModel>();
	List<BookingDetails> referredUsersMeetingsCompleted=userReferral.getMeetingCompleted();
	//System.out.println(referredUsersMeetingsCompleted);
	
			for(BookingDetails referredUsersMeetingCompleted:referredUsersMeetingsCompleted) {
				BookingDetailsModel meetingCompletedInfoObject=new BookingDetailsModel();
				meetingCompletedInfoObject.setBid(referredUsersMeetingCompleted.getBid());
				meetingCompletedInfoObject.setStudentName(referredUsersMeetingCompleted.getStudentName());
				meetingCompletedInfoObject.setTutorName(referredUsersMeetingCompleted.getTutorName());
				meetingCompletedInfoObject.setStartTimeHour(referredUsersMeetingCompleted.getStartTimeHour());
				meetingCompletedInfoObject.setStartTimeMinute(referredUsersMeetingCompleted.getStartTimeMinute());
				meetingCompletedInfoObject.setEndTimeHour(referredUsersMeetingCompleted.getEndTimeHour());
				meetingCompletedInfoObject.setEndTimeMinute(referredUsersMeetingCompleted.getEndTimeMinute());
				meetingCompletedInfoObject.setDuration(referredUsersMeetingCompleted.getDuration());
				meetingCompletedInfoObject.setAmount(referredUsersMeetingCompleted.getAmount());
				meetingCompletedInfoObject.setDateOfMeeting(referredUsersMeetingCompleted.getDateOfMeeting());
				meetingCompletedInfoList.add(meetingCompletedInfoObject);
				//System.out.println(meetingCompletedInfoObject);
			}
			//System.out.println(meetingCompletedInfoList);
			
			AdminReferralInfoModel adminReferralInfoObject=new AdminReferralInfoModel();
			adminReferralInfoObject.setReferrerInfo(referrerUserModel);
			adminReferralInfoObject.setUserReferredInfo(userReferredInfoList);
			adminReferralInfoObject.setMeetingsSetupInfo(meetingSetupInfoList);
			adminReferralInfoObject.setReferrerPaymentDue(referrerPaymentDue);
			adminReferralInfoObject.setMeetingsCompletedInfo(meetingCompletedInfoList);
			System.out.println(adminReferralInfoObject);
			adminReferralInfoList.add(adminReferralInfoObject);
		}
		return adminReferralInfoList;
	}
	
	public double remainingAmount(Users user) {
		UserReferrals ur=repUserReferrals.findByUserId(user.getUserId());
		Double totalAmount=(double)ur.getPaymentDue();
		Double remainingAmount=0.0;
		
		//sum of all paid transactions of this user
		Double sumOfPaidAmount=0.0;
		List<Transactions> TransactionsList=repTransactions.findAll();
		
		for(Transactions tr:TransactionsList) {
			if(tr.getPaidToUserId().getUserId()==user.getUserId()) {
				sumOfPaidAmount=sumOfPaidAmount+tr.getPaidAmount();
			}
		}
		remainingAmount=totalAmount-sumOfPaidAmount;
		System.out.println(remainingAmount);
		return remainingAmount;
	}

	public ArrayList<TransactionsModel> getPendingTransactionsInfo() {
		// TODO Auto-generated method stub
		ArrayList<TransactionsModel> transactionsList=new ArrayList<TransactionsModel>();
		List<UserReferrals> referralsList=repUserReferrals.findAll();
		
		for(UserReferrals ur:referralsList) {
			if(remainingAmount(ur.getUser())>0) {
				TransactionsModel transaction=new TransactionsModel();
				transaction.setUserId(String.valueOf(ur.getUser().getUserId()));
				transaction.setName(userService.fetchUserName(ur.getUser().getUserId(),ur.getUser().getRole()));
				transaction.setContext("Referral");
				transaction.setTotalAmount(ur.getPaymentDue());
				transaction.setRemainingAmount(remainingAmount(ur.getUser()));
				transaction.setSumPaidAmount(transaction.getTotalAmount()-transaction.getRemainingAmount());
				transaction.setUpiId(userService.fetchUpiId(ur.getUser()));
				transaction.setTransactionId("");
				transactionsList.add(transaction);
			}
		}
		System.out.println(transactionsList);
		return transactionsList;
	}

	public boolean addTransaction(TransactionsModel transaction) {
		// TODO Auto-generated method stub
		Transactions transactionObj=new Transactions();
		Users user=repUsers.idExists(Integer.parseInt(transaction.getUserId()));
		transactionObj.setPaidToUserId(user);
		transactionObj.setTransactionDate(new Date());
		transactionObj.setPaidAmount(transaction.getPaidAmount());
		transactionObj.setContext("Referral");
		transactionObj.setUpiId(transaction.getUpiId());
		transactionObj.setTransactionId(transaction.getTransactionId());
		System.out.println(transactionObj);
		repTransactions.save(transactionObj);
		
		
		return true;
	}

	public ArrayList<TransactionsModel> getPreviousTransactions() {
		// TODO Auto-generated method stub
		ArrayList<TransactionsModel> transactionsList=new ArrayList<TransactionsModel>();
		
		List<Transactions> repTransactionList=repTransactions.findAll();
		for(Transactions repTransaction:repTransactionList) {
			TransactionsModel transactions=new TransactionsModel();
			transactions.setUserId(String.valueOf(repTransaction.getPaidToUserId().getUserId()));
			transactions.setContext(repTransaction.getContext());
			transactions.setName(userService.fetchUserName(repTransaction.getPaidToUserId().getUserId(),
					repTransaction.getPaidToUserId().getRole()));
			transactions.setPaidAmount(repTransaction.getPaidAmount());
			transactions.setTransactionId(repTransaction.getTransactionId());
			transactions.setUpiId(repTransaction.getUpiId());
			transactionsList.add(transactions);
		}
		System.out.println(transactionsList);
		return transactionsList;
	}
	
	

}
