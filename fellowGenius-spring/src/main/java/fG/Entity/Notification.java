package fG.Entity;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Type;
import org.springframework.data.annotation.CreatedDate;

@Entity
@Data
public class Notification implements Serializable {
	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private Integer notificationId;
	
	private Integer entityType;
	
	private Integer entityTypeId;
	
	private String actorId;
	
	private String notifierId;
	
	@CreationTimestamp
	@CreatedDate
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name="created_date")
	private Date timestamp;
	
	private String pictureUrl;
	
	@Column(nullable = false)
	@Type(type = "org.hibernate.type.NumericBooleanType")
	private boolean readStatus;

	Notification(){}
	
	public Notification(Integer entityType, Integer entityTypeId, String actorId, String notifierId,
			String pictureUrl, boolean readStatus) {
		super();
		this.entityType = entityType;
		this.entityTypeId = entityTypeId;
		this.actorId = actorId;
		this.notifierId = notifierId;
		this.pictureUrl = pictureUrl;
		this.readStatus = readStatus;
	}
}
