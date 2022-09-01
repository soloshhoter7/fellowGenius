package fG.Entity;

import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Data
public class AppInfo {
	@Id
	@Column(name="keyName",length=50)
	String keyName;
	String value;
	String type;
	
	
}
