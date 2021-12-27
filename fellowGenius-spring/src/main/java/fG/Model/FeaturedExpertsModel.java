package fG.Model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FeaturedExpertsModel {
	String name;
	Integer expertId;
	String topic;
	String profilePictureUrl;
	Integer precedence;
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public Integer getExpertId() {
		return expertId;
	}
	public void setExpertId(Integer expertId) {
		this.expertId = expertId;
	}
	public String getTopic() {
		return topic;
	}
	public void setTopic(String topic) {
		this.topic = topic;
	}
	public String getProfilePictureUrl() {
		return profilePictureUrl;
	}
	public void setProfilePictureUrl(String profilePictureUrl) {
		this.profilePictureUrl = profilePictureUrl;
	}
	public Integer getPrecedence() {
		return precedence;
	}
	public void setPrecedence(Integer precedence) {
		this.precedence = precedence;
	}
	
}
