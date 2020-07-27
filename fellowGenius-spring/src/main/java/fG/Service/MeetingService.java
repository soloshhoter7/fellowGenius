package fG.Service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Properties;
import java.util.TimeZone;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import fG.DAO.MeetingDao;
import fG.DAO.dao;
import fG.Entity.BookingDetails;
import fG.Entity.StudentProfile;
import fG.Entity.TutorProfile;
import fG.Model.BookingDetailsModel;
import fG.Model.ScheduleTime;

@Service
public class MeetingService {

	@Autowired
	MeetingDao meetingDao;

	@Autowired
	dao userDao;
	
	@Autowired
	ScheduleService scheduleService;

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
		sendNotificationTutor(bookingModel.getTutorId(), booking);
		return meetingDao.saveBooking(booking);
	}

	// send notification to tutor upon booking request
	public void sendNotificationTutor(Integer id, BookingDetails booking) {
		String from = "fellowgenius.tech@gmail.com";

		Properties props = new Properties();
		props.put("mail.smtp.auth", "true");
		props.put("mail.smtp.starttls.enable", "true");
		props.put("mail.smtp.host", "smtp.gmail.com");
		props.put("mail.smtp.port", 587);

		Session session = Session.getDefaultInstance(props, new javax.mail.Authenticator() {
			protected PasswordAuthentication getPasswordAuthentication() {
				return new PasswordAuthentication("fellowgenius.tech@gmail.com", "fG15051209");
			}
		});

		try {
			MimeMessage message = new MimeMessage(session);
			if (booking.getApprovalStatus().equals("Pending")) {
				TutorProfile tutProfile = userDao.getTutorProfile(id);
				String to = tutProfile.getEmail();
				message.setFrom(new InternetAddress(from));
				message.addRecipient(Message.RecipientType.TO, new InternetAddress(to));
				message.setSubject("Appointment Notification !");

				message.setContent("<html> <head> <link rel=\"stylesheet\" href=\"https://maxcdn.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css\"/>"
						+ " <style>.Box{box-shadow: 0px 0px 5px rgb(199, 203, 217, 0.7);width: 100%;height: auto;text-align: center;padding: 20px;"
						+ "margin-top: 10px;}.logo{color: #241084;font-weight: 500;line-height: 2rem;font-size: xx-large;}tr{padding: 10px;"
						+ "}td{padding: 5px;margin-right: 5px;}</style> </head><body> <div class=\"container-fluid\"> <div class=\"row\"> "
						+ "<div class=\"col-sm-2\"></div><div class=\"col-sm-7\"> <div class=\"Box\"> <div class=\"box-header\"> <h1 class=\"logo\">"
						+ "fellowGenius</h1> </div><div class=\"box-body\"> <h2 style=\"margin-bottom:30px;margin-top:20px\">New Appointment Request !</h2> "
						+ "<div style=\"padding: 20px;background-color: #e0e0e0;width:max-content;margin:auto\"> <table > <tr> <td><b>Student Name</b></td>"
						+ "<td>:</td><td>"+ booking.getStudentName() + "</td></tr><tr> <td><b>Date</b></td><td>:</td><td>"+ booking.getDateOfMeeting() +"</td></tr><tr> <td><b>Start Time</b></td><td>"
						+ ":</td><td>"+ booking.getStartTimeHour() + ":"+ booking.getStartTimeMinute() +"</td></tr><tr> <td><b>Duration</b></td><td>:</td><td>"+ booking.getDuration() +
						" Minutes </td></tr><tr> <td><b>Description</b></td><td>:</td><td>"
						+ booking.getDescription()+"</td></tr></table> </div><p style=\"margin-top: 30px;font-weight: 100;\">"
						+ "This is an auto-generated message please don't reply back.</p></div></div></div><div class=\"com-sm-3\">"
						+ "</div></div></div></body></html>","text/html");
				Transport.send(message);
				
			} else if (booking.getApprovalStatus().equals("Accepted")) {
				System.out.println("STATUS IS :ACCEPTED");
				StudentProfile stuProfile = userDao.getStudentProfile(id);
				String to = stuProfile.getEmail();
				message.setFrom(new InternetAddress(from));
				message.addRecipient(Message.RecipientType.TO, new InternetAddress(to));
				message.setSubject("Appointment Notification !");

				message.setContent("<html> <head> <link rel=\"stylesheet\" href=\"https://maxcdn.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css\"/>"
						+ " <style>.Box{box-shadow: 0px 0px 5px rgb(199, 203, 217, 0.7);width: 100%;height: auto;text-align: center;padding: 20px;"
						+ "margin-top: 10px;}.logo{color: #241084;font-weight: 500;line-height: 2rem;font-size: xx-large;}"
						+ "tr{padding: 10px;}td{padding: 5px;margin-right: 5px;}</style> </head><body> <div class=\"container-fluid\">"
						+ " <div class=\"row\"> <div class=\"col-sm-2\"></div><div class=\"col-sm-7\"> <div class=\"Box\">"
						+ " <div class=\"box-header\"> <h1 class=\"logo\">fellowGenius</h1> </div><div class=\"box-body\">"
						+ "<h2 style=\"margin-bottom: 20px;\"> Request Accepted !</h2> <div style=\"padding: 20px;background-color: #e0e0e0;"
						+ "width:max-content;margin:auto\"> <table > <tr> <td><b>Tutor Name</b></td><td>:</td><td>"+ booking.getTutorName()+"</td></tr><tr> "
						+ "<td><b>Date</b></td><td>:</td><td>"+ booking.getDateOfMeeting() + "</td></tr><tr> <td><b>Start Time</b></td><td>:</td><td>" + booking.getStartTimeHour()+ ":"+ booking.getStartTimeMinute() + "</td></tr><tr> "
						+ "<td><b>Duration</b></td><td>:</td><td>" + booking.getDuration() +" Minutes</td></tr></table> </div><p style=\"margin-top: 30px;font-weight: 100;\">"
						+ "This is an auto-generated message please don't reply back.</p></div></div></div><div class=\"com-sm-3\"></div></div></div></body></html>","text/html");
				
				Transport.send(message);
				
			}else if (booking.getApprovalStatus().equals("live")) {
				System.out.println("STATUS IS : LIVE");
				StudentProfile stuProfile = userDao.getStudentProfile(id);
				String to = stuProfile.getEmail();
				message.setFrom(new InternetAddress(from));
				message.addRecipient(Message.RecipientType.TO, new InternetAddress(to));
				message.setSubject("Appointment Notification !");

				message.setContent("<html> <head> <link rel=\"stylesheet\" href=\"https://maxcdn.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css\"/>"
						+ " <style>.Box{box-shadow: 0px 0px 5px rgb(199, 203, 217, 0.7);width: 100%;height: auto;text-align: center;padding: 20px;"
						+ "margin-top: 10px;}.logo{color: #241084;font-weight: 500;line-height: 2rem;font-size: xx-large;}"
						+ "tr{padding: 10px;}td{padding: 5px;margin-right: 5px;}</style> </head><body> <div class=\"container-fluid\">"
						+ " <div class=\"row\"> <div class=\"col-sm-2\"></div><div class=\"col-sm-7\"> <div class=\"Box\">"
						+ " <div class=\"box-header\"> <h1 class=\"logo\">fellowGenius</h1> </div><div class=\"box-body\">"
						+ "<h2 style=\"margin-bottom: 20px;\"> Tutor has started the Meeting</h2> <div style=\"padding: 20px;background-color: #e0e0e0;"
						+ "width:max-content;margin:auto\"> <table > <tr> <td><b>Tutor Name</b></td><td>:</td><td>"+ booking.getTutorName()+"</td></tr><tr> "
						+ "<td><b>Date</b></td><td>:</td><td>"+ booking.getDateOfMeeting() + "</td></tr><tr> <td><b>Start Time</b></td><td>:</td><td>" + booking.getStartTimeHour()+ ":"+ booking.getStartTimeMinute() + "</td></tr><tr> "
						+ "<td><b>Duration</b></td><td>:</td><td>" + booking.getDuration() +" Minutes</td></tr></table> </div><p style=\"margin-top: 30px;font-weight: 100;\">"
						+ "This is an auto-generated message please don't reply back.</p></div></div></div><div class=\"com-sm-3\"></div></div></div></body></html>","text/html");

			Transport.send(message);

			System.out.println("Message sent successfully....");

		} 
			}catch (MessagingException e) {
			e.printStackTrace();
			throw new RuntimeException(e);
		}

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
	public boolean deleteMyBooking(Integer bookingId) {
		return meetingDao.deleteMyBooking(bookingId);
		
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
}
