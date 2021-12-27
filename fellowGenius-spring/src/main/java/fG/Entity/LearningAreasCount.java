package fG.Entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class LearningAreasCount {
	@Id
	@Column(length=50)
	String learningArea;
	Integer count = 0;
	

	public String getLearningArea() {
		return learningArea;
	}
	public void setLearningArea(String learningArea) {
		this.learningArea = learningArea;
	}
	public int getCount() {
		return count;
	}
	public void setCount(int count) {
		this.count = count;
	}
	@Override
	public String toString() {
		return "LearningAreasCount [learningArea=" + learningArea + ", count=" + count + "]";
	}

}
