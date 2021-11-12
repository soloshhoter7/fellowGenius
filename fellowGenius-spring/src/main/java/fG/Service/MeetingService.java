package fG.Service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.TimeZone;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Service;

import com.google.gson.JsonObject;

import fG.DAO.Dao;
import fG.DAO.MeetingDao;
import fG.Entity.BookingDetails;
import fG.Entity.Notification;
import fG.Entity.ScheduleData;
import fG.Entity.TutorProfileDetails;
import fG.Model.BookingDetailsModel;
import fG.Model.EarningDataModel;
import fG.Model.KeyValueModel;
import fG.Model.ResponseModel;
import fG.Model.ScheduleTime;
import fG.Model.TutorAvailabilityScheduleModel;
import fG.Repository.repositoryAppInfo;
import fG.Repository.repositoryBooking;
import fG.Repository.repositoryNotification;
import fG.Repository.repositoryTutorAvailabilitySchedule;
import fG.Repository.repositoryTutorProfileDetails;

@Service
public class MeetingService {
	@Autowired
	private SimpMessageSendingOperations messagingTemplate;

	@Autowired
	MeetingDao meetingDao;

	@Autowired
	Dao userDao;

	@Autowired
	repositoryTutorProfileDetails repTutorProfileDetails;

	@Autowired
	repositoryTutorAvailabilitySchedule repTutorAvailabilitySchedule;

	@Autowired
	ScheduleService scheduleService;

	@Autowired
	UserService userService;

	@Autowired
	repositoryBooking repBooking;

	@Autowired
	repositoryNotification repNotification;

	@Autowired
	MailService mailService;

	@Autowired
	repositoryAppInfo repAppInfo;

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
			bkModel.setApprovalStatus(booking.getApprovalStatus());
			bkModel.setBookingCase(booking.getBookingCase());
			bkModel.setSubject(booking.getSubject());
			bkModel.setDomain(booking.getDomain());
			bkModel.setAmount(booking.getAmount());
			bkModel.setTutorProfilePictureUrl(booking.getTutorProfilePictureUrl());
			return bkModel;
		} else {
			return null;
		}

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
		bkModel.setTutorId(booking.getTutorId());
		bkModel.setStudentName(booking.getStudentName());
		bkModel.setTutorName(booking.getTutorName());
		bkModel.setApprovalStatus(booking.getApprovalStatus());
		bkModel.setBookingCase(booking.getBookingCase());
		bkModel.setSubject(booking.getSubject());
		bkModel.setDomain(booking.getDomain());
		bkModel.setAmount(booking.getAmount());
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
		bkModel.setIsRescheduled(booking.getIsRescheduled());
		return bkModel;
	}

	// to save the bookings requested by student
	public boolean saveBooking(BookingDetailsModel bookingModel) {
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
		booking.setApprovalStatus(bookingModel.getApprovalStatus());
		booking.setBookingCase(bookingModel.getBookingCase());
		booking.setSubject(bookingModel.getSubject());
		booking.setDomain(bookingModel.getDomain());
		booking.setAmount(bookingModel.getAmount());
		booking.setRating(0);
		booking.setTutorProfilePictureUrl(bookingModel.getTutorProfilePictureUrl());
		booking.setRazorpay_order_id(bookingModel.getRazorpay_order_id());
		booking.setRazorpay_payment_id(bookingModel.getRazorpay_payment_id());
		booking.setRazorpay_signature(bookingModel.getRazorpay_signature());
		booking.setExpertCode(bookingModel.getExpertCode());
		String message = "New appointment request";
		System.out.println("booking==>" + booking);
//		sendMeetingNotificationWebSocket((bookingModel.getTutorId()).toString(),message);
		sendNotificationTutor(bookingModel.getTutorId(), booking);
		return meetingDao.saveBooking(booking);
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
		booking.setApprovalStatus(approvalStatus);
		Integer tid = booking.getTutorId();
		TutorProfileDetails expert = repTutorProfileDetails.bookingIdExist(tid);
		if (expert != null && approvalStatus.equals("Accepted")) {
			expert.setLessonCompleted(expert.getLessonCompleted() + 1);
			expert.setEarning(expert.getEarning() + booking.getAmount());
			repTutorProfileDetails.save(expert);
		}
		System.out.println(booking);
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

	public Integer calculateRemainingTimeToCancel(BookingDetails bk) throws ParseException {
		Integer timeRemaining = 0;
		TimeZone.setDefault(TimeZone.getTimeZone("Asia/Kolkata"));
		SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
		SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
		sdf.setTimeZone(TimeZone.getTimeZone("IST"));
		// todayDate string
		Date todayTime = new Date();
		System.out.println("date ===>" + bk.getDateOfMeeting());
		Date meetingTime = formatter.parse(bk.getDateOfMeeting());
		meetingTime.setHours(bk.getStartTimeHour());
		meetingTime.setMinutes(bk.getStartTimeMinute());
		System.out.println(todayTime);
		System.out.println(meetingTime);

		long difference_In_Time = meetingTime.getTime() - todayTime.getTime();
		long difference_In_Minutes = (difference_In_Time / (1000 * 60));
		System.out.println(difference_In_Minutes);
		return (int) difference_In_Minutes;
	}

	// to check if the booking is Valid
	public boolean isBookingValid(Integer sh, Integer sm, Integer eh, Integer em, Integer tid, String date)
			throws ParseException {
		System.out.println("is booking valid -->> start time :" + sh + ":" + sm + " end time :" + eh + ":" + em
				+ " Date :" + date + " tid :" + tid);
		ArrayList<BookingDetails> tutorBookings = (ArrayList<BookingDetails>) meetingDao.fetchApprovedListTutor(tid);
		ArrayList<ScheduleTime> timeSlots = scheduleService.createTimeSlots(sh, sm, eh, em, date);
		Boolean bookingExceptionFound = false;
		Boolean calendarExceptionFound = false;
		Integer endMinutes = (eh * 60) + em;

		outerloop: for (BookingDetails booking : tutorBookings) {
			if (booking.getDateOfMeeting().equals(date)) {

				System.out.println("date Matches");
				System.out.println(booking.getStartTimeHour() + " / " + booking.getStartTimeMinute());
				if (eh > booking.getStartTimeHour()) {
					System.out.println("end time > start time of booking");
					for (ScheduleTime slot : timeSlots) {
						System.out.println("SLOT");
						Integer minutes = 0;
						minutes = slot.getHours() * 60 + slot.getMinutes();
						if (endMinutes != minutes) {
							System.out.println("entered");
							System.out.println(slot.getHours() + " / " + slot.getMinutes());
							if ((slot.getHours().equals(booking.getStartTimeHour()))
									&& (slot.getMinutes().equals(booking.getStartTimeMinute()))) {
								System.out.println("MAtched");
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
		} else if (!bookingExceptionFound && checkIfExpertIsAvailableInTime(sh, sm, eh, em, tid, date)) {
			return true;
		} else {
			return false;
		}
	}

	public boolean checkIfExpertIsAvailableInTime(Integer sh, Integer sm, Integer eh, Integer em, Integer tid,
			String date) throws ParseException {
		TutorAvailabilityScheduleModel tutorSchedule = userDao.getTutorAvailabilitySchedule(Integer.valueOf(tid));
		List<ScheduleData> expertSch = tutorSchedule.getAllAvailabilitySchedule();
		TimeZone.setDefault(TimeZone.getTimeZone("Asia/Kolkata"));
		SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
		SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
		sdf.setTimeZone(TimeZone.getTimeZone("IST"));
		Date bookingStartDateTime = (Date) sdf.parse(date);
		Date bookingEndDateTime = (Date) sdf.parse(date);
		bookingStartDateTime.setHours(sh);
		bookingStartDateTime.setMinutes(sm);
		bookingEndDateTime.setHours(eh);
		bookingEndDateTime.setMinutes(em);
		for (ScheduleData sch : expertSch) {
			Date schStartTime = new Date(sch.getStartTime());
			Date schEndTime = new Date(sch.getEndTime());
			if (bookingStartDateTime.getTime() >= schStartTime.getTime()
					&& bookingEndDateTime.getTime() <= schEndTime.getTime()) {
				System.out.println("Time matcheddd");
				return true;
			}
		}

		return false;
	}

	public ArrayList<BookingDetails> isBeforeTime(ArrayList<BookingDetails> bookings) throws ParseException {
		ArrayList<BookingDetails> eliminateList = new ArrayList<BookingDetails>();
		SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
//		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss z");
//		formatter.setTimeZone(TimeZone.getTimeZone("IST"));
//		sdf.setTimeZone(TimeZone.getTimeZone("IST"));
//		Date currentDate = new Date(formatter.format(new Date()));
//		System.out.println("current date ->"+formatter.format(currentDate));
//		Date currentDateWithTime = new Date(sdf.format(new Date()));
//		System.out.println("current date with time ->"+sdf.format(currentDateWithTime));
		TimeZone.setDefault(TimeZone.getTimeZone("Asia/Kolkata"));
		Calendar currentDate = Calendar.getInstance(TimeZone.getTimeZone("Asia/Kolkata"));
		currentDate.set(Calendar.HOUR_OF_DAY, 0);
		currentDate.set(Calendar.MINUTE, 0);
		currentDate.set(Calendar.SECOND, 0);
		currentDate.set(Calendar.MILLISECOND, 0);
		System.out.println("currentDate_>" + currentDate.getTime());
		Calendar currentDateWithTime = Calendar.getInstance(TimeZone.getTimeZone("Asia/Kolkata"));
		System.out.println("currentDateWithTime_>" + currentDateWithTime.getTime());
		for (BookingDetails meeting : bookings) {
//			Date bookingDate = new Date(meeting.getDateOfMeeting());
			Date bookingDate = (Date) formatter.parse(meeting.getDateOfMeeting());
			System.out.println("booking date_>" + bookingDate);
			if (bookingDate.before(currentDate.getTime())) {
				System.out.println("before date");
				eliminateList.add(meeting);
			}
			if (bookingDate.equals(currentDate.getTime())) {
				System.out.println("Date equals");
				Integer meetingMinutes = meeting.getEndTimeHour() * 60 + meeting.getEndTimeMinute();
				Integer currentMinutes = currentDateWithTime.getTime().getHours() * 60
						+ currentDateWithTime.getTime().getMinutes();
				System.out.println("current minutes->" + currentMinutes + "meeting Minutes ->" + meetingMinutes);
				System.out.println("-------------->" + currentDateWithTime.getTime().getHours() + ":"
						+ currentDateWithTime.getTime().getMinutes());
				if (currentMinutes > meetingMinutes) {
					System.out.println("current time is greater");
					eliminateList.add(meeting);
				}
			}
		}
		System.out.println("eliminate meetings ->" + eliminateList);
		System.out.println("bookings ->" + bookings);
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
		List<BookingDetailsModel> bookings = new ArrayList<BookingDetailsModel>();
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
		return booking.getApprovalStatus();
	}

	public ResponseModel canRescheduleMyBooking(String userId, Integer bookingId) throws ParseException {
		BookingDetails bk = repBooking.bidExists(bookingId);

		if (bk != null && bk.getStudentId().equals(Integer.valueOf(userId))) {
			if (bk.getIsRescheduled().equals("true")) {
				return new ResponseModel("already rescheduled");
			} else {
				if (calculateRemainingTimeToCancel(bk) >= Integer
						.valueOf(repAppInfo.keyExist("reschedule_time").getValue())) {
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
		Integer endTimeHour = bk.getStartTimeHour() + hoursToBeAdded;
		Integer endTimeMinute = bk.getStartTimeMinute() + minutesToBeAdded;
		if (endTimeMinute / 60 > 0) {
			endTimeHour += (endTimeMinute / 60);
			endTimeMinute = endTimeMinute % 60;
		}
		if (endTimeHour <= 23 && endTimeMinute < 60) {
			bk.setEndTimeHour(endTimeHour);
			bk.setEndTimeMinute(endTimeMinute);
			bk.setIsRescheduled("true");
			if (isBookingValid(bk.getStartTimeHour(), bk.getStartTimeMinute(), bk.getEndTimeHour(),
					bk.getEndTimeMinute(), bk.getTutorId(), bk.getDateOfMeeting())) {
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
		if (rmt >= Integer.valueOf(repAppInfo.keyExist("reschedule_time").getValue())) {
			TutorProfileDetails tut = repTutorProfileDetails.bookingIdExist(bk.getTutorId());
			tut.setRescheduleRequests(tut.getRescheduleRequests() + 1);
			mailService.sendRequestToReschedule(bk);
			bk.setIsRescheduled("requested");
			repBooking.save(bk);
			repTutorProfileDetails.save(tut);
			return true;
		} else {
			return false;
		}
	}

	public ResponseModel deleteBookingFromUrl(String userId, Integer bookingId) throws ParseException {
		System.out.println("in service");
		BookingDetails bk = repBooking.bidExists(bookingId);
		System.out.println(bk);
		System.out.println(userId);
		if (bk != null && bk.getStudentId().equals(Integer.valueOf(userId))) {
			System.out.println("user matched and booking fetched!");
			return deleteMyBooking(bookingId);
		} else {
			System.out.println("user not matched!");
			return null;
		}

	}

	public EarningDataModel fetchEarningData(String tid) {
		TutorProfileDetails exp = repTutorProfileDetails.bookingIdExist(Integer.valueOf(tid));
		EarningDataModel result = new EarningDataModel();
		ArrayList<Integer> uniqueLearner = new ArrayList<Integer>();
		if (exp != null) {
			LocalDateTime now = LocalDateTime.now();
//		    LocalDateTime then = now.minusDays(1);
			ArrayList<KeyValueModel> weeklyEarningData = new ArrayList<KeyValueModel>();
			ArrayList<KeyValueModel> monthlyEarningData = new ArrayList<KeyValueModel>();
			ArrayList<KeyValueModel> yearlyEarningData = new ArrayList<KeyValueModel>();
			// for weekly Data

			Calendar calendar = Calendar.getInstance(TimeZone.getTimeZone("Asia/Calcutta"));
			System.out.println(calendar.getTime());
			int dayCount = calendar.get(Calendar.DAY_OF_WEEK);
			System.out.println(dayCount + ".............................");

			for (int i = 1; i <= dayCount; i++) {
				Integer earning = 0;
				KeyValueModel day = new KeyValueModel();
				LocalDateTime then = now.minusDays(i);
				day.setKeyName(now.minusDays(i - 1).getDayOfWeek().toString().substring(0, 3));
				List<BookingDetails> bk = repBooking.fetchExpertMeetingsBetweenTwoDates(exp.getBookingId(), then,
						now.minusDays(i - 1));
				System.out.println(then + " : " + bk);
				if (bk != null) {
					for (BookingDetails booking : bk) {
						if (!booking.getApprovalStatus().equals("cancelled")) {
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
						if (!booking.getApprovalStatus().equals("cancelled")) {
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
						if (!booking.getApprovalStatus().equals("cancelled")) {
							if (!uniqueLearner.contains(booking.getStudentId())) {
								uniqueLearner.add(booking.getStudentId());
							}
							earning += booking.getAmount();
						}
					}
				}
				year.setValueName(earning.toString());
				if (Integer.valueOf(year.getKeyName()) >= 2021) {
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

//		System.out.println(repBooking.fetchExpertMeetingsBetweenTwoDates(then,now));
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
}
