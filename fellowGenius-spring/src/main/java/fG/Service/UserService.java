package fG.Service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Properties;
import java.util.Random;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import fG.DAO.MeetingDao;
import fG.DAO.dao;
import fG.Entity.BookingDetails;
import fG.Entity.ExpertiseAreas;
import fG.Entity.ScheduleData;
import fG.Entity.SocialLogin;
import fG.Entity.StudentLogin;
import fG.Entity.StudentProfile;
import fG.Entity.TutorAvailabilitySchedule;
import fG.Entity.TutorProfile;
import fG.Entity.TutorProfileDetails;
import fG.Entity.Users;
import fG.Model.AuthenticationResponse;
import fG.Model.ScheduleTime;
import fG.Model.SocialLoginModel;
import fG.Model.StudentLoginModel;
import fG.Model.StudentProfileModel;
import fG.Model.TutorAvailabilityScheduleModel;
import fG.Model.TutorProfileDetailsModel;
import fG.Model.TutorProfileModel;
import fG.Model.TutorVerificationModel;
import fG.Model.registrationModel;
import fG.Repository.repositorySocialLogin;
import fG.Repository.repositoryStudentLogin;
import fG.Repository.repositoryTutorLogin;
import fG.Repository.repositoryUsers;

@Service
public class UserService  implements UserDetailsService{

	@Autowired
	dao dao;
	
	@Autowired
	MeetingDao meetingDao;
	
	@Autowired
	ScheduleService scheduleService;
     
	@Autowired 
	repositoryStudentLogin repStudentLogin;
	
	@Autowired
	repositoryTutorLogin repTutorLogin;
	
	@Autowired
	repositorySocialLogin repSocialLogin;
	
	@Autowired
	repositoryUsers repUsers;
	@Autowired
	private BCryptPasswordEncoder encoder;
 
	public String validateUser(String email, String password) {
		Users userLogin = repUsers.emailExist(email);
		if(userLogin!=null) {
			if(encoder.matches(password, userLogin.getPassword())) {
				return String.valueOf(userLogin.getUserId());
			}else {
				return null;
			}
		}else {
			return null;
		}
	}
	
//	public String validateStudentUser(String email,String password) {
//		StudentLogin studentLogin = repStudentLogin.emailExist(email);
//		if(studentLogin!=null) {
//			if(encoder.matches(password, studentLogin.getPassword())) {
//			return String.valueOf(studentLogin.getStudentProfile().getSid());
//			}else {
//				return null;
//			}
//		}else {
//		 return null;	
//		} 
//	}
	
//	public User loadStudentByUserId(String userId) {
//		List<SimpleGrantedAuthority> authorities = new ArrayList<>();
//		if(dao.findStudentBySid(Integer.valueOf(userId))) {
//		    authorities.add(new SimpleGrantedAuthority("STUDENT"));
//			return new User(userId,"",authorities);
//		}else {
//			return null;
//		}
//	}
	
	public User loadUserByUserId(String userId) {
		List<SimpleGrantedAuthority> authorities = new ArrayList<>();
		Users user = repUsers.idExists(Integer.valueOf(userId));
		if(user!=null) {
		    authorities.add(new SimpleGrantedAuthority(user.getRole()));
			return new User(userId,"",authorities);
		}else {
			return null;
		}
	}
	
//	public String validateTutorUser(String email,String password) {
//		
//		SocialLogin socialLogin =	repSocialLogin.checkSocialLogin(email);
//		TutorLogin tutLogin = repTutorLogin.validation(email);
//		
//		if(socialLogin!=null && socialLogin.getId().equals(password)) {
//			return String.valueOf(socialLogin.getTid());
//		}else if(tutLogin!=null && encoder.matches(password, tutLogin.getPassword())) {
//			return String.valueOf(tutLogin.getTutorProfile().getTid());
//		}else {
//			return null;
//		}
//		
//	}
//	
//	public User loadTutorByUserId(String userId) {
//		List<SimpleGrantedAuthority> authorities = new ArrayList<>();
//		if(dao.getTutorProfile(Integer.valueOf(userId))!=null) {
//		    authorities.add(new SimpleGrantedAuthority("TUTOR"));
//			return new User(userId,"",authorities);
//		}else {
//			return null;
//		}
//	}
	//for registering a user
	public boolean saveUserProfile(registrationModel registrationModel) {
		if(registrationModel.getRole().equals("Learner")) {
			StudentProfile studentProfile = new StudentProfile();
			studentProfile.setContact(registrationModel.getContact());
			studentProfile.setEmail(registrationModel.getEmail());
			studentProfile.setFullName(registrationModel.getFullName());
			if (dao.saveStudentProfile(studentProfile)) {

				Users user = new Users();
				user.setEmail(registrationModel.getEmail());
				user.setPassword(encoder.encode(registrationModel.getPassword()));
				user.setUserId(studentProfile.getSid());
				user.setRole("Learner");
				dao.saveUserLogin(user);

				return true;
			} else {
				return false;
			}
		}else if(registrationModel.getRole().equals("Expert")) {
			TutorProfile tutorProfile = new TutorProfile();
			tutorProfile.setContact(registrationModel.getContact());
			tutorProfile.setEmail(registrationModel.getEmail());
			tutorProfile.setFullName(registrationModel.getFullName());

			if (dao.saveTutorProfile(tutorProfile)) {

				Users user = new Users();
				user.setEmail(registrationModel.getEmail());
				user.setPassword(encoder.encode(registrationModel.getPassword()));
				user.setUserId(tutorProfile.getTid());
				user.setRole("Expert");
				dao.saveUserLogin(user);
				//creating tutor profile details tuple
				TutorProfileDetails tutProfileDetails = new TutorProfileDetails();
				tutProfileDetails.setTid(tutorProfile.getTid());
				tutProfileDetails.setFullName(registrationModel.getFullName());
				tutProfileDetails.setProfileCompleted(12);
				tutProfileDetails.setLessonCompleted(0);
				tutProfileDetails.setRating(100);
				tutProfileDetails.setReviewCount(0);
				dao.saveTutorID(tutProfileDetails);
				//creating tutor schedule tuple
				TutorAvailabilitySchedule tutSchedule = new TutorAvailabilitySchedule();
				tutSchedule.setTid(tutorProfile.getTid());
				tutSchedule.setFullName(tutorProfile.getFullName());
				tutSchedule.setIsAvailable("yes");
				dao.saveTutorAvailbilitySchedule(tutSchedule);
				return true;
			} else {
				return false;
			}
		}else {
			return false;
		}
	}
	
	// saving student registration details
	public boolean saveStudentProfile(StudentProfileModel studentModel) {
		StudentProfile studentProfile = new StudentProfile();
		studentProfile.setContact(studentModel.getContact());
		studentProfile.setDateOfBirth(studentModel.getDateOfBirth());
		studentProfile.setEmail(studentModel.getEmail());
		studentProfile.setFullName(studentModel.getFullName());
//		studentProfile.setSubject(studentModel.getSubject());
//		studentProfile.setGradeLevel(studentModel.getGradeLevel());
		if (dao.saveStudentProfile(studentProfile)) {
			StudentLogin studentLogin = new StudentLogin();
			studentLogin.setPassword(encoder.encode(studentModel.getPassword()));
			studentLogin.setEmail(studentModel.getEmail());
			studentLogin.setStudentProfile(studentProfile);
			dao.saveStudentLogin(studentLogin);
			return true;
		} else {
			return false;
		}
	}

	// checking on student login
	public boolean onStudentLogin(StudentLoginModel studentLoginModel) {
		if (dao.onStudentLogin(studentLoginModel)) {
			return true;
		} else {
			return false;
		}
	}

	// for getting student details after login
	public StudentProfileModel getStudentDetails(String userId) {
		StudentProfileModel stuProfileModel = new StudentProfileModel();
		StudentProfile stuProfile = new StudentProfile();
		stuProfile = dao.getStudentDetails(userId);
		stuProfileModel.setContact(stuProfile.getContact());
		stuProfileModel.setDateOfBirth(stuProfile.getDateOfBirth());
		stuProfileModel.setEmail(stuProfile.getEmail());
		stuProfileModel.setFullName(stuProfile.getFullName());
		stuProfileModel.setPassword("");
		stuProfileModel.setSid(stuProfile.getSid());
//		stuProfileModel.setGradeLevel(stuProfile.getGradeLevel());
//		stuProfileModel.setSubject(stuProfile.getSubject());
		return stuProfileModel;
	}

	// saving updating details of tutor
	public void updateTutorProfileDetails(TutorProfileDetailsModel tutorModel)
			throws IllegalArgumentException, IllegalAccessException {
		TutorProfileDetails tutProfileDetails = new TutorProfileDetails();
		TutorProfileDetails	tutorProfileDetailsLoaded = dao.getTutorProfileDetails(tutorModel.getTid());
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
		//for setting the expertise areas
		for(String area:tutorModel.getAreaOfExpertise()) {
			ExpertiseAreas subject = new ExpertiseAreas();
			subject.setUserId(tutProfileDetails);
			subject.setSubject(area);
			if(!tutorProfileDetailsLoaded.getAreaOfExpertise().stream().filter(o -> o.getSubject().equals(area)).findFirst().isPresent()) {
				tutProfileDetails.getAreaOfExpertise().add(subject);
			}
			
		}
//		tutProfileDetails.setAreaOfExpertise(areas);
		dao.updateTutorProfile(tutProfileDetails);
		Integer profileCompleted =dao.getTutorProfileDetails(tutorModel.getTid()).getProfileCompleted();
		//updating profile completed percentage
		if(profileCompleted<50) {
			dao.updateProfileCompleted(50, tutorModel.getTid());	
		}else if(profileCompleted.equals(50)&&tutProfileDetails.getInstitute()==null) {
			dao.updateProfileCompleted(50, tutorModel.getTid());
		}else if(profileCompleted.equals(50)&&tutProfileDetails.getInstitute()!=null) {
			dao.updateProfileCompleted(100, tutorModel.getTid());
		}
	}

	// for editing tutor profile details
	public void editTutorProfileDetails(TutorProfileDetailsModel tutorModel)
			throws IllegalArgumentException, IllegalAccessException {
		TutorProfileDetails tutProfileDetails = new TutorProfileDetails();
		tutProfileDetails.setDescription(tutorModel.getDescription());
		tutProfileDetails.setFullName(tutorModel.getFullName());
//		tutProfileDetails.setGradeLevel(tutorModel.getGradeLevel());
//		tutProfileDetails.setGraduationYear(tutorModel.getGraduationYear());
		tutProfileDetails.setLessonCompleted(tutorModel.getLessonCompleted());
//		tutProfileDetails.setMajorSubject(tutorModel.getMajorSubject());
		tutProfileDetails.setPrice1(tutorModel.getPrice1());
		tutProfileDetails.setPrice2(tutorModel.getPrice2());
		tutProfileDetails.setPrice3(tutorModel.getPrice3());
		tutProfileDetails.setProfileCompleted(tutorModel.getProfileCompleted());
		tutProfileDetails.setProfilePictureUrl(tutorModel.getProfilePictureUrl());
		tutProfileDetails.setRating(tutorModel.getRating());
		tutProfileDetails.setReviewCount(tutorModel.getReviewCount());
//		tutProfileDetails.setStudyInstitution(tutorModel.getStudyInstitution());
//		tutProfileDetails.setSubject1(tutorModel.getSubject1());
//		tutProfileDetails.setSubject2(tutorModel.getSubject2());
//		tutProfileDetails.setSubject3(tutorModel.getSubject3());
		tutProfileDetails.setTid(tutorModel.getTid());
//		tutProfileDetails.setWorkInstitution(tutorModel.getWorkInstitution());
//		tutProfileDetails.setWorkTitle(tutorModel.getWorkTitle());
		tutProfileDetails.setSpeciality(tutorModel.getSpeciality());
		dao.updateTutorProfile(tutProfileDetails);
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
				//saving tutor profile details
				TutorProfileDetails tutProfileDetails = new TutorProfileDetails();
				tutProfileDetails.setTid(tutorProfile.getTid());
				tutProfileDetails.setProfileCompleted(12);
				tutProfileDetails.setLessonCompleted(0);
				tutProfileDetails.setRating(100);
				tutProfileDetails.setReviewCount(0);
				dao.saveTutorID(tutProfileDetails);
				
				//saving tutor schedule details
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
		dao.updateTutorBasicInfo(tutorProfile);
		
		if(dao.getTutorProfileDetails(tutorModel.getTid()).getProfileCompleted()<=50) {
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
//		tutorProfile.setAddressLine1(tutorModel.getAddressLine1());
//		tutorProfile.setAddressLine2(tutorModel.getAddressLine2());
//		tutorProfile.setCountry(tutorModel.getCountry());
//		tutorProfile.setState(tutorModel.getState());
		tutorProfile.setProfilePictureUrl(tutorModel.getProfilePictureUrl());
//		tutorProfile.setCity(tutorModel.getCity());
		dao.updateTutorBasicInfo(tutorProfile);
	}

//	// validation of tutor login
//	public boolean onTutorLogin(TutorLoginModel tutorLoginModel) {
//		if (dao.onTutorLogin(tutorLoginModel)) {
//			return true;
//		} else {
//			return false;
//		}
//	}

	// getting tutor details after login
	public TutorProfileModel getTutorDetails(String userId) {
		TutorProfileModel tutorProfileModel = new TutorProfileModel();
		TutorProfile tutorProfile = dao.getTutorDetails(userId);
		tutorProfileModel.setContact(tutorProfile.getContact());
		tutorProfileModel.setDateOfBirth(tutorProfile.getDateOfBirth());
		tutorProfileModel.setEmail(tutorProfile.getEmail());
		tutorProfileModel.setFullName(tutorProfile.getFullName());
		tutorProfileModel.setTid(tutorProfile.getTid());
		tutorProfileModel.setProfilePictureUrl(tutorProfile.getProfilePictureUrl());
		return tutorProfileModel;
	}

	// for getting the list of teachers with 100% profile completion
	public List<TutorProfileDetails> getTutorList() {
		return dao.getTutorList();
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

	// getting tutor profile details with tid
	public TutorProfileDetailsModel getTutorProfileDetails(Integer tid) {
		System.out.println("get tutot profile details ->"+dao.getTutorProfileDetails(tid));
		TutorProfileDetails tutProfileDetails = dao.getTutorProfileDetails(tid);
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
		for(ExpertiseAreas area:tutProfileDetails.getAreaOfExpertise()) {
			tutorProfileDetailsModel.getAreaOfExpertise().add(area.getSubject());
		}
		
		return tutorProfileDetailsModel;
	}

	// for saving social login details
	public boolean registerSocialLogin(SocialLoginModel socialLoginModel) {
		SocialLogin socialLogin = new SocialLogin();
		socialLogin.setEmail(socialLoginModel.getEmail());
		socialLogin.setFullName(socialLoginModel.getFullName());
		socialLogin.setId(socialLoginModel.getId());
		if (dao.saveSocialLogin(socialLogin)) {
			return true;
		} else {
			return false;
		}
	}

//	// for checking social login
//	public boolean checkSocialLogin(String email) {
//		if (dao.checkSocialLogin(email)) {
//			return true;
//		} else {
//			return false;
//		}
//	}

	// for saving tutor Availability Schedule
		public void saveTutorAvailabilitySchedule(TutorAvailabilityScheduleModel tutorAvailabilityScheduleModel) {
			ArrayList<String> availableSchedules = new ArrayList<String>();
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
				schedule.setSubject(booking.getStudentName());
				bookingSchedule.add(schedule);
			}
			tutAvailModel.setAllMeetingsSchedule(bookingSchedule);
			return tutAvailModel;
		}

	// get tutor time array with tid
	public ArrayList<ScheduleTime> getTutorTimeAvailabilityTimeArray(String tid) {
		TutorAvailabilityScheduleModel tutorSchedule = dao.getTutorAvailabilitySchedule(Integer.valueOf(tid));
		return scheduleService.getTimeArray(tutorSchedule.getAllAvailabilitySchedule(), Integer.valueOf(tid));
	}

	// for updating student profile
	public boolean updateStudentProfile(StudentProfileModel studentModel) {
		StudentProfile studentProfile = new StudentProfile();
		studentProfile.setContact(studentModel.getContact());
		studentProfile.setDateOfBirth(studentModel.getDateOfBirth());
		studentProfile.setEmail(studentModel.getEmail());
		studentProfile.setFullName(studentModel.getFullName());
		studentProfile.setUserBookingId(null);
		studentProfile.setSid(studentModel.getSid());
		studentProfile.setProfilePictureUrl(studentModel.getProfilePictureUrl());
		studentProfile.setLinkProfile(studentModel.getLinkProfile());
		studentProfile.setLearningAreas(studentModel.getLearningAreas());
		dao.updateStudentProfile(studentProfile);
		
		dao.learningAreasCount(studentModel.getLearningAreas());
		return true;

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
		ArrayList<BookingDetails> bookings = (ArrayList<BookingDetails>) meetingDao.fetchAllStudentBookings(Integer.valueOf(sid));
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
			String to = email;
			String from = "fellowGenius.tech@gmail.com";
	      
			Properties props = new Properties();
			props.put("mail.smtp.auth", "true");
			props.put("mail.smtp.starttls.enable", "true");
			props.put("mail.smtp.host", "smtp.gmail.com");
			props.put("mail.smtp.port", 587);
	      
	      Session session = Session.getDefaultInstance(props, new javax.mail.Authenticator()
	     {	
	    	  protected PasswordAuthentication getPasswordAuthentication() {
	    		  return new PasswordAuthentication("fellowgenius.tech@gmail.com", "fG15051209");
	    	  }
	    	  
	      });

	      int m = (int) Math.pow(10, 5);
  		String otp =String.valueOf((m + new Random().nextInt(9 * m)));
  		
	      try {
	            MimeMessage message = new MimeMessage(session);  
	            
		   message.setFrom(new InternetAddress(from));

		   
		   message.addRecipient(Message.RecipientType.TO, new InternetAddress(to));

		   
		   message.setSubject("Welcome to FellowGenius");

		   
		   message.setContent(
	              "<html> <head> <link rel=\"stylesheet\" href=\"https://maxcdn.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css\"/>"
	              + " <style>.Box{box-shadow: 0px 0px 5px rgb(199, 203, 217, 0.7);width: 100%;height: auto;text-align: center;padding: "
	              + "20px;margin-top: 10px;}.logo{color: #241084;font-weight: 500;line-height: 2rem;font-size: xx-large;}</style> "
	              + "</head><body> <div class=\"container-fluid\"> <div class=\"row\"> <div class=\"col-sm-3\">"
	              + "</div><div class=\"col-sm-6\"> <div class=\"Box\"> <div class=\"box-header\"> <h1 class=\"logo\">fellowGenius</h1> "
	              + "</div><div class=\"box-body\"> <h2>Welcome to fellow Genius</h2> "
	              + "<p>Please Verify your account by entering the One-time-password Provided below :</p><h2 style=\"padding: 20px;"
	              + "background-color: #e0e0e0;width: max-content;margin:auto\">"+ otp+ "</h2> </div></div></div>"
	              + "<div class=\"com-sm-3\"></div></div></div></body></html>" ,
	             "text/html");

		   
		   Transport.send(message);

		   System.out.println("Sent message successfully....");

	      } catch (MessagingException e) {
		   e.printStackTrace();
		   throw new RuntimeException(e);
	      }
	      String otpFinal = encoder.encode(otp);
	      System.out.println(otpFinal);
		return new AuthenticationResponse(otpFinal);
		
	}
	
	// fetch if the tutor is available ?
	public boolean getTutorIsAvailable(String tid) {
		if(dao.getTutorAvailabilitySchedule(Integer.valueOf(tid)).getIsAvailable().equals("yes")){
			return true;
		}else {
			return false;
		}
	}

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		// TODO Auto-generated method stub
		return null;
	}

	public String fetchUserRole(String userId) {
		return repUsers.idExists(Integer.valueOf(userId)).getRole();
	}

	
}
