package fG.Model;

public class CashbackEarned {

	private Double totalCashback;
	
	private Double redeemedCashback;
	
	private Double remainingCashback;

	public CashbackEarned() {
		super();
		// TODO Auto-generated constructor stub
	}

	public CashbackEarned(Double totalCashback, Double redeemedCashback, Double remainingCashback) {
		super();
		this.totalCashback = totalCashback;
	    this.redeemedCashback = redeemedCashback;
		this.remainingCashback = remainingCashback;
	}

	public Double getTotalCashback() {
		return totalCashback;
	}

	public void setTotalCashback(Double totalCashback) {
		this.totalCashback = totalCashback;
	}

	public Double getRedeemedCashback() {
		return redeemedCashback;
	}

	public void setRedeemedCashback(Double redeemedCashback) {
		this.redeemedCashback = redeemedCashback;
	}

	public Double getRemainingCashback() {
		return remainingCashback;
	}

	public void setRemainingCashback(Double remainingCashback) {
		this.remainingCashback = remainingCashback;
	}

	@Override
	public String toString() {
		return "CashbackEarned [totalCashback=" + totalCashback + ", RedeemedCashback=" + redeemedCashback
				+ ", RemainingCashback=" + remainingCashback + "]";
	}
	
	
}
