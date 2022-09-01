package fG.Entity;

import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
@Data
public class LearningAreasCount {
	@Id
	@Column(length=50)
	String learningArea;
	Integer count = 0;
}
