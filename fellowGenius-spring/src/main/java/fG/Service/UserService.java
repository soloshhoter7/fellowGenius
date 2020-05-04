package fG.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import fG.DAO.dao;
import fG.Entity.StudentLogin;
import fG.Entity.StudentProfile;
import fG.Entity.TutorLogin;
import fG.Entity.TutorProfile;
import fG.Entity.TutorProfileDetails;
import fG.Entity.TutorVerification;
import fG.Model.StudentLoginModel;
import fG.Model.StudentProfileModel;
import fG.Model.TutorLoginModel;
import fG.Model.TutorProfileDetailsModel;
import fG.Model.TutorProfileModel;
import fG.Model.TutorVerificationModel;

@Service
public class UserService {

	@Autowired
	dao dao;

	
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
		public void updateTutorProfile(TutorProfileDetailsModel tutorModel) {
			     dao.updateTutorProfile(tutorModel);
			     if(tutorModel.getStudyInstitution()==null) {
			    	 dao.updateProfileCompleted(37);
			     }else {
				 dao.updateProfileCompleted(62);
			     }
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
			dao.updateProfileCompleted(37);
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
				dao.updateProfileCompleted(99);
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

}
