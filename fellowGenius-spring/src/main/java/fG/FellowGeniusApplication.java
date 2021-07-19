package fG;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationEnvironmentPreparedEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.scheduling.annotation.EnableScheduling;

import fG.Service.UserService;

@SpringBootApplication
@EnableScheduling
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


