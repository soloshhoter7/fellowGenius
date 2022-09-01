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
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

@Entity
@Data
@Table(name="cashback")
public class Cashback {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Integer id;

	@OneToOne(cascade = CascadeType.MERGE)
	@JoinColumn(name = "userId", referencedColumnName = "userId", nullable = false)
	private Users user;
	
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name="cashback_date",updatable=false)
	final Date cashbackDate= new Date();
	
	private String context;

	private int amount;
	
	@OneToOne(cascade = CascadeType.MERGE)
	@JoinColumn(name = "bId", referencedColumnName = "bId", nullable = false)
	private BookingDetails bookingDetails;

	public Cashback() {
		super();
		// TODO Auto-generated constructor stub
	}

	public Cashback(Integer id, Users user, String context, int amount, BookingDetails bookingDetails) {
		super();
		this.id = id;
		this.user = user;
		this.context = context;
		this.amount = amount;
		this.bookingDetails = bookingDetails;
	}

	
}
