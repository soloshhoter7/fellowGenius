import { SafeUrl } from '@angular/platform-browser';

export class MessageModel {
	messageText: string;
	senderId: number;
	senderName: string;
	senderEmail: string;
	senderProfilePicUrl: string;
	receiverId: number;
	sentTime: string;
	date: string;
	fileType: string;
	fileName: string;
	dataSource: SafeUrl;
}
