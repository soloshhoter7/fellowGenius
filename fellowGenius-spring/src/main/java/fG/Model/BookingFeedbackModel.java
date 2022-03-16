package fG.Model;

import java.util.ArrayList;
import java.util.List;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class BookingFeedbackModel {

	Integer bookingId;
	Integer expertId;
	Integer learnerId;
	String role;
	Integer rating;
	List<String> likes = new ArrayList<>();
	List<String> disLikes = new ArrayList<>();
	String review;

}
