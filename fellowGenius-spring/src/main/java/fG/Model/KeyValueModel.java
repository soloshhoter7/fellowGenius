package fG.Model;

public class KeyValueModel {
	String keyName;
	String valueName;
	
	public KeyValueModel(String keyName, String valueName) {
		super();
		this.keyName = keyName;
		this.valueName = valueName;
	}
	public KeyValueModel() {
		// TODO Auto-generated constructor stub
	}
	public String getKeyName() {
		return keyName;
	}
	public void setKeyName(String keyName) {
		this.keyName = keyName;
	}
	public String getValueName() {
		return valueName;
	}
	public void setValueName(String valueName) {
		this.valueName = valueName;
	}
	@Override
	public String toString() {
		return "keyValueModel [keyName=" + keyName + ", valueName=" + valueName + "]";
	}
}
