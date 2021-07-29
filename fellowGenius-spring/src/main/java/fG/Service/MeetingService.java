package fG.Service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.TimeZone;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Service;

import com.google.gson.JsonObject;

import fG.DAO.MeetingDao;
import fG.DAO.dao;
import fG.Entity.BookingDetails;
import fG.Entity.Notification;
import fG.Entity.TutorProfileDetails;
import fG.Model.BookingDetailsModel;
import fG.Model.ResponseModel;
import fG.Model.ScheduleTime;
import fG.Repository.repositoryAppInfo;
import fG.Repository.repositoryBooking;
import fG.Repository.repositoryNotification;
import fG.Repository.repositoryTutorProfileDetails;

@Service
public class MeetingService {
	@Autowired
	private SimpMessageSendingOperations messagingTemplate;

	@Autowired
	MeetingDao meetingDao;

	@Autowired
	dao userDao;
	
	@Autowired
	repositoryTutorProfileDetails repTutorProfileDetails;
	
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
		Notification notification = new Notification(
				msg.get("entityType").getAsInt(),
				msg.get("entityTypeId").getAsInt(),
				msg.get("actorId").getAsString(),
				msg.get("notifierId").getAsString(),
				msg.get("pictureUrl").getAsString(),
				false
				);	
		repNotification.save(notification);
				
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
		booking.setAmount(bookingModel.getAmount());
		booking.setRating(0);
		booking.setTutorProfilePictureUrl(bookingModel.getTutorProfilePictureUrl());
		booking.setRazorpay_order_id(bookingModel.getRazorpay_order_id());
		booking.setRazorpay_payment_id(bookingModel.getRazorpay_payment_id());
		booking.setRazorpay_signature(bookingModel.getRazorpay_signature());
		String message ="New appointment request";
//		sendMeetingNotificationWebSocket((bookingModel.getTutorId()).toString(),message);
		sendNotificationTutor(bookingModel.getTutorId(), booking);
		return meetingDao.saveBooking(booking);
	}

	// send notification to tutor upon booking request
	public void sendNotificationTutor(Integer id, BookingDetails booking) {
		mailService.sendNotificationTutor(id, booking);
//		String from = "soloshooter5631@gmail.com";
//		Properties props = new Properties();
//	    props.setProperty("mail.transport.protocol", "smtp");     
//	    props.setProperty("mail.host", "smtp.gmail.com");  
//	    props.put("mail.smtp.auth", "true");  
//	    props.put("mail.smtp.port", "465");  
//	    props.put("mail.debug", "true");  
//	    props.put("mail.smtp.socketFactory.port", "465");  
//	    props.put("mail.smtp.socketFactory.class","javax.net.ssl.SSLSocketFactory");  
//	    props.put("mail.smtp.socketFactory.fallback", "false");  
//
//		Session session = Session.getDefaultInstance(props, new javax.mail.Authenticator() {
//			protected PasswordAuthentication getPasswordAuthentication() {
//				return new PasswordAuthentication("soloshooter5631@gmail.com", "czdq124c6");
//			}
//
//		});
//
//		try {
//			MimeMessage message = new MimeMessage(session);
//			if (booking.getApprovalStatus().equals("Pending")) {
//				TutorProfile tutProfile = userDao.fetchTutorProfileByBookingId(id);
//				String to = tutProfile.getEmail();
//				message.setFrom(new InternetAddress(from));
//				message.addRecipient(Message.RecipientType.TO, new InternetAddress(to));
//				message.setSubject("Appointment Notification !");
//				message.setContent("<html><head> <link rel=\"stylesheet\" href=\"https://maxcdn.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css\"/> <style>.Box{box-shadow: 0 8px 16px 0 #90a4ae; width: 100%; height: auto; text-align: center; padding: 20px; margin-top: 10px; background: url(https://fellowgenius.com/search_right_bg.7af30faa440a7e6ab2bb.svg) no-repeat; background-size: contain; border: 1px solid #7d0f7d; border-radius: 8px; width: 650px; margin: 0 auto; background-position: left top;}.logo{background: url(https://fellowgenius.com/logo.2dbc598173218fe92921.svg) no-repeat; background-size: contain; height: 100px; display: block; float: right; width: 100px;}tr{padding: 10px;}td{padding: 5px; margin-right: 5px;}</style></head><body> <div class=\"Box\"> <div class=\"box-header\"> <span class=\"logo\"></span> <span style=\"margin-bottom: 20px;color:#892687;width:100%;text-align: center;font-size:16px;font-weight:bold;text-transform: uppercase;\">New appointment Request</span> </div><div style=\"padding:20px;width: 350px; margin: 0 auto;\">"
//						+ " <table> <tr> <td><b>Student Name</b><br>"+booking.getStudentName()+"</td><td><b>"+booking.getDateOfMeeting()+"</b><br>04/06/2020</td></tr><tr> <td><b>Start Time</b><br>"+ booking.getStartTimeHour() + ":"+ booking.getStartTimeMinute() +"</td><td><b>Duration</b><br>"+booking.getDuration()+"</td></tr></table> </div><p style=\"margin-top: 30px; font-size: 10px; text-align: center; width: 100%;\">This is an auto-generated message please don't reply back.</p></div><div class=\"container-fluid\"> <div class=\"row\"> <div class=\"col-sm-2\"></div><div class=\"col-sm-7\"> </div><div class=\"com-sm-3\"></div></div></div></body></html>","text/html");
//				Transport.send(message);
//				
//			} else if (booking.getApprovalStatus().equals("Accepted")) {
//				System.out.println("STATUS IS :ACCEPTED");
//				StudentProfile stuProfile = userDao.getStudentProfile(id);
//				String to = stuProfile.getEmail();
//				message.setFrom(new InternetAddress(from));
//				message.addRecipient(Message.RecipientType.TO, new InternetAddress(to));
//				message.setSubject("Appointment Notification !");
//				message.setContent("<html><head> <link rel=\"stylesheet\" href=\"https://maxcdn.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css\"/> <style>.Box{box-shadow: 0 8px 16px 0 #90a4ae; width: 100%; height: auto; text-align: center; padding: 20px; margin-top: 10px; background: url(https://fellowgenius.com/search_right_bg.7af30faa440a7e6ab2bb.svg) no-repeat; background-size: contain; border: 1px solid #7d0f7d; border-radius: 8px; width: 650px; margin: 0 auto; background-position: left top;}.logo{background: url(https://fellowgenius.com/logo.2dbc598173218fe92921.svg) no-repeat; background-size: contain; height: 100px; display: block; float: right; width: 100px;}tr{padding: 10px;}td{padding: 5px; margin-right: 5px;}</style></head><body> <div class=\"Box\"> <div class=\"box-header\"> <span class=\"logo\"></span> <span style=\"margin-bottom: 20px;color:#892687;width:100%;text-align: center;font-size:16px;font-weight:bold;text-transform: uppercase;\"> Request Accepted !</span> </div><div style=\"padding:20px;width: 350px; margin: 0 auto;\">"
//						+ " <table> <tr> <td><b>Tutor Name</b><br>"+booking.getTutorName()+"</td><td><b>Date</b><br>"+booking.getDateOfMeeting()+"</td></tr><tr> <td><b>Start Time</b><br>"+booking.getStartTimeHour() + ":"+ booking.getStartTimeMinute() +"</td><td><b>Duration</b><br>"+booking.getDuration()+"</td></tr></table> </div><p style=\"margin-top: 30px; font-size: 10px; text-align: center; width: 100%;\">This is an auto-generated message please don't reply back.</p></div><div class=\"container-fluid\"> <div class=\"row\"> <div class=\"col-sm-2\"></div><div class=\"col-sm-7\"> </div><div class=\"com-sm-3\"></div></div></div></body></html>","text/html");
//				Transport.send(message);
//				
//			}else if (booking.getApprovalStatus().equals("live")) {
//				System.out.println("STATUS IS : LIVE");
//				StudentProfile stuProfile = userDao.getStudentProfile(id);
//				String to = stuProfile.getEmail();
//				message.setFrom(new InternetAddress(from));
//				message.addRecipient(Message.RecipientType.TO, new InternetAddress(to));
//				message.setSubject("Appointment Notification !");
//				message.setContent("<html><head> <link rel=\"stylesheet\" href=\"https://maxcdn.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css\"/> <style>.Box{box-shadow: 0 8px 16px 0 #90a4ae; width: 100%; height: auto; text-align: center; padding: 20px; margin-top: 10px; background: url(https://fellowgenius.com/search_right_bg.7af30faa440a7e6ab2bb.svg) no-repeat; background-size: contain; border: 1px solid #7d0f7d; border-radius: 8px; width: 650px; margin: 0 auto; background-position: left top;}.logo{background: url(https://fellowgenius.com/logo.2dbc598173218fe92921.svg) no-repeat; background-size: contain; height: 100px; display: block; float: right; width: 100px;}tr{padding: 10px;}td{padding: 5px; margin-right: 5px;}</style></head><body> <div class=\"Box\"> <div class=\"box-header\"> <span class=\"logo\"></span> <span style=\"margin-bottom: 20px;color:#892687;width:100%;text-align: center;font-size:16px;font-weight:bold;text-transform: uppercase;\"> Tutor has started the meeting </span> </div><div style=\"padding:20px;width: 350px; margin: 0 auto;\"> <table> <tr> <td><b>Tutor Name</b><br>"+booking.getTutorName()+"</td><td><b>Date</b><br>"+booking.getDateOfMeeting()+"</td></tr><tr> <td><b>Start Time</b><br>"+booking.getStartTimeHour()+":"+booking.getStartTimeMinute()+"</td><td><b>Duration</b><br>"+booking.getDuration()+" Minutes</td></tr></table> </div><p style=\"margin-top: 30px; font-size: 10px; text-align: center; width: 100%;\">This is an auto-generated message please don't reply back.</p></div><div class=\"container-fluid\"> <div class=\"row\"> <div class=\"col-sm-2\"></div><div class=\"col-sm-7\"> </div><div class=\"com-sm-3\"></div></div></div></body></html>","text/html");
//			Transport.send(message);
//
//			System.out.println("Message sent successfully....");
//
//		} 
//			}catch (MessagingException e) {
//			e.printStackTrace();
//			throw new RuntimeException(e);
//		}

	}

	// for finding tutor bookings and approval status is pending
	public List<?> findTutorBookings(String tid) throws ParseException {
		return isBeforeTime((ArrayList<BookingDetails>) meetingDao.findTutorBookings(tid));
	}

	// for updating booking approval status
	public boolean updateBookingStatus(String bid, String approvalStatus) {
		BookingDetails booking = meetingDao.findBooking(Integer.valueOf(bid));
		booking.setApprovalStatus(approvalStatus);
		System.out.println(booking);
		sendNotificationTutor(booking.getStudentId(), booking);
		return meetingDao.updateBookingStatus(Integer.valueOf(bid),approvalStatus);
		
	}

	// for finding students pending bookings
	public List<?> findStudentBookings(Integer sid) throws ParseException {
		return isBeforeTime((ArrayList<BookingDetails>)meetingDao.findStudentBookings(sid));
	}

	// fetch approved bookings students
	public List<?> fetchApprovedList(Integer sid) throws ParseException {
		return isBeforeTime((ArrayList<BookingDetails>) meetingDao.fetchApprovedList(sid));
	}

	// for fetching approved booking list
	public List<?> fetchApprovedListTutor(Integer tid) throws ParseException {
		return isBeforeTime((ArrayList<BookingDetails>)meetingDao.fetchApprovedListTutor(tid));
	}

	// fetch live bookings tutor
	public List<?> fetchLiveMeetingListTutor(Integer tid) throws ParseException {
		return isBeforeTime((ArrayList<BookingDetails>)meetingDao.fetchLiveMeetingListTutor(tid));
	}

	// for fetching live meeting list of student
	public List<?> fetchLiveMeetingListStudent(Integer sid) throws ParseException {
		return isBeforeTime((ArrayList<BookingDetails>)meetingDao.fetchLiveMeetingListStudent(sid));
	}

	// for deleting the booking if it is not accepted by the teacher
	public ResponseModel deleteMyBooking(Integer bookingId) throws ParseException {
		Integer remainingTime = calculateRemainingTimeToCancel(repBooking.bidExists(bookingId));
		Integer limitTime = Integer.valueOf(repAppInfo.keyExist("refund_time").getValue());
		if(remainingTime>=limitTime) {
			if(meetingDao.deleteMyBooking(bookingId)) {
				return new ResponseModel("booking deleted successfully");
			}else {
				return new ResponseModel("booking can't be deleted");
			}
		}else {
			return new ResponseModel("delete time has been exceeded");
		}		
	}
	
	public Integer calculateRemainingTimeToCancel(BookingDetails bk) throws ParseException {
		Integer timeRemaining=0;
		TimeZone.setDefault(TimeZone.getTimeZone("Asia/Kolkata"));
		SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
		SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
		sdf.setTimeZone(TimeZone.getTimeZone("IST"));
		//todayDate string
		 Date todayTime = new Date();
		 System.out.println("date ===>"+bk.getDateOfMeeting());
		 Date meetingTime = formatter.parse(bk.getDateOfMeeting());
		 meetingTime.setHours(bk.getStartTimeHour());
		 meetingTime.setMinutes(bk.getStartTimeMinute());
		 System.out.println(todayTime);
		 System.out.println(meetingTime);
		 
		 long difference_In_Time = meetingTime.getTime()-todayTime.getTime();
		 long difference_In_Minutes =(difference_In_Time/(1000*60));
		 System.out.println(difference_In_Minutes);
		return (int) difference_In_Minutes;
	}
	// to check if the booking is Valid
	public boolean isBookingValid(Integer sh, Integer sm, Integer eh, Integer em, Integer tid, String date) {
		ArrayList<BookingDetails> tutorBookings = (ArrayList<BookingDetails>) meetingDao.fetchApprovedListTutor(tid);
		ArrayList<ScheduleTime> timeSlots = scheduleService.createTimeSlots(sh, sm, eh, em, date);
		Boolean bookingExceptionFound = false;
		Integer endMinutes = (eh * 60) + em;
		
		outerloop:
		for(BookingDetails booking: tutorBookings) {
			if(booking.getDateOfMeeting().equals(date)) {
				System.out.println("date Matches");
				System.out.println(booking.getStartTimeHour() + " / "+ booking.getStartTimeMinute());
				if(eh>booking.getStartTimeHour()) {
					System.out.println("end time > start time of booking");
					for(ScheduleTime slot: timeSlots) {
						System.out.println("SLOT");
						Integer minutes = 0;
						minutes = slot.getHours()*60 + slot.getMinutes();
						if(endMinutes != minutes) {
							System.out.println("entered");
							System.out.println(slot.getHours()+" / "+slot.getMinutes());
						   if((slot.getHours().equals(booking.getStartTimeHour()))&&(slot.getMinutes().equals(booking.getStartTimeMinute()))){
							 System.out.println("MAtched");
							 bookingExceptionFound=true; 
							 break outerloop;
						   }
						}
					}
				}
			}
		}
		if(bookingExceptionFound) {
			return false;
		}else {
			return true;
		}
	}
	
	public ArrayList<BookingDetails> isBeforeTime(ArrayList<BookingDetails> bookings) throws ParseException{
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
		System.out.println("currentDate_>"+currentDate.getTime());
		 Calendar currentDateWithTime = Calendar.getInstance(TimeZone.getTimeZone("Asia/Kolkata"));
		 System.out.println("currentDateWithTime_>"+currentDateWithTime.getTime());
		for(BookingDetails meeting:bookings) {
//			Date bookingDate = new Date(meeting.getDateOfMeeting());
			Date bookingDate = (Date)formatter.parse(meeting.getDateOfMeeting());
			System.out.println("booking date_>"+bookingDate);
			if(bookingDate.before(currentDate.getTime())) {
				System.out.println("before date");
				eliminateList.add(meeting);
			}
			if(bookingDate.equals(currentDate.getTime())) {
				System.out.println("Date equals");
				Integer meetingMinutes = meeting.getEndTimeHour()*60+meeting.getEndTimeMinute();
				Integer currentMinutes = currentDateWithTime.getTime().getHours()*60+currentDateWithTime.getTime().getMinutes();
				System.out.println("current minutes->"+currentMinutes+"meeting Minutes ->"+meetingMinutes);
				System.out.println("-------------->"+currentDateWithTime.getTime().getHours()+":"+currentDateWithTime.getTime().getMinutes());
				if(currentMinutes>meetingMinutes) {
					System.out.println("current time is greater");
					eliminateList.add(meeting);
				}
			}
		}
		System.out.println("eliminate meetings ->"+eliminateList);
		System.out.println("bookings ->"+bookings);
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
		List<BookingDetails> meetings =repBooking.fetchExpertRecentReviews(tid);
		if(meetings!=null) {
			for(BookingDetails booking:meetings) {
				if(booking.getRating()!=null) {
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
		
		if(bk!=null&&bk.getStudentId().equals(Integer.valueOf(userId))) {
			if(bk.getIsRescheduled().equals("true")) {
				return new ResponseModel("already rescheduled");
			}else {
				if(calculateRemainingTimeToCancel(bk)>=Integer.valueOf(repAppInfo.keyExist("reschedule_time").getValue())) {
					return new ResponseModel("rescheduling possible");	
				}else {
					return new ResponseModel("rescheduling time limit exceeded");
				}
			}
			
		}else {
			return new ResponseModel("invalid user");
		}	
	}
	public ResponseModel updateRescheduledBooking(BookingDetailsModel booking) {
		BookingDetails bk = repBooking.bidExists(booking.getBid());
		bk.setStartTimeHour(booking.getStartTimeHour());
		bk.setStartTimeMinute(booking.getStartTimeMinute());
		bk.setDateOfMeeting(booking.getDateOfMeeting());
		Integer duration = bk.getDuration();
		Integer hoursToBeAdded = duration/60;
		Integer minutesToBeAdded = duration%60;
		Integer endTimeHour = bk.getStartTimeHour()+hoursToBeAdded;
		Integer endTimeMinute = bk.getStartTimeMinute()+minutesToBeAdded;
		if(endTimeMinute/60>0) {
			endTimeHour+=(endTimeMinute/60);
			endTimeMinute=endTimeMinute%60;
		}
		if(endTimeHour<=23&&endTimeMinute<60) {
			bk.setEndTimeHour(endTimeHour);
			bk.setEndTimeMinute(endTimeMinute);
			bk.setIsRescheduled("true");
			if(isBookingValid(bk.getStartTimeHour(), bk.getStartTimeMinute(), bk.getEndTimeHour(), bk.getEndTimeMinute(), bk.getTutorId(), bk.getDateOfMeeting())) {
				repBooking.save(bk);
				return new ResponseModel("rescheduled successfully");
			}else {
				return new ResponseModel("expert busy");
			}
			
		}else {
			return new ResponseModel("rescheduling unsuccessful");
		}
		
		
	}
	public boolean requestToReschedule(Integer bookingId) throws ParseException {
		BookingDetails bk = repBooking.bidExists(bookingId);
		Integer rmt = calculateRemainingTimeToCancel(bk);
		if(rmt>=Integer.valueOf(repAppInfo.keyExist("reschedule_time").getValue())) {
			TutorProfileDetails tut = repTutorProfileDetails.bookingIdExist(bk.getTutorId());
			tut.setRescheduleRequests(tut.getRescheduleRequests()+1);
			mailService.sendRequestToReschedule(bk);
			bk.setIsRescheduled("requested");
			repBooking.save(bk);
			repTutorProfileDetails.save(tut);
			return true;
		}else {
			return false;
		}
	}
	public ResponseModel deleteBookingFromUrl(String userId, Integer bookingId) throws ParseException {
		System.out.println("in service");
		BookingDetails bk = repBooking.bidExists(bookingId);
		System.out.println(bk);
		System.out.println(userId);
		if(bk!=null&&bk.getStudentId().equals(Integer.valueOf(userId))) {
			System.out.println("user matched and booking fetched!");
			return deleteMyBooking(bookingId);
		}else {
			System.out.println("user not matched!");
			return null;
		}
		
	}
}
