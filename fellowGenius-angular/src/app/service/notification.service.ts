import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationCount =0;
  increaseNotificationCount(num){
    this.notificationCount+=num;
  }
  getNotificationCount(){
    return this.notificationCount;
  }
  constructor() { }
}
