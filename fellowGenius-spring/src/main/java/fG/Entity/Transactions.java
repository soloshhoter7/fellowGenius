package fG.Entity;

import java.util.Date;
import java.util.UUID;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.hibernate.annotations.GenericGenerator;

@Entity
public class Transactions {

	@Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(
        name = "UUID",
        strategy = "org.hibernate.id.UUIDGenerator"
    )
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;
	
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name="transaction_date")
	private Date transactionDate;
	
	public void setTransactionDate(Date transactionDate) {
		this.transactionDate = transactionDate;
	}

	private double payableAmount;
	
	private String upiId;
	
	@OneToOne
	@JoinColumn(name="userId")
	private Users paidToUserId;
	
	private String transactionId;
	
	private String context;

	public Transactions() {
		super();
		// TODO Auto-generated constructor stub
	}

	public Transactions(UUID id, Date transactionDate, double payableAmount, String upiId, Users paidToUserId,
			String transactionId, String context) {
		super();
		this.id = id;
		this.transactionDate = transactionDate;
		this.payableAmount = payableAmount;
		this.upiId = upiId;
		this.paidToUserId = paidToUserId;
		this.transactionId = transactionId;
		this.context = context;
	}

	public UUID getId() {
		return id;
	}

	public void setId(UUID id) {
		this.id = id;
	}

	public double getPayableAmount() {
		return payableAmount;
	}

	public void setPayableAmount(double payableAmount) {
		this.payableAmount = payableAmount;
	}

	public String getUpiId() {
		return upiId;
	}

	public void setUpiId(String upiId) {
		this.upiId = upiId;
	}

	public Users getPaidToUserId() {
		return paidToUserId;
	}

	public void setPaidToUserId(Users paidToUserId) {
		this.paidToUserId = paidToUserId;
	}

	public String getTransactionId() {
		return transactionId;
	}

	public void setTransactionId(String transactionId) {
		this.transactionId = transactionId;
	}

	public String getContext() {
		return context;
	}

	public void setContext(String context) {
		this.context = context;
	}

	public Date getTransactionDate() {
		return transactionDate;
	}

	@Override
	public String toString() {
		return "Transactions [id=" + id + ", transactionDate=" + transactionDate + ", payableAmount=" + payableAmount
				+ ", upiId=" + upiId + ", paidToUserId=" + paidToUserId + ", transactionId=" + transactionId
				+ ", context=" + context + ", getId()=" + getId() + ", getPayableAmount()=" + getPayableAmount()
				+ ", getUpiId()=" + getUpiId() + ", getPaidToUserId()=" + getPaidToUserId() + ", getTransactionId()="
				+ getTransactionId() + ", getContext()=" + getContext() + ", getTransactionDate()="
				+ getTransactionDate() + ", getClass()=" + getClass() + ", hashCode()=" + hashCode() + ", toString()="
				+ super.toString() + "]";
	}
	

	}
