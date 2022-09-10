package fG.Entity;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

@Entity
@Table(name="ExpertiseAreas")
public class ExpertiseAreas {
 
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	Long id;
	
	@OneToOne
	@JoinColumn(name="category_id")
	CategoryList category;
	
	@OneToOne
	@JoinColumn(name="sub_category_id")
	SubcategoryList subCategory;
	
	@NotNull
	Integer price;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name="user_id",nullable=false)
	TutorProfileDetails userId;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	

	public TutorProfileDetails getUserId() {
		return userId;
	}

	public void setUserId(TutorProfileDetails userId) {
		this.userId = userId;
	}
    
	public Integer getPrice() {
		return price;
	}

	public void setPrice(Integer price) {
		this.price = price;
	}

	public CategoryList getCategory() {
		return category;
	}

	public void setCategory(CategoryList category) {
		this.category = category;
	}

	

	public SubcategoryList getSubCategory() {
		return subCategory;
	}

	public void setSubCategory(SubcategoryList subCategory) {
		this.subCategory = subCategory;
	}

//	@Override
//	public String toString() {
//		return "ExpertiseAreas [id=" + id + ", category=" + category + ", subCategory=" + subCategory + ", price="
//				+ price + ", userId=" + userId + "]";
//	}

}
