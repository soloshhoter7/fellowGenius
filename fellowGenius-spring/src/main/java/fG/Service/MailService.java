package fG.Service;

import java.util.Properties;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import fG.DAO.dao;
import fG.Entity.BookingDetails;
import fG.Entity.StudentProfile;
import fG.Entity.TutorProfile;

@Service
public class MailService {
	
	@Autowired
	dao userDao;
	
	String senderEmail="soloshooter5631@gmail.com";
	String senderPassword="czdq124c6";
	
	static Properties props;
	static Session session;
	
	void InitiateMailService(){
		props= new Properties();
		props.put("mail.smtp.auth", "true");
		props.put("mail.smtp.starttls.enable", "true");
		props.put("mail.smtp.host", "smtp.gmail.com");
		props.put("mail.smtp.port", 587);
		System.out.println("props =>"+props);
		//for dev version and deployment
		
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
				return new PasswordAuthentication(senderEmail,senderPassword);
			}
		});
	    if(session==null) {
	    	System.out.println("SESSION IS NULL");
	    }
	}
	
	//For sending OTP verification email
	void sendVerificationEmail(String email,String otp) {
		InitiateMailService();
		String to = email;

		try {
			MimeMessage message = new MimeMessage(session);

			message.setFrom(new InternetAddress(senderEmail));

			message.addRecipient(Message.RecipientType.TO, new InternetAddress(to));

			message.setSubject("Welcome to FellowGenius");

			message.setContent("<html><head> <link rel=\"stylesheet\" href=\"https://maxcdn.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css\"/> <style>.Box{box-shadow: 0 8px 16px 0 #90a4ae; width: 100%; height: auto; text-align: center; padding: 20px; margin-top: 10px; background: url(https://fellowgenius.com/search_right_bg.7af30faa440a7e6ab2bb.svg) no-repeat; background-size: contain; border: 1px solid #7d0f7d; border-radius: 8px; width: 650px; margin: 0 auto; background-position: left top;}.logo{background: url(https://fellowgenius.com/logo.2dbc598173218fe92921.svg) no-repeat; background-size: contain; height: 100px; display: block; float: right; width: 100px;}tr{padding: 10px;}td{padding: 5px; margin-right: 5px;}</style></head>"
					+ "<body> <div class=\"Box\"> <div class=\"box-header\"> <span class=\"logo\"></span> <span style=\"margin-bottom: 20px;color:#892687;width:100%;text-align: center;font-size:16px;font-weight:bold;text-transform: uppercase;\">"
					+ " Welcome to fellowgenius </span> </div><div style=\"padding:20px;width: 350px; margin: 0 auto;\"> <p>Please Verify your account by entering the One-time-password Provided below :</p>"
					+ "<h2 style=\"padding: 20px;background-color: #e0e0e0;width: max-content;margin:auto\">"+otp+"</h2> </div>"
					+ "<p style=\"margin-top: 30px; font-size: 10px; text-align: center; width: 100%;\">This is an auto-generated message please don't reply back.</p></div><div class=\"container-fluid\"> <div class=\"row\"> <div class=\"col-sm-2\"></div><div class=\"col-sm-7\"> </div><div class=\"com-sm-3\"></div></div></div></body></html>","text/html");
			Transport.send(message);

			System.out.println("Sent message successfully....");

		} catch (MessagingException e) {
			e.printStackTrace();
			throw new RuntimeException(e);
		}
	}
	
	//For sending notifications related to meeting
	void sendNotificationTutor(Integer id, BookingDetails booking) {
		InitiateMailService();
		try {
			MimeMessage message = new MimeMessage(session);
			if (booking.getApprovalStatus().equals("Pending")) {
				TutorProfile tutProfile = userDao.fetchTutorProfileByBookingId(id);
				String to = tutProfile.getEmail();
				message.setFrom(new InternetAddress(senderEmail));
				message.addRecipient(Message.RecipientType.TO, new InternetAddress(to));
				message.setSubject("Appointment Notification !");
				message.setContent("<html><head> <link rel=\"stylesheet\" href=\"https://maxcdn.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css\"/> <style>.Box{box-shadow: 0 8px 16px 0 #90a4ae; width: 100%; height: auto; text-align: center; padding: 20px; margin-top: 10px; background: url(https://fellowgenius.com/search_right_bg.7af30faa440a7e6ab2bb.svg) no-repeat; background-size: contain; border: 1px solid #7d0f7d; border-radius: 8px; width: 650px; margin: 0 auto; background-position: left top;}.logo{background: url(https://fellowgenius.com/logo.2dbc598173218fe92921.svg) no-repeat; background-size: contain; height: 100px; display: block; float: right; width: 100px;}tr{padding: 10px;}td{padding: 5px; margin-right: 5px;}</style></head><body> <div class=\"Box\"> <div class=\"box-header\"> <span class=\"logo\"></span> <span style=\"margin-bottom: 20px;color:#892687;width:100%;text-align: center;font-size:16px;font-weight:bold;text-transform: uppercase;\">New appointment Request</span> </div><div style=\"padding:20px;width: 350px; margin: 0 auto;\">"
						+ " <table> <tr> <td><b>Student Name</b><br>"+booking.getStudentName()+"</td><td><b>"+booking.getDateOfMeeting()+"</b><br>04/06/2020</td></tr><tr> <td><b>Start Time</b><br>"+ booking.getStartTimeHour() + ":"+ booking.getStartTimeMinute() +"</td><td><b>Duration</b><br>"+booking.getDuration()+"</td></tr></table> </div><p style=\"margin-top: 30px; font-size: 10px; text-align: center; width: 100%;\">This is an auto-generated message please don't reply back.</p></div><div class=\"container-fluid\"> <div class=\"row\"> <div class=\"col-sm-2\"></div><div class=\"col-sm-7\"> </div><div class=\"com-sm-3\"></div></div></div></body></html>","text/html");
				Transport.send(message);
				
			} else if (booking.getApprovalStatus().equals("Accepted")) {
				StudentProfile stuProfile = userDao.getStudentProfile(id);
				String to = stuProfile.getEmail();
				message.setFrom(new InternetAddress(senderEmail));
				message.addRecipient(Message.RecipientType.TO, new InternetAddress(to));
				message.setSubject("Appointment Notification !");
				message.setContent("<html><head> <link rel=\"stylesheet\" href=\"https://maxcdn.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css\"/> <style>.Box{box-shadow: 0 8px 16px 0 #90a4ae; width: 100%; height: auto; text-align: center; padding: 20px; margin-top: 10px; background: url(https://fellowgenius.com/search_right_bg.7af30faa440a7e6ab2bb.svg) no-repeat; background-size: contain; border: 1px solid #7d0f7d; border-radius: 8px; width: 650px; margin: 0 auto; background-position: left top;}.logo{background: url(https://fellowgenius.com/logo.2dbc598173218fe92921.svg) no-repeat; background-size: contain; height: 100px; display: block; float: right; width: 100px;}tr{padding: 10px;}td{padding: 5px; margin-right: 5px;}</style></head><body> <div class=\"Box\"> <div class=\"box-header\"> <span class=\"logo\"></span> <span style=\"margin-bottom: 20px;color:#892687;width:100%;text-align: center;font-size:16px;font-weight:bold;text-transform: uppercase;\"> Request Accepted !</span> </div><div style=\"padding:20px;width: 350px; margin: 0 auto;\">"
						+ " <table> <tr> <td><b>Tutor Name</b><br>"+booking.getTutorName()+"</td><td><b>Date</b><br>"+booking.getDateOfMeeting()+"</td></tr><tr> <td><b>Start Time</b><br>"+booking.getStartTimeHour() + ":"+ booking.getStartTimeMinute() +"</td><td><b>Duration</b><br>"+booking.getDuration()+"</td></tr></table> </div><p style=\"margin-top: 30px; font-size: 10px; text-align: center; width: 100%;\">This is an auto-generated message please don't reply back.</p></div><div class=\"container-fluid\"> <div class=\"row\"> <div class=\"col-sm-2\"></div><div class=\"col-sm-7\"> </div><div class=\"com-sm-3\"></div></div></div></body></html>","text/html");
				Transport.send(message);
				
			}else if (booking.getApprovalStatus().equals("live")) {
				StudentProfile stuProfile = userDao.getStudentProfile(id);
				String to = stuProfile.getEmail();
				message.setFrom(new InternetAddress(senderEmail));
				message.addRecipient(Message.RecipientType.TO, new InternetAddress(to));
				message.setSubject("Appointment Notification !");
				message.setContent("<html><head> <link rel=\"stylesheet\" href=\"https://maxcdn.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css\"/> <style>.Box{box-shadow: 0 8px 16px 0 #90a4ae; width: 100%; height: auto; text-align: center; padding: 20px; margin-top: 10px; background: url(https://fellowgenius.com/search_right_bg.7af30faa440a7e6ab2bb.svg) no-repeat; background-size: contain; border: 1px solid #7d0f7d; border-radius: 8px; width: 650px; margin: 0 auto; background-position: left top;}.logo{background: url(https://fellowgenius.com/logo.2dbc598173218fe92921.svg) no-repeat; background-size: contain; height: 100px; display: block; float: right; width: 100px;}tr{padding: 10px;}td{padding: 5px; margin-right: 5px;}</style></head><body> <div class=\"Box\"> <div class=\"box-header\"> <span class=\"logo\"></span> <span style=\"margin-bottom: 20px;color:#892687;width:100%;text-align: center;font-size:16px;font-weight:bold;text-transform: uppercase;\"> Tutor has started the meeting </span> </div><div style=\"padding:20px;width: 350px; margin: 0 auto;\"> <table> <tr> <td><b>Tutor Name</b><br>"+booking.getTutorName()+"</td><td><b>Date</b><br>"+booking.getDateOfMeeting()+"</td></tr><tr> <td><b>Start Time</b><br>"+booking.getStartTimeHour()+":"+booking.getStartTimeMinute()+"</td><td><b>Duration</b><br>"+booking.getDuration()+" Minutes</td></tr></table> </div><p style=\"margin-top: 30px; font-size: 10px; text-align: center; width: 100%;\">This is an auto-generated message please don't reply back.</p></div><div class=\"container-fluid\"> <div class=\"row\"> <div class=\"col-sm-2\"></div><div class=\"col-sm-7\"> </div><div class=\"com-sm-3\"></div></div></div></body></html>","text/html");
			Transport.send(message);

			System.out.println("Email sent successfully....");

		} 
			}catch (MessagingException e) {
			e.printStackTrace();
			throw new RuntimeException(e);
		}

	}

}
