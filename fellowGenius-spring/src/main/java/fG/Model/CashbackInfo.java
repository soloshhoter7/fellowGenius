package fG.Model;

public class CashbackInfo {

	private String date;
	
	private String context;
	
	private String balance;
	
	private String referredUserName;

	public CashbackInfo() {
		super();
		// TODO Auto-generated constructor stub
	}

	public CashbackInfo(String date, String context, String balance, String referredUserName) {
		super();
		this.date = date;
		this.context = context;
		this.balance = balance;
		this.referredUserName = referredUserName;
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

	public String getReferredUserName() {
		return referredUserName;
	}

	public void setReferredUserName(String referredUserName) {
		this.referredUserName = referredUserName;
	}

	@Override
	public String toString() {
		return "CashbackInfo [date=" + date + ", context=" + context + ", balance=" + balance + ", referredUserName="
				+ referredUserName + "]";
	}
	
}
