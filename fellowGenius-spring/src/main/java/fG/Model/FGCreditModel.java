package fG.Model;

public class FGCreditModel {

	private String date;
	
	private String context;
	
	private String balance;
	
	// + or -
	private String type;

	public FGCreditModel() {
		super();
		// TODO Auto-generated constructor stub
	}

	public String getDate() {
		return date;
	}

	public void setDate(String date) {
		this.date = date;
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

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	@Override
	public String toString() {
		return "FGCreditModel [date=" + date + ", context=" + context + ", balance=" + balance + ", type=" + type + "]";
	}
	
	
	
}
