package fG.Model;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class BookingFeedbackModel {

	String bookingId;
	String userId;
	String role;
	Date time;
	Integer rating;
	List<String> likes = new ArrayList<>();
	List<String> disLikes = new ArrayList<>();
	String review;

}
