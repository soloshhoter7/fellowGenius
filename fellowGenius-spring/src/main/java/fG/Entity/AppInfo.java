package fG.Entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class AppInfo {
	@Id
	@Column(name="keyName",length=50)
	String keyName;
	String value;
	String type;
	public String getKeyName() {
		return keyName;
	}
	public void setKeyName(String keyName) {
		this.keyName = keyName;
	}
	public String getValue() {
		return value;
	}
	public void setValue(String value) {
		this.value = value;
	}
	
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	@Override
	public String toString() {
		return "AppInfo [keyName=" + keyName + ", value=" + value + ", type=" + type + "]";
	}
	
	
}
