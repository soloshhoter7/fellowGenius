package fG.Model;

public class AuthenticationRequest {
 
	private String email;
	private String password;
	private String role;
	private String method;
	
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
	
	public String getMethod() {
		return method;
	}
	public void setMethod(String method) {
		this.method = method;
	}
	@Override
	public String toString() {
		return "AuthenticationRequest [email=" + email + ", password=" + password + ", role=" + role + ", method="
				+ method + "]";
	}
	
	
	
}
