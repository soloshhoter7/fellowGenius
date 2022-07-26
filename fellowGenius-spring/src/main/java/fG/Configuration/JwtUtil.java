package fG.Configuration;

import java.util.Arrays;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.jetbrains.annotations.NotNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.DecodedJWT;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@Service
public class JwtUtil {
  private String SECRET_KEY = "secret";
  
  public String extractUsername(String token) {
	  return extractClaim(token,Claims::getSubject);
  }
  
  public String extractRole(String token) {
	  final Claims claims = extractAllClaims(token);
	  return (String) claims.get("ROLE");
  }
  
  public Date extractExpiration(String token) {
	  return extractClaim(token,Claims::getExpiration);
  }
  
  public <T> T extractClaim(String token,Function<Claims,T> claimsResolver) {
	final Claims claims = extractAllClaims(token);
	return claimsResolver.apply(claims);
  }
  
  private Claims extractAllClaims(String token) {
	  return Jwts.parser().setSigningKey(SECRET_KEY).parseClaimsJws(token).getBody();
  }
  
  private Boolean isTokenExpired(String token) {
	  return extractExpiration(token).before(new Date());
  }
  
  public String generateToken(String userid,String role) {
	  Map<String,Object> claims = new HashMap<>();
	  return createToken(claims,userid,role);
  }
  public Boolean checkTokenIfExpired(String token) {
	  DecodedJWT jwt = JWT.decode(token);
		if( jwt.getExpiresAt().before(new Date())) {
		    return true;
		}else {
			return false;
		}
  }
  public String Auth0ExtractClaim(String token,String claim) {
	  DecodedJWT jwt = JWT.decode(token);
	  System.out.println(jwt.getClaims());
	  if(claim.equals("userId")) {
		  return jwt.getClaim("sub").asString(); 
	  }else {
		  return jwt.getClaim(claim).asString();
	  }  
  }
  private String createToken(Map<String,Object> claims,String subject,String role) {
	  return Jwts.builder()
			  .setClaims(claims)
			  .setSubject(subject)
			  .claim("ROLE", role)
			  .setIssuedAt(new Date(System.currentTimeMillis()))
			  .setExpiration(new Date(System.currentTimeMillis()+1000*60*60*10))
			  .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
			  .compact();
  }
  
  public Boolean validateToken(String token, @NotNull UserDetails userDetails) {
	  final String username = extractUsername(token);
	  return (username.equals(userDetails.getUsername())&& !isTokenExpired(token));
  }
  
  UsernamePasswordAuthenticationToken getAuthentication(final String token, final Authentication existingAuth, final UserDetails userDetails) {

      final JwtParser jwtParser = Jwts.parser().setSigningKey(SECRET_KEY);

      final Jws claimsJws = jwtParser.parseClaimsJws(token);

      final Claims claims = (Claims) claimsJws.getBody();

      final Collection authorities =
              Arrays.stream(claims.get("ROLE").toString().split(","))
                      .map(SimpleGrantedAuthority::new)
                      .collect(Collectors.toList());
      System.out.println(authorities);
      return new UsernamePasswordAuthenticationToken(userDetails, "", authorities);
  }
}
