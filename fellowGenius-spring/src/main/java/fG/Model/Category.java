package fG.Model;

public class Category {
	String category;
	String subCategory;
	public String getCategory() {
		return category;
	}
	public void setCategory(String category) {
		this.category = category;
	}
	public String getSubCategory() {
		return subCategory;
	}
	public void setSubCategory(String subCategory) {
		this.subCategory = subCategory;
	}
	@Override
	public String toString() {
		return "Category [category=" + category + ", subCategory=" + subCategory + "]";
	}
	
}
