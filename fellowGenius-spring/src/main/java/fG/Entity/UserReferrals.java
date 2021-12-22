package fG.Entity;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;

import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

@Entity
public class UserReferrals implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Integer id;

	@OneToOne(cascade = CascadeType.MERGE)
	@JoinColumn(name = "userId", referencedColumnName = "userId", nullable = false)
	private Users user;

	@OneToMany(cascade = CascadeType.MERGE, fetch = FetchType.LAZY)
	@LazyCollection(LazyCollectionOption.FALSE)
	private List<Users> referCompleted = new ArrayList<>();

	@OneToMany( fetch = FetchType.LAZY)
	@LazyCollection(LazyCollectionOption.FALSE)
	private List<BookingDetails> meetingSetup = new ArrayList<>();

	@OneToMany(fetch = FetchType.LAZY)
	@LazyCollection(LazyCollectionOption.FALSE)
	private List<BookingDetails> meetingCompleted = new ArrayList<>();

	private Integer paymentDue = 0;

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

	public List<Users> getReferCompleted() {
		return referCompleted;
	}

	public void setReferCompleted(List<Users> referCompleted) {
		this.referCompleted = referCompleted;
	}

	public List<BookingDetails> getMeetingSetup() {
		return meetingSetup;
	}

	public void setMeetingSetup(List<BookingDetails> meetingSetup) {
		this.meetingSetup = meetingSetup;
	}

	public List<BookingDetails> getMeetingCompleted() {
		return meetingCompleted;
	}

	public void setMeetingCompleted(List<BookingDetails> meetingCompleted) {
		this.meetingCompleted = meetingCompleted;
	}

	public Integer getPaymentDue() {
		return paymentDue;
	}

	public void setPaymentDue(Integer paymentDue) {
		this.paymentDue = paymentDue;
	}

	public static long getSerialversionuid() {
		return serialVersionUID;
	}

	@Override
	public String toString() {
		return "UserReferrals [id=" + id + ", user=" + user + ", referCompleted=" + referCompleted + ", meetingSetup="
				+ meetingSetup + ", meetingCompleted=" + meetingCompleted + ", paymentDue=" + paymentDue + "]";
	}

}
