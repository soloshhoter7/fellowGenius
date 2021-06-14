package fG.Entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;

@Entity
public class SubcategoryList {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	Integer subCategoryId;
	
	@OneToOne
	@JoinColumn(name="category_id")
	CategoryList category;
	String subCategoryName;
	public CategoryList getCategory() {
		return category;
	}
	public void setCategory(CategoryList category) {
		this.category = category;
	}
	public String getSubCategoryName() {
		return subCategoryName;
	}
	public void setSubCategoryName(String subCategoryName) {
		this.subCategoryName = subCategoryName;
	}
	
	public Integer getSubCategoryId() {
		return subCategoryId;
	}
	public void setSubCategoryId(Integer subCategoryId) {
		this.subCategoryId = subCategoryId;
	}
	@Override
	public String toString() {
		return "SubcategoryList [category=" + category + ", subCategoryName=" + subCategoryName + "]";
	}
	
	
}
