package fG.DAO;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import fG.Entity.StudentLogin;
import fG.Entity.StudentProfile;
import fG.Entity.TutorLogin;
import fG.Entity.TutorProfile;
import fG.Entity.TutorProfileDetails;
import fG.Model.StudentLoginModel;
import fG.Model.TutorLoginModel;
import fG.Model.TutorProfileDetailsModel;
import fG.Repository.repositoryStudentLogin;
import fG.Repository.repositoryStudentProfile;
import fG.Repository.repositoryTutorLogin;
import fG.Repository.repositoryTutorProfile;
import fG.Repository.repositoryTutorProfileDetails;

@Component
public class dao {

	@Autowired
	repositoryStudentProfile repStudentProfile;

	@Autowired
	repositoryStudentLogin repStudentLogin;
	@Autowired
	repositoryTutorProfileDetails repTutorProfileDetails;

	@Autowired
	repositoryTutorProfile repTutorProfile;

	@Autowired
	repositoryTutorLogin repTutorLogin;

	// for saving student profile details
	public boolean saveStudentProfile(StudentProfile studentProfile) {
		if (repStudentProfile.emailExist(studentProfile.getEmail()) == null) {
			repStudentProfile.save(studentProfile);
			return true;
		} else {
			return false;
		}
	}

	// for saving student login details
	public boolean saveStudentLogin(StudentLogin studentLogin) {

		if (repStudentLogin.save(studentLogin) != null) {
			return true;
		} else {
			return false;
		}
	}

	// for validating student login
	public boolean onStudentLogin(StudentLoginModel studentLogin) {
		if (repStudentLogin.validation(studentLogin.getEmail(), studentLogin.getPassword()) != null) {
			return true;
		} else {
			return false;
		}
	}

	// for getting student details after login
	public StudentProfile getStudentDetails(String email) {
		return repStudentProfile.emailExist(email);
	}

	// for saving tutor registration details
	public boolean saveTutorProfile(TutorProfile tutorProfile) {
		if (repTutorProfile.emailExist(tutorProfile.getEmail()) == null) {
			repTutorProfile.save(tutorProfile);
			return true;
		} else {
			return false;
		}
	}

	// for saving tutor login credentials
	public void saveTutorLogin(TutorLogin tutorLogin) {
		repTutorLogin.save(tutorLogin);
	}

	// for validating tutor
	public boolean onTutorLogin(TutorLoginModel tutorLoginModel) {
		if (repTutorLogin.validation(tutorLoginModel.getEmail(), tutorLoginModel.getPassword()) != null) {
			return true;
		} else {
			return false;
		}
	}

	// for updating tutor profile details
	public boolean updateTutorProfile(TutorProfileDetailsModel tutorModel) {
		if (repTutorProfileDetails.saveUpdate(tutorModel.getName(), tutorModel.getAvailability(),
				tutorModel.getSubject(), tutorModel.getGender(), tutorModel.getPrice(), tutorModel.getCollege(),
				tutorModel.getDescription(), tutorModel.getRating(), tutorModel.getReviewCount(),
				tutorModel.getLessonCompleted(), tutorModel.getProfilePictureUrl(), tutorModel.getTid())) {
			return true;
		} else {
			return false;
		}
	}

	// for getting tutors list for finding tutors
	public List<?> getTutorList() {
		return repTutorProfileDetails.findAll();
	}

	//for getting tutor details using email
	public TutorProfile getTutorDetails(String email) {
		return repTutorProfile.emailExist(email);
	}
    
	//for saving tutor profile details
	public void saveTutorID(TutorProfileDetails tutDetails) {
		repTutorProfileDetails.save(tutDetails);

	}
}