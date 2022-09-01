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

import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.data.annotation.CreatedDate;

@Entity
@Data
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

}
