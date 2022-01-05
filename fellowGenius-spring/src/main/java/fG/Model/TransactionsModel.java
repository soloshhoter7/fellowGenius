package fG.Model;

public class TransactionsModel {

	private String userId;
	
	private String name;
	
	private String context;
	
	private double totalAmount;
	
	private double sumPaidAmount;
	
	private double remainingAmount;
	
	private double paidAmount;
	
	private String upiId;
	
	private String transactionId;

	public TransactionsModel() {
		super();
		// TODO Auto-generated constructor stub
	}

	public TransactionsModel(String userId, String name, String context, double totalAmount, double sumPaidAmount,
			double remainingAmount, double paidAmount, String upiId, String transactionId) {
		super();
		this.userId = userId;
		this.name = name;
		this.context = context;
		this.totalAmount = totalAmount;
		this.sumPaidAmount = sumPaidAmount;
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

	public double getTotalAmount() {
		return totalAmount;
	}

	public void setTotalAmount(double totalAmount) {
		this.totalAmount = totalAmount;
	}

	public double getSumPaidAmount() {
		return sumPaidAmount;
	}

	public void setSumPaidAmount(double sumPaidAmount) {
		this.sumPaidAmount = sumPaidAmount;
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
		return "TransactionsModel [userId=" + userId + ", name=" + name + ", context=" + context + ", totalAmount="
				+ totalAmount + ", sumPaidAmount=" + sumPaidAmount + ", remainingAmount=" + remainingAmount
				+ ", paidAmount=" + paidAmount + ", upiId=" + upiId + ", transactionId=" + transactionId + "]";
	}

		
}
