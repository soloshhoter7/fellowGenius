package fG.Entity;

import lombok.Data;

import java.util.Date;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

@Entity
@Data
public class FGCredits {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Integer id;

	@OneToOne(cascade = CascadeType.MERGE)
	@JoinColumn(name = "userId", referencedColumnName = "userId", nullable = false)
	private Users user;
	
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name="credits_date",updatable=false)
	final Date creditDate= new Date();
	
	private String context;
	
	private String type;

	private int amount;
	
	@OneToOne(cascade = CascadeType.MERGE)
	@JoinColumn(name = "bId", referencedColumnName = "bId", nullable = false)
	private BookingDetails bookingDetails;

	public FGCredits() {
		super();
		// TODO Auto-generated constructor stub
	}

	public FGCredits(Integer id, Users user, String context, String type, int amount, BookingDetails bookingDetails) {
		super();
		this.id = id;
		this.user = user;
		this.context = context;
		this.type = type;
		this.amount = amount;
		this.bookingDetails = bookingDetails;
	}


		
}
