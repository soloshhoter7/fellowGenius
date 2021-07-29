import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { NotificationModel } from '../model/notification';
import { HttpService } from './http.service';
import { LoginDetailsService } from './login-details.service';
import { StudentService } from './student.service';
import { TutorService } from './tutor.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationCount =0;
  private notificationList:NotificationModel[]=[];
  private userId;
  notificationsChanged = new Subject<NotificationModel[]>();
  constructor(
    private loginService:LoginDetailsService,
    private tutorService:TutorService,
    private studentService:StudentService,
    private httpService:HttpService
    ){}
  increaseNotificationCount(num){
    this.notificationCount+=num;
  }
  getNotificationCount(){
    
    return this.notificationCount;
  }
  getNotifications(){
    return this.notificationList.slice();
  }
  setNotification(notification:NotificationModel[]){
    this.notificationList = notification;
    this.notificationCount=0;
    let count=0;
    this.notificationList.forEach(function (notification) {
      if(notification.readStatus==false){
        count++;
      }
    });
    this.increaseNotificationCount(count); 
    this.notificationsChanged.next(this.notificationList.slice());
  }
  fetchNotification(){
    let loginType = this.loginService.getLoginType();
    if(loginType&&loginType=='Expert'){
      this.userId = this.tutorService.getTutorDetials().bookingId;
    }else if(loginType&&loginType=='Learner'){
      this.userId=this.studentService.getStudentProfileDetails().sid;
    }
    if(this.userId){
      this.httpService.fetchNotifications(this.userId).subscribe((res)=>{
        this.setNotification(res);
      });
    }
  }
  
}
