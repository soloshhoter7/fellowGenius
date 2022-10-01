package fG.Service;



import fG.Utils.MiscellaneousUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;

import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import java.util.*;

@Service
public class WhatsappService {

    @Value("${whatsAppApiKey}")
    private String ApiKey;
    @Value("${whatsAppUserName}")
    private String whatsappUserName;
    @Value("${whatsAppPassword}")
    private String whatsappPassword;
    @Value("${whatsAppBusinessNumber}")
    private String whatsappBusinessNumber;

    @Autowired
    MiscellaneousUtils miscUtils;

    private final List<String> adminContacts = Arrays.asList("918076490605","918708773832");

    public void initiateWhatsAppMessage(String message) {
        for(String contact:adminContacts){
            sendWhatsappMessage(message,contact);
        }
    }

    public String sendWhatsappMessage(String message,String recipientPhoneNumber) {
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
        return callPostApi(payload, url);
    }
    public void sendPlainTextTemplateMessages(String templateId,List<String> parameters,List<String> buttonPayloads,String recipientPhoneNumber){
        String validRecipientPhoneNumber = miscUtils.validAndCorrectPhoneNumber(recipientPhoneNumber);
        templateId = templateId.toLowerCase(Locale.ROOT);
        String jsonParams = miscUtils.parameterToJSON(parameters);
        String buttonparams="";
        if(buttonPayloads.size()>0){
            buttonparams="\"buttons\": {\n" +
                    "                    \"actions\": [\n" +
                    "                        {\n" +
                    "                            \"type\": \"url\",\n" +
                    "                            \"index\": \"0\",\n" +
                    "                            \"payload\": \""+ buttonPayloads.get(0) +"\"\n" +
                    "                        }\n" +
                    "                    ]\n" +
                    "                }";
            jsonParams=jsonParams+",";
        }

        if(!validRecipientPhoneNumber.equals("Invalid")){
            System.out.println("opt in result :"+optInMobileNumber(validRecipientPhoneNumber));
            String payload = "{\n" +
                    " \"message\": {\n" +
                    " \"channel\": \"WABA\",\n" +
                    " \"content\": {\n" +
                    " \"preview_url\": false,\n" +
                    " \"type\": \"MEDIA_TEMPLATE\",\n" +
                    " \"mediaTemplate\": {\n" +
                    " \"templateId\": \""+templateId+"\",\n" +
                    " \"bodyParameterValues\":"+jsonParams+"\n" +
                    buttonparams+
                    " }\n" +
                    " },\n" +
                    " \"recipient\": {\n" +
                    " \"to\": \""+validRecipientPhoneNumber+"\",\n" +
                    " \"recipient_type\": \"individual\",\n" +
                    " \"reference\": {\n" +
                    " \"cust_ref\": \"Some Customer Ref\",\n" +
                    " \"messageTag1\": \"Message Tag Val1\",\n" +
                    " \"conversationId\": \"Some Optional Conversation ID\"\n" +
                    " }\n" +
                    " },\n" +
                    " \"sender\": {\n" +
                    " \"from\": \""+whatsappBusinessNumber+"\"\n" +
                    " },\n" +
                    " \"preferences\": {\n" +
                    " \"webHookDNId\": \"1001\"\n" +
                    " }\n" +
                    " },\n" +
                    " \"metaData\": {\n" +
                    " \"version\": \"v1.0.9\"\n" +
                    " }\n" +
                    "}\n";
           // System.out.println("Payload is "+payload);
            String url = "https://rcmapi.instaalerts.zone/services/rcm/sendMessage";
            System.out.println("send message res:"+callPostApi(payload,url));
        }

    }

    String callPostApi(String payload, String url){
        MultiValueMap<String, String> headers = new LinkedMultiValueMap<String, String>();
        Map map = new HashMap<String, String>();
        map.put("Content-Type", "application/json");
        map.put("Authentication","Bearer "+ApiKey);
        headers.setAll(map);
        HttpEntity<String> request = new HttpEntity<>(payload, headers);
        String response = new RestTemplate().postForObject(url,request,String.class);
        return response;
    }
    String optInMobileNumber(String recipientPhoneNumber){
        String url = "http://vapi.instaalerts.zone/optin?uname="+whatsappUserName+"&pass="+whatsappPassword+"&optinid="+whatsappBusinessNumber+"&action=optin&mobile="+recipientPhoneNumber;
        return callPostApi("",url);
    }
}
