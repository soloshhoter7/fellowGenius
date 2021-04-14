package fG.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import fG.Entity.SubcategoryList;
@Repository
public interface repositorySubCategoryList extends JpaRepository<SubcategoryList, Integer>{

	@Query(value = "SELECT * FROM subcategory_list WHERE category_id=?1", nativeQuery = true)   
	List<SubcategoryList> findSubCategories(Integer categoryId);
}
