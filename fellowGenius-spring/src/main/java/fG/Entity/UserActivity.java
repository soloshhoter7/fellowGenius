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
import javax.persistence.ManyToOne;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.data.annotation.CreatedDate;

import fG.Model.ScheduleTime;

@Entity
@Data
public class UserActivity implements Serializable {
	private static final long serialVersionUID = 1L;
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	Integer id;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name="userId",referencedColumnName="userId",nullable=false)
	Users userId;
	
	String type;
	
	@CreationTimestamp
	@CreatedDate
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name="created_date")
	Date createdDate;

	@Override
	public boolean equals(Object anObject) {
		if (!(anObject instanceof UserActivity)) {
			return false;
		}
		UserActivity otherMember = (UserActivity) anObject;
		return (otherMember.getId().equals(this.id));
	}
	
}
