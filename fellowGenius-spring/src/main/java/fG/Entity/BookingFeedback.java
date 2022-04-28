package fG.Entity;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@Getter
@Setter
@ToString
public class BookingFeedback {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Integer id;
	Integer bookingId;
	Integer expertId;
	Integer learnerId;
	String role;
	Integer rating;
    @Column
    @ElementCollection(targetClass=String.class)
	List<String> likes=new ArrayList<>();
    @Column
    @ElementCollection(targetClass=String.class)
	List<String> disLikes=new ArrayList<>();
	@Column(length = 300)
	String review;

}
