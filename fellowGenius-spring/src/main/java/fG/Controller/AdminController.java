package fG.Controller;

import java.io.IOException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import fG.Entity.PendingTutorProfileDetails;
import fG.Model.BookingDetailsModel;
import fG.Model.Category;
import fG.Model.FeaturedExpertsModel;
import fG.Model.TutorProfileDetailsModel;
import fG.Model.UserActivityAnalytics;
import fG.Model.UserActivityModel;
import fG.Model.UserDataModel;
import fG.Service.AdminService;
import fG.Service.MailService;
import fG.Service.UserService;

@RestController
@RequestMapping("/fellowGenius/Admin")
public class AdminController {

	@Autowired
	UserService service;
	
	@Autowired
	AdminService adminService;
 
	@Autowired
	MailService mailService;
	
	// for getting tutor profile details after login
	@PreAuthorize("hasAuthority('Admin')")
	@RequestMapping(value = "/getTutorProfileDetails", produces = { "application/json" })
	public TutorProfileDetailsModel getTutorProfileDetails(String tid) {
		return adminService.getTutorProfileDetails(Integer.valueOf(tid));
	}
	//fetching all the users data for excel sheet
	@PreAuthorize("hasAuthority('Admin')")
	@RequestMapping(value = "/fetchAllUsersData")
	@ResponseBody
	public List<UserDataModel> fetchAllUsersData() {
		return service.fetchAllUserData();
	}

	//fetching featured experts
	@PreAuthorize("hasAuthority('Admin')")
	@RequestMapping(value = "/fetchFeaturedExperts")
	public List<FeaturedExpertsModel> fetchFeaturedExpert() {
		return service.fetchFeaturedExperts();
	}

	//saving featured experts
	@PreAuthorize("hasAuthority('Admin')")
	@RequestMapping(value = "/saveFeaturedExperts")
	public boolean saveFeaturedExpert(@RequestBody FeaturedExpertsModel fe) {
		return service.saveFeaturedExpert(fe);
	}
	
	//deleting featured experts
	@PreAuthorize("hasAuthority('Admin')")
	@RequestMapping(value = "/deleteFeaturedExperts")
	public void deleteFeaturedExpert(@RequestBody FeaturedExpertsModel fe) {
		service.deleteFeaturedExpert(fe);
	}

	//updating featured experts
	@PreAuthorize("hasAuthority('Admin')")
	@RequestMapping(value = "/updateFeaturedExperts")
	public boolean updateFeaturedExpert(@RequestBody List<FeaturedExpertsModel> fe) {
		return service.updateFeaturedExperts(fe);
	}
	
	//updating and adding expertise area
	@PreAuthorize("hasAuthority('Admin')")
	@RequestMapping(value = "/updateAndAddExpertiseArea")
	@ResponseBody
	public boolean updateAndAddExpertiseArea(String category, String subCategory) {
		System.out.println(category + " : " + subCategory);
		return service.updateAndAddExpertiseArea(category, subCategory);
	}
	
	//adding domain
	@PreAuthorize("hasAuthority('Admin')")
	@RequestMapping(value = "/addCategories", method = RequestMethod.POST)
	public boolean addNewCategory(@RequestBody Category category) {
		return service.addNewCategory(category);
	}
    
	//adding topics under domain
	@PreAuthorize("hasAuthority('Admin')")
	@RequestMapping(value = "/addSubCategories", method = RequestMethod.POST)
	public boolean addNewSubCategories(@RequestBody Category category) {
		System.out.println(category);
		return service.addNewSubCategories(category);
	}

	//verifying expert
	@PreAuthorize("hasAuthority('Admin')")
	@RequestMapping(value = "/verifyExpert", produces = { "application/json" })
	public void verifyExpert(String id) throws IOException {
		service.verifyExpert(id);
	}
 
	//rejecting expert
	@PreAuthorize("hasAuthority('Admin')")
	@RequestMapping(value = "/rejectExpert", produces = { "application/json" })
	public void rejectExpert(String id) throws IOException {
		service.rejectExpert(id);
	}
	
	//fetching user data analytics
	@PreAuthorize("hasAuthority('Admin')")
	@RequestMapping(value = "/fetchUserDataAnalytics")
	public UserActivityAnalytics fetchUserData() {
		return service.fetchUserDataAnalytics();
	}
	
	//fetching Pending experts
	@PreAuthorize("hasAuthority('Admin')")
	@RequestMapping(value = "/fetchPendingExperts")
	public List<PendingTutorProfileDetails> fetchPendingExperts() {
		return service.fetchPendingExperts();
	}
	
	//sending a blank mail
	@PreAuthorize("hasAuthority('Admin')")
	@RequestMapping(value = "/sendBlankMail")
	public void sendBlankMail() {
		mailService.sendBlankEmail();
	}
	
	//finding pending experts by their id
	@PreAuthorize("hasAuthority('Admin')")
	@RequestMapping(value = "/findPendingExpertById")
	public PendingTutorProfileDetails findPendingExpertById(String id) {
		return service.findPendingExpertById(id);
	}
	
	@PreAuthorize("hasAuthority('Admin')")
	@RequestMapping(value = "/updatePendingExpert", produces = "application/JSON")
	public void updatePendingExpert(@RequestBody TutorProfileDetailsModel tutorDetailsModel) {
		service.updatePendingTutor(tutorDetailsModel);
	}
	@PreAuthorize("hasAuthority('Admin')")
	@RequestMapping(value = "/fetchAllExpertsList", produces = "application/JSON")
	@ResponseBody
	public List<TutorProfileDetailsModel> fetchAllExpertsList() throws NumberFormatException, ParseException {
		List<TutorProfileDetailsModel> tutorProfileDetails = service.fetchAllTutorList();
		return tutorProfileDetails;
	}
	
	@PreAuthorize("hasAuthority('Admin')")
	@RequestMapping(value = "/notifyAllExpertsWithNoSchedule")
	public void notifyAllExpertsWithNoSchedule(String[] users) throws NumberFormatException, ParseException {
		service.notifyAllExpertsWithNoSchedule(users);	
	}
	
	@PreAuthorize("hasAuthority('Admin')")
	@RequestMapping(value = "/fetchAllLoginData")
	public ArrayList<UserActivityModel> fetchAllLoginData(){
		return service.fetchAllLoginData();	
	}
	@PreAuthorize("hasAuthority('Admin')")
	@RequestMapping(value = "/fetchAllSignUpData")
	public ArrayList<UserActivityModel> fetchAllSignUpData() throws NumberFormatException, ParseException {
		return service.fetchAllSignUpData();	
	}
	@PreAuthorize("hasAuthority('Admin')")
	@RequestMapping(value = "/fetchAllMeetingData")
	public ArrayList<BookingDetailsModel> fetchAllMeetingsData() throws NumberFormatException, ParseException {
		return service.fetchAllMeetingsData();	
	}
}
