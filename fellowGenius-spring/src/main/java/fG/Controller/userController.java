package fG.Controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import fG.Entity.TutorProfileDetails;
import fG.Model.Category;
import fG.Model.FiltersApplied;
import fG.Model.NotificationModel;
import fG.Model.SocialLoginModel;
import fG.Model.StudentProfileModel;
import fG.Model.TutorProfileDetailsModel;
import fG.Model.TutorProfileModel;
import fG.Model.TutorVerificationModel;
import fG.Model.registrationModel;
import fG.Model.updatePasswordModel;
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
	
	//for updating student profile
	@PreAuthorize("hasAuthority('Learner')")
	@RequestMapping(value= "/updateStudentProfile")
	public boolean updateStudentProfile(@RequestBody StudentProfileModel stuModel) throws IOException {
		return service.updateStudentProfile(stuModel);		
		
	}
	
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
		service.updateTutorProfileDetails(tutorDetailsModel);

	}

	// for editing basic info of tutor
	@PreAuthorize("hasAuthority('Expert')")
	@RequestMapping(value = "/editTutorBasicInfo")
	public void editTutorBasicInfo(@RequestBody TutorProfileModel tutorProfileModel) throws IOException {
		service.editTutorBasicInfo(tutorProfileModel);

	}

//	// for editing tutor details
//	@PreAuthorize("hasAuthority('Expert')")
//	@RequestMapping(value = "/editTutorProfileDetails", produces = "application/JSON")
//	public void editTutorProfile(@RequestBody TutorProfileDetailsModel tutorDetailsModel)
//			throws IOException, IllegalArgumentException, IllegalAccessException {
//		service.editTutorProfileDetails(tutorDetailsModel);
//
//	}

	// for updating tutor Verification
	@PreAuthorize("hasAuthority('Expert')")
	@RequestMapping(value = "/updateTutorVerification", produces = "application/JSON")
	public void updateTutorVerification(@RequestBody TutorVerificationModel tutorVerify) throws IOException {
		System.out.println(tutorVerify.getTid());
		service.updateTutorVerification(tutorVerify);
	}

	// for getting the list of teachers with 100% profile completion
//	@PreAuthorize("hasAuthority('Learner')")
	@RequestMapping(value = "/fetchTutorList", produces = "application/JSON")
	@ResponseBody
	public List<TutorProfileDetailsModel> tutorList(String subject) {
		System.out.println("in controller"+subject);
		List<TutorProfileDetailsModel> tutorProfileDetails = service.getTutorList(subject);
		return tutorProfileDetails;
	}
  
	@RequestMapping(value="/fetchTutorProfileDetails",produces = "application/JSON")
	@ResponseBody
	public TutorProfileDetailsModel fetchTutorProfileDetails(String tid) {
		return service.getTutorProfileDetails(Integer.valueOf(tid));
	}
	
	@RequestMapping(value="/fetchBookingTutorProfileDetails",produces = "application/JSON")
	@ResponseBody
	public TutorProfileDetailsModel fetchBookingTutorProfileDetails(String bookingId) {
		return service.fetchBookingTutorProfileDetails(Integer.valueOf(bookingId));
	}
	// register social login
//	@PreAuthorize("hasAuthority('STUDENT') or hasAuthority('TUTOR')")
	@RequestMapping(value = "/registerSocialLogin")
	public boolean registerSocialLogin(@RequestBody SocialLoginModel socialLoginModel) {
		return service.registerSocialLogin(socialLoginModel);
	}

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
	
	@PreAuthorize("hasAuthority('Learner')")
	@RequestMapping(value="/fetchAllLinkedTutors")
	@ResponseBody
	public List<TutorProfileDetailsModel> fetchAllLinkedTutors(Integer userId) {
		System.out.println(userId);
		return service.fetchAllLinkedTutors(userId);
	
	}
	
	
	@RequestMapping(value="/filtersApplied")
	public List<TutorProfileDetailsModel> filtersApplied(@RequestBody FiltersApplied filtersApplied) {
		return  service.filtersApplied(filtersApplied.subjects,filtersApplied.price,filtersApplied.ratings);
			
	}
	
	@RequestMapping(value="/userExists")
	@ResponseBody
	public boolean checkUserExists(String email) {
		return service.checkUserExists(email);
	}
	
	@RequestMapping(value="/sendResetLink")
	@ResponseBody
	public boolean sendResetLink(String email) {
		return service.sendResetLink(email);
	}
	
	@RequestMapping(value="/updatePassword")
	@ResponseBody
	public boolean updatePassword(@RequestBody updatePasswordModel data) {
		System.out.println(data.getUserId());
		return service.updatePassword(data.getUserId(),data.getPassword());
	}
	
	@RequestMapping(value="/addCategories",  method=RequestMethod.POST)
	public boolean addNewCategory(@RequestBody Category category) {
		return service.addNewCategory(category);
	}
	
	@RequestMapping(value="/getAllCategories",method=RequestMethod.GET)
	public List<Category> getAllCategories(){
//		System.out.println("hitted!");
		return service.getAllCategories();
	}
	
	@RequestMapping(value="/addSubCategories",method = RequestMethod.POST)
	public boolean addNewSubCategories(@RequestBody Category category) {
		System.out.println(category);
		return service.addNewSubCategories(category);
	}
	
	@RequestMapping(value="/getSubCategories",method = RequestMethod.GET)
	public List<Category> getSubCategories(String category){
		System.out.println("getSubcategory : "+category);
		return service.getSubCategories(category);
	}
	
	@RequestMapping(value="/getAllSubCategories",method=RequestMethod.GET)
	public List<Category> getAllSubCategories(){
//		System.out.println("hitted!");
		return service.getAllSubCategories();
	}
	
	@RequestMapping(value="/fetchNotifications",method=RequestMethod.GET)
	public List<NotificationModel> fetchNotifications(String userId){
		return service.fetchNotifications(userId);
	}
}