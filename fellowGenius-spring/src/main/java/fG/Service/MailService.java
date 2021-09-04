package fG.Service;

import java.nio.charset.StandardCharsets;
import java.util.Properties;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import fG.Configuration.JwtUtil;
import fG.DAO.dao;
import fG.Entity.BookingDetails;
import fG.Entity.StudentProfile;
import fG.Entity.TutorProfile;
import fG.Entity.Users;
import fG.Repository.repositoryTutorProfile;
import fG.Repository.repositoryUsers;

@Service
public class MailService {

	@Autowired
	dao userDao;

	@Autowired
	repositoryUsers repUsers;

	@Autowired
	repositoryTutorProfile repTutorProfile;
	@Autowired
	private JwtUtil jwtUtil;

	@Value("${senderEmail}")
	String senderEmail;
	@Value("${senderPassword}")
	String senderPassword;
	@Value("${rootUrl}")
	String rootUrl;

	static Properties props;
	static Session session;

	void InitiateMailService() {
		props = new Properties();
		props.put("mail.smtp.auth", "true");
		props.put("mail.smtp.starttls.enable", "true");
		props.put("mail.smtp.host", "smtp.gmail.com");
		props.put("mail.smtp.port", 587);
		// for dev version and deployment

//	    props.setProperty("mail.transport.protocol", "smtp");     
//	    props.setProperty("mail.host", "smtp.gmail.com");  
//	    props.put("mail.smtp.auth", "true");  
//	    props.put("mail.smtp.port", "465");  
//	    props.put("mail.debug", "true");  
//	    props.put("mail.smtp.socketFactory.port", "465");  
//	    props.put("mail.smtp.socketFactory.class","javax.net.ssl.SSLSocketFactory");  
//	    props.put("mail.smtp.socketFactory.fallback", "false");  

		session = Session.getDefaultInstance(props, new javax.mail.Authenticator() {
			protected PasswordAuthentication getPasswordAuthentication() {
				return new PasswordAuthentication(senderEmail, senderPassword);
			}
		});
		if (session == null) {
			System.out.println("SESSION IS NULL");
		}
	}

	// For sending OTP verification email
	void sendVerificationEmail(String email, String otp) {
		InitiateMailService();
		String to = email;

		try {
			MimeMessage message = new MimeMessage(session);
			MimeMessageHelper helper = new MimeMessageHelper(message, true);
//			String mailContent="<img src='cid:logoImage'/>";
			String mailContent = "<html>\r\n" + "<head>\r\n" + "  \r\n" + "    <meta charset=\"utf-8\">\r\n"
					+ "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\r\n" + "\r\n"
					+ "</head>\r\n" + "<body>\r\n" + "\r\n"
					+ "    <div style=\"width:100%; background-color: #F7F7F7; display: inline-block; font-family: 'Roboto', sans-serif;\">\r\n"
					+ "        <div style=\"max-width: 500px; height: auto; background-color: #fff; border-radius: 20px; padding: 30px; margin: 3em auto;\">\r\n"
					+ "            <div style=\"width: 100%; display: inline-block; margin-bottom: 20px;\">\r\n"
					+ "                <img src='cid:logoImage' style=\"width: 90px;\">\r\n" + "            </div>\r\n"
					+ "            <div style=\"width: 100%; display: inline-block;\">\r\n"
					+ "                <h1 style=\"color: #202124; font-size: 22px; font-weight: 400;\">Verify your email address</h1>\r\n"
					+ "                <p style=\"font-size: 14px; line-height: 1.75; color: #313745;\">Let's make it official. To verify your email address, enter this code in your browser.</p>\r\n"
					+ "                <div style=\"width: 94%; background-color: #F7F7F7; display: inline-block; padding: 8px; text-align: center; border-radius: 15px; font-size: 55px; font-weight: 400; color: #202124; letter-spacing: 2px;\">"
					+ otp + "</div>\r\n"
					+ "                <p style=\"font-size: 14px; line-height: 1.75; color: #313745;\">If you didn't request a code, you can safely ignore this email.</p>\r\n"
					+ "                <hr style=\"margin: 25px 0; border-top: 1px solid #f7f7f7;\">\r\n"
					+ "                <p style=\"text-align: center; font-size: 14px; color: #B5B3B3; margin-bottom: 0;\">Questions? <span style=\"color: #EC008C;\">We're here to help.</span></p>\r\n"
					+ "            </div>\r\n" + "        </div>\r\n" + "    </div>\r\n" + "\r\n" + "</body>\r\n"
					+ "</html>";
			helper.setFrom(senderEmail);
			helper.setTo(email);
			helper.setSubject("Welcome to FellowGenius");
			helper.setText(mailContent, true);

			ClassPathResource resource = new ClassPathResource("logo.png");
			helper.addInline("logoImage", resource);
			Transport.send(message);

			System.out.println("Sent message successfully....");

		} catch (MessagingException e) {
			e.printStackTrace();
			throw new RuntimeException(e);
		}
	}

	// For sending notifications related to meeting
	void sendNotificationTutor(Integer id, BookingDetails booking) {
		InitiateMailService();
		try {
			MimeMessage message = new MimeMessage(session);
			MimeMessageHelper helper = new MimeMessageHelper(message, true);
//			String mailContent="<img src='cid:logoImage'/>";
			helper.setFrom(senderEmail);

			if (booking.getApprovalStatus().equals("Pending")) {
				TutorProfile tutProfile = userDao.fetchTutorProfileByBookingId(id);
				String to = tutProfile.getEmail();

				helper.setTo(to);
				String recipientName = booking.getTutorName();
				String name = booking.getStudentName();
				String topic = booking.getSubject() + " : " + booking.getDomain();
				String startTime = "";
				String link = rootUrl + "home/tutor-dashboard";
				if (booking.getStartTimeMinute().equals(0)) {
					startTime += booking.getStartTimeHour();
					startTime += ":00";
				} else {
					startTime += booking.getStartTimeHour();
					startTime += ":" + booking.getStartTimeMinute();
				}

				String slot = booking.getDateOfMeeting() + " at " + startTime;
				helper.setSubject("FellowGenius Meeting Notification !");
				String mailContent = "<html>\r\n" + "<head>   \r\n" + "    <style>\r\n" + "   \r\n" + "    </style>\r\n"
						+ "</head>\r\n" + "<body>\r\n"
						+ "    <div style=\"width:100%; background-color: #F7F7F7; display: inline-block; font-family: 'Roboto', sans-serif;\">\r\n"
						+ "        <div style=\"max-width: 500px; height: auto; background-color: #fff; border-radius: 20px; padding: 30px; margin: 3em auto;\">\r\n"
						+ "            <div style=\"width: 100%; display: inline-block; margin-bottom: 20px;\">\r\n"
						+ "                <img src='cid:logoImage' style=\"width: 90px;\">\r\n"
						+ "            </div>\r\n"
						+ "            <div style=\"width: 100%; display: inline-block;\">\r\n"
						+ "                <h1 style=\"color: #202124; font-size: 22px; font-weight: 400;\">New Meeting Request.</h1>\r\n"
						+ "                <p style=\"font-size: 14px; line-height: 1.75; color: #313745;\">Hi "
						+ recipientName + "</p>\r\n"
						+ "                <p style=\"font-size: 14px; line-height: 1.75; color: #313745;\">You have a new meeting request! Please view the full details of the meeting mentioned below.</p>\r\n"
						+ "                <p style=\"font-size: 14px; line-height: 1.75; color: #313745;\">Learner Name - "
						+ name + "<br>Topic - " + topic + "<br>Meeting Slot - " + slot + "</p>\r\n"
						+ "                <p style=\"font-size: 14px; line-height: 1.75; color: #313745;\">Use this link to accept the request - <a href=\""
						+ link + "\">Go to Dashboard</a></p>\r\n"
						+ "                <p style=\"font-size: 14px; line-height: 1.75; color: #313745;\">Have a productive discussion!<br /><br>Regards,<br><br />Team FellowGenius</p>\r\n"
						+ "                <hr style=\"margin: 25px 0; border-top: 1px solid #f7f7f7;\">\r\n"
						+ "                <p style=\"text-align: center; font-size: 14px; color: #B5B3B3; margin-bottom: 0;\">Questions? <span style=\"color: #EC008C;\">We're here to help.</span></p>\r\n"
						+ "            </div>\r\n" + "        </div>\r\n" + "    </div>\r\n" + "</body>\r\n"
						+ "</html>";

//				message.setContent("<html><head> <link rel=\"stylesheet\" href=\"https://maxcdn.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css\"/> <style>.Box{box-shadow: 0 8px 16px 0 #90a4ae; width: 100%; height: auto; text-align: center; padding: 20px; margin-top: 10px; background: url(https://fellowgenius.com/search_right_bg.7af30faa440a7e6ab2bb.svg) no-repeat; background-size: contain; border: 1px solid #7d0f7d; border-radius: 8px; width: 650px; margin: 0 auto; background-position: left top;}.logo{background: url(https://fellowgenius.com/logo.2dbc598173218fe92921.svg) no-repeat; background-size: contain; height: 100px; display: block; float: right; width: 100px;}tr{padding: 10px;}td{padding: 5px; margin-right: 5px;}</style></head><body> <div class=\"Box\"> <div class=\"box-header\"> <span class=\"logo\"></span> <span style=\"margin-bottom: 20px;color:#892687;width:100%;text-align: center;font-size:16px;font-weight:bold;text-transform: uppercase;\">New appointment Request</span> </div><div style=\"padding:20px;width: 350px; margin: 0 auto;\">"
//						+ " <table> <tr> <td><b>Learner Name</b><br>"+booking.getStudentName()+"</td><td><b>"+booking.getDateOfMeeting()+"</b><br>04/06/2020</td></tr><tr> <td><b>Start Time</b><br>"+ booking.getStartTimeHour() + ":"+ booking.getStartTimeMinute() +"</td><td><b>Duration</b><br>"+booking.getDuration()+"</td></tr></table> </div><p style=\"margin-top: 30px; font-size: 10px; text-align: center; width: 100%;\">This is an auto-generated message please don't reply back.</p></div><div class=\"container-fluid\"> <div class=\"row\"> <div class=\"col-sm-2\"></div><div class=\"col-sm-7\"> </div><div class=\"com-sm-3\"></div></div></div></body></html>","text/html");
				helper.setText(mailContent, true);
				ClassPathResource resource = new ClassPathResource("logo.png");
				helper.addInline("logoImage", resource);
				Transport.send(message);

			} else if (booking.getApprovalStatus().equals("Accepted")) {
				StudentProfile stuProfile = userDao.getStudentProfile(id);
				helper.setTo(stuProfile.getEmail());

				String recipientName = booking.getStudentName();
				String name = booking.getTutorName();
				String topic = booking.getSubject() + " : " + booking.getDomain();
				String startTime = "";
				String link = rootUrl + "home/student-dashboard";
				if (booking.getStartTimeMinute().equals(0)) {
					startTime += booking.getStartTimeHour();
					startTime += ":00";
				} else {
					startTime += booking.getStartTimeHour();
					startTime += ":" + booking.getStartTimeMinute();
				}

				String slot = booking.getDateOfMeeting() + " at " + startTime;
				helper.setSubject("FellowGenius Meeting Request Accepted !");
				String mailContent = "<html>\r\n" + "\r\n" + "<head>\r\n" + "\r\n" + "</head>\r\n" + "\r\n"
						+ "<body>\r\n" + "\r\n" + "    <body>\r\n"
						+ "        <div style=\"width:100%; background-color: #F7F7F7; display: inline-block; font-family: 'Roboto', sans-serif;\">\r\n"
						+ "            <div style=\"max-width: 500px; height: auto; background-color: #fff; border-radius: 20px; padding: 30px; margin: 3em auto;\">\r\n"
						+ "                <div style=\"width: 100%; display: inline-block; margin-bottom: 20px;\">\r\n"
						+ "                    <img src='cid:logoImage' style=\"width: 90px;\">\r\n"
						+ "                </div>\r\n"
						+ "                <div style=\"width: 100%; display: inline-block;\">\r\n"
						+ "                    <h1 style=\"color: #202124; font-size: 22px; font-weight: 400;\">Expert has accepted the meeting request.</h1>\r\n"
						+ "                    <p style=\"font-size: 14px; line-height: 1.75; color: #313745;\">Hi "
						+ recipientName + "</p>\r\n"
						+ "                    <p style=\"font-size: 14px; line-height: 1.75; color: #313745;\">Thank you for booking a meeting with FellowGenius. Please view the full details of your\r\n"
						+ "meeting below. Ensure to check the details carefully and notify us of any errors.</p>\r\n"
						+ "                    <p style=\"font-size: 14px; line-height: 1.75; color: #313745;\">Expert Name - "
						+ name + "<br>Topic - " + topic + "<br>Meeting Slot - " + slot + "<br>Amount - ₹"
						+ booking.getAmount() + "</p>\r\n"
						+ "                    <p style=\"font-size: 14px; line-height: 1.75; color: #313745;\">Use this link to connect - <a href=\""
						+ link + "\">Go to Dashboard</a></p>\r\n"
						+ "                    <p style=\"font-size: 14px; line-height: 1.75; color: #313745;\">Have a productive discussion!<br /><br>Regards,<br><br />Team FellowGenius</p>\r\n"
						+ "                    <hr style=\"margin: 25px 0; border-top: 1px solid #f7f7f7;\">\r\n"
						+ "                    <p style=\"text-align: center; font-size: 14px; color: #B5B3B3; margin-bottom: 0;\">Questions? <span style=\"color: #EC008C;\">We're here to help.</span></p>\r\n"
						+ "                </div>\r\n" + "            </div>\r\n" + "        </div>\r\n"
						+ "    </body>\r\n" + "</body>\r\n" + "\r\n" + "</html>";
				helper.setText(mailContent, true);
//				message.setContent("<html><head> <link rel=\"stylesheet\" href=\"https://maxcdn.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css\"/> <style>.Box{box-shadow: 0 8px 16px 0 #90a4ae; width: 100%; height: auto; text-align: center; padding: 20px; margin-top: 10px; background: url(https://fellowgenius.com/search_right_bg.7af30faa440a7e6ab2bb.svg) no-repeat; background-size: contain; border: 1px solid #7d0f7d; border-radius: 8px; width: 650px; margin: 0 auto; background-position: left top;}.logo{background: url(https://fellowgenius.com/logo.2dbc598173218fe92921.svg) no-repeat; background-size: contain; height: 100px; display: block; float: right; width: 100px;}tr{padding: 10px;}td{padding: 5px; margin-right: 5px;}</style></head><body> <div class=\"Box\"> <div class=\"box-header\"> <span class=\"logo\"></span> <span style=\"margin-bottom: 20px;color:#892687;width:100%;text-align: center;font-size:16px;font-weight:bold;text-transform: uppercase;\"> Request Accepted !</span> </div><div style=\"padding:20px;width: 350px; margin: 0 auto;\">"
//						+ " <table> <tr> <td><b>Expert Name</b><br>"+booking.getTutorName()+"</td><td><b>Date</b><br>"+booking.getDateOfMeeting()+"</td></tr><tr> <td><b>Start Time</b><br>"+booking.getStartTimeHour() + ":"+ booking.getStartTimeMinute() +"</td><td><b>Duration</b><br>"+booking.getDuration()+"</td></tr></table> </div><p style=\"margin-top: 30px; font-size: 10px; text-align: center; width: 100%;\">This is an auto-generated message please don't reply back.</p></div><div class=\"container-fluid\"> <div class=\"row\"> <div class=\"col-sm-2\"></div><div class=\"col-sm-7\"> </div><div class=\"com-sm-3\"></div></div></div></body></html>","text/html");
				ClassPathResource resource = new ClassPathResource("logo.png");
				helper.addInline("logoImage", resource);
				Transport.send(message);

			} else if (booking.getApprovalStatus().equals("live")) {
				StudentProfile stuProfile = userDao.getStudentProfile(id);

				helper.setTo(stuProfile.getEmail());
				String recipientName = booking.getStudentName();
				String name = booking.getTutorName();
				String topic = booking.getSubject() + " : " + booking.getDomain();
				String startTime = "";
				String link = rootUrl + "home/student-dashboard";
				if (booking.getStartTimeMinute().equals(0)) {
					startTime += booking.getStartTimeHour();
					startTime += ":00";
				} else {
					startTime += booking.getStartTimeHour();
					startTime += ":" + booking.getStartTimeMinute();
				}

				String slot = booking.getDateOfMeeting() + " at " + startTime;
				helper.setSubject("FellowGenius Appointment Notification !");
				String mailContent = "<html>\r\n" + "\r\n" + "<head>\r\n"
						+ "    <link rel=\"stylesheet\" href=\"https://maxcdn.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css\" />\r\n"
						+ "</head>\r\n" + "\r\n" + "<body>\r\n"
						+ "    <div style=\"width:100%; background-color: #F7F7F7; display: inline-block; font-family: 'Roboto', sans-serif;\">\r\n"
						+ "        <div style=\"max-width: 500px; height: auto; background-color: #fff; border-radius: 20px; padding: 30px; margin: 3em auto;\">\r\n"
						+ "            <div style=\"width: 100%; display: inline-block; margin-bottom: 20px;\">\r\n"
						+ "                <img src='cid:logoImage' style=\"width: 90px;\">\r\n"
						+ "            </div>\r\n"
						+ "            <div style=\"width: 100%; display: inline-block;\">\r\n"
						+ "                <h1 style=\"color: #202124; font-size: 22px; font-weight: 400;\">Expert has started the meeting.</h1>\r\n"
						+ "                <p style=\"font-size: 14px; line-height: 1.75; color: #313745;\">Hi "
						+ recipientName + "</p>\r\n"
						+ "                <p style=\"font-size: 14px; line-height: 1.75; color: #313745;\">This is to notify that expert has started the meeting. Please view the full details of the meeting mentioned below.</p>\r\n"
						+ "                <p style=\"font-size: 14px; line-height: 1.75; color: #313745;\">Expert Name - "
						+ name + "<br>Topic - " + topic + "<br>Meeting Slot - " + slot + "</p>\r\n"
						+ "                <p style=\"font-size: 14px; line-height: 1.75; color: #313745;\">Use this link to connect - <a href=\""
						+ link + "\">Go to Dashboard</a></p>\r\n"
						+ "                <p style=\"font-size: 14px; line-height: 1.75; color: #313745;\">Have a productive discussion!<br /><br>Regards,<br><br />Team FellowGenius</p>\r\n"
						+ "                <hr style=\"margin: 25px 0; border-top: 1px solid #f7f7f7;\">\r\n"
						+ "                <p style=\"text-align: center; font-size: 14px; color: #B5B3B3; margin-bottom: 0;\">Questions? <span style=\"color: #EC008C;\">We're here to help.</span></p>\r\n"
						+ "            </div>\r\n" + "        </div>\r\n" + "    </div>\r\n" + "</body>\r\n" + "\r\n"
						+ "</html>";
//				message.setContent("<html><head> <link rel=\"stylesheet\" href=\"https://maxcdn.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css\"/> <style>.Box{box-shadow: 0 8px 16px 0 #90a4ae; width: 100%; height: auto; text-align: center; padding: 20px; margin-top: 10px; background: url(https://fellowgenius.com/search_right_bg.7af30faa440a7e6ab2bb.svg) no-repeat; background-size: contain; border: 1px solid #7d0f7d; border-radius: 8px; width: 650px; margin: 0 auto; background-position: left top;}.logo{background: url(https://fellowgenius.com/logo.2dbc598173218fe92921.svg) no-repeat; background-size: contain; height: 100px; display: block; float: right; width: 100px;}tr{padding: 10px;}td{padding: 5px; margin-right: 5px;}</style></head><body> <div class=\"Box\"> <div class=\"box-header\"> <span class=\"logo\"></span> <span style=\"margin-bottom: 20px;color:#892687;width:100%;text-align: center;font-size:16px;font-weight:bold;text-transform: uppercase;\"> Tutor has started the meeting </span> </div><div style=\"padding:20px;width: 350px; margin: 0 auto;\"> <table> <tr> <td><b>Tutor Name</b><br>"+booking.getTutorName()+"</td><td><b>Date</b><br>"+booking.getDateOfMeeting()+"</td></tr><tr> <td><b>Start Time</b><br>"+booking.getStartTimeHour()+":"+booking.getStartTimeMinute()+"</td><td><b>Duration</b><br>"+booking.getDuration()+" Minutes</td></tr></table> </div><p style=\"margin-top: 30px; font-size: 10px; text-align: center; width: 100%;\">This is an auto-generated message please don't reply back.</p></div><div class=\"container-fluid\"> <div class=\"row\"> <div class=\"col-sm-2\"></div><div class=\"col-sm-7\"> </div><div class=\"com-sm-3\"></div></div></div></body></html>","text/html");
				ClassPathResource resource = new ClassPathResource("logo.png");
				helper.addInline("logoImage", resource);
				helper.setText(mailContent, true);
				Transport.send(message);

				System.out.println("Email sent successfully....");

			}
		} catch (MessagingException e) {
			e.printStackTrace();
			throw new RuntimeException(e);
		}

	}

	String generateTokenForMail(String id, String role) {
		return jwtUtil.generateToken(id, role);
	}

	void sendRequestToReschedule(BookingDetails booking) {
		InitiateMailService();
		try {
			MimeMessage message = new MimeMessage(session);
			MimeMessageHelper helper = new MimeMessageHelper(message, true);

			ClassPathResource resource = new ClassPathResource("logo.png");
			helper.addInline("logoImage", resource);

			final String token = generateTokenForMail(booking.getStudentId().toString(), "Learner");
			String cancelUrl = rootUrl + "cancel-booking?token=" + token + "&bid=" + booking.getBid();
			String rescheduleUrl = rootUrl + "reschedule-booking?token=" + token + "&bid=" + booking.getBid() + "&tid="
					+ booking.getTutorId();
			StudentProfile stuProfile = userDao.getStudentProfile(booking.getStudentId());
			String to = stuProfile.getEmail();
			helper.setFrom(senderEmail);
			helper.setTo(to);
			helper.setSubject("FellowGenius Meeting Re-schedule Request");
			String topic = booking.getSubject() + " : " + booking.getDomain();
			String mailContent = "<html>\r\n" + "  <head> </head>\r\n" + "\r\n" + "  <body>\r\n" + "    <div\r\n"
					+ "      style=\"\r\n" + "        width: 100%;\r\n" + "        background-color: #f7f7f7;\r\n"
					+ "        display: inline-block;\r\n" + "        font-family: 'Roboto', sans-serif;\r\n"
					+ "      \"\r\n" + "    >\r\n" + "      <div\r\n" + "        style=\"\r\n"
					+ "          max-width: 500px;\r\n" + "          height: auto;\r\n"
					+ "          background-color: #fff;\r\n" + "          border-radius: 20px;\r\n"
					+ "          padding: 30px;\r\n" + "          margin: 3em auto;\r\n" + "        \"\r\n"
					+ "      >\r\n"
					+ "        <div style=\"width: 100%; display: inline-block; margin-bottom: 20px\">\r\n"
					+ "          <img src='cid:logoImage' style=\"width: 90px\" />\r\n" + "        </div>\r\n"
					+ "        <div style=\"width: 100%; display: inline-block\">\r\n"
					+ "          <h1 style=\"color: #202124; font-size: 22px; font-weight: 400\">\r\n"
					+ "            Expert has requested to reschedule.\r\n" + "          </h1>\r\n"
					+ "          <p style=\"font-size: 14px; line-height: 1.75; color: #313745\">Hi</p>\r\n"
					+ "          <p style=\"font-size: 14px; line-height: 1.75; color: #313745\">\r\n"
					+ "            Your expert " + booking.getTutorName() + " for session on " + topic + " has\r\n"
					+ "            requested to reschedule it to the next available slot.<br />Please\r\n"
					+ "            click on the link below to check " + booking.getTutorName()
					+ "'s updated schedule\r\n" + "          </p>\r\n"
					+ "          <p style=\"font-size: 14px; line-height: 1.75; color: #313745\">\r\n"
					+ "            <a href=\"" + rescheduleUrl + "\">Expert availablity schedule</a>\r\n"
					+ "          </p>\r\n"
					+ "          <p style=\"font-size: 14px; line-height: 1.75; color: #313745\">\r\n"
					+ "            In case of non-availability of time slots, please cancel this\r\n"
					+ "            session and select somebody else from our curated set of experts to\r\n"
					+ "            help you. <br> <a href=\"" + cancelUrl + "\">cancel meeting</a>\r\n"
					+ "          </p>\r\n"
					+ "          <p style=\"font-size: 14px; line-height: 1.75; color: #313745\">\r\n"
					+ "            Apologies for the inconvenience caused. In case of cancellation,\r\n"
					+ "            your money would be refunded within 7 working days to your orignal\r\n"
					+ "            mode of payment.<br /><br>Regards,<br><br />Team FellowGenius\r\n"
					+ "          </p>\r\n"
					+ "          <hr style=\"margin: 25px 0; border-top: 1px solid #f7f7f7\" />\r\n"
					+ "          <p\r\n" + "            style=\"\r\n" + "              text-align: center;\r\n"
					+ "              font-size: 14px;\r\n" + "              color: #b5b3b3;\r\n"
					+ "              margin-bottom: 0;\r\n" + "            \"\r\n" + "          >\r\n"
					+ "            Questions? <span style=\"color: #ec008c\">We're here to help.</span>\r\n"
					+ "          </p>\r\n" + "        </div>\r\n" + "      </div>\r\n" + "    </div>\r\n"
					+ "  </body>\r\n" + "</html>";
			helper.setText(mailContent, true);
			Transport.send(message);

		} catch (MessagingException e) {
			e.printStackTrace();
			throw new RuntimeException(e);
		}
	}

	boolean sendVerifiedMail(String email) {
		InitiateMailService();
		Users user = repUsers.emailExist(email);
		TutorProfile tutor = repTutorProfile.idExist(user.getUserId());
		if (user != null) {
			String token = generateTokenForMail(user.getUserId().toString(), "Expert");
			String directUrl = rootUrl + "sign-up-expert?token=" + token;
			String faqUrl = rootUrl + "faq";
			String to = email;
			String recipientName = tutor.getFullName();
			try {
				MimeMessage message = new MimeMessage(session);
				MimeMessageHelper helper = new MimeMessageHelper(message, true);

				helper.setFrom(senderEmail);
				helper.setTo(to);
				helper.setSubject("Welcome to FellowGenius");
				String mailContent = "<html>\r\n" + "    <head>\r\n" + "    </head>\r\n" + "<body>\r\n"
						+ "    <body>\r\n"
						+ "        <div style=\"width:100%; background-color: #F7F7F7; display: inline-block; font-family: 'Roboto', sans-serif;\">\r\n"
						+ "            <div style=\"max-width: 500px; height: auto; background-color: #fff; border-radius: 20px; padding: 30px; margin: 3em auto;\">\r\n"
						+ "                <div style=\"width: 100%; display: inline-block; margin-bottom: 20px;\">\r\n"
						+ "                    <img src='cid:logoImage' style=\"width: 90px;\">\r\n"
						+ "                </div>\r\n"
						+ "                <div style=\"width: 100%; display: inline-block;\">\r\n"
						+ "                    <h1 style=\"color: #202124; font-size: 22px; font-weight: 400;\">Expert Profile Verified.</h1>\r\n"
						+ "                    <p style=\"font-size: 14px; line-height: 1.75; color: #313745;\">Dear "
						+ recipientName + "</p>\r\n"
						+ "                    <p style=\"font-size: 14px; line-height: 1.75; color: #313745;\">We welcome you to the esteemed community of FellowGenius experts\r\n"
						+ "                    </p>\r\n"
						+ "                    <p style=\"font-size: 14px; line-height: 1.75; color: #313745;\">Please take a few minutes to choose to your password in order to complete your profile and set your available timeslot. This will help the learners to discover you faster and connect easily</p>\r\n"
						+ "                    <p style=\"font-size: 14px; line-height: 1.75; color: #313745;\">Use this link to start - <a href=\""
						+ directUrl + "\">Choose password</a></p>\r\n"
						+ "                    <p style=\"font-size: 14px; line-height: 1.75; color: #313745;\">Meanwhile, you can check out these links <a href=\""
						+ faqUrl
						+ "\">FAQ</a> to know more about FellowGenius.<br /><br>Regards,<br><br />Team FellowGenius</p>\r\n"
						+ "                    <hr style=\"margin: 25px 0; border-top: 1px solid #f7f7f7;\">\r\n"
						+ "                    <p style=\"text-align: center; font-size: 14px; color: #B5B3B3; margin-bottom: 0;\">Questions? <span style=\"color: #EC008C;\">We're here to help.</span></p>\r\n"
						+ "                </div>\r\n" + "            </div>\r\n" + "        </div>\r\n"
						+ "    </body>\r\n" + "</body>\r\n" + "</html>";
				
				helper.setText(mailContent, true);
				ClassPathResource resource = new ClassPathResource("logo.png");
				helper.addInline("logoImage", resource);
				Transport.send(message);

			} catch (MessagingException e) {
				e.printStackTrace();
				throw new RuntimeException(e);
			}
			return true;
		} else {
			return false;
		}
	}

	boolean sendResetMail(String email) {
		InitiateMailService();
		Users user = repUsers.emailExist(email);
		if (user != null) {
			String token = user.getUserId().toString();
			String directUrl = rootUrl + "reset-password?token=" + token;
			System.out.println(directUrl);
			String to = email;

			try {
				MimeMessage message = new MimeMessage(session);
				MimeMessageHelper helper = new MimeMessageHelper(message, true);

				
				helper.setFrom(senderEmail);
				helper.setTo(to);
				helper.setSubject("FellowGenius Password Reset");
				String mailContent = "<html>\r\n" + "  <head> </head>\r\n" + "\r\n" + "  <body>\r\n" + "    <div\r\n"
						+ "      style=\"\r\n" + "        width: 100%;\r\n" + "        background-color: #f7f7f7;\r\n"
						+ "        display: inline-block;\r\n" + "        font-family: 'Roboto', sans-serif;\r\n"
						+ "      \"\r\n" + "    >\r\n" + "      <div\r\n" + "        style=\"\r\n"
						+ "          max-width: 500px;\r\n" + "          height: auto;\r\n"
						+ "          background-color: #fff;\r\n" + "          border-radius: 20px;\r\n"
						+ "          padding: 30px;\r\n" + "          margin: 3em auto;\r\n" + "        \"\r\n"
						+ "      >\r\n"
						+ "        <div style=\"width: 100%; display: inline-block; margin-bottom: 20px\">\r\n"
						+ "          <img src='cid:logoImage' style=\"width: 90px\" />\r\n" + "        </div>\r\n"
						+ "        <div style=\"width: 100%; display: inline-block\">\r\n"
						+ "          <p style=\"font-size: 14px; line-height: 1.75; color: #313745\">Hi</p>\r\n"
						+ "          <p style=\"font-size: 14px; line-height: 1.75; color: #313745\">\r\n"
						+ "            Request for resetting your password has been generated.<br />Kindly\r\n"
						+ "            reset your password by clicking the link below.\r\n" + "          </p>\r\n"
						+ "          <p style=\"font-size: 14px; line-height: 1.75; color: #313745\">\r\n"
						+ "            <a href=\"" + directUrl + "\">Reset your password</a>\r\n" + "          </p>\r\n"
						+ "          <p style=\"font-size: 14px; line-height: 1.75; color: #313745\">\r\n"
						+ "            <br />Regards,<br />Team FellowGenius\r\n" + "          </p>\r\n"
						+ "          <hr style=\"margin: 25px 0; border-top: 1px solid #f7f7f7\" />\r\n"
						+ "          <p\r\n" + "            style=\"\r\n" + "              text-align: center;\r\n"
						+ "              font-size: 14px;\r\n" + "              color: #b5b3b3;\r\n"
						+ "              margin-bottom: 0;\r\n" + "            \"\r\n" + "          >\r\n"
						+ "            Questions? <span style=\"color: #ec008c\">We're here to help.</span>\r\n"
						+ "          </p>\r\n" + "        </div>\r\n" + "      </div>\r\n" + "    </div>\r\n"
						+ "  </body>\r\n" + "</html>\r\n";
				helper.setText(mailContent, true);
				ClassPathResource resource = new ClassPathResource("logo.png");
				helper.addInline("logoImage", resource);
				Transport.send(message);

			} catch (MessagingException e) {
				e.printStackTrace();
				throw new RuntimeException(e);
			}
			return true;
		} else {
			return false;
		}
	}

}
