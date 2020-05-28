package fG.DAO;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.google.gson.Gson;

import fG.Entity.ScheduleData;
import fG.Entity.SocialLogin;
import fG.Entity.StudentLogin;
import fG.Entity.StudentProfile;
import fG.Entity.TutorAvailabilitySchedule;
import fG.Entity.TutorLogin;
import fG.Entity.TutorProfile;
import fG.Entity.TutorProfileDetails;
import fG.Entity.TutorVerification;
import fG.Model.StudentLoginModel;
import fG.Model.TutorAvailabilityScheduleModel;
import fG.Model.TutorLoginModel;
import fG.Model.TutorVerificationModel;
import fG.Repository.repositorySocialLogin;
import fG.Repository.repositoryStudentLogin;
import fG.Repository.repositoryStudentProfile;
import fG.Repository.repositoryTutorAvailabilitySchedule;
import fG.Repository.repositoryTutorLogin;
import fG.Repository.repositoryTutorProfile;
import fG.Repository.repositoryTutorProfileDetails;
import fG.Repository.repositoryTutorVerification;

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
	
	@Autowired
	repositoryTutorVerification repTutorVerification;
	
	@Autowired
	repositorySocialLogin repSocialLogin;

	@Autowired
	repositoryTutorAvailabilitySchedule repTutorSchedule;
	
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

	// for updating basic info of tutor
	public void updateTutorBasicInfo(TutorProfile tutorProfile) {
//		repTutorProfile.updateBasicInfo(tutorProfile.getFullName(), tutorProfile.getEmail(), tutorProfile.getContact(),
//				tutorProfile.getDateOfBirth(), tutorProfile.getAddressLine1(), tutorProfile.getAddressLine2(),
//				tutorProfile.getCountry(), tutorProfile.getState(), tutorProfile.getProfilePictureUrl(),tutorProfile.getCity(), tutorProfile.getTid()); 
	     repTutorProfile.save(tutorProfile);
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
	public void updateTutorProfile(TutorProfileDetails tutor) {
		repTutorProfileDetails.save(tutor);
//		repTutorProfileDetails.saveUpdate(
//				tutorModel.getFullName(),
//				tutorModel.getSubject1(),
//				tutorModel.getSubject2(),tutorModel.getSubject3(),
//				tutorModel.getPrice1(),tutorModel.getPrice2(),tutorModel.getPrice3(),
//				tutorModel.getStudyInstitution(),tutorModel.getMajorSubject(),	tutorModel.getGraduationYear(),
//				tutorModel.getWorkTitle(),tutorModel.getWorkInstitution(),tutorModel.getDescription(),tutorModel.getRating(),
//				tutorModel.getReviewCount(),tutorModel.getLessonCompleted(),tutorModel.getProfilePictureUrl(),tutorModel.getProfileCompleted(),tutorModel.getGradeLevel(),
//				tutorModel.getTid());
	}

	// for getting tutors list for finding tutors
	public List<?> getTutorList() {
		return repTutorProfileDetails.findAll();
	}

	// for getting tutor details using email
	public TutorProfile getTutorDetails(String email) {
		return repTutorProfile.emailExist(email);
	}

	// for saving tutor profile details
	public void saveTutorID(TutorProfileDetails tutDetails) {
		repTutorProfileDetails.save(tutDetails);

	}
	//for saving tutor Verification Details
	public void saveTutorVerification(TutorVerification tutorVerification) {
		repTutorVerification.save(tutorVerification);
	}

	public boolean updateTutorVerification(TutorVerificationModel tutorVerify) {
        repTutorVerification.updateTutorVerification(tutorVerify.getCountry(), tutorVerify.getState(), tutorVerify.getIdType(), tutorVerify.getIdNumber(),
        		tutorVerify.getIdDocUrl(), tutorVerify.getEducationType(), tutorVerify.getEducationInstitution(), tutorVerify.getFieldOfStudy(), tutorVerify.getEducationDocUrl(),tutorVerify.getTid());
        return true;
	}

	public TutorProfileDetails getTutorProfileDetails(Integer tid) {
		return repTutorProfileDetails.idExist(tid);
	}
	
	public void updateProfileCompleted(Integer profileCompleted,Integer tid) {
	    repTutorProfileDetails.updateProfileCompleted(profileCompleted,tid);
	}

	public boolean saveSocialLogin(SocialLogin socialLogin) {
		
		if(repTutorProfile.emailExist(socialLogin.getEmail()) != null) {
			return false;
		}
		else {
			TutorProfile tutProf = new TutorProfile();
			tutProf.setEmail(socialLogin.getEmail());
			tutProf.setFullName(socialLogin.getFullName());
			repTutorProfile.save(tutProf);
			TutorProfile tProfile = repTutorProfile.emailExist(socialLogin.getEmail());
			Integer tid = tProfile.getTid();
			socialLogin.setTid(tid);
			
			repSocialLogin.save(socialLogin) ;

			TutorProfileDetails tutProfileDetails = new TutorProfileDetails();
			tutProfileDetails.setTid(tid);
			tutProfileDetails.setFullName(socialLogin.getFullName());
			tutProfileDetails.setProfileCompleted(12);
			repTutorProfileDetails.save(tutProfileDetails);
			
			
			TutorVerification tutVerification = new TutorVerification();
			tutVerification.setTid(tid);
			repTutorVerification.save(tutVerification);
			
			TutorAvailabilitySchedule tutSchedule = new TutorAvailabilitySchedule();
			tutSchedule.setTid(tid);
			tutSchedule.setFullName(socialLogin.getFullName());
			repTutorSchedule.save(tutSchedule);
			return true;
		}
		
	}

	public boolean checkSocialLogin(String email) {
		System.out.println(repSocialLogin.checkSocialLogin((email)));
		if(repSocialLogin.checkSocialLogin(email)!=null) {
			return true;
		}
		else {
			return false;
		}
		
	}

	public void updateTutorProfileNew(Object query, Integer tid) {
		repTutorProfileDetails.saveUpdateNew(query,tid);
	}

    // for saving and updating tutor availability schedule 
	public void saveTutorAvailbilitySchedule(TutorAvailabilitySchedule tutSchedule) {
		System.out.println(tutSchedule);
		repTutorSchedule.save(tutSchedule);
	}
    //for receiving tutor availability schedule 
	public TutorAvailabilityScheduleModel getTutorAvailabilitySchedule(Integer tid) {
		TutorAvailabilityScheduleModel tutScheduleModel = new TutorAvailabilityScheduleModel();
		ArrayList<ScheduleData> availableSchedules = new ArrayList<ScheduleData>();
		TutorAvailabilitySchedule Schedule = repTutorSchedule.idExist(tid);
		System.out.println(Schedule);
		if(Schedule.getAllAvailabilitySchedule()!=null) {
		for(String schd:Schedule.getAllAvailabilitySchedule()) {
			availableSchedules.add(new Gson().fromJson(schd,ScheduleData.class));
		}
		}
		tutScheduleModel.setAllAvailabilitySchedule(availableSchedules);
		tutScheduleModel.setFullName(Schedule.getFullName());
		tutScheduleModel.setTid(Schedule.getTid());
		System.out.println(tutScheduleModel);
		return tutScheduleModel;
	}
}