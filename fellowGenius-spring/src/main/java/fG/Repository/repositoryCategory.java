package fG.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import fG.Entity.CategoryList;

@Repository
public interface repositoryCategory extends JpaRepository<CategoryList,Integer> {

	@Query(value = "SELECT * FROM category_list WHERE category_name=?1", nativeQuery = true)   
	CategoryList findCategory(String categoryName);
	
}
