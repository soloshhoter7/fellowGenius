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
import fG.Model.StudentLoginModel;
import fG.Model.StudentProfileModel;
import fG.Model.TutorLoginModel;
import fG.Model.TutorProfileDetailsModel;
import fG.Model.TutorProfileModel;

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
		public boolean updateTutorProfile(TutorProfileDetailsModel tutorModel) {
			
			if(dao.updateTutorProfile(tutorModel) == true) {
				return true;
			}
			else {
			return false;
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
				tutProfileDetails.setName(tutorProfile.getFullName());
				dao.saveTutorID(tutProfileDetails);
				return true;
			}
			else {
				return false;
			}
			
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
			return tutorProfileModel;
		}
		
		// for getting the list of teachers
		public List<?> getTutorList() {
			return dao.getTutorList();
		}
}
