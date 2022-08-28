package fG.Service;


import com.fasterxml.jackson.databind.util.JSONPObject;
import fG.Enum.WhatsappMessageType;
import org.apache.tomcat.util.json.JSONParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.*;

@Service
public class WhatsappService {

    @Value("${whatsAppApiKey}")
    private String ApiKey;
    private final List<String> adminContacts = Arrays.asList("918076490605","918708773832");

    public void initiateWhatsAppMessage(String message) {
        for(String contact:adminContacts){
            sendWhatsappMessage(message,contact);
        }
    }

    public String sendWhatsappMessage(String message,String recipientPhoneNumber) {
        RestTemplate restTemplate = new RestTemplate();
        String payload = "{\n" +
                "    \"message\": {\n" +
                "        \"channel\": \"WABA\",\n" +
                "        \"content\": {\n" +
                "            \"preview_url\": false,\n" +
                "            \"text\": \""+message+"\",\n" +
                "            \"type\": \"AUTO_TEMPLATE\"\n" +
                "        },\n" +
                "        \"recipient\": {\n" +
                "            \"to\": \""+recipientPhoneNumber+"\",\n" +
                "            \"recipient_type\": \"individual\",\n" +
                "            \"reference\": {\n" +
                "                \"cust_ref\": \"cust_ref123\",\n" +
                "                \"messageTag1\": \"Message Tag 001\",\n" +
                "                \"conversationId\": \"Conv_123\"\n" +
                "            }\n" +
                "        },\n" +
                "        \"sender\": {\n" +
                "            \"name\": \"FellowGenius\",\n" +
                "            \"from\": \"918929408701\"\n" +
                "        },\n" +
                "        \"preferences\": {\n" +
                "            \"webHookDNId\": \"1001\"\n" +
                "        }\n" +
                "    },\n" +
                "    \"metaData\": {\n" +
                "        \"version\": \"v1.0.9\"\n" +
                "    }\n" +
                "}";

        String url = "https://rcmapi.instaalerts.zone/services/rcm/sendMessage";

        MultiValueMap<String, String> headers = new LinkedMultiValueMap<String, String>();
        Map map = new HashMap<String, String>();
        map.put("Content-Type", "application/json");
        map.put("Authentication","Bearer "+ApiKey);
        headers.setAll(map);


        HttpEntity<String> request = new HttpEntity<>(payload, headers);
        String response = new RestTemplate().postForObject(url,request,String.class);
        return response;

    }
}
