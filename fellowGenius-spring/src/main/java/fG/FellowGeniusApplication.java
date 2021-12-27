package fG;

import java.util.Date;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

@SpringBootApplication
public class FellowGeniusApplication {
	
	public static void main(String[] args) {
		SpringApplication application = new SpringApplication(FellowGeniusApplication.class);
//		addInitHooks(application);	
		application.run(args);
	}

//	private static void addInitHooks(SpringApplication application) {
//		application.addListeners((ApplicationListener<ApplicationEnvironmentPreparedEvent>) event -> {
////			UserService userService = new UserService();
//
////			if(userService!=null) {
//////				userService.addCategoriesAndSubCategories();
////				System.out.println("user service is null");
////			}
//		   });
//		
//	}
}
@Configuration
@EnableScheduling
@ConditionalOnProperty(name="scheduling.enabled",matchIfMissing=true)
class SchedulingConfiguration{
	
}


