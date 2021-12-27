package fG.Configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketTransportRegistration;
import org.springframework.web.socket.server.standard.ServletServerContainerFactoryBean;
import org.springframework.web.socket.server.support.HttpSessionHandshakeInterceptor;

@Configuration		
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer{
	
	
		@Override
		public void registerStompEndpoints(StompEndpointRegistry registry) {
			registry.addEndpoint("/fellowGenius").setAllowedOrigins("*").addInterceptors(new HttpSessionHandshakeInterceptor()).withSockJS();
		}
	
		@Override
		public void configureMessageBroker(MessageBrokerRegistry config) {
			config.enableSimpleBroker("/inbox/","/user/");
		}
      
		@Override
	    public void configureWebSocketTransport(WebSocketTransportRegistration registration) {
	        registration.setMessageSizeLimit(104857600*3); // default : 64 * 1024
	        registration.setSendTimeLimit(15 * 10000); // default : 10 * 10000
	        registration.setSendBufferSizeLimit(104857600*3); // default : 512 * 1024
	    }
}

