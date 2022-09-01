package fG.Entity;

import lombok.Data;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;

@Entity
@Data
public class SubcategoryList {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	Integer subCategoryId;
	
	@OneToOne(cascade = {CascadeType.MERGE})
	@JoinColumn(name="category_id")
	CategoryList category;
	String subCategoryName;
}
