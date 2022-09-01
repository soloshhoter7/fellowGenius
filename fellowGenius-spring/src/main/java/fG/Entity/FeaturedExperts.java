package fG.Entity;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Id;


@Entity
@Data
public class FeaturedExperts {
	private String name;
	@Id
	private Integer expertId;
	private String profilePictureUrl;
	private String topic;
	private Integer precedence;
}
