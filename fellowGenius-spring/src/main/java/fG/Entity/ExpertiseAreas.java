package fG.Entity;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

@Entity
@Table(name="ExpertiseAreas")
public class ExpertiseAreas {
 
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	Long id;
	
	@NotNull
	String subject;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name="user_id",nullable=false)
	TutorProfileDetails userId;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getSubject() {
		return subject;
	}

	public void setSubject(String subject) {
		this.subject = subject;
	}

	public TutorProfileDetails getUserId() {
		return userId;
	}

	public void setUserId(TutorProfileDetails userId) {
		this.userId = userId;
	}

	@Override
	public String toString() {
		return "ExpertiseAreas [id=" + id + ", subject=" + subject + ", userId=" + userId + "]";
	}
}
