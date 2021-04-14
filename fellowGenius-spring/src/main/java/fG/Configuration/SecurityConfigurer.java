package fG.Configuration;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import fG.Service.UserService;


@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfigurer extends WebSecurityConfigurerAdapter{
  
	@Autowired
	private UserService myUserDetailsService;
	
	@Autowired
	private JwtRequestFilter jwtRequestFilter;
	
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
//	 
	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http.csrf().disable()
		.authorizeRequests()
//		.antMatchers("/authenticateStudent").permitAll()
//		.antMatchers("/authenticateTutor").permitAll()
		.antMatchers("/authenticate").permitAll()
//		.antMatchers("/fellowGenius/registerStudent").permitAll()
//		.antMatchers("/fellowGenius/registerTutor").permitAll()
		.antMatchers("/fellowGenius/registerUser").permitAll()
		.antMatchers("/fellowGenius/fetchTutorList").permitAll()
		.antMatchers("/fellowGenius/fetchTutorProfileDetails").permitAll()
		.antMatchers("/fellowGenius/registerSocialLogin").permitAll()
		.antMatchers("/fellowGenius/meeting/sendEmail").permitAll()
		.antMatchers("/fellowGenius/addCategories").permitAll()
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
