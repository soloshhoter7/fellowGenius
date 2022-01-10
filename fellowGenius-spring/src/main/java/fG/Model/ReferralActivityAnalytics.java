package fG.Model;

public class ReferralActivityAnalytics {

	private Integer referralLinkedinCount;
	
	private Integer referralMailCount;
	
	private Integer referralWhatsappCount;

	public ReferralActivityAnalytics() {
		super();
		// TODO Auto-generated constructor stub
	}

	public ReferralActivityAnalytics(Integer referralMailCount, Integer referralLinkedinCount,
			Integer referralWhatsappCount) {
		super();
		this.referralMailCount = referralMailCount;
		this.referralLinkedinCount = referralLinkedinCount;
		this.referralWhatsappCount = referralWhatsappCount;
	}

	public Integer getReferralMailCount() {
		return referralMailCount;
	}

	public void setReferralMailCount(Integer referralMailCount) {
		this.referralMailCount = referralMailCount;
	}

	public Integer getReferralLinkedinCount() {
		return referralLinkedinCount;
	}

	public void setReferralLinkedinCount(Integer referralLinkedinCount) {
		this.referralLinkedinCount = referralLinkedinCount;
	}

	public Integer getReferralWhatsappCount() {
		return referralWhatsappCount;
	}

	public void setReferralWhatsappCount(Integer referralWhatsappCount) {
		this.referralWhatsappCount = referralWhatsappCount;
	}

	@Override
	public String toString() {
		return "ReferralActivityAnalytics [referralMailCount=" + referralMailCount + ", referralLinkedinCount="
				+ referralLinkedinCount + ", referralWhatsappCount=" + referralWhatsappCount + "]";
	}
	
}
