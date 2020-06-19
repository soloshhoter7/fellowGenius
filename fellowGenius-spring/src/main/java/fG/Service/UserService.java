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
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import fG.DAO.MeetingDao;
import fG.DAO.dao;
import fG.Entity.BookingDetails;
import fG.Entity.ScheduleData;
import fG.Entity.SocialLogin;
import fG.Entity.StudentLogin;
import fG.Entity.StudentProfile;
import fG.Entity.TutorAvailabilitySchedule;
import fG.Entity.TutorLogin;
import fG.Entity.TutorProfile;
import fG.Entity.TutorProfileDetails;
import fG.Entity.TutorVerification;
import fG.Model.ScheduleTime;
import fG.Model.SocialLoginModel;
import fG.Model.StudentLoginModel;
import fG.Model.StudentProfileModel;
import fG.Model.TutorAvailabilityScheduleModel;
import fG.Model.TutorLoginModel;
import fG.Model.TutorProfileDetailsModel;
import fG.Model.TutorProfileModel;
import fG.Model.TutorVerificationModel;

@Service
public class UserService {

	@Autowired
	dao dao;
	
	@Autowired
	MeetingDao meetingDao;
	
	@Autowired
	ScheduleService scheduleService;

	// saving student registration details
	public boolean saveStudentProfile(StudentProfileModel studentModel) {
		StudentProfile studentProfile = new StudentProfile();
		studentProfile.setContact(studentModel.getContact());
		studentProfile.setDateOfBirth(studentModel.getDateOfBirth());
		studentProfile.setEmail(studentModel.getEmail());
		studentProfile.setFullName(studentModel.getFullName());
		studentProfile.setSubject(studentModel.getSubject());
		studentProfile.setGradeLevel(studentModel.getGradeLevel());
		if (dao.saveStudentProfile(studentProfile)) {
			StudentLogin studentLogin = new StudentLogin();
			studentLogin.setPassword(studentModel.getPassword());
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
	public StudentProfileModel getStudentDetails(String email) {
		StudentProfileModel stuProfileModel = new StudentProfileModel();
		StudentProfile stuProfile = new StudentProfile();
		stuProfile = dao.getStudentDetails(email);
		stuProfileModel.setContact(stuProfile.getContact());
		stuProfileModel.setDateOfBirth(stuProfile.getDateOfBirth());
		stuProfileModel.setEmail(stuProfile.getEmail());
		stuProfileModel.setFullName(stuProfile.getFullName());
		stuProfileModel.setPassword("");
		stuProfileModel.setSid(stuProfile.getSid());
		stuProfileModel.setGradeLevel(stuProfile.getGradeLevel());
		stuProfileModel.setSubject(stuProfile.getSubject());
		return stuProfileModel;
	}

	// saving updating details of tutor
	public void updateTutorProfileDetails(TutorProfileDetailsModel tutorModel)
			throws IllegalArgumentException, IllegalAccessException {
		TutorProfileDetails tutProfileDetails = new TutorProfileDetails();
		tutProfileDetails.setDescription(tutorModel.getDescription());
		tutProfileDetails.setFullName(tutorModel.getFullName());
		tutProfileDetails.setGradeLevel(tutorModel.getGradeLevel());
		tutProfileDetails.setGraduationYear(tutorModel.getGraduationYear());
		tutProfileDetails.setLessonCompleted(tutorModel.getLessonCompleted());
		tutProfileDetails.setMajorSubject(tutorModel.getMajorSubject());
		tutProfileDetails.setPrice1(tutorModel.getPrice1());
		tutProfileDetails.setPrice2(tutorModel.getPrice2());
		tutProfileDetails.setPrice3(tutorModel.getPrice3());
		tutProfileDetails.setProfileCompleted(tutorModel.getProfileCompleted());
		tutProfileDetails.setProfilePictureUrl(tutorModel.getProfilePictureUrl());
		tutProfileDetails.setRating(tutorModel.getRating());
		tutProfileDetails.setReviewCount(tutorModel.getReviewCount());
		tutProfileDetails.setStudyInstitution(tutorModel.getStudyInstitution());
		tutProfileDetails.setSubject1(tutorModel.getSubject1());
		tutProfileDetails.setSubject2(tutorModel.getSubject2());
		tutProfileDetails.setSubject3(tutorModel.getSubject3());
		tutProfileDetails.setTid(tutorModel.getTid());
		tutProfileDetails.setWorkInstitution(tutorModel.getWorkInstitution());
		tutProfileDetails.setWorkTitle(tutorModel.getWorkTitle());
		tutProfileDetails.setSpeciality(tutorModel.getSpeciality());
		dao.updateTutorProfile(tutProfileDetails);
		if (tutorModel.getStudyInstitution() == null) {
			dao.updateProfileCompleted(37, tutorModel.getTid());
		} else {
			dao.updateProfileCompleted(62, tutorModel.getTid());
		}
	}

	// for editing tutor profile details
	public void editTutorProfileDetails(TutorProfileDetailsModel tutorModel)
			throws IllegalArgumentException, IllegalAccessException {
		TutorProfileDetails tutProfileDetails = new TutorProfileDetails();
		tutProfileDetails.setDescription(tutorModel.getDescription());
		tutProfileDetails.setFullName(tutorModel.getFullName());
		tutProfileDetails.setGradeLevel(tutorModel.getGradeLevel());
		tutProfileDetails.setGraduationYear(tutorModel.getGraduationYear());
		tutProfileDetails.setLessonCompleted(tutorModel.getLessonCompleted());
		tutProfileDetails.setMajorSubject(tutorModel.getMajorSubject());
		tutProfileDetails.setPrice1(tutorModel.getPrice1());
		tutProfileDetails.setPrice2(tutorModel.getPrice2());
		tutProfileDetails.setPrice3(tutorModel.getPrice3());
		tutProfileDetails.setProfileCompleted(tutorModel.getProfileCompleted());
		tutProfileDetails.setProfilePictureUrl(tutorModel.getProfilePictureUrl());
		tutProfileDetails.setRating(tutorModel.getRating());
		tutProfileDetails.setReviewCount(tutorModel.getReviewCount());
		tutProfileDetails.setStudyInstitution(tutorModel.getStudyInstitution());
		tutProfileDetails.setSubject1(tutorModel.getSubject1());
		tutProfileDetails.setSubject2(tutorModel.getSubject2());
		tutProfileDetails.setSubject3(tutorModel.getSubject3());
		tutProfileDetails.setTid(tutorModel.getTid());
		tutProfileDetails.setWorkInstitution(tutorModel.getWorkInstitution());
		tutProfileDetails.setWorkTitle(tutorModel.getWorkTitle());
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

			if (dao.saveTutorProfile(tutorProfile)) {
				TutorLogin tutorLogin = new TutorLogin();
				tutorLogin.setPassword(tutorModel.getPassword());
				tutorLogin.setEmail(tutorModel.getEmail());
				tutorLogin.setTutorProfile(tutorProfile);
				dao.saveTutorLogin(tutorLogin);
				TutorProfileDetails tutProfileDetails = new TutorProfileDetails();
				tutProfileDetails.setTid(tutorProfile.getTid());
				tutProfileDetails.setProfileCompleted(12);
				dao.saveTutorID(tutProfileDetails);
				TutorVerification tutVerify = new TutorVerification();
				tutVerify.setTid(tutorProfile.getTid());
				dao.saveTutorVerification(tutVerify);
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
		tutorProfile.setAddressLine1(tutorModel.getAddressLine1());
		tutorProfile.setAddressLine2(tutorModel.getAddressLine2());
		tutorProfile.setCountry(tutorModel.getCountry());
		tutorProfile.setState(tutorModel.getState());
		tutorProfile.setProfilePictureUrl(tutorModel.getProfilePictureUrl());
		tutorProfile.setCity(tutorModel.getCity());
		dao.updateTutorBasicInfo(tutorProfile);
		if (tutorProfile.getCity() != null && tutorProfile.getAddressLine1() != null) {
			dao.updateProfileCompleted(37, tutorProfile.getTid());
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
		tutorProfile.setAddressLine1(tutorModel.getAddressLine1());
		tutorProfile.setAddressLine2(tutorModel.getAddressLine2());
		tutorProfile.setCountry(tutorModel.getCountry());
		tutorProfile.setState(tutorModel.getState());
		tutorProfile.setProfilePictureUrl(tutorModel.getProfilePictureUrl());
		tutorProfile.setCity(tutorModel.getCity());
		dao.updateTutorBasicInfo(tutorProfile);
	}

	// validation of tutor login
	public boolean onTutorLogin(TutorLoginModel tutorLoginModel) {
		if (dao.onTutorLogin(tutorLoginModel)) {
			return true;
		} else {
			return false;
		}
	}

	// getting tutor details after login
	public TutorProfileModel getTutorDetails(String email) {
		TutorProfileModel tutorProfileModel = new TutorProfileModel();
		TutorProfile tutorProfile = dao.getTutorDetails(email);
		tutorProfileModel.setContact(tutorProfile.getContact());
		tutorProfileModel.setDateOfBirth(tutorProfile.getDateOfBirth());
		tutorProfileModel.setEmail(tutorProfile.getEmail());
		tutorProfileModel.setFullName(tutorProfile.getFullName());
		tutorProfileModel.setPassword("");
		tutorProfileModel.setTid(tutorProfile.getTid());
		tutorProfileModel.setAddressLine1(tutorProfile.getAddressLine1());
		tutorProfileModel.setAddressLine2(tutorProfile.getAddressLine2());
		tutorProfileModel.setCountry(tutorProfile.getCountry());
		tutorProfileModel.setState(tutorProfile.getState());
		tutorProfileModel.setProfilePictureUrl(tutorProfile.getProfilePictureUrl());
		tutorProfileModel.setCity(tutorProfile.getCity());
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
	public TutorProfileDetails getTutorProfileDetails(Integer tid) {
		return dao.getTutorProfileDetails(tid);
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

	// for checking social login
	public boolean checkSocialLogin(String email) {
		if (dao.checkSocialLogin(email)) {
			return true;
		} else {
			return false;
		}
	}

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
		studentProfile.setSubject(studentModel.getSubject());
		studentProfile.setGradeLevel(studentModel.getGradeLevel());
		studentProfile.setSid(studentModel.getSid());
		studentProfile.setProfilePictureUrl(studentModel.getProfilePictureUrl());
		dao.updateStudentProfile(studentProfile);
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
	public String verifyEmail(String email) {
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
		return otp;
		
	}
	
	// fetch if the tutor is available ?
	public boolean getTutorIsAvailable(String tid) {
		if(dao.getTutorAvailabilitySchedule(Integer.valueOf(tid)).getIsAvailable().equals("yes")){
			return true;
		}else {
			return false;
		}
	}

}
