package fG.Entity;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.hibernate.annotations.CreationTimestamp;
import org.springframework.data.annotation.CreatedDate;

@Entity
public class ReferralActivity implements Serializable{

	private static final long serialVersionUID = 1L;
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	Integer id;
	
	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name="userId",referencedColumnName="userId",nullable=false)
	Users userId;
	
	String type;
	
	@CreationTimestamp
	@CreatedDate
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name="created_date")
	Date createdDate;

	public ReferralActivity() {
		super();
		// TODO Auto-generated constructor stub
	}

	public ReferralActivity(Integer id, Users userId, String type, Date createdDate) {
		super();
		this.id = id;
		this.userId = userId;
		this.type = type;
		this.createdDate = createdDate;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Users getUserId() {
		return userId;
	}

	public void setUserId(Users userId) {
		this.userId = userId;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public Date getCreatedDate() {
		return createdDate;
	}

	public void setCreatedDate(Date createdDate) {
		this.createdDate = createdDate;
	}

	public static long getSerialversionuid() {
		return serialVersionUID;
	}

	@Override
	public String toString() {
		return "ReferralActivity [id=" + id + ", userId=" + userId + ", type=" + type + ", createdDate=" + createdDate
				+ "]";
	}

}
