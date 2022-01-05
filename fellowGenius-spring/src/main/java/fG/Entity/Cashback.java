package fG.Entity;

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

	private String balance;
	
	@OneToOne(cascade = CascadeType.MERGE)
	@JoinColumn(name = "bId", referencedColumnName = "bId", nullable = false)
	private BookingDetails bookingDetails;

	public Cashback() {
		super();
		// TODO Auto-generated constructor stub
	}

	public Cashback(Integer id, Users user, String context, String balance, BookingDetails bookingDetails) {
		super();
		this.id = id;
		this.user = user;
		this.context = context;
		this.balance = balance;
		this.bookingDetails = bookingDetails;
	}


	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Users getUser() {
		return user;
	}

	public void setUser(Users user) {
		this.user = user;
	}

	public String getContext() {
		return context;
	}

	public void setContext(String context) {
		this.context = context;
	}

	public String getBalance() {
		return balance;
	}

	public void setBalance(String balance) {
		this.balance = balance;
	}

	public BookingDetails getBookingDetails() {
		return bookingDetails;
	}

	public void setBookingDetails(BookingDetails bookingDetails) {
		this.bookingDetails = bookingDetails;
	}

	public Date getCashbackDate() {
		return cashbackDate;
	}

	@Override
	public String toString() {
		return "Cashback [id=" + id + ", user=" + user + ", cashbackDate=" + cashbackDate + ", context=" + context
				+ ", balance=" + balance + ", bookingDetails=" + bookingDetails + "]";
	}


}
