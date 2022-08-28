package fG.Repository;

import fG.Entity.TaskDefinitionDetails;
import org.springframework.data.jpa.repository.JpaRepository;

public interface repositoryTaskDefinitions extends JpaRepository<TaskDefinitionDetails,String> {
}
