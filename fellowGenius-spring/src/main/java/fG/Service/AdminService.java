package fG.Service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.TimeZone;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import fG.Entity.BookingDetails;
import fG.Entity.ReferralActivity;
import fG.Entity.Transactions;
import fG.Entity.TutorAvailabilitySchedule;
import fG.Entity.TutorProfile;
import fG.Entity.TutorProfileDetails;
import fG.Entity.UserReferrals;
import fG.Entity.Users;
import fG.Model.AdminReferralInfoModel;
import fG.Model.BookingDetailsModel;
import fG.Model.ReferralActivityAnalytics;
import fG.Model.ReferralDataModel;
import fG.Model.ReferrerInfoModel;
import fG.Model.TransactionsModel;
import fG.Model.TutorProfileDetailsModel;
import fG.Model.TutorProfileModel;
import fG.Model.UserReferralInfoModel;
import fG.Repository.repositoryReferralActivity;
import fG.Repository.repositoryTransactions;
import fG.Repository.repositoryTutorAvailabilitySchedule;
import fG.Repository.repositoryTutorProfile;
import fG.Repository.repositoryTutorProfileDetails;
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
	
	@Autowired
	repositoryReferralActivity repReferralActivity;
	
	@Autowired
	repositoryTutorProfile repTutorProfile;
	
	@Autowired
	repositoryTutorProfileDetails repTutorProfileDetails;
	
	@Autowired
	repositoryTutorAvailabilitySchedule repTutorAvailabilitySchedule;
	
	@Autowired
    MailService mailService;

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
		SimpleDateFormat sdf = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");
		// TODO Auto-generated method stub
		ArrayList<AdminReferralInfoModel> adminReferralInfoList=
				new ArrayList<AdminReferralInfoModel>();
		List<UserReferrals> userReferralsList=repUserReferrals.findAll();
		//System.out.println(userReferralsList);
		if(userReferralsList!=null) {
			
			for(UserReferrals userReferral:userReferralsList) {
				//1st part-referrer info
				Users referrerUser=userReferral.getUser();
				ReferrerInfoModel referrerUserModel=new ReferrerInfoModel();
				if(referrerUser!=null) {
					
					referrerUserModel.setUserId(String.valueOf(referrerUser.getUserId()));
					referrerUserModel.setEmail(referrerUser.getEmail());
					referrerUserModel.setFullName(userService.fetchUserName(referrerUser.getUserId(),referrerUser.getRole()));
					//System.out.println(ReferrerUserModel);	
				}
				
				
				//2nd part-userReferredInfo
				ArrayList<UserReferralInfoModel> userReferredInfoList=
						new ArrayList<UserReferralInfoModel>();
				List<Users> referredUsers=userReferral.getReferCompleted();
				if(referredUsers!=null) {
					
					for(Users referredUser:referredUsers) {
						
						UserReferralInfoModel userReferredInfoObject=new UserReferralInfoModel();
						userReferredInfoObject.setUserId(String.valueOf(referredUser.getUserId()));
						userReferredInfoObject.setEmail(referredUser.getEmail());
						userReferredInfoObject.setName(userService.fetchUserName(referredUser.getUserId(),referredUser.getRole()));
						
						userReferredInfoList.add(userReferredInfoObject);
					}
					
				}
				
							
				//3rd part
				ArrayList<BookingDetailsModel> meetingSetupInfoList=
						new ArrayList<BookingDetailsModel>();
				List<BookingDetails> referredUsersMeetingsSetup=userReferral.getMeetingSetup();
				
				if(referredUsersMeetingsSetup!=null) {
				
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
						meetingSetupInfoObject.setCreationTime(sdf.format(referredUsersMeetingSetup.getCreatedDate()));
						meetingSetupInfoList.add(meetingSetupInfoObject);
					
					}

				}
								
				//4th part-referrerPaymentDue
				Integer referrerPaymentDue=userReferral.getPaymentDue();
				
				
				//5th part-meetingsCompleted
				ArrayList<BookingDetailsModel> meetingCompletedInfoList=
						new ArrayList<BookingDetailsModel>();
		List<BookingDetails> referredUsersMeetingsCompleted=userReferral.getMeetingCompleted();
		//System.out.println(referredUsersMeetingsCompleted);
			if(referredUsersMeetingsCompleted!=null) {
				
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
					meetingCompletedInfoObject.setCreationTime(sdf.format(referredUsersMeetingCompleted.getCreatedDate()));
					meetingCompletedInfoList.add(meetingCompletedInfoObject);
					//System.out.println(meetingCompletedInfoObject);
				}
				//System.out.println(meetingCompletedInfoList);

			}
								
				AdminReferralInfoModel adminReferralInfoObject=new AdminReferralInfoModel();
				adminReferralInfoObject.setReferrerInfo(referrerUserModel);
				adminReferralInfoObject.setUserReferredInfo(userReferredInfoList);
				adminReferralInfoObject.setMeetingsSetupInfo(meetingSetupInfoList);
				adminReferralInfoObject.setReferrerPaymentDue(referrerPaymentDue);
				adminReferralInfoObject.setMeetingsCompletedInfo(meetingCompletedInfoList);
				System.out.println(adminReferralInfoObject);
				adminReferralInfoList.add(adminReferralInfoObject);
			}
		}
		
		return adminReferralInfoList;
	}
	
	

	public ArrayList<TransactionsModel> getPendingTransactionsInfo() {
		// TODO Auto-generated method stub
		ArrayList<TransactionsModel> transactionsList=new ArrayList<TransactionsModel>();
		List<UserReferrals> referralsList=repUserReferrals.findAll();
		if(referralsList!=null) {
			for(UserReferrals ur:referralsList) {
				if(ur.getPaymentDue()>0) {
					TransactionsModel transaction=new TransactionsModel();
					transaction.setUserId(String.valueOf(ur.getUser().getUserId()));
					transaction.setName(userService.fetchUserName(ur.getUser().getUserId(),ur.getUser().getRole()));
					transaction.setContext("Referral");
					transaction.setRemainingAmount(ur.getPaymentDue());
					transaction.setTotalPaidAmount(getTotalPaidAmount(ur.getUser()));
					transaction.setUpiId(userService.fetchUpiId(ur.getUser()));
					transaction.setTransactionId("");
					transactionsList.add(transaction);
				}
			}
		}
		
		System.out.println(transactionsList);
		return transactionsList;
	}

	public boolean addTransaction(TransactionsModel transaction) {
		// TODO Auto-generated method stub
		System.out.println("Transaction Model is "+ transaction);
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
		
		//deduct the value from payment due
		UserReferrals ur=repUserReferrals.findByUserId(user.getUserId());
		System.out.println("User Referral is "+ ur);
		if(ur!=null) {
			int modifiedPaymentDue=(int) (ur.getPaymentDue()-transaction.getPaidAmount());
			System.out.println("Modified Payment is "+ modifiedPaymentDue);
			ur.setPaymentDue(modifiedPaymentDue);
			repUserReferrals.save(ur);
		}
		System.out.println("Modified User Referral is "+ ur);
		return true;
	}

	public ArrayList<TransactionsModel> getPreviousTransactions() {
		// TODO Auto-generated method stub
		ArrayList<TransactionsModel> transactionsList=new ArrayList<TransactionsModel>();
		
		List<Transactions> repTransactionList=repTransactions.findAll();
		if(repTransactionList!=null) {
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
	
		}
		System.out.println(transactionsList);
		return transactionsList;
	}

	public ReferralActivityAnalytics fetchReferralDataAnalytics() {
		// TODO Auto-generated method stub
		ReferralActivityAnalytics referralAnalytics=new ReferralActivityAnalytics();
	    List<ReferralActivity> referredUsers=repReferralActivity.findAllLinkedinActivities();
	    referralAnalytics.setReferralLinkedinCount(referredUsers.size());
	    referredUsers=repReferralActivity.findAllMailActivities();
	    referralAnalytics.setReferralMailCount(referredUsers.size());
	    referredUsers=repReferralActivity.findAllWhatsappActivities();
	    referralAnalytics.setReferralWhatsappCount(referredUsers.size());
	    System.out.println("Referral Analytics "+ referralAnalytics);
		return referralAnalytics;
	}

	public Double getTotalPaidAmount(Users user) {
		// TODO Auto-generated method stub
		
		
		//sum of all paid transactions of this user
		Double sumOfPaidAmount=0.0;
		
		List<Transactions> transactionsList=repTransactions.findAll();
		
		if(transactionsList!=null) {
			for(Transactions tr:transactionsList) {
				if(tr.getPaidToUserId().getUserId()==user.getUserId()) {
					sumOfPaidAmount=sumOfPaidAmount+tr.getPaidAmount();
				}
			}	
		}
		
		
		System.out.println(sumOfPaidAmount);
		return sumOfPaidAmount;

	}

	public ArrayList<ReferralDataModel> fetchAllReferralData() {
		// TODO Auto-generated method stub
		ArrayList<ReferralDataModel> referralDataList=new ArrayList<ReferralDataModel>();
		List<ReferralActivity> referralActivities=repReferralActivity.findAll();
		SimpleDateFormat sdf = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");
		if(referralActivities!=null) {
			
			for(ReferralActivity ra:referralActivities) {
				
				ReferralDataModel referralData=new ReferralDataModel();
				
				Users user=ra.getUserId();
				referralData.setUserId(String.valueOf(user.getUserId()));
				referralData.setFullName(userService.fetchUserName(user.getUserId(),user.getRole()));
				referralData.setExpertCode(user.getExpertCode());
				referralData.setPlatformType(ra.getType());
				referralData.setSignUpTime(sdf.format(ra.getCreatedDate()));
				
				Users referrerUser=repUsers.idExists(Integer.valueOf(userService.parseReferralCode(user.getExpertCode())));
				referralData.setReferredUser(userService.fetchUserName(referrerUser.getUserId(), referrerUser.getRole()));
				
				referralDataList.add(referralData);
			}
			
		}
		System.out.println("Referral Excel data "+ referralDataList);
		return referralDataList;
	}

	//will run at 23:10 every Sunday
	@Scheduled(cron = "0 10 23 * * 0")
	public void notifyAllExpertsWithNoWeeklySchedule() throws ParseException {
		
		List<TutorProfile> tutors=repTutorProfile.findAll();
		
		List<Integer> tidList=new ArrayList<>();
		for(TutorProfile tutor:tutors) {
			tidList.add(tutor.getTid());
		}
		
		for(int tid:tidList) {
			TutorProfileDetails exp = repTutorProfileDetails.bookingIdExist(tid);
			TimeZone.setDefault(TimeZone.getTimeZone("Asia/Kolkata"));
			SimpleDateFormat sdf = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");
			sdf.setTimeZone(TimeZone.getTimeZone("IST"));
			String date = sdf.format(new Date());
			// todayDate string
			Date now = sdf.parse(date);
			if (exp != null) {
				TutorProfile tut = repTutorProfile.idExist(exp.getTid());
				if (!userService.checkIfExpertHasSchedule(tid)) {
					TutorAvailabilitySchedule sch = repTutorAvailabilitySchedule.idExist(tid);
					if (sch != null) {
						Date lastNotificationTime = sch.getNoScheduleNotificationTime();
						if (lastNotificationTime == null) {
							sch.setNoScheduleNotificationTime(now);
							repTutorAvailabilitySchedule.save(sch);
//							experts.add(tut);
							mailService.sendExpertNoScheduleNotification(tut);
						} else {
							long duration = now.getTime() - lastNotificationTime.getTime();
							long diffInDays = TimeUnit.MILLISECONDS.toDays(duration);
							if (diffInDays >= 6) {
//								experts.add(tut);
								mailService.sendExpertNoScheduleNotification(tut);
							} else {
								System.out.println("less than 7 days !");
							}
						}
					}

				}

			}

		}
	}
	
	
}
