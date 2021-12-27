package fG.Model;

public class TransactionsModel {

	private String userId;
	
	private String name;
	
	private String context;
	
	private double payableAmount;
	
	private String upiId;
	
	private String transactionId;

	public TransactionsModel() {
		super();
		// TODO Auto-generated constructor stub
	}

	public TransactionsModel(String userId, String name, String context, double payableAmount, String upiId,String transactionId) {
		super();
		this.userId = userId;
		this.name = name;
		this.context = context;
		this.payableAmount = payableAmount;
		this.upiId = upiId;
		this.transactionId=transactionId;
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
	

	public String getTransactionId() {
		return transactionId;
	}

	public void setTransactionId(String transactionId) {
		this.transactionId = transactionId;
	}

	@Override
	public String toString() {
		return "TransactionsModel [userId=" + userId + ", name=" + name + ", context=" + context + ", payableAmount="
				+ payableAmount + ", upiId=" + upiId + ", transactionId=" + transactionId + "]";
	}
	
	
}
