package fG.Controller;

import java.io.IOException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import fG.Entity.PendingTutorProfileDetails;
import fG.Model.AdminReferralInfoModel;
import fG.Model.AppInfoModel;
import fG.Model.BookingDetailsModel;
import fG.Model.Category;
import fG.Model.FeaturedExpertsModel;
import fG.Model.ReferralActivityAnalytics;
import fG.Model.ReferralDataModel;
import fG.Model.ResponseModel;
import fG.Model.TransactionsModel;
import fG.Model.TutorProfileDetailsModel;
import fG.Model.UserActivityAnalytics;
import fG.Model.UserActivityModel;
import fG.Model.UserDataModel;
import fG.Service.AdminService;
import fG.Service.AppService;
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
	
	@Autowired
	AppService appService;
	
	// for getting tutor profile details after login
	@PreAuthorize("hasAuthority('Admin')")
	@RequestMapping(value = "/getTutorProfileDetails", produces = { "application/json" })
	public TutorProfileDetailsModel getTutorProfileDetails(String tid) {
		return adminService.getTutorProfileDetails(Integer.valueOf(tid));
	}
	//fetching all the users data for excel sheet
	@PreAuthorize("hasAuthority('Admin')")
	@GetMapping(value = "/fetchAllUsersData")
	@ResponseBody
	public List<UserDataModel> fetchAllUsersData() {
		return service.fetchAllUserData();
	}

	//fetching featured experts
	@PreAuthorize("hasAuthority('Admin')")
	@GetMapping(value = "/fetchFeaturedExperts")
	public List<FeaturedExpertsModel> fetchFeaturedExpert() {
		return service.fetchFeaturedExperts();
	}

	//saving featured experts
	@PreAuthorize("hasAuthority('Admin')")
	@PostMapping(value = "/saveFeaturedExperts")
	public boolean saveFeaturedExpert(@RequestBody FeaturedExpertsModel fe) {
		return service.saveFeaturedExpert(fe);
	}
	
	//deleting featured experts
	@PreAuthorize("hasAuthority('Admin')")
	@PostMapping(value = "/deleteFeaturedExperts")
	public void deleteFeaturedExpert(@RequestBody FeaturedExpertsModel fe) {
		service.deleteFeaturedExpert(fe);
	}

	//updating featured experts
	@PreAuthorize("hasAuthority('Admin')")
	@PostMapping(value = "/updateFeaturedExperts")
	public boolean updateFeaturedExpert(@RequestBody List<FeaturedExpertsModel> fe) {
		return service.updateFeaturedExperts(fe);
	}
	
	//updating and adding expertise area
	@PreAuthorize("hasAuthority('Admin')")
	@GetMapping(value = "/updateAndAddExpertiseArea")
	@ResponseBody
	public boolean updateAndAddExpertiseArea(String category, String subCategory) {
		System.out.println(category + " : " + subCategory);
		return service.updateAndAddExpertiseArea(category, subCategory);
	}
	
	//adding domain
	@PreAuthorize("hasAuthority('Admin')")
	@PostMapping(value = "/addCategories")
	public boolean addNewCategory(@RequestBody Category category) {
		return service.addNewCategory(category);
	}
    
	//adding topics under domain
	@PreAuthorize("hasAuthority('Admin')")
	@PostMapping(value = "/addSubCategories")
	public boolean addNewSubCategories(@RequestBody Category category) {
		System.out.println(category);
		return service.addNewSubCategories(category);
	}

	//verifying expert
	@PreAuthorize("hasAuthority('Admin')")
	@GetMapping(value = "/verifyExpert", produces = { "application/json" })
	public void verifyExpert(String id) throws IOException {
		service.verifyExpert(id);
	}
 
	//rejecting expert
	@PreAuthorize("hasAuthority('Admin')")
	@GetMapping(value = "/rejectExpert", produces = { "application/json" })
	public void rejectExpert(String id) throws IOException {
		service.rejectExpert(id);
	}
	
	//fetching user data analytics
	@PreAuthorize("hasAuthority('Admin')")
	@GetMapping(value = "/fetchUserDataAnalytics")
	public UserActivityAnalytics fetchUserData() {
		return service.fetchUserDataAnalytics();
	}
	
	//fetching Pending experts
	@PreAuthorize("hasAuthority('Admin')")
	@GetMapping(value = "/fetchPendingExperts")
	public List<PendingTutorProfileDetails> fetchPendingExperts() {
		return service.fetchPendingExperts();
	}
	
	//sending a blank mail
	@PreAuthorize("hasAuthority('Admin')")
	@GetMapping(value = "/sendBlankMail")
	public void sendBlankMail() {
		mailService.sendBlankEmail();
	}
	
	//finding pending experts by their id
	@PreAuthorize("hasAuthority('Admin')")
	@GetMapping(value = "/findPendingExpertById")
	public PendingTutorProfileDetails findPendingExpertById(String id) {
		return service.findPendingExpertById(id);
	}
	
	@PreAuthorize("hasAuthority('Admin')")
	@PostMapping(value = "/updatePendingExpert", produces = "application/JSON")
	public void updatePendingExpert(@RequestBody TutorProfileDetailsModel tutorDetailsModel) {
		service.updatePendingTutor(tutorDetailsModel);
	}
	@PreAuthorize("hasAuthority('Admin')")
	@GetMapping(value = "/fetchAllExpertsList", produces = "application/JSON")
	@ResponseBody
	public List<TutorProfileDetailsModel> fetchAllExpertsList() throws NumberFormatException, ParseException {
		List<TutorProfileDetailsModel> tutorProfileDetails = service.fetchAllTutorList();
		return tutorProfileDetails;
	}
	
	@PreAuthorize("hasAuthority('Admin')")
	@GetMapping(value = "/notifyAllExpertsWithNoSchedule")
	public void notifyAllExpertsWithNoSchedule(String[] users) throws NumberFormatException, ParseException {
		service.notifyAllExpertsWithNoSchedule(users);	
	}
	
	@PreAuthorize("hasAuthority('Admin')")
	@GetMapping(value = "/fetchAllLoginData")
	public ArrayList<UserActivityModel> fetchAllLoginData(){
		return service.fetchAllLoginData();	
	}

	@PreAuthorize("hasAuthority('Admin')")
	@GetMapping(value = "/fetchAllSignUpData")
	public ArrayList<UserActivityModel> fetchAllSignUpData() throws NumberFormatException, ParseException {
		return service.fetchAllSignUpData();	
	}
	
	@PreAuthorize("hasAuthority('Admin')")
	@GetMapping(value = "/fetchAllMeetingData")
	public ArrayList<BookingDetailsModel> fetchAllMeetingsData() throws NumberFormatException, ParseException {
		return service.fetchAllMeetingsData();	
	}
	
		
	//fetching all referralActivity info for excel sheet
	@PreAuthorize("hasAuthority('Admin')")
	@GetMapping(value="/fetchAllReferralData")
	public ArrayList<ReferralDataModel> fetchAllReferralData() {
		return adminService.fetchAllReferralData();
	}
	
	//fetching referral data Analytics
	@PreAuthorize("hasAuthority('Admin')")
	@GetMapping(value = "/fetchReferralDataAnalytics")
	public ReferralActivityAnalytics fetchReferralAnalytics()  {
		return adminService.fetchReferralDataAnalytics();	
	}
	
	//fetching all appInfo
	@PreAuthorize("hasAuthority('Admin')")
	@GetMapping(value="/fetchAllAppInfo")
	public ArrayList<AppInfoModel> fetchAllAppInfo(){
		return appService.fetchAllAppInfo();
	}
	
	//updating appInfo
	@PreAuthorize("hasAuthority('Admin')")
	@PostMapping(value="/updateAppInfo")
	public boolean updateAppInfo(@RequestBody AppInfoModel appInfoModel) {
		return appService.updateAppInfo(appInfoModel);
	}
	
	//getting adminReferralInfo
	@PreAuthorize("hasAuthority('Admin')")
	@GetMapping(value="/fetchAdminReferralInfo")
	public ArrayList<AdminReferralInfoModel> fetchAdminReferralInfo(){
		return adminService.getAdminReferralInfo();
	}
	
	//getting pending Transactions info
	@PreAuthorize("hasAuthority('Admin')")
	@GetMapping(value="/fetchPendingTransactionInfo")
	public ArrayList<TransactionsModel> fetchPendingTransactionsInfo(){
		return adminService.getPendingTransactionsInfo();
	}
	
	//add new Transaction
	@PreAuthorize("hasAuthority('Admin')")
	@PostMapping(value="/addTransaction")
	public boolean addTransaction(@RequestBody TransactionsModel transaction) {
		return adminService.addTransaction(transaction);
	}
	
	//getting previous Transactions
	@PreAuthorize("hasAuthority('Admin')")
	@GetMapping(value="/fetchPreviousTransactionsInfo")
	public ArrayList<TransactionsModel> fetchPreviousTransactions(){
		return adminService.getPreviousTransactions();
	}
	
	@PreAuthorize("hasAuthority('Admin')")
	@RequestMapping(value="/deleteUser")
	public void deleteUser(String userId) {
		service.deleteUser(userId);
	}
	
//	@PreAuthorize("hasAuthority('Admin')")
//	@RequestMapping(value="/sendExpertVerficationMail")
//	public ResponseModel sendExpertVerificationMail(String userId) {
//		return adminService.sendExpertVerificationMail(userId);
//	}

	//@PreAuthorize("hasAuthority('Admin')")
	@GetMapping(value="/fetchUnpaidExperts")
	public ResponseEntity<?> getUnpaidExperts(){
		ArrayList<TransactionsModel> list=adminService.fetchUnpaidExpertBookings();
		return ResponseEntity.ok(list);
	}

	//@PreAuthorize("hasAuthority('Admin')")
	@PostMapping(value="/payExpert")
	public ResponseEntity<String> payExperts(@RequestBody  TransactionsModel expertPaidtransaction){
		adminService.payExpertTransaction(expertPaidtransaction);
		return ResponseEntity.ok("successfully paid");
	}
}
