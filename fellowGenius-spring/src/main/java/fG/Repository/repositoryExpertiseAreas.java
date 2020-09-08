package fG.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import fG.Entity.ExpertiseAreas;

@Repository
public interface repositoryExpertiseAreas extends JpaRepository<ExpertiseAreas,Long> {

}
