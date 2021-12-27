package fG.Configuration;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import fG.Service.UserService;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {
 
	@Autowired
	private UserService userDetailsService;
	@Autowired
	private JwtUtil jwtUtil;
	
	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		final String authorizationHeader = request.getHeader("Authorization");
		String userId = null;
		String jwt = null;
		String role = null;
		
		if(authorizationHeader!=null&&authorizationHeader.startsWith("Bearer ")) {
			jwt = authorizationHeader.substring(7);
			userId =  jwtUtil.extractUsername(jwt);
			role = jwtUtil.extractRole(jwt);
		}
		
		if(userId!=null && SecurityContextHolder.getContext().getAuthentication() == null) {
		
			if(role.equals("Learner")||role.equals("Expert")){
				UserDetails userDetails = this.userDetailsService.loadUserByUserId(userId);
				if(jwtUtil.validateToken(jwt, userDetails)) {
					UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken
							(userDetails,null,userDetails.getAuthorities());				
					usernamePasswordAuthenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
					SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
				}
			}else if(role.equals("Admin")) {
				UserDetails userDetails = this.userDetailsService.loadUserByUserId(userId);
				if(jwtUtil.validateToken(jwt, userDetails)) {
					UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken
							(userDetails,null,userDetails.getAuthorities());				
					usernamePasswordAuthenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
					SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
				}
			}
		}
		filterChain.doFilter(request, response);
		
	}

}
