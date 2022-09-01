package fG.Entity;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.data.annotation.CreatedDate;
@Entity
@Data
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
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name="last_login")
	Date lastLogin;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name="signup_date",updatable=false)
	final Date createdDate= new Date();
	
	Integer credits=0;

	@Override
	public String toString() {
		return "Users [userId=" + userId + ", email=" + email + ", password=" + password + ", socialId=" + socialId
				+ ", role=" + role + ", expertCode=" + expertCode + ", lastLogin=" + lastLogin + ", createdDate="
				+ createdDate + ", credits=" + credits + "]";
	}

}
