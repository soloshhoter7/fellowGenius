package fG.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import fG.Entity.BookingDetails;
import fG.Entity.Transactions;
import fG.Entity.UserReferrals;
import fG.Entity.Users;
import fG.Model.AdminReferralInfoModel;
import fG.Model.BookingDetailsModel;
import fG.Model.ReferrerInfoModel;
import fG.Model.TutorProfileDetailsModel;
import fG.Model.TutorProfileModel;
import fG.Model.UserReferralInfoModel;
import fG.Repository.repositoryTransactions;
import fG.Repository.repositoryUserReferrals;

@Service
public class AdminService {
	
	@Autowired
	UserService userService;
	
	@Autowired
	repositoryUserReferrals repUserReferrals;
	
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
			Users ReferrerUser=userReferral.getUser();
			ReferrerInfoModel ReferrerUserModel=new ReferrerInfoModel();
			ReferrerUserModel.setUserId(String.valueOf(ReferrerUser.getUserId()));
			ReferrerUserModel.setEmail(ReferrerUser.getEmail());
			ReferrerUserModel.setFullName(userService.getFullNameFromUserId(ReferrerUser));
			//System.out.println(ReferrerUserModel);
			
			//2nd part-userReferredInfo
			ArrayList<UserReferralInfoModel> userReferredInfoList=
					new ArrayList<UserReferralInfoModel>();
			List<Users> referredUsers=userReferral.getReferCompleted();
			for(Users referredUser:referredUsers) {
				UserReferralInfoModel userReferredInfoObject=new UserReferralInfoModel();
				userReferredInfoObject.setUserId(String.valueOf(referredUser.getUserId()));
				userReferredInfoObject.setEmail(referredUser.getEmail());
				userReferredInfoObject.setName(userService.getFullNameFromUserId(referredUser));
				
				userReferredInfoList.add(userReferredInfoObject);
			}
						
			//3rd part
			ArrayList<BookingDetailsModel> meetingSetupInfoList=
					new ArrayList<BookingDetailsModel>();
			List<BookingDetails> referredUsersMeetingsSetup=userReferral.getMeetingSetup();
			for(BookingDetails referredUsersMeetingSetup:referredUsersMeetingsSetup) {
				BookingDetailsModel meetingSetupInfoObject=new BookingDetailsModel();
				meetingSetupInfoObject.setBid(referredUsersMeetingSetup.getBid());
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
			
			AdminReferralInfoModel adminReferralInfoObject=new AdminReferralInfoModel();
			adminReferralInfoObject.setReferrerInfo(ReferrerUserModel);
			adminReferralInfoObject.setUserReferredInfo(userReferredInfoList);
			adminReferralInfoObject.setMeetingsSetupInfo(meetingSetupInfoList);
			adminReferralInfoObject.setReferrerPaymentDue(referrerPaymentDue);
			System.out.println(adminReferralInfoObject);
			adminReferralInfoList.add(adminReferralInfoObject);
		}
		return adminReferralInfoList;
	}
	
	

}
