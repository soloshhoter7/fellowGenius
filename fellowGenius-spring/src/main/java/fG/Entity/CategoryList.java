package fG.Entity;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
@Data
public class CategoryList {
 @Id
 @GeneratedValue(strategy = GenerationType.AUTO)
 Integer categoryId;
 String categoryName;
@Override
public String toString() {
	return "CategoryList [categoryId=" + categoryId + ", categoryName=" + categoryName + "]";
}
 
}
