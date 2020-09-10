package fG.Controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import fG.Entity.TutorProfileDetails;
import fG.Model.SocialLoginModel;
import fG.Model.StudentLoginModel;
import fG.Model.StudentProfileModel;
import fG.Model.TutorProfileDetailsModel;
import fG.Model.TutorProfileModel;
import fG.Model.TutorVerificationModel;
import fG.Model.registrationModel;
import fG.Service.UserService;

@RestController
//@CrossOrigin(origins = "https://fellowgenius.com")
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/fellowGenius")
public class userController {

	@Autowired
	UserService service;
     
	@RequestMapping(value = "/registerUser")
	public boolean saveUserProfile(@RequestBody registrationModel registrationModel) {
		System.out.println(registrationModel);
		return service.saveUserProfile(registrationModel);
	}
	
//	// for saving student registration details
////	@PreAuthorize("hasAuthority('STUDENT')")
//	@RequestMapping(value = "/registerStudent")
//	public boolean saveStudentProfile(@RequestBody StudentProfileModel studentModel) throws IOException {
//		if (service.saveStudentProfile(studentModel)) {
//			return true;
//		} else {
//			return false;
//		}
//	}

	//for updating student profile
	@PreAuthorize("hasAuthority('Learner')")
	@RequestMapping(value= "/updateStudentProfile")
	public boolean updateStudentProfile(@RequestBody StudentProfileModel stuModel) throws IOException {
		return service.updateStudentProfile(stuModel);		
		
	}
	
//	// for checking student login
//	@PreAuthorize("hasAuthority('Learner')")
//	@RequestMapping(value = "/loginStudent")
//	public boolean onLoginStudent(@RequestBody StudentLoginModel studentLoginModel) {
//		return service.onStudentLogin(studentLoginModel);
//	}

	// for getting student details after login
	@PreAuthorize("hasAuthority('Learner')")
	@RequestMapping(value = "/getStudentDetails", produces = { "application/json" })
	public StudentProfileModel getStudentDetails(String userId) throws IOException {
		return service.getStudentDetails(userId);
	}

	// for getting tutor details after login
	@PreAuthorize("hasAuthority('Expert')")
	@RequestMapping(value = "/getTutorDetails", produces = { "application/json" })
	public TutorProfileModel getTutorDetails(String userId) throws IOException {
		return service.getTutorDetails(userId);
	}

	// for getting tutor profile details after login
	@PreAuthorize("hasAuthority('Expert')")
	@RequestMapping(value = "/getTutorProfileDetails", produces = { "application/json" })
	public TutorProfileDetailsModel getTutorProfileDetails(String tid) {
		return service.getTutorProfileDetails(Integer.valueOf(tid));
	}

	//fetch top tutor details
	@PreAuthorize("hasAuthority('Learner')")
	@RequestMapping(value="/fetchTopTutorList")
	@ResponseBody
	public ArrayList<TutorProfileDetails> fetchTopTutorList(String subject) {
		ArrayList<TutorProfileDetails> topTutors = service.fetchTopTutorList(subject);
		return topTutors;
	}
	
	// for saving tutor registration details
//	@PreAuthorize("hasAuthority('TUTOR')")
	@RequestMapping(value = "/registerTutor")
	public boolean saveTutorProfile(@RequestBody TutorProfileModel tutorModel) throws IOException {
		if (service.saveTutorProfile(tutorModel)) {
			return true;
		} else {
			return false;
		}
	}

	// for updating basic info of tutor
	@PreAuthorize("hasAuthority('Expert')")
	@RequestMapping(value = "/updateTutorBasicInfo")
	public void updateTutorBasicInfo(@RequestBody TutorProfileModel tutorProfileModel) throws IOException {
		service.updateTutorBasicInfo(tutorProfileModel);

	}

	// for updating tutor details
	@PreAuthorize("hasAuthority('Expert')")
	@RequestMapping(value = "/updateTutor", produces = "application/JSON")
	public void updateTutorProfile(@RequestBody TutorProfileDetailsModel tutorDetailsModel)
			throws IOException, IllegalArgumentException, IllegalAccessException {
		System.out.println("tutor details model ->"+tutorDetailsModel);
		service.updateTutorProfileDetails(tutorDetailsModel);

	}

	// for editing basic info of tutor
	@PreAuthorize("hasAuthority('Expert')")
	@RequestMapping(value = "/editTutorBasicInfo")
	public void editTutorBasicInfo(@RequestBody TutorProfileModel tutorProfileModel) throws IOException {
		service.editTutorBasicInfo(tutorProfileModel);

	}

	// for editing tutor details
	@PreAuthorize("hasAuthority('Expert')")
	@RequestMapping(value = "/editTutorProfileDetails", produces = "application/JSON")
	public void editTutorProfile(@RequestBody TutorProfileDetailsModel tutorDetailsModel)
			throws IOException, IllegalArgumentException, IllegalAccessException {
		service.editTutorProfileDetails(tutorDetailsModel);

	}

	// for updating tutor Verification
	@PreAuthorize("hasAuthority('Expert')")
	@RequestMapping(value = "/updateTutorVerification", produces = "application/JSON")
	public void updateTutorVerification(@RequestBody TutorVerificationModel tutorVerify) throws IOException {
		System.out.println(tutorVerify.getTid());
		service.updateTutorVerification(tutorVerify);
	}

//	// for checking tutor login
//	@PreAuthorize("hasAuthority('TUTOR')")
//	@RequestMapping(value = "/loginTutor", produces = "application/JSON")
//	public boolean onLoginTutor(@RequestBody TutorLoginModel tutorLoginModel) {
//		return service.onTutorLogin(tutorLoginModel);
//	}

	// for getting the list of teachers with 100% profile completion
	@PreAuthorize("hasAuthority('Learner')")
	@RequestMapping(value = "/fetchTutorList", produces = "application/JSON")
	@ResponseBody
	public List<TutorProfileDetails> tutorList() {
		List<TutorProfileDetails> tutorProfileDetails = service.getTutorList();
		return tutorProfileDetails;
	}

	// register social login
//	@PreAuthorize("hasAuthority('STUDENT') or hasAuthority('TUTOR')")
	@RequestMapping(value = "/registerSocialLogin")
	public boolean registerSocialLogin(@RequestBody SocialLoginModel socialLoginModel) {
		return service.registerSocialLogin(socialLoginModel);
	}

//	// check social login
//	@PreAuthorize("hasAuthority('STUDENT') or hasAuthority('TUTOR')")
//	@RequestMapping(value = "/ckeckSocialLogin")
//	@ResponseBody
//	public boolean checkSocialLogin(String id) {
//		System.out.println("In check social login" + id);
//		return service.checkSocialLogin(email);
//	}
//	
	// to change tutor availability status
	@PreAuthorize("hasAuthority('Expert')")
	@RequestMapping(value="/changeAvailabilityStatus")
	@ResponseBody
	public void changeAvailabilityStatus(String tid, String isAavailable) {
		int tutorId = Integer.parseInt(tid);
		service.changeAvailabilityStatus(tutorId, isAavailable);
	}
	@PreAuthorize("hasAuthority('Learner') or hasAuthority('Expert')")
	@RequestMapping(value="/subtractArea")
	@ResponseBody
	public void subtractAres(String userId,String subject,String role) {
		int id = Integer.parseInt(userId);
		service.subtractArea(id,subject,role);
	}
	@RequestMapping(value="/helloKarma")
	@ResponseBody
	public String helloKarma() {
		return "Hello world ! the server is up and running";
	}
	
}