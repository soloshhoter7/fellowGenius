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
	socket = new WebSocket('wss://backend.fellowgenius.com/fellowGenius');
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
				var res = JSON.parse(message.body);

				if(res.message=="new appointment request"){
					console.log('message matched!')
					if(this.loginType&&this.loginType=='Expert'&&this.tutorService.getTutorDetials().tid!=null){
						this.notificationService.increaseNotificationCount(1);
						
					}
				}
			
			});
			// this.sendMessageToMeeting(userId);
		  },
		  (error) => {
			// alert('STOMP error ' + error);
			console.log('re initiating the connection !');
			
			// setTimeout(() => {
			//   this.connectToUserWebSocket(this.meeting.roomName);
			// }, 5000);
		  }
		);
		
	}
	sendAppointmentRequestNotfication( userId: string) {
		let data = JSON.stringify({
		  message: "new appointment request",
		});
		this.ws.send('/sendNotification/' + userId, {}, data);
	  }
	// public getSenderDetails(): any {
	// 	return this.senderDetails;
	// }
	// public setSenderDetails(value: any) {
	// 	this.senderDetails = value;
	// }

	// connect() {
	// 	var id: number;

	// 	if (this.loginService.getLoginType() == 'student') {
	// 		this.senderDetails = this.studentService.getStudentProfileDetails();
	// 		id = this.senderDetails.sid;
	// 	} else if (this.loginService.getLoginType() == 'tutor') {
	// 		this.senderDetails = this.tutorService.getTutorDetials();
	// 		id = this.senderDetails.tid;
	// 	}

	// 	this.ws = Stomp.over(this.socket);
	// 	let that = this;

	// 	this.ws.connect(
	// 		{},
	// 		function(frame) {
	// 			that.ws.subscribe('/errors', function(message) {
	// 				alert('Error ' + message.body);
	// 			});

	// 			that.ws.subscribe('/inbox/coversation/' + id, function(message) {
	// 				var res: any = JSON.parse(message.body);

	// 				var msg: MessageModel = new MessageModel();
	// 				msg.messageText = res.message.messageText;
	// 				msg.senderName = res.message.senderName;
	// 				that.chatService.setChat(msg);
	// 			});
	// 		},
	// 		function(error) {
	// 			alert('STOMP error ' + error);
	// 		}
	// 	);
	// }

	// disconnect() {
	// 	if (this.ws != null) {
	// 		this.ws.ws.close();
	// 	}
	// }
	// //for sending one to one message
	// sendMessage(message: MessageModel) {
	// 	let data = JSON.stringify({
	// 		message: message
	// 	});
	// 	this.ws.send('/messaging/' + message.receiverId, {}, data);
	// }
	// //for sending message to the booking
	// sendMessageToMeeting(message: MessageModel, bookingId: string) {
	// 	bookingId = 'a123';
	// 	let data = JSON.stringify({
	// 		message: message
	// 	});
	// 	this.ws.send('/sendChat/' + bookingId, {}, data);
	// }

}
