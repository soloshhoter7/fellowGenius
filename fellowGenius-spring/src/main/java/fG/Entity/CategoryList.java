package fG.Entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class CategoryList {
 @Id
 @GeneratedValue(strategy = GenerationType.AUTO)
 Integer categoryId;
 String categoryName;
public Integer getCategoryId() {
	return categoryId;
}
public void setCategoryId(Integer categoryId) {
	this.categoryId = categoryId;
}
public String getCategoryName() {
	return categoryName;
}
public void setCategoryName(String categoryName) {
	this.categoryName = categoryName;
}
@Override
public String toString() {
	return "CategoryList [categoryId=" + categoryId + ", categoryName=" + categoryName + "]";
}
 
}
