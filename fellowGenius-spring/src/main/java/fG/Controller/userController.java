package fG.Controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import fG.Entity.TutorProfileDetails;
import fG.Model.SocialLoginModel;
import fG.Model.StudentLoginModel;
import fG.Model.StudentProfileModel;
import fG.Model.TutorLoginModel;
import fG.Model.TutorProfileDetailsModel;
import fG.Model.TutorProfileModel;
import fG.Model.TutorVerificationModel;
import fG.Service.UserService;

@RestController
//@CrossOrigin(origins = "https://fellowgenius.com")
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/fellowGenius")
public class userController {

	@Autowired
	UserService service;

	// for saving student registration details
	@RequestMapping(value = "/registerStudent")
	public boolean saveStudentProfile(@RequestBody StudentProfileModel studentModel) throws IOException {
		if (service.saveStudentProfile(studentModel)) {
			return true;
		} else {
			return false;
		}
	}

	//for updating student profile
	@RequestMapping(value= "/updateStudentProfile")
	public boolean updateStudentProfile(@RequestBody StudentProfileModel stuModel) throws IOException {
		service.updateStudentProfile(stuModel);
		return true;
	}
	// for checking student login
	@RequestMapping(value = "/loginStudent")
	public boolean onLoginStudent(@RequestBody StudentLoginModel studentLoginModel) {
		return service.onStudentLogin(studentLoginModel);
	}

	// for getting student details after login
	@RequestMapping(value = "/getStudentDetails", produces = { "application/json" })
	public StudentProfileModel getStudentDetails(String email) throws IOException {
		return service.getStudentDetails(email);
	}

	// for getting tutor details after login
	@RequestMapping(value = "/getTutorDetails", produces = { "application/json" })
	public TutorProfileModel getTutorDetails(String email) throws IOException {
		return service.getTutorDetails(email);
	}

	// for getting tutor profile details after login
	@RequestMapping(value = "/getTutorProfileDetails", produces = { "application/json" })
	public TutorProfileDetails getTutorProfileDetails(String tid) {
		return service.getTutorProfileDetails(Integer.valueOf(tid));
	}

	//fetch top tutor details
	@RequestMapping(value="/fetchTopTutorList")
	@ResponseBody
	public ArrayList<TutorProfileDetails> fetchTopTutorList(String subject) {
		ArrayList<TutorProfileDetails> topTutors = service.fetchTopTutorList(subject);
		return topTutors;
	}
	
	// for saving tutor registration details
	@RequestMapping(value = "/registerTutor")
	public boolean saveTutorProfile(@RequestBody TutorProfileModel tutorModel) throws IOException {
		if (service.saveTutorProfile(tutorModel)) {
			return true;
		} else {
			return false;
		}
	}

	// for updating basic info of tutor
	@RequestMapping(value = "/updateTutorBasicInfo")
	public void updateTutorBasicInfo(@RequestBody TutorProfileModel tutorProfileModel) throws IOException {
		service.updateTutorBasicInfo(tutorProfileModel);

	}

	// for updating tutor details
	@RequestMapping(value = "/updateTutor", produces = "application/JSON")
	public void updateTutorProfile(@RequestBody TutorProfileDetailsModel tutorDetailsModel)
			throws IOException, IllegalArgumentException, IllegalAccessException {
		service.updateTutorProfileDetails(tutorDetailsModel);

	}

	// for editing basic info of tutor
	@RequestMapping(value = "/editTutorBasicInfo")
	public void editTutorBasicInfo(@RequestBody TutorProfileModel tutorProfileModel) throws IOException {
		service.editTutorBasicInfo(tutorProfileModel);

	}

	// for editing tutor details
	@RequestMapping(value = "/editTutorProfileDetails", produces = "application/JSON")
	public void editTutorProfile(@RequestBody TutorProfileDetailsModel tutorDetailsModel)
			throws IOException, IllegalArgumentException, IllegalAccessException {
		service.editTutorProfileDetails(tutorDetailsModel);

	}

	// for updating tutor Verification
	@RequestMapping(value = "/updateTutorVerification", produces = "application/JSON")
	public void updateTutorVerification(@RequestBody TutorVerificationModel tutorVerify) throws IOException {
		System.out.println(tutorVerify.getTid());
		service.updateTutorVerification(tutorVerify);
	}

	// for checking tutor login
	@RequestMapping(value = "/loginTutor", produces = "application/JSON")
	public boolean onLoginTutor(@RequestBody TutorLoginModel tutorLoginModel) {
		return service.onTutorLogin(tutorLoginModel);
	}

	// for getting the list of teachers with 100% profile completion
	@RequestMapping(value = "/fetchTutorList", produces = "application/JSON")
	@ResponseBody
	public List<TutorProfileDetails> tutorList() {
		List<TutorProfileDetails> tutorProfileDetails = service.getTutorList();
		return tutorProfileDetails;
	}

	// register social login
	@RequestMapping(value = "/registerSocialLogin")
	public boolean registerSocialLogin(@RequestBody SocialLoginModel socialLoginModel) {
		return service.registerSocialLogin(socialLoginModel);
	}

	// check social login
	@RequestMapping(value = "/ckeckSocialLogin")
	@ResponseBody
	public boolean checkSocialLogin(String email) {
		System.out.println("In check social login" + email);
		return service.checkSocialLogin(email);
	}
	
	// to change tutor availability status
	@RequestMapping(value="/changeAvailabilityStatus")
	@ResponseBody
	public void changeAvailabilityStatus(String tid, String isAavailable) {
		int tutorId = Integer.parseInt(tid);
		service.changeAvailabilityStatus(tutorId, isAavailable);
	}
	
	@RequestMapping(value="/helloKarma")
	@ResponseBody
	public String helloKarma() {
		return "Hello world ! the server is up and running";
	}
	
}