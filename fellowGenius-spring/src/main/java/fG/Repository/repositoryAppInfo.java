package fG.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import fG.Entity.AppInfo;
import fG.Entity.Notification;


@Repository
public interface repositoryAppInfo extends JpaRepository<AppInfo,String>{
	@Query(value = "SELECT * FROM app_info WHERE key_name=?1", nativeQuery = true)   
	AppInfo keyExist(String keyName);
	
	@Query(value = "SELECT * FROM app_info WHERE type=?1", nativeQuery = true)   
	List<AppInfo> typeExist(String type);
}
