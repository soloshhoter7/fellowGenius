package fG.Service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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
import fG.Model.ScheduleDataModel;
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
	ScheduleService scheduleService;
	
	@Autowired
	MeetingDao meetingDao;
	
	// saving student registration details
	public boolean saveStudentProfile(StudentProfileModel studentModel) {
		StudentProfile studentProfile = new StudentProfile();
		studentProfile.setContact(studentModel.getContact());
		studentProfile.setDateOfBirth(studentModel.getDateOfBirth());
		studentProfile.setEmail(studentModel.getEmail());
		studentProfile.setFullName(studentModel.getFullName());	
		studentProfile.setSubject(studentModel.getSubject());
		studentProfile.setGradeLevel(studentModel.getGradeLevel());
		if(dao.saveStudentProfile(studentProfile)) {
			StudentLogin studentLogin = new StudentLogin();
			studentLogin.setPassword(studentModel.getPassword());
		    studentLogin.setEmail(studentModel.getEmail());
			studentLogin.setStudentProfile(studentProfile);
			dao.saveStudentLogin(studentLogin);
			return true;
		}
		else {
			return false;
		}
	}

	// checking on student login
	public boolean onStudentLogin(StudentLoginModel studentLoginModel) {
		if(dao.onStudentLogin(studentLoginModel)) {
			return true;
		}else {
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
		return stuProfileModel;
	}
	
	    // saving updating details of tutor
		public void updateTutorProfileDetails(TutorProfileDetailsModel tutorModel) throws IllegalArgumentException, IllegalAccessException {
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
			     if(tutorModel.getStudyInstitution()==null) {
			    	 dao.updateProfileCompleted(37,tutorModel.getTid());
			     }else {
				 dao.updateProfileCompleted(62,tutorModel.getTid());
			     }
		}
		
		//for editing tutor profile details
		public void editTutorProfileDetails(TutorProfileDetailsModel tutorModel) throws IllegalArgumentException, IllegalAccessException {
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

			if(dao.saveTutorProfile(tutorProfile)) {
				TutorLogin tutorLogin = new TutorLogin();
				tutorLogin.setPassword(tutorModel.getPassword());
				tutorLogin.setEmail(tutorModel.getEmail());
				tutorLogin.setTutorProfile(tutorProfile);
				dao.saveTutorLogin(tutorLogin);
				TutorProfileDetails tutProfileDetails = new TutorProfileDetails();
				tutProfileDetails.setTid(tutorProfile.getTid());
				tutProfileDetails.setProfileCompleted(12);
				dao.saveTutorID(tutProfileDetails);
				TutorVerification tutVerify = new  TutorVerification();
				tutVerify.setTid(tutorProfile.getTid());
				dao.saveTutorVerification(tutVerify);
				TutorAvailabilitySchedule tutSchedule = new TutorAvailabilitySchedule();
				tutSchedule.setTid(tutorProfile.getTid());
				tutSchedule.setFullName(tutorProfile.getFullName());
				dao.saveTutorAvailbilitySchedule(tutSchedule);
				return true;
			}
			else {
				return false;
			}
			
		}

		//for updating tutor basic info
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
			if(tutorProfile.getCity()!=null&&tutorProfile.getAddressLine1()!=null) {
				dao.updateProfileCompleted(37,tutorProfile.getTid());
			}
			
		}
		
		//for editing tutor Basic info
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
			if(dao.onTutorLogin(tutorLoginModel)) {
				return true;
			}
			else {
				return false;
			}
		}
		
        // getting tutor details after login
		public TutorProfileModel getTutorDetails(String email) {
			TutorProfileModel tutorProfileModel = new TutorProfileModel();
			TutorProfile tutorProfile =dao.getTutorDetails(email);
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
		
		// for getting the list of teachers
		public List<?> getTutorList() {
			return dao.getTutorList();
		}

		public boolean updateTutorVerification(TutorVerificationModel tutorVerify) {
			if(dao.updateTutorVerification(tutorVerify) == true) {
				dao.updateProfileCompleted(99,tutorVerify.getTid());
				return true;
			}
			else {
			return false;
			}
		}
        //getting tutor profile details with tid
		public TutorProfileDetails getTutorProfileDetails(Integer tid) {
			return dao.getTutorProfileDetails(tid);
		}

		public boolean registerSocialLogin(SocialLoginModel socialLoginModel) {
			SocialLogin socialLogin = new SocialLogin();
			socialLogin.setEmail(socialLoginModel.getEmail());
			socialLogin.setFullName(socialLoginModel.getFullName());
			socialLogin.setId(socialLoginModel.getId());
			if(dao.saveSocialLogin(socialLogin)) {
				return true;
			}
			else {
				return false;
			}
		}

		public boolean checkSocialLogin(String email) {
			if(dao.checkSocialLogin(email)) {
				return true;
			}
			else {
				return false;
			}
		}
		// for saving tutor Availability Schedule
		public void saveTutorAvailabilitySchedule(TutorAvailabilityScheduleModel tutorAvailabilityScheduleModel) {
			ArrayList<String> availableSchedules = new ArrayList<String>();
			for(ScheduleData schedule:tutorAvailabilityScheduleModel.getAllAvailabilitySchedule()) {
				availableSchedules.add(schedule.serialize());
			}
			TutorAvailabilitySchedule tutSchedule = new TutorAvailabilitySchedule();
			tutSchedule.setAllAvailabilitySchedule(availableSchedules);
			tutSchedule.setFullName(tutorAvailabilityScheduleModel.getFullName());
			tutSchedule.setTid(tutorAvailabilityScheduleModel.getTid());
			dao.saveTutorAvailbilitySchedule(tutSchedule);
		}
		
		// for getting tutor Availability Schedule after login
		public TutorAvailabilityScheduleModel getTutorAvailabilitySchedule(Integer tid) throws ParseException{
			TutorAvailabilityScheduleModel tutAvailModel = new TutorAvailabilityScheduleModel();
			tutAvailModel = dao.getTutorAvailabilitySchedule(tid);
			ArrayList<BookingDetails> bookings = (ArrayList<BookingDetails>) meetingDao.fetchApprovedListTutor(tid);
			ArrayList<ScheduleData> bookingSchedule = new ArrayList<ScheduleData>();
			SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
			for(int i=0; i<bookings.size(); i++) {
				BookingDetails booking = bookings.get(i);
				
				Date startDate = formatter.parse(booking.getDateOfMeeting());
				
				startDate.setHours(booking.getStartTimeHour());
				startDate.setMinutes(booking.getStartTimeMinute());
				Date endDate = formatter.parse(booking.getDateOfMeeting());
				endDate.setHours(booking.getEndTimeHour());
				endDate.setMinutes(booking.getEndTimeMinute());
				ScheduleData schedule = new ScheduleData();
				schedule.setStartTime(startDate.toString());
				schedule.setEndTime(endDate.toString());
				schedule.setId(i+1);
				schedule.setSubject(booking.getStudentName());
				System.out.println("DEKHO MAI AAGYA" + schedule);
				bookingSchedule.add(schedule);
			}
			tutAvailModel.setAllMeetingsSchedule(bookingSchedule);
			return tutAvailModel; 
		}

		public ArrayList<ScheduleTime> getTutorTimeAvailabilityTimeArray(String tid) {
			TutorAvailabilityScheduleModel tutorSchedule = dao.getTutorAvailabilitySchedule(Integer.valueOf(tid));
			return scheduleService.getTimeArray(tutorSchedule.getAllAvailabilitySchedule(),Integer.valueOf(tid));
		}


}
