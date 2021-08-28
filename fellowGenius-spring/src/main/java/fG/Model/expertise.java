package fG.Model;

import java.io.Serializable;

public class expertise implements Serializable {
	 private static final long serialVersionUID = 1L;
	String category;
	String subCategory;
	Integer price;
	
	public Integer getPrice() {
		return price;
	}
	public void setPrice(Integer price) {
		this.price = price;
	}
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
		return "expertise [category=" + category + ", subCategory=" + subCategory + ", price=" + price + "]";
	}
}
