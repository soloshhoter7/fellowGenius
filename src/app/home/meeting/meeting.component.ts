import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import {
	NgxAgoraService,
	Stream,
	AgoraClient,
	ClientEvent,
	StreamEvent,
	LocalStreamStats,
	RemoteStreamStats,
	StreamStats
} from 'ngx-agora';
import { timer, Subscription } from 'rxjs';
import { MeetingService } from 'src/app/service/meeting.service';
import { meetingDetails } from 'src/app/model/meetingDetails';
import { Router } from '@angular/router';

const numbers = timer(3000, 1000);

@Component({
	selector: 'app-meeting',
	templateUrl: './meeting.component.html',
	styleUrls: [ './meeting.component.css' ]
})
export class MeetingComponent implements OnInit {
	meeting = new meetingDetails();
	localCallId = 'agora_local';
	screenCallId = 'agora_screen';
	remoteCalls: string[] = [];
	screenRemoteCalls: string[] = [];
	localStreams: string[] = [];
	remoteVideoMute = false;
	muteHostVideoStatus = 'mute host video';
	hostVideo = true;
	muteHostAudioStatus = 'mute host mic';
	hostScreenShareStatus = false;
	timelimit = 100;
	timeLeft = this.timelimit;
	subscription: Subscription;
	private client: AgoraClient;
	private screenClient: AgoraClient;
	private localStream: Stream;
	private screenStream: Stream;
	private uid: number;
	private sid: number;

	constructor(
		private ngxAgoraService: NgxAgoraService,
		public meetingService: MeetingService,
		public router: Router
	) {
		this.uid = Math.floor(Math.random() * 100);
		this.sid = 76;
	}

	ngOnInit() {
		this.meeting = this.meetingService.getMeeting();
		console.log(this.meeting);
		this.shortName();
		//---------------------------------------------- normal camera stream ----------------------------------
		this.client = this.ngxAgoraService.createClient({ mode: 'rtc', codec: 'h264' });
		this.assignClientHandlers();
		this.localStream = this.ngxAgoraService.createStream({
			streamID: this.uid,
			audio: true,
			video: true,
			screen: false
		});
		this.assignLocalStreamHandlers();
		this.initLocalStream();
		this.initLocalStream(() => this.join((uid) => this.publish(), (error) => console.error(error)));
		//-----------------------------------------------screen sharing-----------------------------------------

		//----------------------------------------------------------------------------------------------------------
	}
	shareScreen() {
		if (this.meetingService.getMeeting().role == 'host') {
			this.screenClient = this.ngxAgoraService.createClient({ mode: 'rtc', codec: 'h264' });
			this.assignScreenClientHandlers();
			this.screenStream = this.ngxAgoraService.createStream({
				streamID: this.uid,
				audio: false,
				video: false,
				screen: true
			});
			this.initScreenStream(() =>
				this.screenJoin((sid) => this.screenPublish(), (error) => console.error(error))
			);
		}
	}
	endCall() {
		if (this.meeting.role == 'host') {
			this.screenStream.stop();
			this.screenClient.leave();
		}
		this.localStream.stop();
		this.client.leave();
		this.router.navigate([ 'home' ]);
	}
	limitStream() {
		this.subscription = numbers.subscribe((x) => {
			this.timeLeft = this.timelimit - x;
			if (x == this.timelimit) {
				this.localStream.stop();
				this.subscription.unsubscribe();
				this.endCall();
			}
		});
	}
	//---------------------------------------------- client Handlers -------------------------------------------------------------
	// normal client handler
	private assignClientHandlers(): void {
		this.client.on(ClientEvent.LocalStreamPublished, (evt) => {
			console.log('Publish local stream successfully');
		});

		this.client.on(ClientEvent.Error, (error) => {
			console.log('Got error msg:', error.reason);
			if (error.reason === 'DYNAMIC_KEY_TIMEOUT') {
				this.client.renewChannelKey(
					'',
					() => console.log('Renewed the channel key successfully.'),
					(renewError) => console.error('Renew channel key failed: ', renewError)
				);
			}
		});

		this.client.on(ClientEvent.RemoteStreamAdded, (evt) => {
			const stream = evt.stream as Stream;
			var id = stream.getId();

			if (!this.localStreams.includes(id.toString()) && id != 76) {
				console.log('//////////////////////////////////////////// -> going to subscribe normal stream');
				this.client.subscribe(stream, { audio: true, video: true }, (err) => {
					console.log('Subscribe stream failed', err);
				});
			} else if (this.meetingService.getMeeting().role == 'student' && id == 76) {
				console.log('//////////////////////////////////////////// -> going to subscribe screen stream');
				this.client.subscribe(stream, { audio: true, video: true }, (err) => {
					console.log('Subscribe screen stream failed', err);
				});
			}
		});

		this.client.on(ClientEvent.RemoteStreamSubscribed, (evt) => {
			const stream = evt.stream as Stream;
			const id = this.getRemoteId(stream);
			const idt = stream.getId();
			if (idt == 76) {
				this.screenRemoteCalls.push(id);
				console.log('///////////////////////////////////////////// -> played screen stream');
				setTimeout(() => stream.play(id), 1000);
			} else {
				if (!this.remoteCalls.length) {
					this.remoteCalls.push(id);
					console.log('///////////////////////////////////////////// -> played normal stream');
					setTimeout(() => stream.play(id), 1000);
					this.limitStream();
				}
			}
		});

		this.client.on(ClientEvent.RemoteStreamRemoved, (evt) => {
			const stream = evt.stream as Stream;
			if (stream) {
				stream.stop();
				this.remoteCalls = [];
				console.log(`Remote stream is removed ${stream.getId()}`);
				this.endCall();
			}
		});
		this.client.on(ClientEvent.RemoveVideoMuted, (evt) => {
			this.remoteVideoMute = true;
		});
		this.client.on(ClientEvent.RemoteVideoUnmuted, (evt) => {
			this.remoteVideoMute = false;
		});
		this.client.on(ClientEvent.PeerLeave, (evt) => {
			const stream = evt.stream as Stream;
			if (stream) {
				stream.stop();
				this.endCall();
				this.remoteCalls = this.remoteCalls.filter((call) => call !== `${this.getRemoteId(stream)}`);
				console.log(`${evt.uid} left from this channel`);
			}
		});
	}
	// screen client Handlers
	private assignScreenClientHandlers(): void {
		this.screenClient.on(ClientEvent.LocalStreamPublished, (evt) => {
			console.log('Publish local stream successfully');
		});
	}
	private getRemoteId(stream: Stream): string {
		return `agora_remote-${stream.getId()}`;
	}
	//----------------------------------------------------------------------------------------------------------
	//--------------------------------------stream Handlers----------------------------------------------------
	private assignLocalStreamHandlers(): void {
		this.localStream.on(StreamEvent.MediaAccessAllowed, () => {
			console.log('accessAllowed');
		});

		// The user has denied access to the camera and mic.
		this.localStream.on(StreamEvent.MediaAccessDenied, () => {
			console.log('accessDenied');
		});
	}
	//------------------------------------------------------------------------------------------------------------
	//------------------------------init functions for streams ---------------------------------------------------
	private initLocalStream(onSuccess?: () => any): void {
		this.localStream.init(
			() => {
				this.localStream.play(this.localCallId);
				if (onSuccess) {
					onSuccess();
				}
			},
			(err) => console.error('getUserMedia failed', err)
		);
	}

	private initScreenStream(onSuccess?: () => any): void {
		this.screenStream.init(
			() => {
				this.screenStream.play(this.screenCallId);
				if (onSuccess) {
					onSuccess();
				}
			},
			(err) => console.error('getUserMedia failed', err)
		);
	}
	//-----------------------------------------------------------------------------------------------------------------
	//-----------------------------------------join and publish functions----------------------------------------------

	join(onSuccess?: (uid: number | string) => void, onFailure?: (error: Error) => void): void {
		console.log('-------------------name--------------------' + this.meetingService.getMeeting().roomName);
		this.client.join(null, this.meetingService.getMeeting().roomName, this.uid, onSuccess, onFailure);
	}

	publish(): void {
		this.client.publish(this.localStream, (err) => console.log('Publish local stream error: ' + err));
	}

	screenJoin(onSuccess?: (sid: number | string) => void, onFailure?: (error: Error) => void): void {
		console.log(this.meetingService.getMeeting().roomName);
		this.localStreams.push(this.sid.toString());
		this.screenClient.join(null, this.meetingService.getMeeting().roomName, this.sid, onSuccess, onFailure);
	}

	screenPublish(): void {
		this.screenClient.publish(this.screenStream, (err) => console.log('Publish local stream error: ' + err));
	}
	// ------------------------------------------------------------------------------------------------------------------
	//--------------------------------------------- control button functions --------------------------------------------
	stopStream() {
		console.log('stream stopped !');
		this.endCall();
	}

	muteVideo() {
		if (this.muteHostVideoStatus == 'mute host video') {
			this.localStream.muteVideo();
			this.muteHostVideoStatus = 'unmute host video';
		} else if (this.muteHostVideoStatus == 'unmute host video') {
			this.localStream.unmuteVideo();
			this.muteHostVideoStatus = 'mute host video';
		}
	}

	muteAudio() {
		if (this.muteHostAudioStatus == 'mute host mic') {
			this.localStream.muteAudio();
			this.muteHostAudioStatus = 'unmute host mic';
		} else {
			this.localStream.unmuteAudio();
			this.muteHostAudioStatus = 'mute host mic';
		}
	}
	screenShare() {
		if (this.hostScreenShareStatus == false) {
			this.hostScreenShareStatus = true;
			// this.hostVideo = false;
			this.shareScreen();
		} else {
			this.hostScreenShareStatus = false;
			// this.hostVideo = true;
			this.screenStream.stop();
			this.screenStream.muteVideo();
		}
	}
	//-------------------------------------------------------------------------------------------------------------------
	//--------------------------------- for short Name ------------------------------------------------------------------
	shortName() {
		console.log('------------------------------ye room name hia' + this.meeting.roomName);
		var str = this.meeting.userName.split(' ');
		if (str[1] != undefined) {
			var fn = str[0];
			var ln = str[1];
		} else {
			var fn = str[0];
		}

		if (ln == undefined) {
			console.log('ye to undefined hai');
			var shortName = fn[0].toString();
			this.meeting.userName = shortName;
		} else {
			console.log(fn[0].toString() + ' ' + ln[0].toString());
			var shortName = fn[0].toString().concat(ln[0].toString());
			console.log(shortName);
			this.meeting.userName = shortName;
		}
	}
}
