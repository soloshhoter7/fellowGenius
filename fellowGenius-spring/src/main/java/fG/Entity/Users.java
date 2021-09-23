package fG.Entity;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.hibernate.annotations.CreationTimestamp;
import org.springframework.data.annotation.CreatedDate;
@Entity
public class Users implements Serializable {
	private static final long serialVersionUID = 1L;
	@Column(name="userId",length=50)
	Integer userId;
	
	@Id
	@Column(name="email",length=50)
	String email;

	String password;
    
	String socialId;
	
	String role;
	String expertCode;
//	@CreationTimestamp
//	@CreatedDate
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name="last_login")
	Date lastLogin;
	
	
	@CreationTimestamp
	@CreatedDate
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name="signup_date")
	Date createdDate;
//	String lastLogin;
	
	public Integer getUserId() {
		return userId;
	}

	public void setUserId(Integer userId) {
		this.userId = userId;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}
	 
	
	public String getSocialId() {
		return socialId;
	}

	public void setSocialId(String socialId) {
		this.socialId = socialId;
	}
	
	
	public Date getLastLogin() {
		return lastLogin;
	}

	public void setLastLogin(Date lastLogin) {
		this.lastLogin = lastLogin;
	}

	public Date getCreatedDate() {
		return createdDate;
	}

	public void setCreatedDate(Date createdDate) {
		this.createdDate = createdDate;
	}
	
	
	public String getExpertCode() {
		return expertCode;
	}

	public void setExpertCode(String expertCode) {
		this.expertCode = expertCode;
	}

	public static long getSerialversionuid() {
		return serialVersionUID;
	}

	@Override
	public String toString() {
		return "Users [userId=" + userId + ", email=" + email + ", password=" + password + ", socialId=" + socialId
				+ ", role=" + role + ", expertCode=" + expertCode + ", lastLogin=" + lastLogin + ", createdDate="
				+ createdDate + "]";
	}

	
	
}
