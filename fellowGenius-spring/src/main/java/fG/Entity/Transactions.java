package fG.Entity;

import java.util.Date;
import java.util.UUID;

import javax.persistence.*;

import fG.Enum.TransactionContext;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
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

	private double paidAmount;
	
	private String upiId;
	
	@OneToOne(cascade = CascadeType.MERGE)
	@JoinColumn(name = "userId", referencedColumnName = "userId", nullable = false)
	private Users paidToUserId;
	
	private String transactionId;

	@Enumerated(EnumType.STRING)
	private TransactionContext context;

	}
