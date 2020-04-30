package fG.Controller;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import fG.Model.StudentLoginModel;
import fG.Model.StudentProfileModel;
import fG.Model.TutorLoginModel;
import fG.Model.TutorProfileDetailsModel;
import fG.Model.TutorProfileModel;
import fG.Service.UserService;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/fellowGenius")
public class userController {			
	
	@Autowired
	UserService service;
	
	// for saving student registration details
	@RequestMapping(value = "/registerStudent")
	public boolean saveStudentProfile(@RequestBody StudentProfileModel studentModel)throws IOException {
		if(service.saveStudentProfile(studentModel)) {
			return true;
		}
		else {
			return false;
		}
	}
	
	// for checking student login
	@RequestMapping(value = "/loginStudent")
	public boolean onLoginStudent(@RequestBody StudentLoginModel studentLoginModel) {
		return service.onStudentLogin(studentLoginModel);
	}
	
    // for getting student details after login
	@RequestMapping(value = "/getStudentDetails",produces={"application/json"})
	public StudentProfileModel getStudentDetails(String email) throws IOException {
		return service.getStudentDetails(email);
	}
	
    // for getting tutor details after login	
	@RequestMapping(value="/getTutorDetails",produces= {"application/json"})
	public TutorProfileModel getTutorDetails(String email) throws IOException{
		return service.getTutorDetails(email);
	}
	
	// for saving tutor registration details
	@RequestMapping(value = "/registerTutor")
	public boolean saveTutorProfile(@RequestBody TutorProfileModel tutorModel)throws IOException {
		if(service.saveTutorProfile(tutorModel)) {
			return true;
		}
		else {
			return false;
		}
	}
	
	//for updating basic info of tutor
	@RequestMapping(value = "/updateTutorBasicInfo")
	public void updateTutorBasicInfo(@RequestBody TutorProfileModel tutorProfileModel) throws IOException{
		System.out.println("..............................................................................................................."+tutorProfileModel.getProfilePictureUrl());
		service.updateTutorBasicInfo(tutorProfileModel);

	}

	//for checking tutor login
	@RequestMapping(value = "/loginTutor",produces = "application/JSON")
	public boolean onLoginTutor(@RequestBody TutorLoginModel tutorLoginModel) {
		return service.onTutorLogin(tutorLoginModel);
	}
	
	//for updating tutor details
	@RequestMapping(value = "/updateTutor",produces = "application/JSON")
	@ResponseBody
	public boolean updateTutorProfile(TutorProfileDetailsModel tutorDetailsModel)throws IOException {
		if(service.updateTutorProfile(tutorDetailsModel)) {
			return true;
		}
		else {
			return false;
		}
	}
	
	//fetch list of all teachers
	@RequestMapping(value= "/fetchTutorList", produces = "application/JSON")
	@ResponseBody
	public List<?> tutorList() {
			List<?> tutorProfileDetails = service.getTutorList();
			return tutorProfileDetails;
		}
	}
