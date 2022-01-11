package fG.Model;

public class TransactionsModel {

	private String userId;
	
	private String name;
	
	private String context;
	
	private double totalPaidAmount;  
	
	private double remainingAmount;
	
	private double paidAmount;
	
	private String upiId;
	
	private String transactionId;

	public TransactionsModel() {
		super();
		// TODO Auto-generated constructor stub
	}

	public TransactionsModel(String userId, String name, String context, double totalPaidAmount, double remainingAmount,
			double paidAmount, String upiId, String transactionId) {
		super();
		this.userId = userId;
		this.name = name;
		this.context = context;
		this.totalPaidAmount = totalPaidAmount;
		this.remainingAmount = remainingAmount;
		this.paidAmount = paidAmount;
		this.upiId = upiId;
		this.transactionId = transactionId;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getContext() {
		return context;
	}

	public void setContext(String context) {
		this.context = context;
	}

	public double getTotalPaidAmount() {
		return totalPaidAmount;
	}

	public void setTotalPaidAmount(double totalPaidAmount) {
		this.totalPaidAmount = totalPaidAmount;
	}

	public double getRemainingAmount() {
		return remainingAmount;
	}

	public void setRemainingAmount(double remainingAmount) {
		this.remainingAmount = remainingAmount;
	}

	public double getPaidAmount() {
		return paidAmount;
	}

	public void setPaidAmount(double paidAmount) {
		this.paidAmount = paidAmount;
	}

	public String getUpiId() {
		return upiId;
	}

	public void setUpiId(String upiId) {
		this.upiId = upiId;
	}

	public String getTransactionId() {
		return transactionId;
	}

	public void setTransactionId(String transactionId) {
		this.transactionId = transactionId;
	}

	@Override
	public String toString() {
		return "TransactionsModel [userId=" + userId + ", name=" + name + ", context=" + context + ", totalPaidAmount="
				+ totalPaidAmount + ", remainingAmount=" + remainingAmount + ", paidAmount=" + paidAmount + ", upiId="
				+ upiId + ", transactionId=" + transactionId + "]";
	}

	 
	
		
}
