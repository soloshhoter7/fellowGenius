package fG.Entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import lombok.Data;
import org.hibernate.annotations.GenericGenerator;

@Entity
@Data
public class TutorProfile {

	@Id
	@GeneratedValue(generator = "id_seq")
	@GenericGenerator(
			name = "id_seq", 
			strategy = "fG.Service.IdGenerator")
	Integer tid;
	
	Integer bookingId;
	
	@Column(name="fullname")
	String fullName;
	String email;
	@Column(name="DOB")
	String dateOfBirth;
	String contact;
	String profilePictureUrl;

}
