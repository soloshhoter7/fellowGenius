package fG.Model;

import java.util.Date;

public class NotificationModel {

String pictureUrl;
Date timestamp;
String message;
boolean readStatus;


public String getPictureUrl() {
	return pictureUrl;
}
public void setPictureUrl(String pictureUrl) {
	this.pictureUrl = pictureUrl;
}
public Date getTimestamp() {
	return timestamp;
}
public void setTimestamp(Date timestamp) {
	this.timestamp = timestamp;
}
public String getMessage() {
	return message;
}
public void setMessage(String message) {
	this.message = message;
}
public boolean isReadStatus() {
	return readStatus;
}
public void setReadStatus(boolean readStatus) {
	this.readStatus = readStatus;
}
@Override
public String toString() {
	return "NotificationModel [pictureUrl=" + pictureUrl + ", timestamp=" + timestamp + ", message=" + message
			+ ", readStatus=" + readStatus + "]";
}


}
