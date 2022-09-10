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

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Type;
import org.springframework.data.annotation.CreatedDate;

@Entity
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
//		this.timestamp = timestamp;
		this.pictureUrl = pictureUrl;
		this.readStatus = readStatus;
	}

	public Integer getNotificationId() {
		return notificationId;
	}

	public void setNotificationId(Integer notificationId) {
		this.notificationId = notificationId;
	}

	public Integer getEntityType() {
		return entityType;
	}

	public void setEntityType(Integer entityType) {
		this.entityType = entityType;
	}

	public Integer getEntityTypeId() {
		return entityTypeId;
	}

	public void setEntityTypeId(Integer entityTypeId) {
		this.entityTypeId = entityTypeId;
	}

	public String getActorId() {
		return actorId;
	}

	public void setActorId(String actorId) {
		this.actorId = actorId;
	}

	public String getNotifierId() {
		return notifierId;
	}

	public void setNotifierId(String notifierId) {
		this.notifierId = notifierId;
	}

	public Date getTimestamp() {
		return timestamp;
	}

	public void setTimestamp(Date timestamp) {
		this.timestamp = timestamp;
	}

	public String getPictureUrl() {
		return pictureUrl;
	}

	public void setPictureUrl(String pictureUrl) {
		this.pictureUrl = pictureUrl;
	}

	public boolean isReadStatus() {
		return readStatus;
	}

	public void setReadStatus(boolean readStatus) {
		this.readStatus = readStatus;
	}

	@Override
	public String toString() {
		return "Notification [notificationId=" + notificationId + ", entityType=" + entityType + ", entityTypeId="
				+ entityTypeId + ", actorId=" + actorId + ", notifierId=" + notifierId + ", timestamp=" + timestamp
				+ ", pictureUrl=" + pictureUrl + ", readStatus=" + readStatus + "]";
	}

	
	
}
