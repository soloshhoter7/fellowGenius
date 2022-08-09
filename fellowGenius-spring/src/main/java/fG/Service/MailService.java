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
import org.springframework.core.env.Environment;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import fG.Configuration.JwtUtil;
import fG.DAO.Dao;
import fG.Entity.BookingDetails;
import fG.Entity.StudentProfile;
import fG.Entity.TutorProfile;
import fG.Entity.Users;
import fG.Model.ContactUsModel;
import fG.Repository.repositoryStudentProfile;
import fG.Repository.repositoryTutorProfile;
import fG.Repository.repositoryUsers;

@Service
public class MailService {

	@Autowired
	Dao userDao;

	@Autowired
	repositoryUsers repUsers;
	
	@Autowired
	repositoryStudentProfile repStudentProfile;

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
	
	@Autowired
	private Environment env;

	static Properties props;
	static Session session;

	void InitiateMailService(String email) {
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
	}
	boolean isGmail(String email) {
		if(email!=null) {
            return email.contains("@gmail");
		}
		return false;
	}
	// For sending OTP verification email
	void sendVerificationEmail(String email, String otp) {
		InitiateMailService("registration@fellowgenius.com");
		String from ="registration@fellowgenius.com";
		String to = email;		
		if (session == null) {
			System.out.println("SESSION IS NULL");
		}
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
					+ "                <p style=\"text-align: center; font-size: 14px; color: #B5B3B3; margin-bottom: 0;\">Questions? "
					+ "<a style=\"color: #EC008C;\" href=\"mailto:support@fellowgenius.com\" >We're here to help.</a></p>\r\n"
					+ "            </div>\r\n" + "        </div>\r\n" + "    </div>\r\n" + "\r\n" + "</body>\r\n"
					+ "</html>";
			helper.setFrom(from);
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
		InitiateMailService("meetings@fellowgenius.com");
		String from = senderEmail;
		session = Session.getDefaultInstance(props, new javax.mail.Authenticator() {
			protected PasswordAuthentication getPasswordAuthentication() {
				return new PasswordAuthentication(from, senderPassword);
			}
		});
		try {
			MimeMessage message = new MimeMessage(session);
			MimeMessageHelper helper = new MimeMessageHelper(message, true);
//			String mailContent="<img src='cid:logoImage'/>";
			helper.setFrom(from);

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
						+ "                <p style=\"text-align: center; font-size: 14px; color: #B5B3B3; margin-bottom: 0;\">Questions? <a style=\"color: #EC008C;\" href=\"mailto:support@fellowgenius.com\" >We're here to help.</a></p>\r\n"
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
						+ name + "<br>Topic - " + topic + "<br>Meeting Slot - " + slot + "<br>Amount - INR "
						+ booking.getAmount() + "</p>\r\n"
						+ "                    <p style=\"font-size: 14px; line-height: 1.75; color: #313745;\">Use this link to connect - <a href=\""
						+ link + "\">Go to Dashboard</a></p>\r\n"
						+ "                    <p style=\"font-size: 14px; line-height: 1.75; color: #313745;\">Have a productive discussion!<br /><br>Regards,<br><br />Team FellowGenius</p>\r\n"
						+ "                    <hr style=\"margin: 25px 0; border-top: 1px solid #f7f7f7;\">\r\n"
						+ "                    <p style=\"text-align: center; font-size: 14px; color: #B5B3B3; margin-bottom: 0;\">Questions? <a style=\"color: #EC008C;\" href=\"mailto:support@fellowgenius.com\" >We're here to help.</a></p>\r\n"
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
						+ "                <p style=\"text-align: center; font-size: 14px; color: #B5B3B3; margin-bottom: 0;\">Questions? <a style=\"color: #EC008C;\" href=\"mailto:support@fellowgenius.com\" >We're here to help.</a></p>\r\n"
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
		InitiateMailService("meetings@fellowgenius.com");
		String from = senderEmail;
		session = Session.getDefaultInstance(props, new javax.mail.Authenticator() {
			protected PasswordAuthentication getPasswordAuthentication() {
				return new PasswordAuthentication(from, senderPassword);
			}
		});
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
			helper.setFrom(from);
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
					+ "            Questions? <a style=\"color: #EC008C;\" href=\"mailto:support@fellowgenius.com\" >We're here to help.</a>\r\n"
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
		InitiateMailService("registration@fellowgenius.com");
		String from = senderEmail;
		session = Session.getDefaultInstance(props, new javax.mail.Authenticator() {
			protected PasswordAuthentication getPasswordAuthentication() {
				return new PasswordAuthentication(from, senderPassword);
			}
		});
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
						+ "                    <p style=\"font-size: 14px; line-height: 1.75; color: #313745;\">Please take a few minutes to choose your password in order to complete your profile and set your available timeslot. This will help the learners to discover you faster and connect easily</p>\r\n"
						+ "                    <p style=\"font-size: 14px; line-height: 1.75; color: #313745;\">Use this link to start - <a href=\""
						+ directUrl + "\">Choose password</a></p>\r\n"
						+ "                    <p style=\"font-size: 14px; line-height: 1.75; color: #313745;\">Meanwhile, you can check out these links <a href=\""
						+ faqUrl
						+ "\">FAQ</a> to know more about FellowGenius.<br /><br>Regards,<br><br />Team FellowGenius</p>\r\n"
						+ "                    <hr style=\"margin: 25px 0; border-top: 1px solid #f7f7f7;\">\r\n"
						+ "                    <p style=\"text-align: center; font-size: 14px; color: #B5B3B3; margin-bottom: 0;\">Questions? <a style=\"color: #EC008C;\" href=\"mailto:support@fellowgenius.com\" >We're here to help.</a></p>\r\n"
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
	
	void sendRejectedMail(String email,String name) {
		InitiateMailService("registration@fellowgenius.com");
		String from = senderEmail;
		session = Session.getDefaultInstance(props, new javax.mail.Authenticator() {
			protected PasswordAuthentication getPasswordAuthentication() {
				return new PasswordAuthentication(from, senderPassword);
			}
		});
		
			String Url = rootUrl;
			String to = email;
			String recipientName = name;
			try {
				MimeMessage message = new MimeMessage(session);
				MimeMessageHelper helper = new MimeMessageHelper(message, true);

				helper.setFrom(senderEmail);
				helper.setTo(to);
				helper.setSubject("FellowGenius Application Status Update");
				String mailContent = "<html>\r\n" + 
						"    <head>\r\n" + 
						"    </head>\r\n" + 
						"<body>\r\n" + 
						"    <body>\r\n" + 
						"        <div style=\"width:100%; background-color: #F7F7F7; display: inline-block; font-family: 'Roboto', sans-serif;\">\r\n" + 
						"            <div style=\"max-width: 500px; height: auto; background-color: #fff; border-radius: 20px; padding: 30px; margin: 3em auto;\">\r\n" + 
						"                <div style=\"width: 100%; display: inline-block; margin-bottom: 20px;\">\r\n" + 
						"                    <img src=\"cid:logoImage\" style=\"width: 90px;\">\r\n" + 
						"                </div>\r\n" + 
						"                <div style=\"width: 100%; display: inline-block;\">\r\n" + 
						"                    <p style=\"font-size: 14px; line-height: 1.75; color: #313745;\">Dear "+recipientName+"</p>\r\n" + 
						"                    <p style=\"font-size: 14px; line-height: 1.75; color: #313745;\">We appreciate your interest in FellowGenius and the time you invested in sharing your details with us.\r\n" + 
						"                    </p>\r\n" + 
						"                    <p style=\"font-size: 14px; line-height: 1.75; color: #313745;\">Based on the screening of the details provided by you, we regret to inform you that we will not be able to take your request to enroll as the FellowGenius's expert.\r\n" + 
						"                      <br> <br> We will retain your information in our active database and connect with you should a suitable opportunity arise.\r\n" + 
						"                        </p>\r\n" + 
						"                    <p style=\"font-size: 14px; line-height: 1.75; color: #313745;\">Till then, Visit FellowGenius and Interact with experts from your domain in just a click!!<br><a href=\""+Url+"\">FellowGenius</a></p>\r\n" + 
						"                    <p style=\"font-size: 14px; line-height: 1.75; color: #313745;\"><br>Regards,<br>Team FellowGenius</p>\r\n" + 
						"                    <hr style=\"margin: 25px 0; border-top: 1px solid #f7f7f7;\">\r\n" + 
						"                </div>\r\n" + 
						"            </div>\r\n" + 
						"        </div>\r\n" + 
						"    </body>\r\n" + 
						"</body>\r\n" + 
						"</html>";
				
				helper.setText(mailContent, true);
				ClassPathResource resource = new ClassPathResource("logo.png");
				helper.addInline("logoImage", resource);
				Transport.send(message);

			} catch (MessagingException e) {
				e.printStackTrace();
				throw new RuntimeException(e);
			}
		
	}
	boolean sendResetMail(String email) {
		InitiateMailService("support@fellowgenius.com");
		String from = senderEmail;
		session = Session.getDefaultInstance(props, new javax.mail.Authenticator() {
			protected PasswordAuthentication getPasswordAuthentication() {
				return new PasswordAuthentication(from, senderPassword);
			}
		});
		Users user = repUsers.emailExist(email);
		if (user != null) {
			String token = user.getUserId().toString();
			String directUrl = rootUrl + "reset-password?token=" + token;
			System.out.println(directUrl);
			String to = email;

			try {
				MimeMessage message = new MimeMessage(session);
				MimeMessageHelper helper = new MimeMessageHelper(message, true);

				
				helper.setFrom(from);
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
						+ "            Questions? <a style=\"color: #EC008C;\" href=\"mailto:support@fellowgenius.com\" >We're here to help.</a>\r\n"
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
	
	void ReferConfirmationMail(String from,String referrerEmail,String referCode,String directUrl) {
		try {
			MimeMessage message = new MimeMessage(session);
			MimeMessageHelper helper = new MimeMessageHelper(message, true);

			
			helper.setFrom(from);
			helper.setTo(referrerEmail);
			helper.setSubject("Your Refer code invite sent to others ");
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
					+ "          <p style=\"font-size: 14px; line-height: 1.75; color: #313745\">Below text sent to email adresses you referred</p><br />\r\n"
					+ "          <p style=\"font-size: 14px; line-height: 1.75; color: #313745\">Hi there,</p>\r\n"
					+ "          <p style=\"font-size: 14px; line-height: 1.75; color: #313745\">\r\n"
					+ "           Are you looking for expert advice for your on-going project at work? Join the FellowGenius community and connect with experts across domains for help and support.</p>\r\n"
					+ "          <p style=\"font-size: 14px; line-height: 1.75; color: #313745\">\r\n"
					+ "			  To make learning more rewarding, use the referral code below while signing up and earn rewards worth INR 200 when you complete your 1st session with a FellowGenius expert.</p>\r\n"
					+ "			 <br />	"		
					+ " <div style=\"width: 94%; background-color: #F7F7F7; display: inline-block; padding: 8px; text-align: center; border-radius: 15px; font-size: 40px; font-weight: 400; color: #202124; letter-spacing: 2px;\">"
					+ referCode + "</div> <br />\r\n"
					
					+ "          <p style=\"font-size: 14px; line-height: 1.75; color: #313745\">\r\n"
					+ "          Click <a href=\"" + directUrl + "\">here</a>\r\n" + " to sign up now.  </p>\r\n"
					+ "          <p style=\"font-size: 14px; line-height: 1.75; color: #313745\">\r\n"
					+ "            <br />"
					+ "Regards,<br />Team FellowGenius\r\n" + "          </p>\r\n"
					+ "          <hr style=\"margin: 25px 0; border-top: 1px solid #f7f7f7\" />\r\n"
					+ "          <p\r\n" + "            style=\"\r\n" + "              text-align: center;\r\n"
					+ "              font-size: 14px;\r\n" + "              color: #b5b3b3;\r\n"
					+ "              margin-bottom: 0;\r\n" + "            \"\r\n" + "          >\r\n"
					+ "            Questions? <a style=\"color: #EC008C;\" href=\"mailto:support@fellowgenius.com\" >Hurry, join the FellowGenius community now!!</a>\r\n"
					+ "          </p>\r\n" + "        </div>\r\n" + "      </div>\r\n" + "    </div>\r\n"
					+ "  </body>\r\n" + "</html>\r\n";
			helper.setText(mailContent, true);
			ClassPathResource resource = new ClassPathResource("logo.png");
			helper.addInline("logoImage", resource);
			Transport.send(message);

		}catch(MessagingException e) {
			e.printStackTrace();
			throw new RuntimeException(e);
		}

	}
	
	void ReferInviteMail(String from,String to,String senderName, String referCode,String directUrl) {
		try {
			MimeMessage message = new MimeMessage(session);
			MimeMessageHelper helper = new MimeMessageHelper(message, true);

			
			helper.setFrom(from);
			helper.setTo(to);
			helper.setSubject(senderName+" has referred you to FellowGenius. Join Now!!");
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
					+ "          <p style=\"font-size: 14px; line-height: 1.75; color: #313745\">Hi There,</p>\r\n"
					+ "          <p style=\"font-size: 14px; line-height: 1.75; color: #313745\">\r\n"
					+ "           Are you looking for expert advice for your on-going project at work? Join the FellowGenius community and connect with experts across domains for help and support.</p>\r\n"
					+ "          <p style=\"font-size: 14px; line-height: 1.75; color: #313745\">\r\n"
					+ "			  To make learning more rewarding, use the referral code below while signing up and earn rewards worth INR 200 when you complete your 1st session with a FellowGenius expert.</p>\r\n"
					+ "			 <br />	"		
					+ " <div style=\"width: 94%; background-color: #F7F7F7; display: inline-block; padding: 8px; text-align: center; border-radius: 15px; font-size: 40px; font-weight: 400; color: #202124; letter-spacing: 2px;\">"
					+ referCode + "</div> <br />\r\n"
					
					+ "          <p style=\"font-size: 14px; line-height: 1.75; color: #313745\">\r\n"
					+ "          Click <a href=\"" + directUrl + "\">here</a>\r\n" + " to sign up now.  </p>\r\n"
					+ "          <p style=\"font-size: 14px; line-height: 1.75; color: #313745\">\r\n"
					+ "            <br />"
					+ "Regards,<br />Team FellowGenius\r\n" + "          </p>\r\n"
					+ "          <hr style=\"margin: 25px 0; border-top: 1px solid #f7f7f7\" />\r\n"
					+ "          <p\r\n" + "            style=\"\r\n" + "              text-align: center;\r\n"
					+ "              font-size: 14px;\r\n" + "              color: #b5b3b3;\r\n"
					+ "              margin-bottom: 0;\r\n" + "            \"\r\n" + "          >\r\n"
					+ "            Questions? <a style=\"color: #EC008C;\" href=\"mailto:support@fellowgenius.com\" >Hurry, join the FellowGenius community now!!</a>\r\n"
					+ "          </p>\r\n" + "        </div>\r\n" + "      </div>\r\n" + "    </div>\r\n"
					+ "  </body>\r\n" + "</html>\r\n";
			helper.setText(mailContent, true);
			ClassPathResource resource = new ClassPathResource("logo.png");
			helper.addInline("logoImage", resource);
			Transport.send(message);

		}catch(MessagingException e) {
			e.printStackTrace();
			throw new RuntimeException(e);
		}

	}
	
	boolean sendReferInviteMail(String[] users,String referCode,String referrerEmail) {
		System.out.println("Inside mail service method of referInvite");
		InitiateMailService("support@fellowgenius.com");
		String from = senderEmail;
		session = Session.getDefaultInstance(props, new javax.mail.Authenticator() {
			protected PasswordAuthentication getPasswordAuthentication() {
				return new PasswordAuthentication(from, senderPassword);
			}
		});
		boolean result=true;
		
		String directUrl=rootUrl+"sign-up?pt=MA";
		
		System.out.println(directUrl);
		
		//send email to all user one by one
		Users userObj=repUsers.emailExist(referrerEmail);
		System.out.println(userObj.toString());
		if(userObj!=null) {
			String senderFullName="";
			if(userObj.getRole().equals("Learner")) {
				StudentProfile student=repStudentProfile.emailExist(referrerEmail);
				senderFullName=student.getFullName();
			}else if(userObj.getRole().equals("Expert")) {
				TutorProfile tutor=repTutorProfile.emailExist(referrerEmail);
				senderFullName=tutor.getFullName();
			}else {
				System.out.println("Invalid user");
				result=false;
			}
			for(String user:users) {
				
				
				String to = user;
				ReferInviteMail(from, to, senderFullName, referCode, directUrl);
			}
			
			//after this send a confirmation mail to sender that referred mail has been sent	
			ReferConfirmationMail(from, referrerEmail, referCode, senderFullName);
		}
		
		return result;
	}

	public void sendExpertNoScheduleNotification(TutorProfile expert) {
		InitiateMailService("support@fellowgenius.com");
		String from = senderEmail;
		session = Session.getDefaultInstance(props, new javax.mail.Authenticator() {
			protected PasswordAuthentication getPasswordAuthentication() {
				return new PasswordAuthentication(from, senderPassword);
			}
		});
		
			String Url = rootUrl+"home/tutor-schedule";
			String to = expert.getEmail();
			String recipientName = expert.getFullName();
			try {
				MimeMessage message = new MimeMessage(session);
				MimeMessageHelper helper = new MimeMessageHelper(message, true);

				helper.setFrom(senderEmail);
				helper.setTo(to);
				helper.setSubject("FellowGenius - Update Availability");
				String mailContent = "<html>\r\n" + 
						"    <head>\r\n" + 
						"    </head>\r\n" + 
						"<body>\r\n" + 
						"    <body>\r\n" + 
						"        <div style=\"width:100%; background-color: #F7F7F7; display: inline-block; font-family: 'Roboto', sans-serif;\">\r\n" + 
						"            <div style=\"max-width: 500px; height: auto; background-color: #fff; border-radius: 20px; padding: 30px; margin: 3em auto;\">\r\n" + 
						"                <div style=\"width: 100%; display: inline-block; margin-bottom: 20px;\">\r\n" + 
						"                    <img src=\"cid:logoImage\" style=\"width: 90px;\">\r\n" + 
						"                </div>\r\n" + 
						"                <div style=\"width: 100%; display: inline-block;\">\r\n" + 
						"                   \r\n" + 
						"                    <p style=\"font-size: 14px; line-height: 1.75; color: #313745;\">Dear "+recipientName+"</p>\r\n" + 
						"                    <p style=\"font-size: 14px; line-height: 1.75; color: #313745;\">Your profile is getting noticed!\r\n" + 
						"                    </p>\r\n" + 
						"                    <p style=\"font-size: 14px; line-height: 1.75; color: #313745;\">FellowGenius learners are trying to connect with you. Please update your availability using the calendar provided in your dashboard. You can also access the calendar by clicking <a href=\""+Url+"\">here</a></p>\r\n" + 
						"                    <p style=\"font-size: 14px; line-height: 1.75; color: #313745;\">Regards,<br>Team FellowGenius</p>\r\n" + 
						"                    <hr style=\"margin: 25px 0; border-top: 1px solid #f7f7f7;\">\r\n" + 
						"                    <p style=\"text-align: center; font-size: 14px; color: #B5B3B3; margin-bottom: 0;\">Questions? <a style=\"color: #EC008C;\" href=\"mailto:support@fellowgenius.com\" >We're here to help.</a></p>\r\n" + 
						"                </div>\r\n" + 
						"            </div>\r\n" + 
						"        </div>\r\n" + 
						"    </body>\r\n" + 
						"</body>\r\n" + 
						"</html>";
				
				helper.setText(mailContent, true);
				ClassPathResource resource = new ClassPathResource("logo.png");
				helper.addInline("logoImage", resource);
				Transport.send(message);

			} catch (MessagingException e) {
				e.printStackTrace();
				throw new RuntimeException(e);
			}
		
	}
	public void sendBlankEmail() {
		InitiateMailService("support@fellowgenius.com");
		String from = senderEmail;
		session = Session.getDefaultInstance(props, new javax.mail.Authenticator() {
			protected PasswordAuthentication getPasswordAuthentication() {
				return new PasswordAuthentication(from, senderPassword);
			}
		});
		
			String to = "navjeetkumar.007@gmail.com";
			try {
				MimeMessage message = new MimeMessage(session);
				MimeMessageHelper helper = new MimeMessageHelper(message, true);

				helper.setFrom(senderEmail);
				helper.setTo(to);
				helper.setSubject("FellowGenius - Get Rs 250 Cashback");
				String mailContent = "<html>\r\n" + 
						"    <head>\r\n" + 
						"    </head>\r\n" + 
						"<body>\r\n" + 
						"    <body>\r\n" + 
						"        <div style=\"width:100%; background-color: #F7F7F7; display: inline-block; font-family: 'Roboto', sans-serif;\">\r\n" + 
						"            <div style=\"max-width: 500px; height: auto; background-color: #fff; border-radius: 20px; padding: 30px; margin: 3em auto;\">\r\n" + 
						"                <div style=\"width: 100%; display: inline-block; margin-bottom: 20px;\">\r\n" + 
						"                    <img src=\"cid:logoImage\" style=\"width: 90px;\">\r\n" + 
						"                </div>\r\n" + 
						"                <div style=\"width: 100%; display: inline-block;\">\r\n" + 
						"                   \r\n" + 
						"                    <p style=\"font-size: 14px; line-height: 1.75; color: #313745;\">Hello Mr. Navjeet,</p>\r\n" + 
						"                    <p style=\"font-size: 14px; line-height: 1.75; color: #313745;\">Thank you for booking your 1st session with FellowGenius. We hope it was a productive session.\r\n" + 
						"                    </p>\r\n" + 
						"                    <p style=\"font-size: 14px; line-height: 1.75; color: #313745;\">For your next session on FellowGenius, use coupon code FG091001 and get INR 250 as cashback.<br><br>Coupon code is valid till 30th November 2021. A valid UPI id is required for processing the cashback amount</p>\r\n" + 
						"                    <p style=\"font-size: 14px; line-height: 1.75; color: #313745;\">Regards,<br>Team FellowGenius</p>\r\n" + 
						"                    <hr style=\"margin: 25px 0; border-top: 1px solid #f7f7f7;\">\r\n" + 
						"                    <p style=\"text-align: center; font-size: 14px; color: #B5B3B3; margin-bottom: 0;\">Questions? <a style=\"color: #EC008C;\" href=\"mailto:support@fellowgenius.com\" >We're here to help.</a></p>\r\n" + 
						"                </div>\r\n" + 
						"            </div>\r\n" + 
						"        </div>\r\n" + 
						"    </body>\r\n" + 
						"</body>\r\n" + 
						"</html>";
				
				helper.setText(mailContent, true);
				ClassPathResource resource = new ClassPathResource("logo.png");
				helper.addInline("logoImage", resource);
				Transport.send(message);

			} catch (MessagingException e) {
				e.printStackTrace();
				throw new RuntimeException(e);
			}
		
	}
	public void sendDiwaliMail(String email) {		
		InitiateMailService("support@fellowgenius.com");
		String from = senderEmail;
		session = Session.getDefaultInstance(props, new javax.mail.Authenticator() {
			protected PasswordAuthentication getPasswordAuthentication() {
				return new PasswordAuthentication(from, senderPassword);
			}
		});
		
			String to = email;
			try {
				MimeMessage message = new MimeMessage(session);
				MimeMessageHelper helper = new MimeMessageHelper(message, true);

				helper.setFrom(senderEmail);
				helper.setTo(to);
				helper.setSubject("Happy Diwali from FellowGenius");
				String mailContent = "<html>\r\n" + 
						"    <body>\r\n" + 
						"        <div>\r\n" + 
						"            <img src=\"cid:diwaliPost\" style=\"width: 500px;\" alt=\"\">\r\n" + 
						"        </div>\r\n" + 
						"    </body>\r\n" + 
						"</html>";
				
				helper.setText(mailContent, true);
				ClassPathResource resource = new ClassPathResource("diwali.png");
				helper.addInline("diwaliPost", resource);
//				ClassPathResource resource = new ClassPathResource("logo.png");
//				helper.addInline("logoImage", resource);
				Transport.send(message);

			} catch (MessagingException e) {
				e.printStackTrace();
				throw new RuntimeException(e);
			}

	}
//	public static void SendMessageWithEmbeddedImages()
//	{
//	  String htmlMessage = "<html>\r\n" + 
//				"    <body>\r\n" + 
//				"        <div>\r\n" + 
//				"            <img src=\"cid:diwaliPost\" style=\"width: 500px;\" alt=\"\">\r\n" + 
//				"        </div>\r\n" + 
//				"    </body>\r\n" + 
//				"</html>";
//	  SmtpClient client = new SmtpClient("mail.server.com");
//	  MailMessage msg = new MailMessage("noreply@deventerprise.net",
//	                                    "someone@deventerprise.net");
//	  // Create the HTML view
//	  AlternateView htmlView = AlternateView.CreateAlternateViewFromString(
//	                                               htmlMessage,
//	                                               Encoding.UTF8,
//	                                               MediaTypeNames.Text.Html);
//	
//	  LinkedResource img = new LinkedResource("\"C:\\Users\\drnic\\Downloads\\diwali_post.png\"", mediaType);
//	  // Make sure you set all these values!!!
//	  img.ContentId = "EmbeddedContent_1";
//	  img.ContentType.MediaType = mediaType;
//	  img.TransferEncoding = TransferEncoding.Base64;
//	  img.ContentType.Name = img.ContentId;
//	  img.ContentLink = new Uri("cid:" + img.ContentId);
//	  htmlView.LinkedResources.Add(img);
//	  //////////////////////////////////////////////////////////////
//	  msg.AlternateViews.Add(plainView);
//	  msg.AlternateViews.Add(htmlView);
//	  msg.IsBodyHtml = true;
//	  msg.Subject = "Some subject";
//	  client.Send(msg);
//	}
	public boolean sendContactUsMail(ContactUsModel contactUsModel) {
		
		InitiateMailService("support@fellowgenius.com");
		String from = senderEmail;
		session = Session.getDefaultInstance(props, new javax.mail.Authenticator() {
			protected PasswordAuthentication getPasswordAuthentication() {
				return new PasswordAuthentication(from, senderPassword);
			}
		});
		
		try {
			MimeMessage message = new MimeMessage(session);
			MimeMessageHelper helper = new MimeMessageHelper(message, true);

			helper.setFrom(from);
			
			String to=from;
			helper.setTo(to);
			
			helper.setSubject("FellowGenius Contact Us Message Notification !");
			String mailContent = "<html>\r\n" + "<head>   \r\n" + "    <style>\r\n" + "   \r\n" + "    </style>\r\n"
					+ "</head>\r\n" + "<body>\r\n"
					+ "    <div style=\"width:100%; background-color: #F7F7F7; display: inline-block; font-family: 'Roboto', sans-serif;\">\r\n"
					+ "        <div style=\"max-width: 500px; height: auto; background-color: #fff; border-radius: 20px; padding: 30px; margin: 3em auto;\">\r\n"
					+ "            <div style=\"width: 100%; display: inline-block; margin-bottom: 20px;\">\r\n"
					+ "                <img src='cid:logoImage' style=\"width: 90px;\">\r\n"
					+ "            </div>\r\n"
					+ "            <div style=\"width: 100%; display: inline-block;\">\r\n"
					+ "                <h1 style=\"color: #202124; font-size: 22px; font-weight: 400;\">Contact us Message.</h1>\r\n"
					+ "                <p style=\"font-size: 14px; line-height: 1.75; color: #313745;\">Hi Admin"
					+ "</p>\r\n"
					+ "                <p style=\"font-size: 14px; line-height: 1.75; color: #313745;\">You have a new Message! Please view the full details of the message mentioned below.</p>\r\n"
					+ "                <p style=\"font-size: 14px; line-height: 1.75; color: #313745;\"> Name - " + contactUsModel.getName() 
					+ "<br> Email - " + contactUsModel.getEmail() 
					+ "<br> Contact - " + contactUsModel.getPhone() 
					+ "<br> Message - " + contactUsModel.getMessage()
					+ "</p>\r\n"
					
					+ "                <p style=\"font-size: 14px; line-height: 1.75; color: #313745;\">Have a good Day!<br /><br>Regards,<br><br />Team FellowGenius</p>\r\n"
					+ "                <hr style=\"margin: 25px 0; border-top: 1px solid #f7f7f7;\">\r\n"
					+ "                <p style=\"text-align: center; font-size: 14px; color: #B5B3B3; margin-bottom: 0;\">Questions? <a style=\"color: #EC008C;\" href=\"mailto:support@fellowgenius.com\" >We're here to help.</a></p>\r\n"
					+ "            </div>\r\n" + "        </div>\r\n" + "    </div>\r\n" + "</body>\r\n"
					+ "</html>";

			helper.setText(mailContent, true);
			ClassPathResource resource = new ClassPathResource("logo.png");
			helper.addInline("logoImage", resource);
			Transport.send(message);

			
			
		} catch (MessagingException e) {
			e.printStackTrace();
			throw new RuntimeException(e);
		}
		return true;
	}

}
