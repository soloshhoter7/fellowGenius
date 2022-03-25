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

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import fG.Configuration.JwtUtil;
import fG.Entity.TutorProfileDetails;
import fG.Model.AppInfoModel;
import fG.Model.CashbackEarned;
import fG.Model.CashbackInfo;
import fG.Model.Category;
import fG.Model.ContactUsModel;
import fG.Model.FGCreditModel;
import fG.Model.FiltersApplied;
import fG.Model.NotificationModel;
import fG.Model.ResponseModel;
import fG.Model.SocialLoginModel;
import fG.Model.StudentProfileModel;
import fG.Model.TutorProfileDetailsModel;
import fG.Model.TutorProfileModel;
import fG.Model.TutorVerificationModel;
import fG.Model.UserReferralInfoModel;
import fG.Model.registrationModel;
import fG.Model.updatePasswordModel;
import fG.Service.MailService;
import fG.Service.UserService;

@RestController
@RequestMapping("/fellowGenius")
public class UserController {

	@Autowired
	UserService service;

	@Autowired
	private JwtUtil jwtUtil;

	@Autowired
	MailService mailService;

	@RequestMapping(value = "/expertChoosePassword")
	@ResponseBody
	public ResponseModel expertChoosePassword(@RequestBody String body) throws ParseException {
		JsonObject jsonObject = new JsonParser().parse(body).getAsJsonObject();
		String token = jsonObject.get("token").getAsString();
		String password = jsonObject.get("password").getAsString();
		String userId = jwtUtil.Auth0ExtractClaim(token, "userId");
		if (token != null) {
			return service.expertChoosePassword(userId, password);
		} else {
			return null;
		}
	}


	// for getting student details after login
	@RequestMapping(value = "/registerUser")
	public boolean saveUserProfile(@RequestBody registrationModel registrationModel) {
		System.out.println(registrationModel);
		return service.saveUserProfile(registrationModel);
	}

	@RequestMapping(value = "/blankApi")
	public boolean hitBlankApi() {
		return service.getReferralInformation();
	}

//	// for getting student details after login
//		@RequestMapping(value = "/sendDiwaliMail")
//		public boolean sendDiwalimail() {
//			return service.sendDiwaliMail();
//		}
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

	@RequestMapping(value = "/registerExpert", produces = "application/JSON")
	public boolean registerExpert(@RequestBody TutorProfileDetailsModel tutorDetailsModel)
			throws IOException, IllegalArgumentException, IllegalAccessException {
		return service.savePendingTutor(tutorDetailsModel);

	}

	// for getting the list of teachers with 100% profile completion
//	@PreAuthorize("hasAuthority('Learner')")
	@RequestMapping(value = "/fetchTutorList", produces = "application/JSON")
	@ResponseBody
	public List<TutorProfileDetailsModel> tutorList(String subject) {
		List<TutorProfileDetailsModel> tutorProfileDetails = service.getTutorList(subject);
		return tutorProfileDetails;
	}

	@RequestMapping(value = "/fetchBookingTutorProfileDetails", produces = "application/JSON")
	@ResponseBody
	public TutorProfileDetailsModel fetchBookingTutorProfileDetails(String bookingId) {
		return service.fetchBookingTutorProfileDetails(Integer.valueOf(bookingId));
	}

	// register social login
	@RequestMapping(value = "/registerSocialLogin")
	public boolean registerSocialLogin(@RequestBody SocialLoginModel socialLoginModel) {
		return service.registerSocialLogin(socialLoginModel);
	}

	@RequestMapping(value = "/helloKarma")
	@ResponseBody
	public String helloKarma() {
		return "Hello world ! the server is up and running and now tested";
	}

	@RequestMapping(value = "/filtersApplied")
	public List<TutorProfileDetailsModel> filtersApplied(@RequestBody FiltersApplied filtersApplied) {
		return service.filtersApplied(filtersApplied.subjects, filtersApplied.price, filtersApplied.ratings,
				filtersApplied.getDomain(), filtersApplied.getDomains());

	}

	@RequestMapping(value = "/userExists")
	@ResponseBody
	public boolean checkUserExists(String email) {
		return service.checkUserExists(email);
	}

	@RequestMapping(value = "/sendResetLink")
	@ResponseBody
	public boolean sendResetLink(String email) {
		return service.sendResetLink(email);
	}

	@RequestMapping(value = "/sendReferInviteMail", method = RequestMethod.GET)
	@ResponseBody
	public boolean sendReferInviteMail(String[] users, String referCode, String senderEmail) {
		System.out.println("Users array:- ");
		for (String user : users) {
			System.out.println(user);
		}
		System.out.println("Refer code:- " + referCode);
		System.out.println("sender name:- " + senderEmail);
		return service.sendReferInviteMail(users, referCode, senderEmail);
	}

	@RequestMapping(value = "/updatePassword")
	@ResponseBody
	public boolean updatePassword(@RequestBody updatePasswordModel data) {
		System.out.println(data.getUserId());
		return service.updatePassword(data.getUserId(), data.getPassword());
	}

	@RequestMapping(value = "/getAllCategories", method = RequestMethod.GET)
	public List<Category> getAllCategories() {
		return service.getAllCategories();
	}

	@RequestMapping(value = "/getSubCategories", method = RequestMethod.GET)
	public List<Category> getSubCategories(String category) {
		System.out.println("getSubcategory : " + category);
		return service.getSubCategories(category);
	}

	@RequestMapping(value = "/getAllSubCategories", method = RequestMethod.GET)
	public List<Category> getAllSubCategories() {
		return service.getAllSubCategories();
	}

	@PreAuthorize("hasAuthority('Learner') or hasAuthority('Expert') ")
	@RequestMapping(value = "/fetchNotifications", method = RequestMethod.GET)
	public List<NotificationModel> fetchNotifications(String userId) {
		return service.fetchNotifications(userId);
	}

	@PreAuthorize("hasAuthority('Admin') or hasAuthority('Learner') ")
	@RequestMapping(value = "/notifyExpert")
	public boolean notifyNoScheduleExpert(String tid) throws NumberFormatException, ParseException {
		service.notifyNoScheduleExpert(Integer.valueOf(tid));
		return true;
	}

	@PreAuthorize("hasAuthority('Learner')")
	@RequestMapping(value = "/fetchAllLinkedTutors")
	@ResponseBody
	public List<TutorProfileDetailsModel> fetchAllLinkedTutors(Integer userId) {
		System.out.println(userId);
		return service.fetchAllLinkedTutors(userId);

	}

	// to change tutor availability status
	@PreAuthorize("hasAuthority('Expert')")
	@RequestMapping(value = "/changeAvailabilityStatus")
	@ResponseBody
	public void changeAvailabilityStatus(String tid, String isAavailable) {
		int tutorId = Integer.parseInt(tid);
		service.changeAvailabilityStatus(tutorId, isAavailable);
	}

	@PreAuthorize("hasAuthority('Learner') or hasAuthority('Expert')")
	@RequestMapping(value = "/subtractArea")
	@ResponseBody
	public void subtractArea(String userId, String subject, String role) {
		int id = Integer.parseInt(userId);
		service.subtractArea(id, subject, role);
	}

	@PreAuthorize("hasAuthority('Learner') or hasAuthority('Expert') or hasAuthority('Admin')")
	@RequestMapping(value = "/fetchTutorProfileDetails", produces = "application/JSON")
	@ResponseBody
	public TutorProfileDetailsModel fetchTutorProfileDetails(String tid) {
		return service.getTutorProfileDetails(Integer.valueOf(tid));
	}

	// for editing basic info of tutor
	@PreAuthorize("hasAuthority('Expert')")
	@RequestMapping(value = "/editTutorBasicInfo")
	public void editTutorBasicInfo(@RequestBody TutorProfileModel tutorProfileModel) throws IOException {
		service.editTutorBasicInfo(tutorProfileModel);

	}

	// for updating tutor Verification
	@PreAuthorize("hasAuthority('Expert')")
	@RequestMapping(value = "/updateTutorVerification", produces = "application/JSON")
	public void updateTutorVerification(@RequestBody TutorVerificationModel tutorVerify) throws IOException {
		System.out.println(tutorVerify.getTid());
		service.updateTutorVerification(tutorVerify);
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

	// for updating student profile
	@PreAuthorize("hasAuthority('Learner')")
	@RequestMapping(value = "/updateStudentProfile")
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
	@PreAuthorize("hasAuthority('Expert') or hasAuthority('Admin')")
	@RequestMapping(value = "/getTutorProfileDetails", produces = { "application/json" })
	public TutorProfileDetailsModel getTutorProfileDetails(String tid) {
		return service.getTutorProfileDetails(Integer.valueOf(tid));
	}

	// fetch top tutor details
	@PreAuthorize("hasAuthority('Learner')")
	@RequestMapping(value = "/fetchTopTutorList")
	@ResponseBody
	public ArrayList<TutorProfileDetails> fetchTopTutorList(String subject) {
		ArrayList<TutorProfileDetails> topTutors = service.fetchTopTutorList(subject);
		return topTutors;
	}

	@PreAuthorize("hasAuthority('Expert') ")
	@RequestMapping(value = "/getEarningsAppInfo", method = RequestMethod.GET)
	public List<AppInfoModel> getEarningAppInfo() {
		return service.getEarningAppInfo();
	}

	@PreAuthorize("hasAuthority('Expert') or hasAuthority('Learner')")
	@RequestMapping(value = "/getRedeemedCreditPercentage", method = RequestMethod.GET)
	public AppInfoModel getRedeemedCreditAppInfo() {
		return service.getRedeemedCreditAppInfo();
	}

	// to fetch user referral info
	@PreAuthorize("hasAuthority('Expert') or hasAuthority('Learner')")
	@RequestMapping(value = "/getUserReferralInfo", method = RequestMethod.GET)
	public List<UserReferralInfoModel> getUserReferralInfo(String userId) throws ParseException {
		return service.getUserReferralInformationEvents(userId);
	}

	// to fetch fgCredits of user
	@PreAuthorize("hasAuthority('Expert') or hasAuthority('Learner')")
	@RequestMapping(value = "/getFGCreditsOfUser", method = RequestMethod.GET)
	public Integer getFGCreditsOfUser(String userId) {
		return service.getFGCreditsOfUser(userId);
	}

	// to fetch FG Credits Table of user
	@PreAuthorize("hasAuthority('Learner')")
	@RequestMapping(value = "/getFGCreditsTableOfUser", method = RequestMethod.GET)
	public List<FGCreditModel> getFGCreditsTableOfUser(String userId) {
		return service.getFGCreditsTableOfUser(userId);
	}

	// to fetch cashback info of user
	@PreAuthorize("hasAuthority('Expert') or hasAuthority('Learner')")
	@RequestMapping(value = "/getCashbackEarnedOfUser", method = RequestMethod.GET)
	public CashbackEarned getCashbackEarnedOfUser(String userId) {
		return service.getCashbackEarnedInfo(userId);
	}

	// to fetch cashback table of user
	@PreAuthorize("hasAuthority('Expert') or hasAuthority('Learner')")
	@RequestMapping(value = "/getCashbackTableOfUser", method = RequestMethod.GET)
	public List<CashbackInfo> getCashbackTableOfUser(String userId) {
		return service.getCashbackTableOfUser(userId);
	}

	// for save contact us details
	@RequestMapping(value = "/saveContactUsMessage")
	public boolean saveContactUsMessage(@RequestBody ContactUsModel contactUsModel) {
		System.out.println("Contact us model is :- " + contactUsModel);
		return mailService.sendContactUsMail(contactUsModel);
	}

}