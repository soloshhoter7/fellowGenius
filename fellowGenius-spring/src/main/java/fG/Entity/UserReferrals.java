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

import lombok.Data;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

@Entity
@Data
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

	@Override
	public String toString() {
		return "UserReferrals [id=" + id + ", user=" + user + ", referCompleted=" + referCompleted + ", meetingSetup="
				+ meetingSetup + ", meetingCompleted=" + meetingCompleted + ", paymentDue=" + paymentDue + "]";
	}

}
