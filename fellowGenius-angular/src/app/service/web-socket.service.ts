import { Injectable, NgZone } from '@angular/core';
import * as Stomp from 'stompjs';
import { MessageModel } from './../model/message';
import { LoginDetailsService } from './login-details.service';
import { StudentService } from './student.service';
import { TutorService } from './tutor.service';
import { ChatService } from './chat.service';
import * as SockJS from 'sockjs-client';
import { NotificationService } from './notification.service';
import { TutorDashboardComponent } from '../home/dashboard/tutor-dashboard.component';

@Injectable({
	providedIn: 'root'
})
export class WebSocketService {
	greetings: string[] = [];
	ws: any;
	senderDetails: any;
	userId;
	constructor(
		private loginService: LoginDetailsService,
		private tutorService: TutorService,
		private studentService: StudentService,
		private chatService: ChatService,
		private notificationService:NotificationService,
		private zone: NgZone,
	) {}
	loginType;
	connectToUserWebSocket(userId) {
		// let socket = new WebSocket('ws://backend.fellowgenius.com/fellowGenius');
		// let socket = new SockJS('https://backend.fellowgenius.com/fellowGenius');
		let socket = new SockJS('http://localhost:5000/fellowGenius');

		this.ws = Stomp.over(socket);
		let that = this;
		this.ws.connect(
		  {},
		  (frame) => {
			this.loginType = this.loginService.getLoginType();
			that.ws.subscribe('/errors', (message) => {
			  alert('Error ' + message.body);
			});
			that.ws.subscribe('/user/Notifications/' +userId, (message) => {
				console.log(message);
				// var res = JSON.parse(message.body);

				if(message.body=="updateNotification"){
					console.log('message matched');
					if(this.loginType&&this.loginType=='Expert'&&this.tutorService.getTutorDetials().tid!=null){
						// this.notificationService.increaseNotificationCount(1);
						// location.reload();
						this.notificationService.fetchNotification();
						this.tutorService.fetchTutorPendingBookings();
					}else if(this.loginType&&this.loginType=='Learner'&&this.studentService.getStudentProfileDetails().sid!=null){
						this.notificationService.fetchNotification();
						this.studentService.fetchStudentPendingBookings();
					}
				}
			
			});
		  },
		  (error) => {
			if(userId){
				console.log('re initiating the connection !');
				setTimeout(() => {
					this.connectToUserWebSocket(userId);
				  }, 5000);
			}
		  }
		);
		
	}
	sendAppointmentNotfication( data,userId) {
		this.ws.send('/sendNotification/' + userId, {}, data);
	}

}
