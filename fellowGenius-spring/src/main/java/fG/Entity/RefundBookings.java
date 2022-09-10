package fG.Entity;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.hibernate.annotations.CreationTimestamp;
import org.springframework.data.annotation.CreatedDate;

@Entity
public class RefundBookings {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	Long id;
	
	@OneToOne
	@JoinColumn(name="booking_id")
	BookingDetails bid;
	
	@CreationTimestamp
	@CreatedDate
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name="refund_inititated")
	Date refundInitiated;
	
	String refundStatus;

	
	public Long getId() {
		return id;
	}


	public void setId(Long id) {
		this.id = id;
	}


	public BookingDetails getBid() {
		return bid;
	}


	public void setBid(BookingDetails bid) {
		this.bid = bid;
	}


	public Date getRefundInitiated() {
		return refundInitiated;
	}


	public void setRefundInitiated(Date refundInitiated) {
		this.refundInitiated = refundInitiated;
	}


	public String getRefundStatus() {
		return refundStatus;
	}


	public void setRefundStatus(String refundStatus) {
		this.refundStatus = refundStatus;
	}


	@Override
	public String toString() {
		return "RefundBookings [id=" + id + ", bid=" + bid + ", refundInitiated=" + refundInitiated + ", refundStatus="
				+ refundStatus + "]";
	}
	
	
}
