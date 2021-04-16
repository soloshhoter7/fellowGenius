package fG;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class FellowGeniusApplication {

	public static void main(String[] args) {
		SpringApplication.run(FellowGeniusApplication.class, args);
	}

}
