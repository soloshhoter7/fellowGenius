package fG.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import fG.Configuration.JwtUtil;
import fG.Model.AuthenticationRequest;
import fG.Model.AuthenticationResponse;
import fG.Service.UserService;


@RestController
//@CrossOrigin(origins = "https://fellowgenius.com")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthenticationController {
	
		@Autowired
		private UserService userDetailsService;

		@Autowired
		private JwtUtil jwtTokenUtil;
         
		@Autowired
		private BCryptPasswordEncoder encoder;
		
		@RequestMapping(value = "/student/hello")
		@ResponseBody
		public String helloStudent() {
			System.out.println("hello student");
			return "Hello student";
		}
//
//		@RequestMapping(value = "/authenticateStudent", method = RequestMethod.POST)
//		public ResponseEntity<?> studentAuthentication(@RequestBody AuthenticationRequest authenticationRequest)
//				throws Exception {
//        
//            String password =  encoder.encode(authenticationRequest.getPassword());
//            System.out.println(password);
//	        final String userId = userDetailsService.validateStudentUser(authenticationRequest.getEmail(), authenticationRequest.getPassword());
//	        System.out.println("userId ->"+userId);
//	        if(userId!=null) {
//	    		final String jwt = jwtTokenUtil.generateToken(userId,"STUDENT");
//	    		System.out.println(new AuthenticationResponse(jwt));
//	    		return ResponseEntity.ok(new AuthenticationResponse(jwt));
//	        }else {
//	        	 return ResponseEntity.ok(new AuthenticationResponse("false"));
//	        }
//		}
//		
//		@RequestMapping(value = "/authenticateTutor", method = RequestMethod.POST)
//		public ResponseEntity<?> tutorAuthentication(@RequestBody AuthenticationRequest authenticationRequest) {
//
//	        final String userId = userDetailsService.validateTutorUser(authenticationRequest.getEmail(), authenticationRequest.getPassword());
//	        if(userId!=null) {
//	    		final String jwt = jwtTokenUtil.generateToken(userId,"TUTOR");
//	    		return ResponseEntity.ok(new AuthenticationResponse(jwt));
//	        }else {
//	        	return ResponseEntity.ok(new AuthenticationResponse("false"));
//	        }
//		}
		
		@RequestMapping(value ="/authenticate",method = RequestMethod.POST)
		public ResponseEntity<?> authentication(@RequestBody AuthenticationRequest authenticationRequest){
			String password =  encoder.encode(authenticationRequest.getPassword());
	        final String userId = userDetailsService.validateUser(authenticationRequest.getEmail(), authenticationRequest.getPassword());
	        
	        if(userId!=null) {
	        	final String role = userDetailsService.fetchUserRole(userId);
	    		final String jwt = jwtTokenUtil.generateToken(userId,role);
	    		System.out.println(new AuthenticationResponse(jwt));
	    		return ResponseEntity.ok(new AuthenticationResponse(jwt));
	        }else {
	        	 return ResponseEntity.ok(new AuthenticationResponse("false"));
	        }
		}
}
