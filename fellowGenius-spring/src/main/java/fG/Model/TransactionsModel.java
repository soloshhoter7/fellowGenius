package fG.Model;

import fG.Enum.TransactionContext;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class TransactionsModel {

	private String userId;
	
	private String name;
	
	private TransactionContext context;

	//null in case of referral
	private String bookingId;
	
	private double totalPaidAmount;  
	
	private double remainingAmount;
	
	private double paidAmount;
	
	private String upiId;
	
	private String transactionId;

}
