package fG.Service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
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
import fG.Entity.AppInfo;
import fG.Entity.BookingDetails;
import fG.Entity.CategoryList;
import fG.Entity.ExpertiseAreas;
import fG.Entity.LearningAreas;
import fG.Entity.Notification;
import fG.Entity.ScheduleData;
import fG.Entity.SocialLogin;
import fG.Entity.StudentLogin;
import fG.Entity.StudentProfile;
import fG.Entity.SubcategoryList;
import fG.Entity.TutorAvailabilitySchedule;
import fG.Entity.TutorProfile;
import fG.Entity.TutorProfileDetails;
import fG.Entity.UserActivity;
import fG.Entity.Users;
import fG.Model.AppInfoModel;
import fG.Model.AuthenticationResponse;
import fG.Model.Category;
import fG.Model.NotificationModel;
import fG.Model.ScheduleTime;
import fG.Model.SocialLoginModel;
import fG.Model.StudentLoginModel;
import fG.Model.StudentProfileModel;
import fG.Model.TutorAvailabilityScheduleModel;
import fG.Model.TutorProfileDetailsModel;
import fG.Model.TutorProfileModel;
import fG.Model.TutorVerificationModel;
import fG.Model.UserActivityAnalytics;
import fG.Model.expertise;
import fG.Model.registrationModel;
import fG.Repository.repositoryAppInfo;
import fG.Repository.repositoryBooking;
import fG.Repository.repositoryCategory;
import fG.Repository.repositoryNotification;
import fG.Repository.repositorySocialLogin;
import fG.Repository.repositoryStudentLogin;
import fG.Repository.repositoryStudentProfile;
import fG.Repository.repositorySubCategoryList;
import fG.Repository.repositoryTutorLogin;
import fG.Repository.repositoryTutorProfile;
import fG.Repository.repositoryTutorProfileDetails;
import fG.Repository.repositoryUserActivity;
import fG.Repository.repositoryUsers;

@Service
public class UserService implements UserDetailsService {

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
	private BCryptPasswordEncoder encoder;
	
	@Autowired
	MailService mailService;
	
	
	public String validateUser(String email, String password) {
		Users userLogin = repUsers.emailExist(email);
		Date lastLogin = new Date();
		userLogin.setLastLogin(lastLogin);
		UserActivity userActivity = new UserActivity();
	
		if (userLogin != null) {
			userActivity.setUserId(userLogin);
			userActivity.setType("login");
			if (encoder.matches(password, userLogin.getPassword())) {
				repUsers.save(userLogin);
				repUserActivity.save(userActivity);
				return String.valueOf(userLogin.getUserId());
			} 
			if(encoder.matches(password, userLogin.getSocialId())) {
				repUsers.save(userLogin);
				repUserActivity.save(userActivity);
				System.out.println("social id exists and matches");
				return String.valueOf(userLogin.getUserId());
			}else {
				System.out.println("n/a called");
				if(encoder.matches("N/A", userLogin.getSocialId())) {
					repUsers.save(userLogin);
					repUserActivity.save(userActivity);
					return String.valueOf(userLogin.getUserId());
				}else {
					return null;
				}
			}
			
		} else {
			return null;
		}
	}


	public User loadUserByUserId(String userId) {
		List<SimpleGrantedAuthority> authorities = new ArrayList<>();
		Users user = repUsers.idExists(Integer.valueOf(userId));
		if (user != null) {
			authorities.add(new SimpleGrantedAuthority(user.getRole()));
			return new User(userId, "", authorities);
		} else {
			return null;
		}
	}

	// for registering a user
	public boolean saveUserProfile(registrationModel registrationModel) {
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
			if (dao.saveStudentProfile(studentProfile)) {

				Users user = new Users();
				user.setEmail(registrationModel.getEmail());
				user.setPassword(encoder.encode(registrationModel.getPassword()));
				user.setUserId(studentProfile.getSid());
				user.setRole("Learner");
				user.setSocialId(encoder.encode("N/A"));
				if(registrationModel.getSocialId()!=null) {
					user.setSocialId(encoder.encode(registrationModel.getSocialId()));
				}
				dao.saveUserLogin(user);
				userActivity.setUserId(user);
				repUserActivity.save(userActivity);
				return true;
			} else {
				return false;
			}
		} else if (registrationModel.getRole().equals("Expert")) {
			TutorProfile tutorProfile = new TutorProfile();
			tutorProfile.setContact(registrationModel.getContact());
			tutorProfile.setEmail(registrationModel.getEmail());
			tutorProfile.setFullName(registrationModel.getFullName());
			tutorProfile.setBookingId(genUserBookingId());

			if (dao.saveTutorProfile(tutorProfile)) {

				Users user = new Users();
				user.setEmail(registrationModel.getEmail());
				user.setPassword(encoder.encode(registrationModel.getPassword()));
				user.setUserId(tutorProfile.getTid());
				user.setSocialId(encoder.encode("N/A"));
				if(registrationModel.getSocialId()!=null) {
					user.setSocialId(encoder.encode(registrationModel.getSocialId()));
				}
				user.setRole("Expert");
				dao.saveUserLogin(user);
				// creating tutor profile details tuple
				TutorProfileDetails tutProfileDetails = new TutorProfileDetails();
				tutProfileDetails.setTid(tutorProfile.getTid());
				tutProfileDetails.setFullName(registrationModel.getFullName());
				tutProfileDetails.setProfileCompleted(12);
				tutProfileDetails.setLessonCompleted(0);
				tutProfileDetails.setRating(100);
				tutProfileDetails.setReviewCount(0);
				tutProfileDetails.setPrice1("400");
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
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	}
	public Integer genUserBookingId() {
	  IdGenerator id = new IdGenerator();
	  Integer bookingId = id.generate9DigitNumber();
	  if(repTutorProfile.findByBookingId(bookingId)==null) {
		  return bookingId;
	  }else {
		return genUserBookingId();
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
		stuProfileModel.setSid(stuProfile.getSid());
		stuProfileModel.setContact(stuProfile.getContact());
		stuProfileModel.setDateOfBirth(stuProfile.getDateOfBirth());
		stuProfileModel.setEmail(stuProfile.getEmail());
		stuProfileModel.setFullName(stuProfile.getFullName());
		stuProfileModel.setProfilePictureUrl(stuProfile.getProfilePictureUrl());
		stuProfileModel.setLinkedInProfile(stuProfile.getLinkedInProfile());
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
		// for setting the expertise areas
		Integer minPrice = Integer.MAX_VALUE;
		Integer maxPrice = 0;
		if (tutorProfileDetailsLoaded.getPrice1() != "400") {
			if (tutorProfileDetailsLoaded.getPrice2() != null && tutorProfileDetailsLoaded.getPrice1() != null) {
				minPrice = Integer.valueOf(tutorProfileDetailsLoaded.getPrice2());
				maxPrice = Integer.valueOf(tutorProfileDetailsLoaded.getPrice1());
			}
		}

		for (expertise area : tutorModel.getAreaOfExpertise()) {
			ExpertiseAreas subject = new ExpertiseAreas();
			SubcategoryList subCateg = repSubcategory.findSubCategoryByName(area.getSubCategory());
			if(subCateg!=null) {
				subject.setUserId(tutProfileDetails);
				subject.setSubCategory(subCateg);
				subject.setCategory(subCateg.getCategory());
				subject.setPrice(area.getPrice());
				if (!tutorProfileDetailsLoaded.getAreaOfExpertise().stream()
						.filter(o -> o.getSubCategory().getSubCategoryName().equals(area.getSubCategory())).findFirst().isPresent()) {
					tutProfileDetails.getAreaOfExpertise().add(subject);
					if (area.getPrice() > maxPrice) {
						maxPrice = area.getPrice();
					}
					if (area.getPrice() < minPrice) {
						minPrice = area.getPrice();
					}
				}
				
			}
		}
		if (maxPrice != 0 && minPrice != Integer.MAX_VALUE) {
			tutProfileDetails.setPrice1(minPrice.toString());
			tutProfileDetails.setPrice2(maxPrice.toString());
		}

//		tutProfileDetails.setAreaOfExpertise(areas);
//		System.out.println(tutProfileDetails);
		dao.updateTutorProfile(tutProfileDetails);
//		Integer profileCompleted = dao.getTutorProfileDetails(tutorModel.getTid()).getProfileCompleted();
//		// updating profile completed percentage
//		if (profileCompleted < 50) {
//			dao.updateProfileCompleted(50, tutorModel.getTid());
//		} else if (profileCompleted.equals(50) && tutProfileDetails.getInstitute() == null) {
//			dao.updateProfileCompleted(50, tutorModel.getTid());
//		} else if (profileCompleted.equals(50) && tutProfileDetails.getInstitute() != null) {
//			dao.updateProfileCompleted(100, tutorModel.getTid());
//		}
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
		System.out.println("tutorProfile => "+tutorProfile);
		tutorProfileModel.setContact(tutorProfile.getContact());
		tutorProfileModel.setDateOfBirth(tutorProfile.getDateOfBirth());
		tutorProfileModel.setEmail(tutorProfile.getEmail());
		tutorProfileModel.setFullName(tutorProfile.getFullName());
		tutorProfileModel.setTid(tutorProfile.getTid());
		tutorProfileModel.setProfilePictureUrl(tutorProfile.getProfilePictureUrl());
		tutorProfileModel.setBookingId(tutorProfile.getBookingId());
		System.out.println("tutorProfileModel =>"+tutorProfileModel);
		return tutorProfileModel;
	}

	// for getting the list of teachers with 100% profile completion
	public List<TutorProfileDetailsModel> getTutorList(String subject) {
		List<TutorProfileDetailsModel> tutListModel = new ArrayList<TutorProfileDetailsModel>();
		List<TutorProfileDetails> tutList = dao.getTutorList(subject);
		for (TutorProfileDetails tutProfileDetails : tutList) {
			TutorProfileDetailsModel tutorModel = copyTutorProfileDetails(tutProfileDetails);
			tutorModel.setTid(null);
			tutListModel.add(tutorModel);
		}
		return tutListModel;
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
	//getting tutor profile details with tutor bookingId
	public TutorProfileDetailsModel fetchBookingTutorProfileDetails(Integer bookingId) {
		TutorProfileDetails tutProfileDetails = dao.fetchTutorProfileDetailsByBookingId(bookingId);
		TutorProfileDetailsModel tutProfileDetailsModel =copyTutorProfileDetails(tutProfileDetails);
		tutProfileDetailsModel.setTid(null);
		return tutProfileDetailsModel;
	}
	// getting tutor profile details with tid
	public TutorProfileDetailsModel getTutorProfileDetails(Integer tid) {
		TutorProfileDetails tutProfileDetails = dao.getTutorProfileDetails(tid);
	    return copyTutorProfileDetails(tutProfileDetails);
	}
	
	//from copying content of tutorProfileDetails entity to model
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
		for (ExpertiseAreas area : tutProfileDetails.getAreaOfExpertise()) {
			expertise exp = new expertise();
			exp.setCategory(area.getCategory().getCategoryName());
			exp.setSubCategory(area.getSubCategory().getSubCategoryName());
			exp.setPrice(area.getPrice());
			tutorProfileDetailsModel.getAreaOfExpertise().add(exp);
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
	public ArrayList<ScheduleTime> getTutorTimeAvailabilityTimeArray(String tid) {
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
		if (dao.getTutorAvailabilitySchedule(Integer.valueOf(bookingId)).getIsAvailable().equals("yes")) {
			return true;
		} else {
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

	public void subtractArea(int id, String subject, String role) {
		dao.subtractArea(id, subject, role);
	}

	public List<TutorProfileDetailsModel> fetchAllLinkedTutors(Integer userId) {
		List<TutorProfileDetails> tutors = dao.fetchAllLinkedTutors(userId);
		List<TutorProfileDetailsModel> tutorsModel = new ArrayList<TutorProfileDetailsModel>();
		for (TutorProfileDetails tutor : tutors) {
			tutorsModel.add(copyTutorProfileDetails(tutor));
		}
		return tutorsModel;

	}

	public List<TutorProfileDetailsModel> filtersApplied(String[] subjects, String[] price, Integer[] ratings) {
		List<TutorProfileDetails> tutors = dao.filtersApplied(subjects, price, ratings);
		if (tutors == null) {
			return null;
		} else {
			List<TutorProfileDetailsModel> tutorsModel = new ArrayList<TutorProfileDetailsModel>();
			for (TutorProfileDetails tutor : tutors) {
				tutorsModel.add(copyTutorProfileDetails(tutor));
			}
			return tutorsModel;
		}

	}

	public boolean checkUserExists(String email) {
		if (repUsers.emailExist(email) != null) {
			return true;
		} else {
			return false;
		}
	}

	public boolean sendResetLink(String email) {
		Users user = repUsers.emailExist(email);
		if (user != null) {
			String token = user.getUserId().toString();
			String directUrl = "https://fellowgenius.com/#/resetPassword?token="+token;
			System.out.println(directUrl);
			String to = email;
			String from = "fellowGenius.tech@gmail.com";

			Properties props = new Properties();
			props.put("mail.smtp.auth", "true");
			props.put("mail.smtp.starttls.enable", "true");
			props.put("mail.smtp.host", "smtp.gmail.com");
			props.put("mail.smtp.port", 587);

			Session session = Session.getDefaultInstance(props, new javax.mail.Authenticator() {
				protected PasswordAuthentication getPasswordAuthentication() {
					return new PasswordAuthentication("fellowgenius.tech@gmail.com", "fellowG12091505.");
				}

			});

			try {
				MimeMessage message = new MimeMessage(session);

				message.setFrom(new InternetAddress(from));

				message.addRecipient(Message.RecipientType.TO, new InternetAddress(to));

				message.setSubject("Reset your password");

//				message.setContent(
//						"<html> <head> <link rel=\"stylesheet\" href=\"https://maxcdn.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css\"/> <style>.Box{box-shadow: 0px 0px 5px rgb(199, 203, 217, 0.7);width: 100%;height: auto;text-align: center;padding: 20px;margin-top: 10px;}.logo{color: #241084;font-weight: 500;line-height: 2rem;font-size: xx-large;}</style> </head><body> <div class=\"container-fluid\"> <div class=\"row\">"
//						+ " <div class=\"col-sm-3\"></div><div class=\"col-sm-6\"> <div class=\"Box\"> <div class=\"box-header\"> <h1 class=\"logo\">fellowGenius</h1> </div><div class=\"box-body\">"
//						+ " <h2>Reset your password</h2> <p>Please click on the link mentioned below to verify and reset your password</p>"
//						+ "<a href=\""+directUrl+"\" class=\"btn btn-primary\">Reset Link</a> "
//						+ "</div></div></div><div class=\"com-sm-3\"></div></div></div></body></html>",
//						"text/html");
                message.setContent("<html><head> <link rel=\"stylesheet\" href=\"https://maxcdn.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css\"/> <style>.Box{box-shadow: 0 8px 16px 0 #90a4ae; width: 100%; height: auto; text-align: center; padding: 20px; margin-top: 10px; background: url(https://fellowgenius.com/search_right_bg.7af30faa440a7e6ab2bb.svg) no-repeat; background-size: contain; border: 1px solid #7d0f7d; border-radius: 8px; width: 650px; margin: 0 auto; background-position: left top;}.logo{background: url(https://fellowgenius.com/logo.2dbc598173218fe92921.svg) no-repeat; background-size: contain; height: 100px; display: block; float: right; width: 100px;}tr{padding: 10px;}td{padding: 5px; margin-right: 5px;}</style></head><body> <div class=\"Box\"> <div class=\"box-header\"> <span class=\"logo\"></span> <span style=\"margin-bottom: 20px;color:#892687;width:100%;text-align: center;font-size:16px;font-weight:bold;text-transform: uppercase;\">Reset your password !</span> </div>"
                		+ "<div style=\"padding:20px;width: 350px; margin: 0 auto;\"> <p>Please click on the link mentioned below to verify and reset your password</p>"
                		+ "<a href=\""+directUrl+"\" class=\"btn btn-primary\">Reset Link</a> "
                		+ "</div><p style=\"margin-top: 30px; font-size: 10px; text-align: center; width: 100%;\">This is an auto-generated message please don't reply back.</p></div><div class=\"container-fluid\"> <div class=\"row\"> <div class=\"col-sm-2\"></div><div class=\"col-sm-7\"> </div><div class=\"com-sm-3\"></div></div></div></body></html>","text/html");
				Transport.send(message);

			} catch (MessagingException e) {
				e.printStackTrace();
				throw new RuntimeException(e);
			}

			return true;
		} else {
			return false;
		}
	}

	public boolean updatePassword(String userId, String password) {
		System.out.println(userId);
		if(repUsers.idExists(Integer.valueOf(userId))!=null) {
			String newPassword = encoder.encode(password);
			repUsers.updatePassword(Integer.valueOf(userId),newPassword);
			return true;
		}else {
			return false;	
		}
	}

	//to create new subject category
	public boolean addNewCategory(Category category) {
		// TODO Auto-generated method stub
		CategoryList newCategory = new CategoryList();
		List<CategoryList> allCategories = new ArrayList<CategoryList>();
		allCategories = repCategory.findAll();
		int categoryFoundFlag=0;
		if(allCategories.size()>0) {
			for(CategoryList c:allCategories) {
				if(c.getCategoryName().equals(category.getCategory())) {
					categoryFoundFlag=1;
				}
			}
		}
		if(categoryFoundFlag!=1) {
			newCategory.setCategoryName(category.getCategory());
			repCategory.save(newCategory);
			return true;
		}else {
			return false;
		}
	}


	public List<Category> getAllCategories() {
		List<CategoryList> categoryEntity = repCategory.findAll();
		List<Category> categoryModel = new ArrayList<Category>();
		if(categoryEntity!=null) {
			for(CategoryList c:categoryEntity) {
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
		if(categ!=null) {
			subCateg.setCategory(categ);
			subCateg.setSubCategoryName(category.getSubCategory());
			repSubcategory.save(subCateg);
			return true;
		}else {
			return false;
		}
	}


	public List<Category> getSubCategories(String category) {
		CategoryList  categ = repCategory.findCategory(category);
		List<Category> subCategsModel = new ArrayList<Category>();
		if(categ!=null) {
			List<SubcategoryList> subCategs = repSubcategory.findSubCategories(categ.getCategoryId());
			System.out.println(subCategs);
			if(subCategs!=null) {
				for(SubcategoryList sc:subCategs) {
					Category cat = new Category();
					cat.setCategory(sc.getCategory().getCategoryName());
					cat.setSubCategory(sc.getSubCategoryName());
					subCategsModel.add(cat);
				}
			}	
		}
		
		return subCategsModel;
	}
	
	public List<Category> getAllSubCategories(){
		List<Category> categModel = new ArrayList<Category>();
		List<SubcategoryList> subCategs = repSubcategory.findAll();
		if(subCategs!=null) {
			for(SubcategoryList sc:subCategs) {
				Category categ = new Category();
				categ.setCategory(sc.getCategory().getCategoryName());
				categ.setSubCategory(sc.getSubCategoryName());
				categModel.add(categ);
			}
		}
		return categModel;
	}

	//for fetching notifications using userId
	public List<NotificationModel> fetchNotifications(String userId) {
		List<NotificationModel> notifList = new ArrayList<NotificationModel>();
		if(userId!=null) {
			List<Notification> notifications = repNotification.notificationExist(userId);
			if(notifications!=null) {
				for(Notification n:notifications) {
					NotificationModel nModel = new NotificationModel();
					nModel.setPictureUrl(n.getPictureUrl());
					nModel.setReadStatus(n.isReadStatus());
					nModel.setTimestamp(n.getTimestamp());
					String message="";
					if(n.getEntityTypeId()==11) {
					 StudentProfile sp = repStudentProfile.idExist(Integer.valueOf(n.getActorId()));
					 message = sp.getFullName()+ " sent you an appointment request";
					}else if(n.getEntityTypeId()==12) {
					 TutorProfile tp = repTutorProfile.findByBookingId(Integer.valueOf(n.getActorId()));
					 message = tp.getFullName()+" has accepted your appointment request";
					}else if(n.getEntityTypeId()==13) {
						 StudentProfile sp = repStudentProfile.idExist(Integer.valueOf(n.getActorId()));
						 message = sp.getFullName()+ " has cancelled its recent appointment";
					}
					nModel.setMessage(message);
					notifList.add(nModel);
				}
			}
			if(notifList!=null) {
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
		List<AppInfoModel> appInfoList= new ArrayList<AppInfoModel>();
		List<AppInfo> appInfo = repAppInfo.typeExist("Earnings");
		if(appInfo!=null) {
			for(AppInfo ai:appInfo) {
				AppInfoModel aInfo = new AppInfoModel();
				aInfo.setKey(ai.getKeyName());
				aInfo.setValue(ai.getValue());
				appInfoList.add(aInfo);
			}
		}
		return appInfoList;
	}


	public UserActivityAnalytics fetchUserDataAnalytics() {
		UserActivityAnalytics userAnalytics= new UserActivityAnalytics();
		long userCount = repUsers.count();
		userAnalytics.setUsersCount((int)userCount);
		List<UserActivity> users = repUserActivity.findLast1WeekLogins();
		userAnalytics.setWeeklyLoginCount(users.size());
		users= repUserActivity.findTodayLogins();
		userAnalytics.setDailyLoginCount(users.size());
		users = repUserActivity.findLast1MonthLogins();
		userAnalytics.setMonthlyLoginCount(users.size());
		
		users=repUserActivity.findTodaySignUp();
		userAnalytics.setDailySignUpCount(users.size());
		users=repUserActivity.findLast1WeekSignUp();
		userAnalytics.setWeeklySignUpCount(users.size());
		users=repUserActivity.findLast1MonthSignUp();
		userAnalytics.setMonthlySignUpCount(users.size());
		
		List<BookingDetails> bookings = repBooking.findTodayMeetings();
		userAnalytics.setDailyMeetingsSetup(bookings.size());
		bookings=repBooking.findLast1WeekMeetings();
		userAnalytics.setWeeklyMeetingSetup(bookings.size());
		bookings = repBooking.findLast1MonthMeetings();
		userAnalytics.setMonthlyMeetingSetup(bookings.size());
		return userAnalytics;
	}
	 
}
