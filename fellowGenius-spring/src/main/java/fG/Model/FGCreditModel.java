package fG.Model;

public class FGCreditModel {

	private String date;
	
	private String context;
	
	private Integer amount;
	
	private String type;

	public FGCreditModel() {
		super();
		// TODO Auto-generated constructor stub
	}

	public FGCreditModel(String date, String context, Integer amount, String type) {
		super();
		this.date = date;
		this.context = context;
		this.amount = amount;
		this.type = type;
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

	public Integer getAmount() {
		return amount;
	}

	public void setAmount(Integer amount) {
		this.amount = amount;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	@Override
	public String toString() {
		return "FGCreditModel [date=" + date + ", context=" + context + ", amount=" + amount + ", type=" + type + "]";
	}
	
}
