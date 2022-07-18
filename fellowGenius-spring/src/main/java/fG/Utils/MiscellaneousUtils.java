package fG.Utils;

import org.springframework.stereotype.Service;

@Service
public class MiscellaneousUtils {
    public String generateCronExpression(int date,int month,int hours,int minutes,int seconds){
        return seconds+" "+minutes+" "+hours+" "+date+" "+month+" ?";
    }
}
