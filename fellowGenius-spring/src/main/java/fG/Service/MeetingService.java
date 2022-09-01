package fG.Service;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.lowagie.text.DocumentException;
import fG.DAO.Dao;
import fG.DAO.MeetingDao;
import fG.Entity.*;
import fG.Enum.MeetingStatus;
import fG.Enum.TaskDefinitonType;
import fG.Enum.WhatsappMessageType;
import fG.Model.*;
import fG.Repository.*;
import fG.Utils.MiscellaneousUtils;
import fG.Utils.NumberToWords;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

import static java.lang.Integer.parseInt;

@Service
public class MeetingService {


	@Autowired
	AdminService adminService;

	@Autowired
	NumberToWords numberToWords;

	@Autowired
	MeetingDao meetingDao;

	@Autowired
	Dao userDao;

	@Autowired
	repositoryTutorProfileDetails repTutorProfileDetails;

	@Autowired
	ScheduleService scheduleService;

	@Autowired
	UserService userService;
	
	@Autowired
	PdfService pdfService;

	@Autowired
	CouponService couponService;

	@Autowired
	repositoryCoupon repCoupon;

	@Autowired
	repositoryBooking repBooking;
	
	@Autowired
	repositoryFGCredits repFGCredits;

	@Autowired 
	repositoryCashback repCashback;
	
	@Autowired
	repositoryNotification repNotification;

	@Autowired
	MailService mailService;

	@Autowired
	repositoryStudentProfile repStudentProfile;

	@Autowired
	repositoryUsers repUsers;

	@Autowired
	repositoryAppInfo repAppInfo;

	@Autowired
	repositoryUserReferrals repUserReferral;

	@Autowired
	MiscellaneousUtils miscUtils;

	@Autowired
	SchedulerService taskSchedulerService;

	@Autowired
	NotificationService notificationService;
	
	public void saveNotification(JsonObject msg) {
		Notification notification = new Notification(msg.get("entityType").getAsInt(),
				msg.get("entityTypeId").getAsInt(), msg.get("actorId").getAsString(),
				msg.get("notifierId").getAsString(), msg.get("pictureUrl").getAsString(), false);
		repNotification.save(notification);

	}

	public BookingDetailsModel fetchBookingDetailsWithId(String meetingId) {
		BookingDetails booking = repBooking.meetingIdExists(meetingId);
		if (booking != null) {
			BookingDetailsModel bkModel = new BookingDetailsModel();
			bkModel.setBid(booking.getBid());
			bkModel.setDateOfMeeting(booking.getDateOfMeeting());
			bkModel.setDescription(booking.getDescription());
			bkModel.setDuration(booking.getDuration());
			bkModel.setEndTimeHour(booking.getEndTimeHour());
			bkModel.setEndTimeMinute(booking.getEndTimeMinute());
			bkModel.setMeetingId(booking.getMeetingId());
			bkModel.setStartTimeHour(booking.getStartTimeHour());
			bkModel.setStartTimeMinute(booking.getStartTimeMinute());
			bkModel.setStudentId(booking.getStudentId());
			bkModel.setTutorId(booking.getTutorId());
			bkModel.setStudentName(booking.getStudentName());
			bkModel.setTutorName(booking.getTutorName());
			bkModel.setApprovalStatus(booking.getApprovalStatus().name());
			bkModel.setSubject(booking.getSubject());
			bkModel.setDomain(booking.getDomain());
			bkModel.setAmount(booking.getAmount());
			bkModel.setTutorProfilePictureUrl(booking.getTutorProfilePictureUrl());
			return bkModel;
		} else {
			return null;
		}

	}

	// to save the bookings requested by student
	public boolean saveBooking(BookingDetailsModel bookingModel) throws ParseException {
		BookingDetails meetingBooked;
		BookingDetails booking = new BookingDetails();
		booking.setDateOfMeeting(bookingModel.getDateOfMeeting());
		booking.setDescription(bookingModel.getDescription());
		booking.setDuration(bookingModel.getDuration());
		booking.setEndTimeHour(bookingModel.getEndTimeHour());
		booking.setEndTimeMinute(bookingModel.getEndTimeMinute());
		booking.setMeetingId(bookingModel.getMeetingId());
		booking.setStartTimeHour(bookingModel.getStartTimeHour());
		booking.setStartTimeMinute(bookingModel.getStartTimeMinute());
		booking.setStudentId(bookingModel.getStudentId());
		booking.setTutorId(bookingModel.getTutorId());
		booking.setStudentName(bookingModel.getStudentName());
		booking.setTutorName(bookingModel.getTutorName());
		booking.setApprovalStatus(MeetingStatus.valueOf(bookingModel.getApprovalStatus()));
		booking.setSubject(bookingModel.getSubject());
		booking.setDomain(bookingModel.getDomain());
		booking.setAmount(bookingModel.getAmount());
		booking.setPaidAmount(bookingModel.getPaidAmount());
		booking.setCouponCode(bookingModel.getCouponCode());
		booking.setRating(0);
		booking.setTutorProfilePictureUrl(bookingModel.getTutorProfilePictureUrl());
		booking.setRazorpay_order_id(bookingModel.getRazorpay_order_id());
		booking.setRazorpay_payment_id(bookingModel.getRazorpay_payment_id());
		booking.setRazorpay_signature(bookingModel.getRazorpay_signature());
		StudentProfile sp = repStudentProfile.idExist(booking.getStudentId());
		if (sp.getLessonCompleted() == 0) {
			AppInfo thresholdCost = repAppInfo.keyExist("ReferralMeetingCost");
			AppInfo thresholdTime = repAppInfo.keyExist("ReferralExpirationTime");
			Integer diffInTime = findDaysFromRegistration(booking.getStudentId(), new Date());
			if (booking.getPaidAmount() >= Integer.parseInt(thresholdCost.getValue())
					&& diffInTime <= Integer.parseInt(thresholdTime.getValue())) {
				booking.setExpertCode(getReferralCodeFromUser(booking.getStudentId()));
			}
		}
		meetingBooked = meetingDao.saveBooking(booking);

		//check for coupon code.
		if(meetingBooked!=null){
			createMeetingSchedulerJobs(booking);
			notificationService.sendMeetingWhatsappNotifications(booking.getMeetingId(),WhatsappMessageType.ADMIN_MEETING_BOOKED);
			//check for coupon code.
			Coupon coupon=repCoupon.couponCodeExists(meetingBooked.getCouponCode());
			if(coupon!=null){
				couponService.incrementConsumerCount(coupon.getCouponId().toString());
			}
//		sendMeetingNotificationWebSocket((bookingModel.getTutorId()).toString(),message);

			StudentProfile learner = repStudentProfile.idExist(booking.getStudentId());
			if(learner.getLessonCompleted()==0&&meetingBooked.getExpertCode()!=null) {
				
				//update credit field of b in user table
				Users user=repUsers.idExists(learner.getSid());
				AppInfo referralCredit=repAppInfo.keyExist("ReferralCredit");
				user.setCredits(user.getCredits()+Integer.parseInt(referralCredit.getValue()));
				repUsers.save(user);
				
				//update this transaction in fg credit table
				FGCredits credits=new FGCredits();
				credits.setUser(repUsers.idExists(learner.getSid()));
				credits.setBookingDetails(meetingBooked);
				credits.setType("DEPOSIT");
				credits.setAmount(Integer.parseInt(referralCredit.getValue()));
				credits.setContext("Added "+referralCredit.getValue()+" FG for signing up via refer code");
				repFGCredits.save(credits);
			}
			
			// if user has paid some amount by FG Credit
			if(bookingModel.getAmount()-bookingModel.getPaidAmount()>0 && bookingModel.getCouponCode()==null) {
				Integer creditsUsed=bookingModel.getAmount()-bookingModel.getPaidAmount();
				Users user=repUsers.idExists(learner.getSid());
				user.setCredits(user.getCredits()-creditsUsed);
				repUsers.save(user);
				//update this transaction in fg credit table
				FGCredits credits=new FGCredits();
				credits.setUser(repUsers.idExists(learner.getSid()));
				credits.setBookingDetails(meetingBooked);
				credits.setType("WITHDRAW");
				credits.setAmount(creditsUsed);
				credits.setContext("Withdrawn "+creditsUsed+" FG for setting up meeting via refer code");
				repFGCredits.save(credits);
			}
			repStudentProfile.save(learner);
			sendNotificationTutor(bookingModel.getTutorId(), booking);
			updateMeetingsSetUpInReferrals(booking.getMeetingId());
			
		}
		
		return meetingBooked != null;
	}
	public BookingDetailsModel copyBookingDetailsToBookingDetailsModel(BookingDetails booking) {
		SimpleDateFormat sdf = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");
		BookingDetailsModel bkModel = new BookingDetailsModel();
		bkModel.setBid(booking.getBid());
		bkModel.setDateOfMeeting(booking.getDateOfMeeting());
		bkModel.setDescription(booking.getDescription());
		bkModel.setDuration(booking.getDuration());
		bkModel.setEndTimeHour(booking.getEndTimeHour());
		bkModel.setEndTimeMinute(booking.getEndTimeMinute());
		bkModel.setMeetingId(booking.getMeetingId());
		bkModel.setStartTimeHour(booking.getStartTimeHour());
		bkModel.setStartTimeMinute(booking.getStartTimeMinute());
		bkModel.setStudentId(booking.getStudentId());
		bkModel.setStudentName(booking.getStudentName());
		bkModel.setTutorName(booking.getTutorName());
		bkModel.setApprovalStatus(booking.getApprovalStatus().name());
		bkModel.setSubject(booking.getSubject());
		bkModel.setDomain(booking.getDomain());
		bkModel.setAmount(booking.getAmount());
		bkModel.setPaidAmount(booking.getPaidAmount());
		bkModel.setTutorProfilePictureUrl(booking.getTutorProfilePictureUrl());
		bkModel.setCreationTime(sdf.format(booking.getCreatedDate()));
		String start = booking.getStartTimeHour() + ":" + booking.getStartTimeMinute();
		String end = booking.getEndTimeHour() + ":" + booking.getEndTimeMinute();
		bkModel.setStartTime(start);
		bkModel.setEndTime(end);
		if (booking.getExpertJoinTime() != null) {
			bkModel.setExpertJoinTime(sdf.format(booking.getExpertJoinTime()));
		}
		if (booking.getExpertLeavingTime() != null) {
			bkModel.setExpertLeavingTime(sdf.format(booking.getExpertLeavingTime()));
		}
		if (booking.getLearnerJoinTime() != null) {
			bkModel.setLearnerJoinTime(sdf.format(booking.getLearnerJoinTime()));
		}
		if (booking.getLearnerLeavingTime() != null) {
			bkModel.setLearnerLeavingTime(sdf.format(booking.getLearnerLeavingTime()));
		}

		bkModel.setExpertCode(booking.getExpertCode());
		bkModel.setRazorpay_payment_id(booking.getRazorpay_payment_id());
		bkModel.setRescheduled(booking.isRescheduled());
		return bkModel;
	}

	public void createMeetingSchedulerJobs(BookingDetails booking) throws ParseException {
		//create completion check job
		String[] dateParts = booking.getDateOfMeeting().split("/");

		SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
		//Parsing the given String to Date object
		Date currentTime = new Date();
		Date meetingStartTime = formatter.parse(booking.getDateOfMeeting());
		meetingStartTime.setHours(booking.getStartTimeHour());
		meetingStartTime.setMinutes(booking.getStartTimeMinute());
		Integer minutesPending = miscUtils.checkDiffBtwTimeInMinutes(currentTime,meetingStartTime);
		TaskDefinition taskDefinition;
		//setting up notifications
		 if(minutesPending>120){
			 taskDefinition = new TaskDefinition();
			 Map<Integer,Integer> startHoursAndMinutes = miscUtils.subtractFromTime(120,booking.getStartTimeHour(),booking.getStartTimeMinute());
			 Map.Entry<Integer,Integer> startTime = startHoursAndMinutes.entrySet().iterator().next();
			 taskDefinition.setData(booking.getMeetingId());
			 taskDefinition.setActionType(TaskDefinitonType.CHECK_IF_PENDING_STATUS_ADMIN_2HR);
			 taskDefinition.setCronExpression(miscUtils.generateCronExpression(parseInt(dateParts[0]),parseInt(dateParts[1]),startTime.getKey(),startTime.getValue(),0));
			 taskSchedulerService.scheduleATask(taskDefinition);
		 }
		 if(minutesPending>15){
			 taskDefinition = new TaskDefinition();
			 Map<Integer,Integer> startHoursAndMinutes = miscUtils.subtractFromTime(15,booking.getStartTimeHour(),booking.getStartTimeMinute());
			Map.Entry<Integer,Integer> startTime = startHoursAndMinutes.entrySet().iterator().next();
			 taskDefinition.setData(booking.getMeetingId());
			taskDefinition.setActionType(TaskDefinitonType.MEETING_NOTIFICATION_15);
			taskDefinition.setCronExpression(miscUtils.generateCronExpression(parseInt(dateParts[0]),parseInt(dateParts[1]),startTime.getKey(),startTime.getValue(),0));
			taskSchedulerService.scheduleATask(taskDefinition);
		}

		taskDefinition = new TaskDefinition();
		taskDefinition.setData(booking.getMeetingId());
		taskDefinition.setActionType(TaskDefinitonType.MEETING_COMPLETION);
		taskDefinition.setCronExpression(miscUtils.generateCronExpression(parseInt(dateParts[0]),parseInt(dateParts[1]),booking.getEndTimeHour(),booking.getEndTimeMinute()+1,0));
		taskSchedulerService.scheduleATask(taskDefinition);
	}

	void updateMeetingsSetUpInReferrals(String meetingId) {
		BookingDetails booking = repBooking.meetingIdExists(meetingId);
		String referralCode = booking.getExpertCode();

		if (referralCode != null && !referralCode.equals("")) {
			if (userService.isValidFormatForReferralCode(referralCode)) {
				String referralUserId = userService.parseReferralCode(referralCode);
				if (!Objects.equals(referralUserId, "")) {
					UserReferrals ur = repUserReferral.findByUserId(Integer.valueOf(referralUserId));
					List<BookingDetails> bks = ur.getMeetingSetup();
					bks.add(booking);
					ur.setMeetingSetup(bks);
					repUserReferral.save(ur);
				}
			}
		}
	}


	@Scheduled(cron = "0 32 17 1/1 * *")
	void updateMeetingCompleted() throws ParseException {
		SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
		ArrayList<String> last2DatesInString = new ArrayList<>();
		Calendar c = Calendar.getInstance();
		c.setTime(new Date());
		last2DatesInString.add(formatter.format(c.getTime()));
		c.add(Calendar.DATE, -1);
		last2DatesInString.add(formatter.format(c.getTime()));
		c.add(Calendar.DATE, -1);
		last2DatesInString.add(formatter.format(c.getTime()));
		for (String date : last2DatesInString) {
			List<BookingDetails> bookings = repBooking.fetchBookingsForDate(date);
			if (bookings != null && bookings.size() != 0) {
				for (BookingDetails b : bookings) {
					Date endDateTime = calculateDate(b.getDateOfMeeting(), b.getEndTimeHour(), b.getEndTimeMinute());
					Date currentDate = new Date();
					if (currentDate.getTime() > endDateTime.getTime()) {
						b.setApprovalStatus(miscUtils.findMeetingStatus(b));
						repBooking.save(b);
						if(b.getApprovalStatus().equals(MeetingStatus.COMPLETED)) {
							assignReferralCashback(b);
						}
					}
				}
			}
		}
	}
	void assignReferralCashback(BookingDetails b){
		if(b.getExpertCode()!=null&& !Objects.equals(b.getExpertCode(), "")) {

			String refCode = b.getExpertCode();
			String referrerUserId = userService.parseReferralCode(refCode);
			UserReferrals ur = repUserReferral.findByUserId(Integer.valueOf(referrerUserId));
			List<BookingDetails> meetingsCompleted = ur.getMeetingCompleted();
			List<BookingDetails> meetingsSetup = ur.getMeetingSetup();
			if(!meetingsCompleted.contains(b)) {
				Integer referralAmount = Integer.valueOf(repAppInfo.keyExist("ReferralAmount").getValue());
				int amountDue = ur.getPaymentDue()+referralAmount;
				ur.setPaymentDue(amountDue);

				Cashback cashback=new Cashback();
				cashback.setUser(ur.getUser());
				cashback.setBookingDetails(b);
				cashback.setAmount(referralAmount);
				repCashback.save(cashback);

				for(BookingDetails bs:meetingsSetup) {
					if(bs.getBid().equals(b.getBid())) {
						meetingsCompleted.add(b);
					}
				}

				ur.setMeetingCompleted(meetingsCompleted);
				repUserReferral.save(ur);
			}
		}
	}
	Date calculateDate(String dateOfMeeting, int eh, int em) throws ParseException {
		SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
		Date date = formatter.parse(dateOfMeeting);
		date.setHours(eh);
		date.setMinutes(em);
		return date;
	}

	Integer findDaysFromRegistration(Integer userId, Date current) {
		Users user = repUsers.idExists(userId);
		Date signUpTime = user.getCreatedDate();
		Calendar cal = Calendar.getInstance();
		cal.setTime(signUpTime);
		Integer startDate = cal.get(Calendar.DAY_OF_YEAR);
		cal.setTime(current);
		Integer endDate = cal.get(Calendar.DAY_OF_YEAR);
		return Math.abs(endDate - startDate);
	}

	String getReferralCodeFromUser(Integer userId) {
		Users user = repUsers.idExists(userId);
		return user.getExpertCode();
	}

	// send notification to tutor upon booking request
	public void sendNotificationTutor(Integer id, BookingDetails booking) {
		mailService.sendNotificationTutor(id, booking);
	}

	// for finding tutor bookings and approval status is pending
	public List<?> findTutorBookings(String tid) throws ParseException {
		return isBeforeTime((ArrayList<BookingDetails>) meetingDao.findTutorBookings(tid));
	}

	// for updating booking approval status
	public boolean updateBookingStatus(String bid, String approvalStatus) {
		BookingDetails booking = meetingDao.findBooking(Integer.valueOf(bid));
		booking.setApprovalStatus(MeetingStatus.valueOf(approvalStatus));
		Integer tid = booking.getTutorId();
		TutorProfileDetails expert = repTutorProfileDetails.bookingIdExist(tid);
		if (expert != null && approvalStatus.equals("Accepted")) {
//			expert.setLessonCompleted(expert.getLessonCompleted() + 1);
			expert.setEarning(expert.getEarning() + booking.getAmount());
			repTutorProfileDetails.save(expert);
		};
		sendNotificationTutor(booking.getStudentId(), booking);
		return meetingDao.updateBookingStatus(Integer.valueOf(bid), approvalStatus);
	}

	// for finding students pending bookings
	public List<?> findStudentBookings(Integer sid) throws ParseException {
		return isBeforeTime((ArrayList<BookingDetails>) meetingDao.findStudentBookings(sid));
	}

	// fetch approved bookings students
	public List<?> fetchApprovedList(Integer sid) throws ParseException {
		return isBeforeTime((ArrayList<BookingDetails>) meetingDao.fetchApprovedList(sid));
	}

	// for fetching approved booking list
	public List<?> fetchApprovedListTutor(Integer tid) throws ParseException {
		return isBeforeTime((ArrayList<BookingDetails>) meetingDao.fetchApprovedListTutor(tid));
	}

	// fetch live bookings tutor
	public List<?> fetchLiveMeetingListTutor(Integer tid) throws ParseException {
		return isBeforeTime((ArrayList<BookingDetails>) meetingDao.fetchLiveMeetingListTutor(tid));
	}

	// for fetching live meeting list of student
	public List<?> fetchLiveMeetingListStudent(Integer sid) throws ParseException {
		return isBeforeTime((ArrayList<BookingDetails>) meetingDao.fetchLiveMeetingListStudent(sid));
	}

	public ResponseModel deleteBooking(Integer bookingId){
		BookingDetails bookingDetails=repBooking.bidExists(bookingId);

		// decrement lesson completed of student
		if(bookingDetails!=null){
			StudentProfile studentProfile=repStudentProfile.idExist(bookingDetails.getStudentId());
			if(studentProfile!=null&&studentProfile.getLessonCompleted()>0){
				studentProfile.setLessonCompleted(studentProfile.getLessonCompleted()-1);
				repStudentProfile.save(studentProfile);
			}

			//decrement lesson completed of tutor
			TutorProfileDetails tutorProfileDetails=repTutorProfileDetails.bookingIdExist(bookingDetails.getTutorId());
			if(tutorProfileDetails!=null&&tutorProfileDetails.getLessonCompleted()>0){
				tutorProfileDetails.setLessonCompleted(tutorProfileDetails.getLessonCompleted()-1);
				repTutorProfileDetails.save(tutorProfileDetails);
			}

			repBooking.deleteBooking(bookingId);
			return new ResponseModel("booking deleted successfully");
		}else{
			return new ResponseModel("booking not found");
		}

	}

	// for deleting the booking if it is not accepted by the teacher
	public ResponseModel deleteMyBooking(Integer bookingId) throws ParseException {
		Integer remainingTime = calculateRemainingTimeToCancel(repBooking.bidExists(bookingId));
		Integer limitTime = Integer.valueOf(repAppInfo.keyExist("refund_time").getValue());
		if (remainingTime >= limitTime) {
			if (meetingDao.deleteMyBooking(bookingId)) {
				return new ResponseModel("booking deleted successfully");
			} else {
				return new ResponseModel("booking can't be deleted");
			}
		} else {
			return new ResponseModel("delete time has been exceeded");
		}
	}

	public Integer calculateRemainingTimeToCancel(@NotNull BookingDetails bk) throws ParseException {
		TimeZone.setDefault(TimeZone.getTimeZone("Asia/Kolkata"));
		SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
		SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
		sdf.setTimeZone(TimeZone.getTimeZone("IST"));
		// todayDate string
		Date todayTime = new Date();
		Date meetingTime = formatter.parse(bk.getDateOfMeeting());
		meetingTime.setHours(bk.getStartTimeHour());
		meetingTime.setMinutes(bk.getStartTimeMinute());

		long difference_In_Time = meetingTime.getTime() - todayTime.getTime();
		long difference_In_Minutes = (difference_In_Time / (1000 * 60));
		return (int) difference_In_Minutes;
	}

	// to check if the booking is Valid
	public boolean isBookingValid(Integer sh, Integer sm, Integer eh, Integer em, Integer tid, String date)
			throws ParseException {
		ArrayList<BookingDetails> tutorBookings = (ArrayList<BookingDetails>) meetingDao.fetchApprovedListTutor(tid);
		ArrayList<ScheduleTime> timeSlots = scheduleService.createTimeSlots(sh, sm, eh, em, date);
		boolean bookingExceptionFound = false;
		Integer endMinutes = (eh * 60) + em;

		outerloop: for (BookingDetails booking : tutorBookings) {
			if (booking.getDateOfMeeting().equals(date)) {

				if (eh > booking.getStartTimeHour()) {
					for (ScheduleTime slot : timeSlots) {
						int minutes = slot.getHours() * 60 + slot.getMinutes();
						if (!endMinutes.equals(minutes)) {
							if ((slot.getHours().equals(booking.getStartTimeHour()))
									&& (slot.getMinutes().equals(booking.getStartTimeMinute()))) {
								bookingExceptionFound = true;
								break outerloop;
							}
						}
					}
				}
			}
		}
		if (bookingExceptionFound || !checkIfExpertIsAvailableInTime(sh, sm, eh, em, tid, date)) {
			return false;
		} else return checkIfExpertIsAvailableInTime(sh, sm, eh, em, tid, date);
	}

	public boolean checkIfExpertIsAvailableInTime(Integer sh, Integer sm, Integer eh, Integer em, Integer tid,
			String date) throws ParseException {
		TutorAvailabilityScheduleModel tutorSchedule = userDao.getTutorAvailabilitySchedule(tid);
		List<ScheduleData> expertSch = tutorSchedule.getAllAvailabilitySchedule();
		TimeZone.setDefault(TimeZone.getTimeZone("Asia/Kolkata"));
		SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
		sdf.setTimeZone(TimeZone.getTimeZone("IST"));
		Date bookingStartDateTime = sdf.parse(date);
		Date bookingEndDateTime = sdf.parse(date);
		bookingStartDateTime.setHours(sh);
		bookingStartDateTime.setMinutes(sm);
		bookingEndDateTime.setHours(eh);
		bookingEndDateTime.setMinutes(em);
		for (ScheduleData sch : expertSch) {
			Date schStartTime = new Date(sch.getStartTime());
			Date schEndTime = new Date(sch.getEndTime());
			if (bookingStartDateTime.getTime() >= schStartTime.getTime()
					&& bookingEndDateTime.getTime() <= schEndTime.getTime()) {

				return true;
			}
		}

		return false;
	}

	public ArrayList<BookingDetails> isBeforeTime(ArrayList<BookingDetails> bookings) throws ParseException {
		ArrayList<BookingDetails> eliminateList = new ArrayList<>();
		SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
		TimeZone.setDefault(TimeZone.getTimeZone("Asia/Kolkata"));
		Calendar currentDate = Calendar.getInstance(TimeZone.getTimeZone("Asia/Kolkata"));
		currentDate.set(Calendar.HOUR_OF_DAY, 0);
		currentDate.set(Calendar.MINUTE, 0);
		currentDate.set(Calendar.SECOND, 0);
		currentDate.set(Calendar.MILLISECOND, 0);
		Calendar currentDateWithTime = Calendar.getInstance(TimeZone.getTimeZone("Asia/Kolkata"));
		for (BookingDetails meeting : bookings) {
			Date bookingDate = formatter.parse(meeting.getDateOfMeeting());
			if (bookingDate.before(currentDate.getTime())) {
				eliminateList.add(meeting);
			}
			if (bookingDate.equals(currentDate.getTime())) {
				int meetingMinutes = meeting.getEndTimeHour() * 60 + meeting.getEndTimeMinute();
				int currentMinutes = currentDateWithTime.getTime().getHours() * 60
						+ currentDateWithTime.getTime().getMinutes();
				if (currentMinutes > meetingMinutes) {
					eliminateList.add(meeting);
				}
			}
		}
		bookings.removeAll(eliminateList);

		return bookings;
	}

	public List<BookingDetails> fetchPendingReviewsList(Integer studentId) {
		return meetingDao.fetchPendingReviewsList(studentId);

	}

	public boolean saveTutorRatings(String meetingId, Integer rating, String reviewText, Integer tid) {
		return meetingDao.saveTutorRatings(meetingId, rating, reviewText, tid);
	}

	public List<BookingDetailsModel> fetchExpertRecentReviews(Integer tid) {
		List<BookingDetailsModel> bookings = new ArrayList<>();
		List<BookingDetails> meetings = repBooking.fetchExpertRecentReviews(tid);
		if (meetings != null) {
			for (BookingDetails booking : meetings) {
				if (booking.getRating() != null) {
					BookingDetailsModel meeting = new BookingDetailsModel();
					meeting.setStudentName(booking.getStudentName());
					meeting.setRating(booking.getRating());
					bookings.add(meeting);
				}
			}
		}
		return bookings;
	}

	public String fetchBookingStatus(String bid) {
		BookingDetails booking = repBooking.bidExists(Integer.valueOf(bid));
		return booking.getApprovalStatus().name();
	}

	public ResponseModel canRescheduleMyBooking(String userId, Integer bookingId) throws ParseException {
		BookingDetails bk = repBooking.bidExists(bookingId);

		if (bk != null && bk.getStudentId().equals(Integer.valueOf(userId))) {
			if (bk.isRescheduled()) {
				return new ResponseModel("already rescheduled");
			} else {
				if (calculateRemainingTimeToCancel(bk) >= Integer
						.parseInt(repAppInfo.keyExist("reschedule_time").getValue())) {
					return new ResponseModel("rescheduling possible");
				} else {
					return new ResponseModel("rescheduling time limit exceeded");
				}
			}

		} else {
			return new ResponseModel("invalid user");
		}
	}

	public ResponseModel updateRescheduledBooking(BookingDetailsModel booking) throws ParseException {
		BookingDetails bk = repBooking.bidExists(booking.getBid());
		bk.setStartTimeHour(booking.getStartTimeHour());
		bk.setStartTimeMinute(booking.getStartTimeMinute());
		bk.setDateOfMeeting(booking.getDateOfMeeting());
		Integer duration = bk.getDuration();
		Integer hoursToBeAdded = duration / 60;
		Integer minutesToBeAdded = duration % 60;
		int endTimeHour = bk.getStartTimeHour() + hoursToBeAdded;
		int endTimeMinute = bk.getStartTimeMinute() + minutesToBeAdded;
		if (endTimeMinute / 60 > 0) {
			endTimeHour += (endTimeMinute / 60);
			endTimeMinute = endTimeMinute % 60;
		}
		if (endTimeHour <= 23 && endTimeMinute < 60) {
			bk.setEndTimeHour(endTimeHour);
			bk.setEndTimeMinute(endTimeMinute);

			if (isBookingValid(bk.getStartTimeHour(), bk.getStartTimeMinute(), bk.getEndTimeHour(),
					bk.getEndTimeMinute(), bk.getTutorId(), bk.getDateOfMeeting())) {
				bk.setRescheduled(true);
				repBooking.save(bk);
				return new ResponseModel("rescheduled successfully");
			} else {
				return new ResponseModel("expert busy");
			}

		} else {
			return new ResponseModel("rescheduling unsuccessful");
		}

	}

	public boolean requestToReschedule(Integer bookingId) throws ParseException {
		BookingDetails bk = repBooking.bidExists(bookingId);
		Integer rmt = calculateRemainingTimeToCancel(bk);
		if (rmt >= Integer.parseInt(repAppInfo.keyExist("reschedule_time").getValue())) {
			TutorProfileDetails tut = repTutorProfileDetails.bookingIdExist(bk.getTutorId());
			tut.setRescheduleRequests(tut.getRescheduleRequests() + 1);
			mailService.sendRequestToReschedule(bk);
			bk.setApprovalStatus(MeetingStatus.RESCHEDULE_REQUESTED);
			repBooking.save(bk);
			repTutorProfileDetails.save(tut);
			return true;
		} else {
			return false;
		}
	}

	public ResponseModel deleteBookingFromUrl(String userId, Integer bookingId) throws ParseException {
		BookingDetails bk = repBooking.bidExists(bookingId);
		if (bk != null && bk.getStudentId().equals(Integer.valueOf(userId))) {
			return deleteMyBooking(bookingId);
		} else {
			return null;
		}

	}

	public EarningDataModel fetchEarningData(String tid) {
		TutorProfileDetails exp = repTutorProfileDetails.bookingIdExist(Integer.valueOf(tid));
		EarningDataModel result = new EarningDataModel();
		ArrayList<Integer> uniqueLearner = new ArrayList<>();
		if (exp != null) {
			LocalDateTime now = LocalDateTime.now();
//		    LocalDateTime then = now.minusDays(1);
			ArrayList<KeyValueModel> weeklyEarningData = new ArrayList<>();
			ArrayList<KeyValueModel> monthlyEarningData = new ArrayList<>();
			ArrayList<KeyValueModel> yearlyEarningData = new ArrayList<>();
			// for weekly Data

			Calendar calendar = Calendar.getInstance(TimeZone.getTimeZone("Asia/Calcutta"));
			int dayCount = calendar.get(Calendar.DAY_OF_WEEK);

			for (int i = 1; i <= dayCount; i++) {
				Integer earning = 0;
				KeyValueModel day = new KeyValueModel();
				LocalDateTime then = now.minusDays(i);
				day.setKeyName(now.minusDays(i - 1).getDayOfWeek().toString().substring(0, 3));
				List<BookingDetails> bk = repBooking.fetchExpertMeetingsBetweenTwoDates(exp.getBookingId(), then,
						now.minusDays(i - 1));
				if (bk != null) {
					for (BookingDetails booking : bk) {
						if (!booking.getApprovalStatus().equals(MeetingStatus.CANCELLED)) {
							if (!uniqueLearner.contains(booking.getStudentId())) {
								uniqueLearner.add(booking.getStudentId());
							}
							earning += booking.getAmount();
						}
					}
				}
				day.setValueName(earning.toString());
				weeklyEarningData.add(day);
			}
			// for monthly Data

			LocalDate today = LocalDate.now();
			int monthNumber = today.getMonthValue();

			for (int i = 1; i <= monthNumber; i++) {
				Integer earning = 0;
				KeyValueModel month = new KeyValueModel();
				LocalDateTime then = now.minusMonths(i);
				month.setKeyName(now.minusMonths(i - 1).getMonth().toString().substring(0, 3));
				List<BookingDetails> bk = repBooking.fetchExpertMeetingsBetweenTwoDates(exp.getBookingId(), then,
						now.minusMonths(i - 1));
				if (bk != null) {
					for (BookingDetails booking : bk) {
						if (!booking.getApprovalStatus().equals(MeetingStatus.CANCELLED)) {
							if (!uniqueLearner.contains(booking.getStudentId())) {
								uniqueLearner.add(booking.getStudentId());
							}
							earning += booking.getAmount();
						}
					}
				}
				month.setValueName(earning.toString());
				monthlyEarningData.add(month);
			}
			// for yearly data
			for (int i = 1; i <= 6; i++) {
				Integer earning = 0;
				KeyValueModel year = new KeyValueModel();
				LocalDateTime then = now.minusYears(i);
				year.setKeyName(String.valueOf(now.minusYears(i - 1).getYear()));
				List<BookingDetails> bk = repBooking.fetchExpertMeetingsBetweenTwoDates(exp.getBookingId(), then,
						now.minusYears(i - 1));
				if (bk != null) {
					for (BookingDetails booking : bk) {
						if (!booking.getApprovalStatus().equals(MeetingStatus.CANCELLED)) {
							if (!uniqueLearner.contains(booking.getStudentId())) {
								uniqueLearner.add(booking.getStudentId());
							}
							earning += booking.getAmount();
						}
					}
				}
				year.setValueName(earning.toString());
				if (Integer.parseInt(year.getKeyName()) >= 2021) {
					yearlyEarningData.add(year);
				}

			}

			Collections.reverse(weeklyEarningData);
			Collections.reverse(monthlyEarningData);
			Collections.reverse(yearlyEarningData);
			Integer totalEarnings = 0;
			if (exp.getEarning() != null) {
				totalEarnings += exp.getEarning();
			}
			result.setTotalEarnings(totalEarnings);
			result.setWeeklyData(weeklyEarningData);
			result.setMonthlyData(monthlyEarningData);
			result.setYearlyData(yearlyEarningData);
			result.setTotalLearners(uniqueLearner.size());
			return result;
		} else {
			return null;
		}
	}

	public List<?> findTutorCompletedBookings(String tid) {
		return repBooking.fetchCompletedBookingExpert(Integer.valueOf(tid));
	}

	public List<?> findStudentCompletedBookings(String sid) {
		return repBooking.fetchCompletedBookingStudent(Integer.valueOf(sid));
	}

	public void meetingMemberJoined(String meetingId, String userId) throws ParseException {
		BookingDetails booking = repBooking.meetingIdExists(meetingId);
		TimeZone.setDefault(TimeZone.getTimeZone("Asia/Kolkata"));
		SimpleDateFormat sdf = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");
		sdf.setTimeZone(TimeZone.getTimeZone("IST"));
		String date = sdf.format(new Date());
		// todayDate string
		Date now = sdf.parse(date);
		if (booking != null) {
			if (Integer.valueOf(userId).equals(booking.getStudentId())) {
				if (booking.getLearnerJoinTime() == null) {
					booking.setLearnerJoinTime(now);
				}
			} else if (Integer.valueOf(userId).equals(booking.getTutorId())) {
				if (booking.getExpertJoinTime() == null) {
					booking.setExpertJoinTime(now);
				}
			}
			repBooking.save(booking);
		}
	}

	public void meetingMemberLeft(String meetingId, String userId) throws ParseException {
		// TODO Auto-generated method stub
		BookingDetails booking = repBooking.meetingIdExists(meetingId);
		TimeZone.setDefault(TimeZone.getTimeZone("Asia/Kolkata"));
		SimpleDateFormat sdf = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");
		sdf.setTimeZone(TimeZone.getTimeZone("IST"));
		String date = sdf.format(new Date());
		// todayDate string
		Date now = sdf.parse(date);
		if (booking != null) {
			if (Integer.valueOf(userId).equals(booking.getStudentId()) && booking.getLearnerJoinTime() != null) {
				booking.setLearnerLeavingTime(now);
			} else if (Integer.valueOf(userId).equals(booking.getTutorId()) && booking.getExpertJoinTime() != null) {
				booking.setExpertLeavingTime(now);
			}
			repBooking.save(booking);
		}
	}


	public BookingInvoiceModel bookingToInvoice(@NotNull BookingDetailsModel booking){
		BookingInvoiceModel bookingInvoice=new BookingInvoiceModel();
		bookingInvoice.setBookingId(booking.getBid().toString());
		bookingInvoice.setDateOfMeeting(booking.getDateOfMeeting());
		bookingInvoice.setExpertName(booking.getTutorName());
		bookingInvoice.setLearnerName(booking.getStudentName());
		bookingInvoice.setSubject(booking.getSubject());
		bookingInvoice.setTotalAmount(booking.getAmount());
		//methods to set actual Amount, commission and gst


		Map<String,Double> earnings=adminService.getEarnings(booking.getAmount());
		bookingInvoice.setActualAmount(Math.round(earnings.get("actualEarning")*100)/100);
		bookingInvoice.setGSTFees(Math.round(earnings.get("GSTFees")*100)/100);
		bookingInvoice.setPlatformFees(Math.round(earnings.get("commissionFees")*100)/100);
		bookingInvoice.setTotalAmount(Math.round(booking.getAmount()*100)/100);

        //number to words
		long actualAmountLong= Math.round(bookingInvoice.getActualAmount()+bookingInvoice.getPlatformFees());
		bookingInvoice.setActualAmountWords(numberToWords.convert(actualAmountLong));

		return bookingInvoice;
	}

	public Resource generateInvoice(BookingDetailsModel booking)
			throws DocumentException, IOException{
		BookingInvoiceModel bookingInvoice=bookingToInvoice(booking);
		try {
            Path file = Paths.get(pdfService.generatePdf(bookingInvoice).getAbsolutePath());
            Resource resource = new UrlResource(file.toUri());
            
            if (resource.exists()) {
                return resource;
            }

		} catch (DocumentException | IOException ex) {
            ex.printStackTrace();
        }
		
		return null;
	}

	public boolean isFeedbackSubmitted(String meetingId,String userId) {
		BookingDetails bookingDetails = repBooking.meetingIdExists(meetingId);
		if(bookingDetails!=null){
			if(bookingDetails.getStudentId().equals(Integer.valueOf(userId))&&bookingDetails.getLearnerJoinTime()!=null){
				return bookingDetails.getLearnerFeedBack()!=null;
			}
			if(bookingDetails.getTutorId().equals(Integer.valueOf(userId))&&bookingDetails.getExpertJoinTime()!=null){
				return bookingDetails.getExpertFeedback()!=null;
			}
		}
		return true;
	}

	public void saveFeedback(BookingFeedbackModel feedbackModel) {
		Integer userId = Integer.valueOf(feedbackModel.getUserId());
		String role = feedbackModel.getRole();
		feedbackModel.setTime(new Date());
		BookingDetails bookingDetails = repBooking.bidExists(Integer.valueOf(feedbackModel.getBookingId()));
		if(bookingDetails!=null){

			if(bookingDetails.getStudentId().equals(userId)&&role.equals("Learner")&& bookingDetails.getLearnerFeedBack()==null){
				bookingDetails.setLearnerFeedBack(new Gson().toJson(feedbackModel));
				repBooking.save(bookingDetails);
			}

			if(bookingDetails.getTutorId().equals(userId)&&role.equals("Expert")&& bookingDetails.getExpertFeedback()==null){
				bookingDetails.setExpertFeedback(new Gson().toJson(feedbackModel));
				repBooking.save(bookingDetails);
			}
		}
	}
}
