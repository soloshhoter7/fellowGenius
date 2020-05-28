package fG.Service;

import java.lang.reflect.Field;
import java.util.Date;

import org.springframework.stereotype.Service;

import fG.Entity.TutorProfileDetails;

@Service
public class queryGenerator {
     String createQuery(Object object) throws IllegalArgumentException, IllegalAccessException {
    	StringBuilder query = new StringBuilder();
    	
    	for (Field field : object.getClass().getDeclaredFields()) {
    		if(field.getName()!="tid") {
    		field.setAccessible(true);
    		StringBuilder subQuery = new StringBuilder();
    		
    		Class<?> intType = Integer.class;
    		Class<?> stringType = String.class;
    		Class<?> dateType = Date.class;
    		
    	    Object value = field.get(object); 
    	    
    	    if (value != null) {
    	    	String queryValue = new String();
    	    	if(field.getType().isAssignableFrom(intType)) {
    	    	    queryValue=field.getName()+"="+field.get(object)+",";
        		}else if(field.getType().isAssignableFrom(stringType)) {
        			queryValue = field.getName()+"='"+field.get(object)+"',";
        		}
    	    	subQuery.append(queryValue);
//    	        System.out.println(field.getName()+" : "+value);
    	    }
    	    query.append(subQuery);
    	}  
    	}
    	if( query.length() > 0 ) {
            query.deleteCharAt(query.length() - 1 );
    	}
    	System.out.println(query);
    	return query.toString();
    }
    	
}
