package fG.Configuration;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.core.env.Environment;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import fG.Service.UserService;


@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfigurer extends WebSecurityConfigurerAdapter implements WebMvcConfigurer{
  
	@Autowired
	private UserService myUserDetailsService;
	
	@Autowired
	private JwtRequestFilter jwtRequestFilter;
	
	@Autowired
	private Environment env;

	
	@Override
	@Bean
	public AuthenticationManager authenticationManagerBean() throws Exception {
		return super.authenticationManagerBean();
	}
	
	@Autowired
    public void globalUserDetails(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(myUserDetailsService)
                .passwordEncoder(encoder());
    }
	
	@Override
	protected void configure(AuthenticationManagerBuilder auth) throws Exception {
		auth.userDetailsService(myUserDetailsService);
	}
	
	@Override 
	public void addCorsMappings(CorsRegistry registry) {
		String[] activeProfiles = env.getActiveProfiles();      // it will return String Array of all active profile.  
        String profile = activeProfiles[0];
        System.out.println("profile is: "+profile);
        if(profile.equals("dev")){
        	registry.addMapping("/**").allowedOrigins("http://localhost:4200");	
        }else if(profile.equals("prod")) {
        	registry.addMapping("/**").allowedOrigins("https://fellowgenius.com","https://www.fellowgenius.com");	
        }
		
	}
	
	@Override
	protected void configure(HttpSecurity http) throws Exception {
		String[] activeProfiles = env.getActiveProfiles();      // it will return String Array of all active profile.  
        String profile = activeProfiles[0];
        System.out.println("profile is: "+profile);
//        if(profile.equals("prod")) {
//        	http.requiresChannel().anyRequest().requiresSecure();
//        }
		
//        
		http.csrf().disable()
		.authorizeRequests()
//		.antMatchers("/authenticateStudent").permitAll()
//		.antMatchers("/authenticateTutor").permitAll()
		.antMatchers("/authenticate").permitAll()
		.antMatchers("/authenticateAdmin").permitAll()
//		.antMatchers("/fellowGenius/registerStudent").permitAll()
//		.antMatchers("/fellowGenius/registerTutor").permitAll()
		.antMatchers("/fellowGenius/registerUser").permitAll()
		.antMatchers("/fellowGenius/fetchTutorList").permitAll()
		.antMatchers("/fellowGenius/fetchTutorProfileDetails").permitAll()
		.antMatchers("/fellowGenius/registerSocialLogin").permitAll()
		.antMatchers("/fellowGenius/meeting/sendEmail").permitAll()
		.antMatchers("/fellowGenius/addCategories").permitAll()
		.antMatchers("/fellowGenius/getAllCategories").permitAll()
		.antMatchers("/fellowGenius/getAllCategories").permitAll()
		.antMatchers("/fellowGenius/**").permitAll()
		.anyRequest().authenticated()
		.and()
		.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
		
		http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);
	}
	
	
	
	 @Bean
	 public BCryptPasswordEncoder encoder(){
	     return new BCryptPasswordEncoder();
	 }
}
