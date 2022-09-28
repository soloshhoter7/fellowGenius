package fG.Service;

import java.net.URISyntaxException;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Random;
import java.util.TimeZone;
import java.util.concurrent.TimeUnit;

import fG.Enum.WhatsappMessageType;
import fG.Mapper.BookingDetailsMapper;
import fG.Mapper.TutorProfileDetailsMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import fG.DAO.Dao;
import fG.DAO.MeetingDao;
import fG.Entity.AppInfo;
import fG.Entity.BookingDetails;
import fG.Entity.Cashback;
import fG.Entity.CategoryList;
import fG.Entity.ExpertiseAreas;
import fG.Entity.FGCredits;
import fG.Entity.FeaturedExperts;
import fG.Entity.LearningAreas;
import fG.Entity.Notification;
import fG.Entity.PendingTutorProfileDetails;
import fG.Entity.ReferralActivity;
import fG.Entity.ScheduleData;
import fG.Entity.SocialLogin;
import fG.Entity.StudentLogin;
import fG.Entity.StudentProfile;
import fG.Entity.SubcategoryList;
import fG.Entity.TutorAvailabilitySchedule;
import fG.Entity.TutorProfile;
import fG.Entity.TutorProfileDetails;
import fG.Entity.UserActivity;
import fG.Entity.UserReferrals;
import fG.Entity.Users;
import fG.Model.AppInfoModel;
import fG.Model.AuthenticationResponse;
import fG.Model.BookingDetailsModel;
import fG.Model.CashbackEarned;
import fG.Model.CashbackInfo;
import fG.Model.Category;
import fG.Model.FGCreditModel;
import fG.Model.FeaturedExpertsModel;
import fG.Model.NotificationModel;
import fG.Model.ResponseModel;
import fG.Model.ScheduleTime;
import fG.Model.SocialLoginModel;
import fG.Model.StudentLoginModel;
import fG.Model.StudentProfileModel;
import fG.Model.TutorAvailabilityScheduleModel;
import fG.Model.TutorProfileDetailsModel;
import fG.Model.TutorProfileModel;
import fG.Model.TutorVerificationModel;
import fG.Model.UserActivityAnalytics;
import fG.Model.UserActivityModel;
import fG.Model.UserDataModel;
import fG.Model.UserReferralInfoModel;
import fG.Model.expertise;
import fG.Model.registrationModel;
import fG.Repository.repositoryAppInfo;
import fG.Repository.repositoryBooking;
import fG.Repository.repositoryCashback;
import fG.Repository.repositoryCategory;
import fG.Repository.repositoryExpertiseAreas;
import fG.Repository.repositoryFGCredits;
import fG.Repository.repositoryFeaturedExperts;
import fG.Repository.repositoryNotification;
import fG.Repository.repositoryPendingTutorProfileDetails;
import fG.Repository.repositoryReferralActivity;
import fG.Repository.repositorySocialLogin;
import fG.Repository.repositoryStudentLogin;
import fG.Repository.repositoryStudentProfile;
import fG.Repository.repositorySubCategoryList;
import fG.Repository.repositoryTutorAvailabilitySchedule;
import fG.Repository.repositoryTutorProfile;
import fG.Repository.repositoryTutorProfileDetails;
import fG.Repository.repositoryUserActivity;
import fG.Repository.repositoryUserReferrals;
import fG.Repository.repositoryUsers;

@Service
public class UserService implements UserDetailsService {

	@Autowired
	Dao dao;

	@Autowired
	TutorProfileDetailsMapper tutorProfileDetailsMapper;

	@Autowired
	BookingDetailsMapper bookingDetailsMapper;

	@Autowired
	MeetingDao meetingDao;

	@Autowired
	ScheduleService scheduleService;

	@Autowired
	MeetingService meetingService;
	
	@Autowired
	AdminService adminService;


	@Autowired
	repositoryUsers repUsers;

	
	@Autowired
	repositoryTutorProfile repTutorProfile;

	@Autowired
	repositoryTutorProfileDetails repTutorProfileDetails;

	@Autowired
	repositoryCategory repCategory;

	@Autowired
	repositorySubCategoryList repSubcategory;

	@Autowired
	repositoryNotification repNotification;

	@Autowired
	repositoryStudentProfile repStudentProfile;

	@Autowired
	repositoryAppInfo repAppInfo;

	@Autowired
	repositoryUserActivity repUserActivity;

	@Autowired
	repositoryBooking repBooking;
	
	@Autowired
	repositoryFGCredits repFGCredit;
	
	@Autowired
	repositoryCashback repCashback;

	@Autowired
	repositoryExpertiseAreas repExpertiseAreas;

	@Autowired
	repositoryPendingTutorProfileDetails repPendingTutorProfileDetails;

	@Autowired
	repositoryFeaturedExperts repFeaturedExperts;

	@Autowired
	repositoryTutorAvailabilitySchedule repTutorAvailabilitySchedule;
	
	@Autowired
	repositoryUserReferrals repUserReferrals;
	
	@Autowired
	repositoryReferralActivity repReferralActivity;

	@Autowired
	private BCryptPasswordEncoder encoder;

	@Autowired
	MailService mailService;

	@Autowired
	WhatsappService whatsappService;

	@Autowired
	NotificationService notificationService;

	public String getLatestReferralStatus(Integer userId,UserReferrals userRef) {
		String status="";
		System.out.println("Referred user id "+userId);
		List<BookingDetails> meetingsCompleted=userRef.getMeetingCompleted();
		//System.out.println("Referred Meeting Completed "+ meetingsCompleted);
		List<BookingDetails> meetingsSetup=userRef.getMeetingSetup();
		//System.out.println("Referred Meeting Setup "+ meetingsSetup);
		List<Users> registeredUsers=userRef.getReferCompleted();
		//System.out.println("Referred Users : "+ registeredUsers);
		//check for meeting completed
		for(BookingDetails meetCompleted:meetingsCompleted) {
			//System.out.println("meeting id: "+meetCompleted.getStudentId());
			if(meetCompleted.getStudentId().equals(userId)) {
				status="Meeting Completed";
				//System.out.println(status);
				return status;
			}
		}
		
		//check for meeting setups
		for(BookingDetails meetSetup:meetingsSetup) {
			if(meetSetup.getStudentId().equals(userId)) {
				status="Meeting Setup";
				//System.out.println(status);
				return status;
			}
		}
		
		//check for offer expired
		
		
		//check for registered and offer expired
		for(Users user:registeredUsers) {
			if(user.getUserId().equals(userId)) {
			Integer diffInTime=meetingService.findDaysFromRegistration(user.getUserId(), new Date());
			AppInfo thresholdTime=repAppInfo.keyExist("ReferralExpirationTime");
			
			if(diffInTime > Integer.valueOf(thresholdTime.getValue())) {
				status="Offer Expired";
			}else {
				status="Registered";
			}
				return status;
			}
		}
		return status;
	}
	
	public List<UserReferralInfoModel> getUserReferralInformationEvents(String userId) throws ParseException{
		List<UserReferralInfoModel> referrerDetails = new ArrayList<UserReferralInfoModel>();
		UserReferrals userRef = repUserReferrals.findByUserId(Integer.valueOf(userId));
		System.out.println(userRef);
		//getting user referral information events
		//getting the registered people with timestamp
		if(userRef!=null) {
			List<Users> registeredUsers = userRef.getReferCompleted();
			
			//for registered users
			for(Users user:registeredUsers) {
				UserReferralInfoModel urf = new UserReferralInfoModel();
				urf.setEmail(user.getEmail());
				urf.setName(fetchUserName(user.getUserId(),user.getRole()));
				urf.setStatus(getLatestReferralStatus(user.getUserId(), userRef));
				urf.setTimeStamp(user.getCreatedDate());
				referrerDetails.add(urf);
			}
		}
		//sorting on the basis of timestamp
		referrerDetails.sort((r1,r2) -> r1.getTimeStamp().compareTo(r2.getTimeStamp()));
		Collections.reverse(referrerDetails);
		System.out.println(referrerDetails);
		return referrerDetails;
	}
	
	public boolean savePendingTutor(TutorProfileDetailsModel tutorModel)
			throws IllegalArgumentException, IllegalAccessException {
		PendingTutorProfileDetails ptLoaded = repPendingTutorProfileDetails.emailExist(tutorModel.getEmail());
		if (ptLoaded == null) {
			// saving pt to generate id
			PendingTutorProfileDetails pt = new PendingTutorProfileDetails();
			pt.setEmail(tutorModel.getEmail());
			repPendingTutorProfileDetails.save(pt);
			// fetching pt with email to get id
			PendingTutorProfileDetails tutProfileDetails = repPendingTutorProfileDetails
					.emailExist(tutorModel.getEmail());

			// personal info
			tutProfileDetails.setFullName(tutorModel.getFullName());
			tutProfileDetails.setEmail(tutorModel.getEmail());
			tutProfileDetails.setContact(tutorModel.getContact());
			tutProfileDetails.setDateOfBirth(tutorModel.getDateOfBirth());
			tutProfileDetails.setUpiId(tutorModel.getUpiID());
			tutProfileDetails.setGst(tutorModel.getGst());
			tutProfileDetails.setLinkedInProfile(tutorModel.getLinkedInProfile());
			// education
			tutProfileDetails.setInstitute(tutorModel.getInstitute());
			tutProfileDetails.setEducationalQualifications(tutorModel.getEducationalQualifications());
			// description and speciality
			tutProfileDetails.setDescription(tutorModel.getDescription());
			tutProfileDetails.setSpeciality(tutorModel.getSpeciality());
			// work experience
			tutProfileDetails.setYearsOfExperience(tutorModel.getYearsOfExperience());
			tutProfileDetails.setCurrentOrganisation(tutorModel.getCurrentOrganisation());
			tutProfileDetails.setCurrentDesignation(tutorModel.getCurrentDesignation());
			tutProfileDetails.setPreviousOrganisations(tutorModel.getPreviousOrganisations());
			// photo
			tutProfileDetails.setProfilePictureUrl(tutorModel.getProfilePictureUrl());
			// domain
			tutProfileDetails.setPrice1(tutorModel.getPrice1());
			tutProfileDetails.setPrice2(tutorModel.getPrice2());
			tutProfileDetails.setPrice3(tutorModel.getPrice3());
			tutProfileDetails.setAreaOfExpertise(tutorModel.getAreaOfExpertise());

			repPendingTutorProfileDetails.save(tutProfileDetails);
			return true;
		} else {
			return false;
		}

	}

	public void updatePendingTutor(TutorProfileDetailsModel tutorModel) {

		// fetching pt with email to get id
		PendingTutorProfileDetails tutProfileDetails = repPendingTutorProfileDetails.emailExist(tutorModel.getEmail());

		// personal info
		tutProfileDetails.setFullName(tutorModel.getFullName());
		tutProfileDetails.setEmail(tutorModel.getEmail());
		tutProfileDetails.setContact(tutorModel.getContact());
		tutProfileDetails.setDateOfBirth(tutorModel.getDateOfBirth());
		tutProfileDetails.setUpiId(tutorModel.getUpiID());
		tutProfileDetails.setLinkedInProfile(tutorModel.getLinkedInProfile());
		// education
		tutProfileDetails.setInstitute(tutorModel.getInstitute());
		tutProfileDetails.setEducationalQualifications(tutorModel.getEducationalQualifications());
		// description and speciality
		tutProfileDetails.setDescription(tutorModel.getDescription());
		tutProfileDetails.setSpeciality(tutorModel.getSpeciality());
		// work experience
		tutProfileDetails.setYearsOfExperience(tutorModel.getYearsOfExperience());
		tutProfileDetails.setCurrentOrganisation(tutorModel.getCurrentOrganisation());
		tutProfileDetails.setCurrentDesignation(tutorModel.getCurrentDesignation());
		tutProfileDetails.setPreviousOrganisations(tutorModel.getPreviousOrganisations());
		// photo
		tutProfileDetails.setProfilePictureUrl(tutorModel.getProfilePictureUrl());
		// domain
		tutProfileDetails.setPrice1(tutorModel.getPrice1());
		tutProfileDetails.setPrice2(tutorModel.getPrice2());
		tutProfileDetails.setPrice3(tutorModel.getPrice3());
		tutProfileDetails.setAreaOfExpertise(tutorModel.getAreaOfExpertise());
		System.out.println(tutProfileDetails);
		repPendingTutorProfileDetails.save(tutProfileDetails);
	}

	public String validateUser(String email, String password, String method) {
		System.out.println(email + " : " + password + " : " + method);
		Users userLogin = repUsers.emailExist(email);
		Date lastLogin = new Date();
		UserActivity userActivity = new UserActivity();
		if (userLogin != null) {
			if (encoder.matches("social", method)) {
				System.out.println("entered social");
				userActivity.setUserId(userLogin);
				userActivity.setType("login");
				userLogin.setLastLogin(lastLogin);

				if (encoder.matches(password, userLogin.getSocialId())
						|| encoder.matches("N/A", userLogin.getSocialId())) {

					repUsers.save(userLogin);
					repUserActivity.save(userActivity);
					System.out.println("social id exists and matches");
					return String.valueOf(userLogin.getUserId());
				} else {
					return null;
				}
			} else if (encoder.matches("manual", method)) {
				System.out.println("entered manual");
				userActivity.setUserId(userLogin);
				userActivity.setType("login");
				userLogin.setLastLogin(lastLogin);
				if (encoder.matches(password, userLogin.getPassword())) {
					System.out.println("password matches!");
					repUsers.save(userLogin);
					repUserActivity.save(userActivity);
					return String.valueOf(userLogin.getUserId());
				} else {
					return null;
				}
			} else {
				return null;
			}
		} else {
			return null;
		}
	}

	public String validateAdmin(String email, String password) {
		AppInfo adminEmail = repAppInfo.keyExist("admin_id");
		AppInfo adminPassword = repAppInfo.keyExist("admin_password");
		if (email.equals(adminEmail.getValue()) && password.equals(adminPassword.getValue())) {
			return adminEmail.getValue();
		} else {
			return null;
		}

	}

	public User loadUserByUserId(String userId) {
		List<SimpleGrantedAuthority> authorities = new ArrayList<>();
		if (!userId.equals(repAppInfo.keyExist("admin_id").getValue())) {
			Users user = repUsers.idExists(Integer.valueOf(userId));
			if (user != null) {
				authorities.add(new SimpleGrantedAuthority(user.getRole()));
				return new User(userId, "", authorities);
			} else {
				return null;
			}
		} else {
			authorities.add(new SimpleGrantedAuthority("Admin"));
			return new User(userId, "", authorities);
		}

	}

	public boolean verifyExpert(String id) {
		String whatsappMessage = "";
		PendingTutorProfileDetails pt = repPendingTutorProfileDetails.idExist(Integer.valueOf(id));
		TutorProfile tutorProfile = new TutorProfile();
		tutorProfile.setContact(pt.getContact());
		tutorProfile.setEmail(pt.getEmail());
		tutorProfile.setFullName(pt.getFullName());
		tutorProfile.setBookingId(genUserBookingId());
		tutorProfile.setDateOfBirth(pt.getDateOfBirth());
		tutorProfile.setProfilePictureUrl(pt.getProfilePictureUrl());
		UserActivity userActivity = new UserActivity();
		userActivity.setType("signup");
		if (dao.saveTutorProfile(tutorProfile)) {

			Users user = new Users();
			user.setEmail(pt.getEmail());
			user.setPassword(encoder.encode("N/A"));
			user.setUserId(tutorProfile.getTid());
			user.setSocialId(encoder.encode("N/A"));
			user.setRole("Expert");

			dao.saveUserLogin(user);
			// creating tutor profile details tuple
			TutorProfileDetails tutProfileDetails = new TutorProfileDetails();
			tutProfileDetails.setTid(tutorProfile.getTid());
			tutProfileDetails.setFullName(pt.getFullName());
			tutProfileDetails.setProfileCompleted(12);
			tutProfileDetails.setLessonCompleted(0);
			tutProfileDetails.setRating(0);
			tutProfileDetails.setReviewCount(0);
//			tutProfileDetails.setPrice1("400");
			tutProfileDetails.setBookingId(tutorProfile.getBookingId());

			dao.saveTutorID(tutProfileDetails);
			// creating tutor schedule tuple
			TutorAvailabilitySchedule tutSchedule = new TutorAvailabilitySchedule();
			tutSchedule.setTid(tutorProfile.getBookingId());
			tutSchedule.setFullName(tutorProfile.getFullName());
			tutSchedule.setIsAvailable("yes");

			dao.saveTutorAvailbilitySchedule(tutSchedule);
			userActivity.setUserId(user);

			repUserActivity.save(userActivity);

			tutProfileDetails.setTid(tutorProfile.getTid());
			tutProfileDetails.setBookingId(tutorProfile.getBookingId());
			// personal info

			tutProfileDetails.setFullName(pt.getFullName());
			tutProfileDetails.setUpiId(pt.getUpiId());
			tutProfileDetails.setGst(pt.getGst());
			tutProfileDetails.setLinkedInProfile(pt.getLinkedInProfile());
			// education
			tutProfileDetails.setInstitute(pt.getInstitute());
			tutProfileDetails.setEducationalQualifications(pt.getEducationalQualifications());
			// description and speciality
			tutProfileDetails.setDescription(pt.getDescription());
			tutProfileDetails.setSpeciality(pt.getSpeciality());
			// work experience
			tutProfileDetails.setYearsOfExperience(pt.getYearsOfExperience());
			tutProfileDetails.setCurrentOrganisation(pt.getCurrentOrganisation());
			tutProfileDetails.setCurrentDesignation(pt.getCurrentDesignation());
			tutProfileDetails.setPreviousOrganisations(pt.getPreviousOrganisations());
			// photo
			tutProfileDetails.setProfilePictureUrl(pt.getProfilePictureUrl());
			// domain
			tutProfileDetails.setPrice1(pt.getPrice1());

//			TutorProfileDetails tutProfileDetails = new TutorProfileDetails();
			TutorProfileDetails tutorProfileDetailsLoaded = dao.getTutorProfileDetails(tutorProfile.getTid());
			// for setting the expertise areas
			Integer minPrice = Integer.MAX_VALUE;
			Integer maxPrice = 0;

			for (expertise area : pt.getAreaOfExpertise()) {
				ExpertiseAreas subject = new ExpertiseAreas();
				SubcategoryList subCateg = repSubcategory.findSubCategoryByName(area.getSubCategory());
				if (subCateg != null) {
					subject.setUserId(tutProfileDetails);
					subject.setSubCategory(subCateg);
					subject.setCategory(subCateg.getCategory());
					subject.setPrice(area.getPrice());
					if (!tutorProfileDetailsLoaded.getAreaOfExpertise().stream()
							.filter(o -> o.getSubCategory().getSubCategoryName().equals(area.getSubCategory()))
							.findFirst().isPresent()) {
						tutProfileDetails.getAreaOfExpertise().add(subject);

					}

				}
			}


			dao.updateTutorProfile(tutProfileDetails);

			// to update the price of all the expertise of a user to the price1
			List<ExpertiseAreas> exp = repExpertiseAreas.searchExpertiseAreasByUserId(tutProfileDetails.getTid());

			if (exp != null) {
				for (ExpertiseAreas e : exp) {
					e.setPrice(Integer.valueOf(tutProfileDetails.getPrice1()));
					dao.updateExpertiseArea(e);
				}
			}

			repPendingTutorProfileDetails.deleteById(pt.getId());

			mailService.sendVerifiedMail(tutorProfile.getEmail());
			whatsappMessage = "Hey Admin, a new user "+tutorProfile.getFullName()+" has registered with email :"+tutorProfile.getEmail()+" " +
					"and contact :"+tutorProfile.getContact()+" as an Expert.";
			whatsappMessage+=" So the total number of users now are "+repUsers.count();
			whatsappService.initiateWhatsAppMessage(whatsappMessage);
			notificationService.sendUserWhatsappMessage(user,null,WhatsappMessageType.E_PROFILE_VERIFY);
			return true;
		} else {

			return false;
		}
	}

	// for registering a user
	public boolean saveUserProfile(registrationModel registrationModel) {
		Integer totalUsersCount = Math.toIntExact(repUsers.count());
		String whatsappMessage = "";
		UserActivity userActivity = new UserActivity();
		userActivity.setType("signup");
		if (repUsers.emailExist(registrationModel.getEmail()) != null) {
			return false;
		}
		if (registrationModel.getRole().equals("Learner")) {
			StudentProfile studentProfile = new StudentProfile();
			studentProfile.setContact(registrationModel.getContact());
			studentProfile.setEmail(registrationModel.getEmail());
			studentProfile.setFullName(registrationModel.getFullName());
			//check if expert code is valid or not
			
			if(parseReferralCode(registrationModel.getExpertCode())!=""||registrationModel.getExpertCode()!=null) {
				studentProfile.setExpertCode(registrationModel.getExpertCode());
			}
			studentProfile.setUpiID(registrationModel.getUpiId());
			if (dao.saveStudentProfile(studentProfile)) {
				System.out.println("Inside save student profile");
				Users user = new Users();
				user.setEmail(registrationModel.getEmail());
				user.setPassword(encoder.encode(registrationModel.getPassword()));
				user.setUserId(studentProfile.getSid());
				user.setRole("Learner");
				user.setSocialId(encoder.encode("N/A"));
				whatsappMessage = "Hey Admin, a new user "+studentProfile.getFullName()+" has registered with email :"+registrationModel.getEmail()+" " +
						"and contact :"+registrationModel.getContact()+" as a Learner.";
				//check if expert code is valid or not
				if(parseReferralCode(registrationModel.getExpertCode())!="") {
					user.setExpertCode(registrationModel.getExpertCode());
				}
				// user.setExpertCode(registrationModel.getExpertCode());
				if (registrationModel.getSocialId() != null) {
					user.setSocialId(encoder.encode(registrationModel.getSocialId()));
				}
				dao.saveUserLogin(user);
				
				userActivity.setUserId(user);
				repUserActivity.save(userActivity);
				if(user.getExpertCode()!=null) {
					System.out.println("User expert code: "+user.getExpertCode());
					if(isValidFormatForReferralCode(user.getExpertCode())) {
						System.out.println("Inside valid format");
						updateReferralCompleted(parseReferralCode(user.getExpertCode()),user);
						saveReferralActivity(user,registrationModel.getReferActivity());
					}
				}
				whatsappMessage+=" So the total number of users now are "+repUsers.count();
				whatsappService.initiateWhatsAppMessage(whatsappMessage);
				notificationService.sendUserWhatsappMessage(user,null, WhatsappMessageType.L_REG);
				return true;
			} else {
				return false;
			}
		}
		 else {
			return false;
		}
	}
	
	private void saveReferralActivity(Users user, String referActivityType) {
		// TODO Auto-generated method stub
		System.out.println("Refer Activity Type "+ referActivityType);
		String referType=referActivityType.trim();
		System.out.println(referActivityType.equals("LI"));
		System.out.println(referType.equals("LI"));
		if(!referActivityType.equals("NO")) {
			ReferralActivity referralActivity=new ReferralActivity();
			referralActivity.setUserId(user);
			
			if(referActivityType.equals("MA")) {
				referralActivity.setType("MAIL");
			}else if(referActivityType.equals("LI")) {
				System.out.println("Inside the linkedin method");
				referralActivity.setType("LINKEDIN");
			}else if(referActivityType.equals("WA")){
				referralActivity.setType("WHATSAPP");
			}else {
				
			}
			System.out.println("Refer Activity Object :"+referralActivity);
			repReferralActivity.save(referralActivity);
			System.out.println(referralActivity);
		}else {
			System.out.println("User has not come via refer URLs");
		}
	}

	void updateReferralCompleted(String userId,Users user){
		if(userId!=null&&userId!="") {
			System.out.println(repUserReferrals.findByUserId(Integer.valueOf(userId)));
			UserReferrals  ur = repUserReferrals.findByUserId(Integer.valueOf(userId));
			if(ur==null) {
				System.out.println("user referral is null");
				ur = new UserReferrals();
			}
			ur.setUser(repUsers.idExists(Integer.valueOf(userId)));
			List<Users> refers = ur.getReferCompleted();
			refers.add(user);
			ur.setReferCompleted(refers);
			repUserReferrals.save(ur);
			
			
		}
		
	}
	
	boolean isValidFormatForReferralCode(String code) {
		//will work in 2022 only 🤣🤣
		return code.matches("FG22[A-Z]{2}[\\d]{4}");
	}
	
	public boolean getReferralInformation() {
		System.out.println("referralInformation : "+repUserReferrals.findByUserId(Integer.valueOf(765270902)));
		return false;
	}
	
	//returns the valid userId after parsing refCode
	public String parseReferralCode(String refCode){
//		String refCode = "FG21SS0902";     //input string
		String lastFourDigits = "";
				//substring containing last 4 characters
		String rawInitials = "";
		String userInitials="";
		if(refCode!=null) {
			
		
		if (refCode.length() > 4) 
		{
		    lastFourDigits = refCode.substring(refCode.length() - 4);
		    rawInitials = refCode.substring(4,6); 
		} 
		List<Users> matchingUsers = repUsers.findByLast4Digits(lastFourDigits);
		Integer userId=0;
		
		if(matchingUsers.size()>0) {
			for(int i=0;i<matchingUsers.size();i++) {
				Users user= new Users();
				user = matchingUsers.get(i);
				System.out.println("user email:"+user.getEmail());
				System.out.println("raw Initials :"+rawInitials);
				userInitials = genInitials(fetchUserName(user.getUserId(), user.getRole()));
				userInitials = userInitials.toUpperCase();
				System.out.println("user initials :"+userInitials);
				if(rawInitials.equals(userInitials)) {
					 return user.getUserId().toString();
				}
			}
		}
		}
		return "";
		
	}
	String genInitials(String fullName) {
		String initials="";
		if(fullName.length()>1) {
			String[] name = fullName.split("\\s+");
			System.out.println("The name array is ");
			for(String n:name) {
				System.out.print(n + " ");
			}
			if(name.length>2) { //TSK
				initials+=name[0].charAt(0);
				initials+=name[name.length-1].charAt(0);
			}else if(name.length==1) { //TT
				initials+=name[0].charAt(0);
				initials+=name[0].charAt(0);
			}else { //TK,SK or SS
				for(String n:name) {
					initials+=n.charAt(0);
				}
			}
			
		}
		System.out.println("The initials are : "+ initials);
		return initials;
		
	}
	public Integer genUserBookingId() {
		IdGenerator id = new IdGenerator();
		Integer bookingId = id.generate9DigitNumber();
		if (repTutorProfile.findByBookingId(bookingId) == null) {
			return bookingId;
		} else {
			return genUserBookingId();
		}
	}

	// for getting student details after login
	public StudentProfileModel getStudentDetails(String userId) {
		StudentProfileModel stuProfileModel = new StudentProfileModel();
		StudentProfile stuProfile = new StudentProfile();
		stuProfile = dao.getStudentDetails(userId);
		stuProfileModel.setSid(stuProfile.getSid());
		stuProfileModel.setContact(stuProfile.getContact());
		stuProfileModel.setDateOfBirth(stuProfile.getDateOfBirth());
		stuProfileModel.setEmail(stuProfile.getEmail());
		stuProfileModel.setFullName(stuProfile.getFullName());
		stuProfileModel.setProfilePictureUrl(stuProfile.getProfilePictureUrl());
		stuProfileModel.setLinkedInProfile(stuProfile.getLinkedInProfile());
		stuProfileModel.setCurrentOrganisation(stuProfile.getCurrentOrganisation());
		stuProfileModel.setCurrentDesignation(stuProfile.getCurrentDesignation());
		stuProfileModel.setYearsOfExperience(stuProfile.getYearsOfExperience());
		stuProfileModel.setHighestQualification(stuProfile.getHighestQualification());
		stuProfileModel.setUpiID(stuProfile.getUpiID());
		for (LearningAreas area : stuProfile.getLearningAreas()) {
			stuProfileModel.getLearningAreas().add(area.getSubject());
		}
		return stuProfileModel;
	}

	// for updating student profile
	public boolean updateStudentProfile(StudentProfileModel studentModel) {
		StudentProfile studentProfileLoaded = dao.getStudentDetails(studentModel.getSid().toString());
		StudentProfile studentProfile = new StudentProfile();
		studentProfile.setContact(studentModel.getContact());
		studentProfile.setDateOfBirth(studentModel.getDateOfBirth());
		studentProfile.setEmail(studentModel.getEmail());
		studentProfile.setFullName(studentModel.getFullName());
		studentProfile.setUserBookingId(null);
		studentProfile.setSid(studentModel.getSid());
		studentProfile.setProfilePictureUrl(studentModel.getProfilePictureUrl());
		studentProfile.setLinkedInProfile(studentModel.getLinkedInProfile());
		studentProfile.setYearsOfExperience(studentModel.getYearsOfExperience());
		studentProfile.setCurrentDesignation(studentModel.getCurrentDesignation());
		studentProfile.setCurrentOrganisation(studentModel.getCurrentOrganisation());
		studentProfile.setHighestQualification(studentModel.getHighestQualification());
		studentProfile.setUpiID(studentModel.getUpiID());
		for (String area : studentModel.getLearningAreas()) {
			LearningAreas subject = new LearningAreas();
			subject.setUserId(studentProfile);
			subject.setSubject(area);
			if (!studentProfileLoaded.getLearningAreas().stream().filter(o -> o.getSubject().equals(area)).findFirst()
					.isPresent()) {
				studentProfile.getLearningAreas().add(subject);
			}
		}

		dao.updateStudentProfile(studentProfile);
		return true;

	}

	// saving updating details of tutor
	public void updateTutorProfileDetails(TutorProfileDetailsModel tutorModel)
			throws IllegalArgumentException, IllegalAccessException {
		TutorProfileDetails tutProfileDetails = new TutorProfileDetails();
		TutorProfileDetails tutorProfileDetailsLoaded = dao.getTutorProfileDetails(tutorModel.getTid());
		tutProfileDetails.setTid(tutorModel.getTid());
		tutProfileDetails.setFullName(tutorModel.getFullName());
		tutProfileDetails.setInstitute(tutorModel.getInstitute());
		tutProfileDetails.setEducationalQualifications(tutorModel.getEducationalQualifications());
		tutProfileDetails.setPrice1(tutorModel.getPrice1());
		tutProfileDetails.setPrice2(tutorModel.getPrice2());
		tutProfileDetails.setPrice3(tutorModel.getPrice3());
		tutProfileDetails.setDescription(tutorModel.getDescription());
		tutProfileDetails.setSpeciality(tutorModel.getSpeciality());
		tutProfileDetails.setRating(tutorModel.getRating());
		tutProfileDetails.setReviewCount(tutorModel.getReviewCount());
		tutProfileDetails.setLessonCompleted(tutorModel.getLessonCompleted());
		tutProfileDetails.setProfilePictureUrl(tutorModel.getProfilePictureUrl());
		tutProfileDetails.setProfessionalSkills(tutorModel.getProfessionalSkills());
		tutProfileDetails.setCurrentOrganisation(tutorModel.getCurrentOrganisation());
		tutProfileDetails.setPreviousOrganisations(tutorModel.getPreviousOrganisations());
		tutProfileDetails.setProfileCompleted(tutorModel.getProfileCompleted());
		tutProfileDetails.setYearsOfExperience(tutorModel.getYearsOfExperience());
		tutProfileDetails.setLinkedInProfile(tutorModel.getLinkedInProfile());
		tutProfileDetails.setBookingId(tutorModel.getBookingId());
		tutProfileDetails.setUpiId(tutorModel.getUpiID());
		tutProfileDetails.setGst(tutorModel.getGst());
		tutProfileDetails.setCurrentDesignation(tutorModel.getCurrentDesignation());
		tutProfileDetails.setEarning(tutorProfileDetailsLoaded.getEarning());
		// for setting the expertise areas
		for (expertise area : tutorModel.getAreaOfExpertise()) {
			ExpertiseAreas subject = new ExpertiseAreas();
			SubcategoryList subCateg = repSubcategory.findSubCategoryByName(area.getSubCategory());
			if (subCateg != null) {
				subject.setUserId(tutProfileDetails);
				subject.setSubCategory(subCateg);
				subject.setCategory(subCateg.getCategory());
				subject.setPrice(area.getPrice());
				if (!tutorProfileDetailsLoaded.getAreaOfExpertise().stream()
						.filter(o -> o.getSubCategory().getSubCategoryName().equals(area.getSubCategory())).findFirst()
						.isPresent()) {
					tutProfileDetails.getAreaOfExpertise().add(subject);

				}

			}
		}

		dao.updateTutorProfile(tutProfileDetails);

		// to update the price of all the expertise of a user to the price1
		List<ExpertiseAreas> exp = repExpertiseAreas.searchExpertiseAreasByUserId(tutProfileDetails.getTid());

		if (exp != null) {
			for (ExpertiseAreas e : exp) {
				e.setPrice(Integer.valueOf(tutProfileDetails.getPrice1()));
				dao.updateExpertiseArea(e);
			}
		}
	}

	// saving registration details of tutor
	public boolean saveTutorProfile(TutorProfileModel tutorModel) {
		TutorProfile tutorProfile = new TutorProfile();
		tutorProfile.setContact(tutorModel.getContact());
		tutorProfile.setDateOfBirth(tutorModel.getDateOfBirth());
		tutorProfile.setEmail(tutorModel.getEmail());
		tutorProfile.setFullName(tutorModel.getFullName());
		tutorProfile.setProfilePictureUrl(tutorModel.getProfilePictureUrl());
		tutorProfile.setTid(tutorModel.getTid());

		if (dao.saveTutorProfile(tutorProfile)) {
			// saving tutor profile details
			TutorProfileDetails tutProfileDetails = new TutorProfileDetails();
			tutProfileDetails.setTid(tutorProfile.getTid());
			tutProfileDetails.setProfileCompleted(12);
			tutProfileDetails.setLessonCompleted(0);
			tutProfileDetails.setRating(100);
			tutProfileDetails.setReviewCount(0);
			dao.saveTutorID(tutProfileDetails);

			// saving tutor schedule details
			TutorAvailabilitySchedule tutSchedule = new TutorAvailabilitySchedule();
			tutSchedule.setTid(tutorProfile.getTid());
			tutSchedule.setFullName(tutorProfile.getFullName());
			tutSchedule.setIsAvailable("yes");
			dao.saveTutorAvailbilitySchedule(tutSchedule);
			return true;
		} else {
			return false;
		}

	}

	// for updating tutor basic info
	public void updateTutorBasicInfo(TutorProfileModel tutorModel) {
		TutorProfile tutorProfile = new TutorProfile();
		tutorProfile.setTid(tutorModel.getTid());
		tutorProfile.setContact(tutorModel.getContact());
		tutorProfile.setDateOfBirth(tutorModel.getDateOfBirth());
		tutorProfile.setEmail(tutorModel.getEmail());
		tutorProfile.setFullName(tutorModel.getFullName());
		tutorProfile.setProfilePictureUrl(tutorModel.getProfilePictureUrl());
		tutorProfile.setBookingId(tutorModel.getBookingId());
		dao.updateTutorBasicInfo(tutorProfile);

		if (dao.getTutorProfileDetails(tutorModel.getTid()).getProfileCompleted() <= 50) {
			dao.updateProfileCompleted(40, tutorProfile.getTid());
		}

	}

	// for editing tutor Basic info
	public void editTutorBasicInfo(TutorProfileModel tutorModel) {
		TutorProfile tutorProfile = new TutorProfile();
		tutorProfile.setTid(tutorModel.getTid());
		tutorProfile.setContact(tutorModel.getContact());
		tutorProfile.setDateOfBirth(tutorModel.getDateOfBirth());
		tutorProfile.setEmail(tutorModel.getEmail());
		tutorProfile.setFullName(tutorModel.getFullName());
		tutorProfile.setProfilePictureUrl(tutorModel.getProfilePictureUrl());
		dao.updateTutorBasicInfo(tutorProfile);
	}

	// getting tutor details after login
	public TutorProfileModel getTutorDetails(String userId) {
		TutorProfileModel tutorProfileModel = new TutorProfileModel();
		TutorProfile tutorProfile = dao.getTutorDetails(userId);
		System.out.println("tutorProfile => " + tutorProfile);
		tutorProfileModel.setContact(tutorProfile.getContact());
		tutorProfileModel.setDateOfBirth(tutorProfile.getDateOfBirth());
		tutorProfileModel.setEmail(tutorProfile.getEmail());
		tutorProfileModel.setFullName(tutorProfile.getFullName());
		tutorProfileModel.setTid(tutorProfile.getTid());
		tutorProfileModel.setProfilePictureUrl(tutorProfile.getProfilePictureUrl());
		tutorProfileModel.setBookingId(tutorProfile.getBookingId());
		System.out.println("tutorProfileModel =>" + tutorProfileModel);
		return tutorProfileModel;
	}

	// for getting the list of teachers with 100% profile completion
	public List<TutorProfileDetailsModel> getTutorList(String subject) {
		List<TutorProfileDetailsModel> tutListModel = new ArrayList<TutorProfileDetailsModel>();
		List<TutorProfileDetails> tutList = new ArrayList<TutorProfileDetails>();
		if (!subject.equals("*")) {
			tutList = dao.getTutorList(subject);
			for (TutorProfileDetails tutProfileDetails : tutList) {
				TutorProfileDetailsModel tutorModel=tutorProfileDetailsMapper.EntityToDto(tutProfileDetails);
				//TutorProfileDetailsModel tutorModel = tutorProfileDetailsMapper.EntityToDto(tutProfileDetails);
				tutorModel.setTid(null);
				tutListModel.add(tutorModel);
			}
		} else {
			tutList = repTutorProfileDetails.findAll();
			for (TutorProfileDetails tutProfileDetails : tutList) {
				//TutorProfileDetailsModel tutorModel=copyTutorProfileDetails(tutProfileDetails);
				TutorProfileDetailsModel tutorModel = tutorProfileDetailsMapper.EntityToDto(tutProfileDetails);
				tutListModel.add(tutorModel);
			}
		}
		return tutListModel;
	}

	public List<TutorProfileDetailsModel> fetchAllTutorList() throws NumberFormatException, ParseException {
		List<TutorProfileDetailsModel> tutListModel = new ArrayList<TutorProfileDetailsModel>();
		List<TutorProfileDetails> tutList = new ArrayList<TutorProfileDetails>();
		tutList = repTutorProfileDetails.findAll();
		for (TutorProfileDetails tutProfileDetails : tutList) {
			//TutorProfileDetailsModel tutorModel=copyTutorProfileDetails(tutProfileDetails);
			TutorProfileDetailsModel tutorModel = tutorProfileDetailsMapper.EntityToDto(tutProfileDetails);
			tutorModel.setLastLogin(returnLastLoginTime(tutProfileDetails.getTid()));
			ArrayList<ScheduleTime> schedule = getTutorTimeAvailabilityTimeArray(
					tutProfileDetails.getBookingId().toString());
//			ArrayList<ScheduleTime> schedule = new ArrayList<ScheduleTime>();
			tutorModel.setIsWeeklyCalendarUpdated(schedule != null && schedule.size() != 0);
			tutListModel.add(tutorModel);
		}
		return tutListModel;
	}

	public String returnLastLoginTime(Integer userId) {
		String lastLogin = "";
		SimpleDateFormat formatter = new SimpleDateFormat("dd-M-yyyy hh:mm:ss");
		Users user = repUsers.idExists(userId);
		if (user.getLastLogin() != null) {
			lastLogin = formatter.format(user.getLastLogin());
		} else {
			lastLogin = "N/A";
		}
		return lastLogin;
	}

	// for updating tutor verification
	public boolean updateTutorVerification(TutorVerificationModel tutorVerify) {
		if (dao.updateTutorVerification(tutorVerify) == true) {
			dao.updateProfileCompleted(99, tutorVerify.getTid());
			return true;
		} else {
			return false;
		}
	}

	// getting tutor profile details with tutor bookingId
	public TutorProfileDetailsModel fetchBookingTutorProfileDetails(Integer bookingId) {
		TutorProfileDetails tutProfileDetails = dao.fetchTutorProfileDetailsByBookingId(bookingId);
		//TutorProfileDetailsModel tutProfileDetailsModel=copyTutorProfileDetails(tutProfileDetails);
		TutorProfileDetailsModel tutProfileDetailsModel = tutorProfileDetailsMapper.EntityToDto(tutProfileDetails);
		tutProfileDetailsModel.setTid(null);
		return tutProfileDetailsModel;
	}

	// getting tutor profile details with tid
	public TutorProfileDetailsModel getTutorProfileDetails(Integer tid) {
		TutorProfileDetails tutProfileDetails = dao.getTutorProfileDetails(tid);
		return tutorProfileDetailsMapper.EntityToDto(tutProfileDetails);
	}

	// from copying content of tutorProfileDetails entity to model
	public TutorProfileDetailsModel copyTutorProfileDetails(TutorProfileDetails tutProfileDetails) {
		TutorProfileDetailsModel tutorProfileDetailsModel = new TutorProfileDetailsModel();
		tutorProfileDetailsModel.setTid(tutProfileDetails.getTid());
		tutorProfileDetailsModel.setFullName(tutProfileDetails.getFullName());
		tutorProfileDetailsModel.setInstitute(tutProfileDetails.getInstitute());
		tutorProfileDetailsModel.setEducationalQualifications(tutProfileDetails.getEducationalQualifications());
		tutorProfileDetailsModel.setPrice1(tutProfileDetails.getPrice1());
		tutorProfileDetailsModel.setPrice2(tutProfileDetails.getPrice2());
		tutorProfileDetailsModel.setPrice3(tutProfileDetails.getPrice3());
		tutorProfileDetailsModel.setDescription(tutProfileDetails.getDescription());
		tutorProfileDetailsModel.setSpeciality(tutProfileDetails.getSpeciality());
		tutorProfileDetailsModel.setRating(tutProfileDetails.getRating());
		tutorProfileDetailsModel.setReviewCount(tutProfileDetails.getReviewCount());
		tutorProfileDetailsModel.setLessonCompleted(tutProfileDetails.getLessonCompleted());
		tutorProfileDetailsModel.setProfilePictureUrl(tutProfileDetails.getProfilePictureUrl());
		tutorProfileDetailsModel.setProfessionalSkills(tutProfileDetails.getProfessionalSkills());
		tutorProfileDetailsModel.setCurrentOrganisation(tutProfileDetails.getCurrentOrganisation());
		tutorProfileDetailsModel.setPreviousOrganisations(tutProfileDetails.getPreviousOrganisations());
		tutorProfileDetailsModel.setProfileCompleted(tutProfileDetails.getProfileCompleted());
		tutorProfileDetailsModel.setYearsOfExperience(tutProfileDetails.getYearsOfExperience());
		tutorProfileDetailsModel.setLinkedInProfile(tutProfileDetails.getLinkedInProfile());
		tutorProfileDetailsModel.setBookingId(tutProfileDetails.getBookingId());
		tutorProfileDetailsModel.setUpiID(tutProfileDetails.getUpiId());
		tutorProfileDetailsModel.setGst(tutProfileDetails.getGst());
		tutorProfileDetailsModel.setCurrentDesignation(tutProfileDetails.getCurrentDesignation());
		for (ExpertiseAreas area : tutProfileDetails.getAreaOfExpertise()) {
			expertise exp = new expertise();
			exp.setCategory(area.getCategory().getCategoryName());
			exp.setSubCategory(area.getSubCategory().getSubCategoryName());
			exp.setPrice(area.getPrice());
			tutorProfileDetailsModel.getAreaOfExpertise().add(exp);
		}
		System.out.println(tutorProfileDetailsModel);
		return tutorProfileDetailsModel;
	}

	// for saving social login details
	public boolean registerSocialLogin(SocialLoginModel socialLoginModel) {
		SocialLogin socialLogin = new SocialLogin();
		socialLogin.setEmail(socialLoginModel.getEmail());
		socialLogin.setFullName(socialLoginModel.getFullName());
		socialLogin.setId(socialLoginModel.getId());
		return dao.saveSocialLogin(socialLogin);
	}

	// for saving tutor Availability Schedule
	public void saveTutorAvailabilitySchedule(TutorAvailabilityScheduleModel tutorAvailabilityScheduleModel) {
		ArrayList<String> availableSchedules = new ArrayList<String>();
		System.out.println(tutorAvailabilityScheduleModel.getAllAvailabilitySchedule());
		for (ScheduleData schedule : tutorAvailabilityScheduleModel.getAllAvailabilitySchedule()) {
			availableSchedules.add(schedule.serialize());
		}
		TutorAvailabilitySchedule tutSchedule = new TutorAvailabilitySchedule();
		tutSchedule.setAllAvailabilitySchedule(availableSchedules);
		tutSchedule.setFullName(tutorAvailabilityScheduleModel.getFullName());
		tutSchedule.setTid(tutorAvailabilityScheduleModel.getTid());
		tutSchedule.setIsAvailable(tutorAvailabilityScheduleModel.getIsAvailable());
		dao.saveTutorAvailbilitySchedule(tutSchedule);
	}

	// for getting tutor Availability Schedule after login
	public TutorAvailabilityScheduleModel getTutorAvailabilitySchedule(Integer tid) throws ParseException {
		TutorAvailabilityScheduleModel tutAvailModel = new TutorAvailabilityScheduleModel();
		tutAvailModel = dao.getTutorAvailabilitySchedule(tid);
		ArrayList<BookingDetails> bookings = (ArrayList<BookingDetails>) meetingDao.fetchAllTutorBookings(tid);
		ArrayList<ScheduleData> bookingSchedule = new ArrayList<ScheduleData>();
		SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
		for (int i = 0; i < bookings.size(); i++) {
			BookingDetails booking = bookings.get(i);
			String Description;
			Date startDate = formatter.parse(booking.getDateOfMeeting());
			startDate.setHours(booking.getStartTimeHour());
			startDate.setMinutes(booking.getStartTimeMinute());

			Date endDate = formatter.parse(booking.getDateOfMeeting());
			endDate.setHours(booking.getEndTimeHour());
			endDate.setMinutes(booking.getEndTimeMinute());
			Description = booking.getSubject() + "=>" + booking.getDescription();
			ScheduleData schedule = new ScheduleData();
			schedule.setDescription(Description);
			schedule.setStartTime(startDate.toLocaleString());
			schedule.setEndTime(endDate.toLocaleString());
			schedule.setId(i + 1);
			schedule.setSubject(booking.getStudentName());
			bookingSchedule.add(schedule);
		}
		tutAvailModel.setAllMeetingsSchedule(bookingSchedule);
		return tutAvailModel;
	}

	// get tutor time array with tid
	public ArrayList<ScheduleTime> getTutorTimeAvailabilityTimeArray(String tid)
			throws NumberFormatException, ParseException {
		TutorAvailabilityScheduleModel tutorSchedule = dao.getTutorAvailabilitySchedule(Integer.valueOf(tid));
		return scheduleService.getTimeArray(tutorSchedule.getAllAvailabilitySchedule(), Integer.valueOf(tid));
	}

	// for fetching top tutor list
	public ArrayList<TutorProfileDetails> fetchTopTutorList(String subject) {
		return dao.fetchTopTutorList(subject);
	}

	// for changing availability status of tutor
	public void changeAvailabilityStatus(int tid, String availabilityStatus) {
		dao.changeAvailabilityStatus(tid, availabilityStatus);
	}

	// for getting student meetings schedule
	public ArrayList<ScheduleData> getStudentSchedule(String sid) throws ParseException {
		ArrayList<BookingDetails> bookings = (ArrayList<BookingDetails>) meetingDao
				.fetchAllStudentBookings(Integer.valueOf(sid));
		ArrayList<ScheduleData> bookingSchedule = new ArrayList<ScheduleData>();
		SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
		System.out.println("bookings array size ->" + bookings.size());
		for (int i = 0; i < bookings.size(); i++) {
			BookingDetails booking = bookings.get(i);

			Date startDate = formatter.parse(booking.getDateOfMeeting());
			startDate.setHours(booking.getStartTimeHour());
			startDate.setMinutes(booking.getStartTimeMinute());

			Date endDate = formatter.parse(booking.getDateOfMeeting());
			endDate.setHours(booking.getEndTimeHour());
			endDate.setMinutes(booking.getEndTimeMinute());

			ScheduleData schedule = new ScheduleData();
			schedule.setStartTime(startDate.toLocaleString());
			schedule.setEndTime(endDate.toLocaleString());
			schedule.setId(i + 1);
			schedule.setSubject(booking.getTutorName());
			bookingSchedule.add(schedule);
		}
		return bookingSchedule;
	}

	// for sending verification email
	public AuthenticationResponse verifyEmail(String email) {

		int m = (int) Math.pow(10, 5);
		String otp = String.valueOf((m + new Random().nextInt(9 * m)));
		mailService.sendVerificationEmail(email, otp);
		String otpFinal = encoder.encode(otp);
		System.out.println(otpFinal);
		return new AuthenticationResponse(otpFinal);

	}

	// fetch if the tutor is available ?
	public boolean getTutorIsAvailable(String bookingId) {
		return dao.getTutorAvailabilitySchedule(Integer.valueOf(bookingId)).getIsAvailable().equals("yes");
	}

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		// TODO Auto-generated method stub
		return null;
	}

	public String fetchUserRole(String userId) {
		return repUsers.idExists(Integer.valueOf(userId)).getRole();
	}

	public void subtractArea(int id, String subject, String role) {
		dao.subtractArea(id, subject, role);
	}

	public List<TutorProfileDetailsModel> fetchAllLinkedTutors(Integer userId) {
		List<TutorProfileDetails> tutors = dao.fetchAllLinkedTutors(userId);
		List<TutorProfileDetailsModel> tutorsModel = new ArrayList<TutorProfileDetailsModel>();
		for (TutorProfileDetails tutor : tutors) {
			tutorsModel.add(tutorProfileDetailsMapper.EntityToDto(tutor));
		}
		return tutorsModel;

	}

	public List<TutorProfileDetailsModel> filtersApplied(String[] subjects, String[] price, Integer[] ratings,
			String domain, String[] domains) {
		CategoryList categ = new CategoryList();

		if (repCategory.findCategory(domain) != null) {
			categ = repCategory.findCategory(domain);
		}
		List<TutorProfileDetails> tutors = dao.filtersApplied(subjects, price, ratings, categ.getCategoryId(), domains);
		if (tutors == null) {
			return null;
		} else {
			List<TutorProfileDetailsModel> tutorsModel = new ArrayList<TutorProfileDetailsModel>();
			for (TutorProfileDetails tutor : tutors) {
				tutorsModel.add(tutorProfileDetailsMapper.EntityToDto(tutor));
			}
			return tutorsModel;
		}

	}

	public boolean checkUserExists(String email) {
		return repUsers.emailExist(email) != null;
	}

	public boolean sendResetLink(String email) {
		return mailService.sendResetMail(email);
	}
	
	public boolean sendReferInviteMail(String[] users,String referCode,String senderEmail) {
		return mailService.sendReferInviteMail(users, referCode, senderEmail);
	}

	public boolean updatePassword(String userId, String password) {
		System.out.println(userId);
		if (repUsers.idExists(Integer.valueOf(userId)) != null) {
			String newPassword = encoder.encode(password);
			repUsers.updatePassword(Integer.valueOf(userId), newPassword);
			return true;
		} else {
			return false;
		}
	}

	// to create new subject category
	public boolean addNewCategory(Category category) {
		// TODO Auto-generated method stub
		CategoryList newCategory = new CategoryList();
		List<CategoryList> allCategories = new ArrayList<CategoryList>();
		allCategories = repCategory.findAll();
		int categoryFoundFlag = 0;
		if (allCategories.size() > 0) {
			for (CategoryList c : allCategories) {
				if (c.getCategoryName().equals(category.getCategory())) {
					categoryFoundFlag = 1;
				}
			}
		}
		if (categoryFoundFlag != 1) {
			newCategory.setCategoryName(category.getCategory());
			repCategory.save(newCategory);
			return true;
		} else {
			return false;
		}
	}

	public List<Category> getAllCategories() {
		List<CategoryList> categoryEntity = repCategory.findAll();
		List<Category> categoryModel = new ArrayList<Category>();
		if (categoryEntity != null) {
			for (CategoryList c : categoryEntity) {
				Category newC = new Category();
				newC.setCategory(c.getCategoryName());
				categoryModel.add(newC);
			}
		}
		return categoryModel;
	}

	public boolean addNewSubCategories(Category category) {
		SubcategoryList subCateg = new SubcategoryList();
		CategoryList categ = repCategory.findCategory(category.getCategory());
		if (categ != null) {
			subCateg.setCategory(categ);
			subCateg.setSubCategoryName(category.getSubCategory());
			repSubcategory.save(subCateg);
			return true;
		} else {
			return false;
		}
	}

	public List<Category> getSubCategories(String category) {
		CategoryList categ = repCategory.findCategory(category);
		List<Category> subCategsModel = new ArrayList<Category>();
		if (categ != null) {
			List<SubcategoryList> subCategs = repSubcategory.findSubCategories(categ.getCategoryId());
			System.out.println(subCategs);
			if (subCategs != null) {
				for (SubcategoryList sc : subCategs) {
					Category cat = new Category();
					cat.setCategory(sc.getCategory().getCategoryName());
					cat.setSubCategory(sc.getSubCategoryName());
					subCategsModel.add(cat);
				}
			}
		}

		return subCategsModel;
	}

	public List<Category> getAllSubCategories() {
		List<Category> categModel = new ArrayList<Category>();
		List<SubcategoryList> subCategs = repSubcategory.findAll();
		if (subCategs != null) {
			for (SubcategoryList sc : subCategs) {
				Category categ = new Category();
				categ.setCategory(sc.getCategory().getCategoryName());
				categ.setSubCategory(sc.getSubCategoryName());
				categModel.add(categ);
			}
		}
		return categModel;
	}

	// for fetching notifications using userId
	public List<NotificationModel> fetchNotifications(String userId) {
		List<NotificationModel> notifList = new ArrayList<NotificationModel>();
		if (userId != null) {
			List<Notification> notifications = repNotification.notificationExist(userId);
			if (notifications != null) {
				for (Notification n : notifications) {
					NotificationModel nModel = new NotificationModel();
					nModel.setPictureUrl(n.getPictureUrl());
					nModel.setReadStatus(n.isReadStatus());
					nModel.setTimestamp(n.getTimestamp());
					String message = "";
					if (n.getEntityTypeId() == 11) {
						StudentProfile sp = repStudentProfile.idExist(Integer.valueOf(n.getActorId()));
						message = sp.getFullName() + " sent you an appointment request";
					} else if (n.getEntityTypeId() == 12) {
						TutorProfile tp = repTutorProfile.findByBookingId(Integer.valueOf(n.getActorId()));
						message = tp.getFullName() + " has accepted your appointment request";
					} else if (n.getEntityTypeId() == 13) {
						StudentProfile sp = repStudentProfile.idExist(Integer.valueOf(n.getActorId()));
						message = sp.getFullName() + " has cancelled its recent appointment";
					}
					nModel.setMessage(message);
					notifList.add(nModel);
				}
			}
			if (notifList != null) {
				Collections.sort(notifList, new Comparator<NotificationModel>() {
					public int compare(NotificationModel n1, NotificationModel n2) {
						return n2.getTimestamp().compareTo(n1.getTimestamp());
					}
				});
			}
		}
		return notifList;
	}

	public List<AppInfoModel> getEarningAppInfo() {
		List<AppInfoModel> appInfoList = new ArrayList<AppInfoModel>();
		List<AppInfo> appInfo = repAppInfo.typeExist("Earnings");
		if (appInfo != null) {
			for (AppInfo ai : appInfo) {
				AppInfoModel aInfo = new AppInfoModel();
				aInfo.setKey(ai.getKeyName());
				aInfo.setValue(ai.getValue());
				appInfoList.add(aInfo);
			}
		}
		return appInfoList;
	}
	
	public AppInfoModel getRedeemedCreditAppInfo() {
		AppInfo appInfo=repAppInfo.keyExist("redeemedCreditPercentage");
		AppInfoModel appModel=new AppInfoModel();
		appModel.setKey(appInfo.getKeyName());
		appModel.setValue(appInfo.getValue());
		return appModel;
	}

	public UserActivityAnalytics fetchUserDataAnalytics() {
		UserActivityAnalytics userAnalytics = new UserActivityAnalytics();
		long userCount = repUsers.count();
		userAnalytics.setUsersCount((int) userCount);
		List<UserActivity> users = repUserActivity.findLast1WeekLogins();
		userAnalytics.setWeeklyLoginCount(users.size());
		users = repUserActivity.findTodayLogins();
		userAnalytics.setDailyLoginCount(users.size());
		users = repUserActivity.findLast1MonthLogins();
		userAnalytics.setMonthlyLoginCount(users.size());

		users = repUserActivity.findTodaySignUp();
		userAnalytics.setDailySignUpCount(users.size());
		users = repUserActivity.findLast1WeekSignUp();
		userAnalytics.setWeeklySignUpCount(users.size());
		users = repUserActivity.findLast1MonthSignUp();
		userAnalytics.setMonthlySignUpCount(users.size());

		List<BookingDetails> bookings = repBooking.findTodayMeetings();
		userAnalytics.setDailyMeetingsSetup(bookings.size());
		bookings = repBooking.findLast1WeekMeetings();
		userAnalytics.setWeeklyMeetingSetup(bookings.size());
		bookings = repBooking.findLast1MonthMeetings();
		userAnalytics.setMonthlyMeetingSetup(bookings.size());
		return userAnalytics;
	}

	public List<PendingTutorProfileDetails> fetchPendingExperts() {
		List<PendingTutorProfileDetails> result = new ArrayList<PendingTutorProfileDetails>();
		List<PendingTutorProfileDetails> pendingTutors = repPendingTutorProfileDetails.findAll();
		List<PendingTutorProfileDetails> toBeDeleted = new ArrayList<PendingTutorProfileDetails>();
		if (pendingTutors != null) {
			for (PendingTutorProfileDetails tut : pendingTutors) {
				if (repUsers.emailExist(tut.getEmail()) == null) {
					result.add(tut);
				} else {
					repPendingTutorProfileDetails.delete(tut);
				}
			}
		}
		return result;
	}

	public ResponseModel expertChoosePassword(String userId, String password) {

		Users user = repUsers.idExists(Integer.valueOf(userId));
		if (user != null) {
			String newPassword = encoder.encode(password);
			if (encoder.matches("N/A", user.getPassword())) {
				repUsers.updatePassword(Integer.valueOf(userId), newPassword);
				return new ResponseModel(user.getEmail());
			} else {
				return new ResponseModel("password not changed");
			}

		} else {
			return new ResponseModel("password not changed");
		}
	}

	public boolean updateAndAddExpertiseArea(String category, String subCategory) {
		CategoryList categ = repCategory.findCategory(category);
		if (categ == null) {
			CategoryList c = new CategoryList();
			c.setCategoryName(category);
			repCategory.save(c);
			CategoryList fetchedCategory = repCategory.findCategory(category);
			SubcategoryList sc = new SubcategoryList();
			sc.setCategory(fetchedCategory);
			sc.setSubCategoryName(subCategory);
			repSubcategory.save(sc);
			return true;
		} else {
			SubcategoryList sc = new SubcategoryList();
			sc.setCategory(categ);
			sc.setSubCategoryName(subCategory);
			repSubcategory.save(sc);
			return true;
		}
	}

	public String fetchUserName(Integer userId, String role) {
		if (role.equals("Learner")) {
			StudentProfile stu = repStudentProfile.idExist(userId);
			return stu.getFullName();
		} else if (role.equals("Expert")) {
			TutorProfile exp = repTutorProfile.idExist(userId);
			return exp.getFullName();
		} else {
			return "";
		}
	}

	public String fetchExpertiseString(Integer userId) {
		String expertise = "";
		TutorProfileDetails tut = new TutorProfileDetails();
		tut = repTutorProfileDetails.idExist(userId);
		if (tut.getAreaOfExpertise() != null) {
			Integer count = 0;
			for (ExpertiseAreas expa : tut.getAreaOfExpertise()) {
				count++;
				expertise += expa.getCategory().getCategoryName();
				expertise += " : ";
				expertise += expa.getSubCategory().getSubCategoryName();
				if (!count.equals(tut.getAreaOfExpertise().size())) {
					expertise += " , ";
				}
			}
		}
		return expertise;
	}

	public List<String> fetchExpertiseList(Integer userId) {
		List<String> expertise = new ArrayList<String>();
		TutorProfileDetails tut = new TutorProfileDetails();
		tut = repTutorProfileDetails.idExist(userId);
		if (tut.getAreaOfExpertise() != null) {

			for (ExpertiseAreas expa : tut.getAreaOfExpertise()) {
				String expt = "";
				expt += expa.getCategory().getCategoryName();
				expt += " : ";
				expt += expa.getSubCategory().getSubCategoryName();
				expertise.add(expt);
			}
		}
		return expertise;
	}

	public List<UserDataModel> fetchAllUserData() {
		List<Users> allUsers = repUsers.findAll();
		List<UserDataModel> result = new ArrayList<UserDataModel>();
		if (allUsers != null) {
			for (Users u : allUsers) {
				UserDataModel ud = new UserDataModel();
				ud.setEmail(u.getEmail());
				ud.setRole(u.getRole());
				ud.setFullName(fetchUserName(u.getUserId(), u.getRole()));
				ud.setUserId(u.getUserId().toString());
				if (u.getRole().equals("Expert")) {
					TutorProfileDetails tut = new TutorProfileDetails();
					tut = repTutorProfileDetails.idExist(u.getUserId());
					ud.setUpiID(tut.getUpiId());
					ud.setExpertises(fetchExpertiseString(u.getUserId()));
				}
				if (u.getRole().equals("Learner")) {
					StudentProfile su = repStudentProfile.idExist(u.getUserId());
					ud.setUpiID(su.getUpiID());
					ud.setExpertCode(u.getExpertCode());
				}
				result.add(ud);
			}
		}

		return result;
	}

	public String validateAdmin(String email, String password, String method) {
		// TODO Auto-generated method stub
		return null;
	}

	public List<FeaturedExpertsModel> fetchFeaturedExperts() {
		List<FeaturedExpertsModel> expertsDTO = new ArrayList<FeaturedExpertsModel>();
		List<FeaturedExperts> experts = repFeaturedExperts.findAll();
		if (experts != null) {
			for (FeaturedExperts e : experts) {
				expertsDTO.add(copyFeaturedExpertsToDTO(e));
			}
		}
		return expertsDTO;
	}

	public boolean saveFeaturedExpert(FeaturedExpertsModel fe) {
		return repFeaturedExperts.save(copyFeaturedExperts(fe)) != null;
	}

	public void deleteFeaturedExpert(FeaturedExpertsModel fe) {
		repFeaturedExperts.delete(copyFeaturedExperts(fe));
	}

	public boolean updateFeaturedExperts(List<FeaturedExpertsModel> exps) {
		repFeaturedExperts.deleteAll();
		for (FeaturedExpertsModel fe : exps) {
			repFeaturedExperts.save(copyFeaturedExperts(fe));
		}
		return true;
	}

	public FeaturedExperts copyFeaturedExperts(FeaturedExpertsModel fe) {
		FeaturedExperts e = new FeaturedExperts();
		e.setExpertId(fe.getExpertId());
		e.setName(fe.getName());
		e.setPrecedence(fe.getPrecedence());
		e.setProfilePictureUrl(fe.getProfilePictureUrl());
		e.setTopic(fe.getTopic());
		return e;
	}

	public FeaturedExpertsModel copyFeaturedExpertsToDTO(FeaturedExperts fe) {
		FeaturedExpertsModel e = new FeaturedExpertsModel();
		e.setExpertId(fe.getExpertId());
		e.setName(fe.getName());
		e.setPrecedence(fe.getPrecedence());
		e.setProfilePictureUrl(fe.getProfilePictureUrl());
		e.setTopic(fe.getTopic());
		return e;
	}

	public PendingTutorProfileDetails findPendingExpertById(String id) {
		return repPendingTutorProfileDetails.idExist(Integer.valueOf(id));
	}

	public void rejectExpert(String id) {
		PendingTutorProfileDetails pt = repPendingTutorProfileDetails.idExist(Integer.valueOf(id));
		if (pt != null) {
			mailService.sendRejectedMail(pt.getEmail(), pt.getFullName());
			repPendingTutorProfileDetails.delete(pt);
		}
	}

	// to check if expert has a schedule within a week
	public boolean checkIfExpertHasSchedule(Integer tid) throws ParseException {
		TutorAvailabilityScheduleModel tutorSchedule = dao.getTutorAvailabilitySchedule(Integer.valueOf(tid));
		ArrayList<ScheduleTime> timeArray = scheduleService.getTimeArray(tutorSchedule.getAllAvailabilitySchedule(),
				Integer.valueOf(tid));
		return timeArray != null && timeArray.size() != 0;
	}

	public void notifyNoScheduleExpert(Integer tid) throws ParseException {
		TutorProfileDetails exp = repTutorProfileDetails.bookingIdExist(tid);
		TimeZone.setDefault(TimeZone.getTimeZone("Asia/Kolkata"));
		SimpleDateFormat sdf = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");
		sdf.setTimeZone(TimeZone.getTimeZone("IST"));
		String date = sdf.format(new Date());
		// todayDate string
		Date now = sdf.parse(date);
		if (exp != null) {
			TutorProfile tut = repTutorProfile.idExist(exp.getTid());
			if (!checkIfExpertHasSchedule(tid)) {
				TutorAvailabilitySchedule sch = repTutorAvailabilitySchedule.idExist(tid);
				if (sch != null) {
					Date lastNotificationTime = sch.getNoScheduleNotificationTime();
					if (lastNotificationTime == null) {
						sch.setNoScheduleNotificationTime(now);
						repTutorAvailabilitySchedule.save(sch);
//						experts.add(tut);
						mailService.sendExpertNoScheduleNotification(tut);
					} else {
						long duration = now.getTime() - lastNotificationTime.getTime();
						long diffInHours = TimeUnit.MILLISECONDS.toHours(duration);
						if (diffInHours >= 24) {
//							experts.add(tut);
							sch.setNoScheduleNotificationTime(now);
							repTutorAvailabilitySchedule.save(sch);
							mailService.sendExpertNoScheduleNotification(tut);
							
						} else {
							System.out.println("less than 24 hours !");
						}
					}
				}

			}

		}
	}

	// notify all experts with no schedule
	public void notifyAllExpertsWithNoSchedule(String[] users) throws NumberFormatException, ParseException {
		for (String user : users) {
			System.out.println("notifying expert :" + user);
			notifyNoScheduleExpert(Integer.valueOf(user));
		}
	}
	//fetching last 50 login data
	public ArrayList<UserActivityModel> fetchAllLoginData() {
		ArrayList<UserActivityModel> loginData = new ArrayList<UserActivityModel>();
		List<UserActivity> userActivities = repUserActivity.findAllLoginAcitivities();
		SimpleDateFormat sdf = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");
		if (userActivities != null) {
			for (UserActivity ua : userActivities) {
				UserActivityModel uam = new UserActivityModel();
				Users user = ua.getUserId();
				uam.setUserId(user.getUserId().toString());

				uam.setFullName(fetchUserName(user.getUserId(), user.getRole()));
				uam.setRole(user.getRole());
				uam.setLoginTime(sdf.format(ua.getCreatedDate()));
				loginData.add(uam);
			}
			//sort in desc order of login date
			Collections.sort(loginData,(o1, o2) -> {
					try {
						if(sdf.parse(o1.getLoginTime()).before(sdf.parse(o2.getLoginTime()))){
							return 1;
						} else if(sdf.parse(o1.getLoginTime()).after(sdf.parse(o2.getLoginTime()))){
							return -1;
						}else{
							return 0;
						}
					} catch (ParseException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
					return 0;
				}
			);
			//Collections.reverse(loginData);
		}

		return loginData;
	}
	//fetching last 50 sign up data
	public ArrayList<UserActivityModel> fetchAllSignUpData() {
		ArrayList<UserActivityModel> signUpData = new ArrayList<UserActivityModel>();
		List<UserActivity> userActivities = repUserActivity.findAllSignUpAcitivities();
		SimpleDateFormat sdf = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");
		if (userActivities != null) {
			for (UserActivity ua : userActivities) {
				UserActivityModel uam = new UserActivityModel();
				Users user = ua.getUserId();
				uam.setUserId(user.getUserId().toString());

				uam.setFullName(fetchUserName(user.getUserId(), user.getRole()));
				uam.setRole(user.getRole());
				uam.setSignUpTime(sdf.format(ua.getCreatedDate()));
				uam.setReferralCode(user.getExpertCode());
				signUpData.add(uam);
			}
			Collections.sort(signUpData,(o1, o2) -> {
						try {
							if(sdf.parse(o1.getSignUpTime()).before(sdf.parse(o2.getSignUpTime()))){
								return 1;
							} else if(sdf.parse(o1.getSignUpTime()).after(sdf.parse(o2.getSignUpTime()))){
								return -1;
							}else{
								return 0;
							}
						} catch (ParseException e) {
							// TODO Auto-generated catch block
							e.printStackTrace();
						}
						return 0;
					}
			);

		}

		return signUpData;
	}
	//fetching all previous meeting data
	public ArrayList<BookingDetailsModel> fetchAllMeetingsData() {
		SimpleDateFormat sdf = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");
		ArrayList<BookingDetailsModel> allBookingsModel = new ArrayList<BookingDetailsModel>();
		List<BookingDetails> allBookings = repBooking.findAll();
		if (allBookings != null) {
			for (BookingDetails bk : allBookings) {
				BookingDetailsModel bkm = new BookingDetailsModel();
				bkm = copyBookingDetailsToBookingDetailsModel(bk);
				allBookingsModel.add(bkm);
			}
			Collections.sort(allBookingsModel,(o1, o2) -> {
						try {
							if(sdf.parse(o1.getCreationTime()).before(sdf.parse(o2.getCreationTime()))){
								return 1;
							} else if(sdf.parse(o1.getCreationTime()).after(sdf.parse(o2.getCreationTime()))){
								return -1;
							}else{
								return 0;
							}
						} catch (ParseException e) {
							// TODO Auto-generated catch block
							e.printStackTrace();
						}
						return 0;
					}
			);

		}

		return allBookingsModel;
	}

	public BookingDetailsModel copyBookingDetailsToBookingDetailsModel(BookingDetails booking) {
		SimpleDateFormat sdf = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");
		BookingDetailsModel bkModel = new BookingDetailsModel();
		bkModel.setBid(booking.getBid());
		bkModel.setDateOfMeeting(booking.getDateOfMeeting());
		bkModel.setDescription(booking.getDescription());
		bkModel.setDuration(booking.getDuration());
		bkModel.setEndTimeHour(booking.getEndTimeHour());
		bkModel.setEndTimeMinute(booking.getEndTimeMinute());
		bkModel.setMeetingId(booking.getMeetingId());
		bkModel.setStartTimeHour(booking.getStartTimeHour());
		bkModel.setStartTimeMinute(booking.getStartTimeMinute());
		bkModel.setStudentId(booking.getStudentId());
		bkModel.setStudentName(booking.getStudentName());
		bkModel.setTutorName(booking.getTutorName());
		bkModel.setApprovalStatus(booking.getApprovalStatus().name());
		bkModel.setSubject(booking.getSubject());
		bkModel.setDomain(booking.getDomain());
		bkModel.setAmount(booking.getAmount());
		bkModel.setPaidAmount(booking.getPaidAmount());
		bkModel.setTutorProfilePictureUrl(booking.getTutorProfilePictureUrl());
		bkModel.setCreationTime(sdf.format(booking.getCreatedDate()));
		String start = booking.getStartTimeHour() + ":" + booking.getStartTimeMinute();
		String end = booking.getEndTimeHour() + ":" + booking.getEndTimeMinute();
		bkModel.setStartTime(start);
		bkModel.setEndTime(end);
		if (booking.getExpertJoinTime() != null) {
			bkModel.setExpertJoinTime(sdf.format(booking.getExpertJoinTime()));
		}
		if (booking.getExpertLeavingTime() != null) {
			bkModel.setExpertLeavingTime(sdf.format(booking.getExpertLeavingTime()));
		}
		if (booking.getLearnerJoinTime() != null) {
			bkModel.setLearnerJoinTime(sdf.format(booking.getLearnerJoinTime()));
		}
		if (booking.getLearnerLeavingTime() != null) {
			bkModel.setLearnerLeavingTime(sdf.format(booking.getLearnerLeavingTime()));
		}

		bkModel.setExpertCode(booking.getExpertCode());
		bkModel.setRazorpay_payment_id(booking.getRazorpay_payment_id());
		bkModel.setRescheduled(booking.isRescheduled());
		return bkModel;
	}

	
	//fetch upi id from user
	public String fetchUpiId(Users user) {
		String upiId="";
		if(user.getRole().equals("Learner")) {
			StudentProfile sp=repStudentProfile.idExist(user.getUserId());
			upiId=sp.getUpiID();
		}else if(user.getRole().equals("Expert")) {
			TutorProfileDetails tpd=repTutorProfileDetails.idExist(user.getUserId());
			upiId=tpd.getUpiId();
		}
		
		if(upiId.equals("")||upiId==null) {
			upiId="NOT_AVAILABLE";
		}
		
		//System.out.println(upiId);
		return upiId;
	}

	public Integer getFGCreditsOfUser( String userId ) {
		// TODO Auto-generated method stub
		System.out.println("User id "+Integer.valueOf(userId));
		
		Users user=repUsers.idExists(Integer.valueOf(userId));
		System.out.println("User objects of FG Credit"+user);
		Integer FGCredits=0;
		if(user!=null) {
			if(user.getCredits()==null) {
				user.setCredits(0);
				user=repUsers.save(user);
			}
			
			FGCredits=user.getCredits();
		}
		System.out.println("FG Credits of User " + FGCredits);
		return FGCredits;
	}

	public CashbackEarned getCashbackEarnedInfo(String userId) {
		// TODO Auto-generated method stub
		Users user=repUsers.idExists(Integer.valueOf(userId));
		UserReferrals userReferral=repUserReferrals.findByUserId(user.getUserId());
		CashbackEarned cashback=new CashbackEarned();
		//user has not referred anyone 
		if(userReferral==null) {
			cashback.setTotalCashback(0.0);
			cashback.setRemainingCashback(0.0);
			cashback.setRedeemedCashback(0.0);
		}else {
			
			cashback.setRemainingCashback((double)userReferral.getPaymentDue());
			cashback.setRedeemedCashback(adminService.getTotalPaidAmount(user));
			cashback.setTotalCashback(cashback.getRedeemedCashback()+cashback.getRemainingCashback());
		}
		
		System.out.println(cashback);
		return cashback;
	}

	public List<FGCreditModel> getFGCreditsTableOfUser(String userId) {
		// TODO Auto-generated method stub
		List<FGCredits> creditList=repFGCredit.findByUserId(Integer.valueOf(userId));
		ArrayList<FGCreditModel> creditModelList=new ArrayList<FGCreditModel>();
		if(creditList!=null) {
			
		
		
		for(FGCredits credit:creditList) {
			
			DateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
			FGCreditModel creditModel=new FGCreditModel();
			creditModel.setDate(formatter.format(credit.getCreditDate()));
			
			Integer amount=credit.getAmount();
			
			creditModel.setType(credit.getType());
			
			creditModel.setAmount(amount);
			
			creditModel.setContext(credit.getContext());
			
			creditModelList.add(creditModel);
		}
		
		}
		return creditModelList;
	}

	public List<CashbackInfo> getCashbackTableOfUser(String userId) {
		// TODO Auto-generated method stub
		List<Cashback> repCashbackList=repCashback.findByUserId(Integer.valueOf(userId));
		
		ArrayList<CashbackInfo> cashbackList=new ArrayList<CashbackInfo>();
		
		for(Cashback cashback:repCashbackList) {
			DateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
			CashbackInfo cashbackModel=new CashbackInfo();
			cashbackModel.setDate(formatter.format(cashback.getCashbackDate()));
			
			BookingDetails booking=cashback.getBookingDetails();
			cashbackModel.setReferredUserName(booking.getStudentName());
			
			cashbackModel.setContext(cashback.getContext());
			
		    cashbackModel.setAmount(cashback.getAmount());
		    
		    System.out.println("Cashback Model "+cashbackModel);
		    
		    cashbackList.add(cashbackModel);
		}
		return cashbackList;
	}

	public void deleteUser(String userId) {
		
		// TODO Auto-generated method stub
		
		
	}


	public void generateInvoiceMail(String bookingId) {
		BookingDetails bookingDetails=repBooking.bidExists(Integer.valueOf(bookingId));

		if(bookingDetails!=null){
			mailService.generateInvoiceMail(bookingDetails);
		}
	}
}
