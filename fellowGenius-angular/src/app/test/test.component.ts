
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute} from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { filtersApplied } from '../model/filtersApplied';
import { tutorProfileDetails } from '../model/tutorProfileDetails';
import { FiltersDialogComponent } from '../search-results/filters-dialog/filters-dialog.component';
import { ProfileService } from '../service/profile.service';
import {
  Component,
  OnInit,
  Pipe,
  PipeTransform,
  ViewChild,
  ElementRef,
  Input,
  Sanitizer,
  ViewChildren,
  HostListener,
} from '@angular/core';
import {
  DomSanitizer,
  SafeHtml,
  SafeUrl,
  SafeStyle,
} from '@angular/platform-browser';
import * as Stomp from 'stompjs';
import { fromEvent } from 'rxjs';
import { switchMap, takeUntil, pairwise } from 'rxjs/operators';
import {
  NgxAgoraService,
  Stream,
  AgoraClient,
  ClientEvent,
  StreamEvent,
  LocalStreamStats,
  RemoteStreamStats,
  StreamStats,
} from 'ngx-agora';
import * as SockJS from 'sockjs-client';
import { timer, Subscription } from 'rxjs';
import { MeetingService } from 'src/app/service/meeting.service';
import { meetingDetails } from 'src/app/model/meetingDetails';
import { Router } from '@angular/router';
import { bookingDetails } from 'src/app/model/bookingDetails';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarConfig } from '@angular/material/snack-bar';
import { MessageModel } from 'src/app/model/message';
import { WebSocketService } from 'src/app/service/web-socket.service';
import { DataSource } from '@angular/cdk/collections';
import { LocationStrategy } from '@angular/common';
import { LoginDetailsService } from 'src/app/service/login-details.service';
import { HttpService } from 'src/app/service/http.service';
import { CookieService } from 'ngx-cookie-service';
import * as jwt_decode from 'jwt-decode';
import { environment } from 'src/environments/environment';
const numbers = timer(3000, 1000);
@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css'],
})
export class TestComponent implements OnInit {
  constructor(
    private ngxAgoraService: NgxAgoraService,
    private meetingService: MeetingService,
    private router: Router,
    private snackbar: MatSnackBar,
    private sanitizer: DomSanitizer,
    private locationStrategy: LocationStrategy,
    private loginService: LoginDetailsService,
    private httpService: HttpService,
    private cookieService: CookieService
  ) {
    this.uid = Math.floor(Math.random() * 100);
    this.sid = 76;
  }
  //   ---------------------
 
  private cx: CanvasRenderingContext2D;
  newMessageNotification: boolean = false;
  meetingChat: MessageModel[] = [];
  greetings: string[] = [];
  showConversation: boolean = false;
  chatOpen: boolean = false;
  myClass: string = 'hideBlock';
  myScreenShareClass: string = 'hideBlock';
  ws: any;
  name: string;
  disabled: boolean;
  uploadedProfilePicture: File = null;
  undoStack: object[] = [];
  redoStack: object[] = [];
  list: object[] = [];
  //   ------------------------
  expandedScreen: boolean = false;
  expandEnabled: boolean = true;
  remoteJoined: boolean = false;
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
  timelimit = 0;
  timeLeft = this.timelimit;
  openWhiteBoardStatus: boolean = false;
  bookingDetails: bookingDetails;
  subscription: Subscription;
  message = new MessageModel();
  fileMessage = new MessageModel();
  messageText: string;
  messageToAdd = new MessageModel();
  senderName: string;
  fileUploadedBox = false;
  fileSizeExceeded = false;
  fileName = '';
  fileSize = '';
  uploadedFile: File;
  private client: AgoraClient;
  private screenClient: AgoraClient;
  private localStream: Stream;
  private screenStream: Stream;
  private uid: number;
  private sid: number;
  senderId;
  screenHeight;
  screenWidth;
  canvasEl: HTMLCanvasElement;
  canvasScreenShareEl: HTMLCanvasElement;
  config: MatSnackBarConfig = {
    duration: 7000,
    horizontalPosition: 'center',
    verticalPosition: 'top',
  };
  fileType: string;
  backendURL=environment.BACKEND_URL;

  micTriggered=false;
  clientVideoOn:boolean;
  clientMicOn:boolean;
  ngOnInit(): void {
    this.client = this.ngxAgoraService.createClient({
      mode: 'rtc',
      codec: 'h264',
    });
    this.assignClientHandlers();
    this.localStream = this.ngxAgoraService.createStream({
      streamID: this.uid,
      audio: true,
      video: true,
      screen: false,
    });
    this.assignLocalStreamHandlers();
    // this.initLocalStream();
    this.initLocalStream(() =>
      this.join(
        (uid) => this.publish(),
        (error) => console.error(error)
      )
    );
  }
    
    
    //---------------------------------------------- client Handlers -------------------------------------------------------------
    // normal client handler
    private assignClientHandlers(): void {
      this.client.on(ClientEvent.LocalStreamPublished, (evt) => {});
  
      this.client.on(ClientEvent.Error, (error) => {
        if (error.reason === 'DYNAMIC_KEY_TIMEOUT') {
          this.client.renewChannelKey('', () => (renewError) =>
            console.error('Renew channel key failed: ', renewError)
          );
        }
      });
  
      this.client.on(ClientEvent.RemoteStreamAdded, (evt) => {
        const stream = evt.stream as Stream;
        var id = stream.getId();
  
        if (!this.localStreams.includes(id.toString()) && id != 76) {
          this.client.subscribe(
            stream,
            { audio: true, video: true },
            (err) => {}
          );
        } else if (
          this.meetingService.getMeeting().role == 'student' &&
          id == 76
        ) {
          this.client.subscribe(
            stream,
            { audio: true, video: true },
            (err) => {}
          );
        }
      });
  
      this.client.on(ClientEvent.RemoteStreamSubscribed, (evt) => {
        const stream = evt.stream as Stream;
        const id = this.getRemoteId(stream);
        const idt = stream.getId();
        if (idt == 76) {
          this.screenRemoteCalls.push(id);
          setTimeout(() => stream.play(id), 1000);
        } else {
          if (!this.remoteCalls.length) {
            this.remoteCalls.push(id);
            setTimeout(() => stream.play(id), 1000);
            this.limitStream();
          }
        }
      });
  
      this.client.on(ClientEvent.RemoteStreamRemoved, (evt) => {
        const stream = evt.stream as Stream;
        const id = this.getRemoteId(stream);
        const idt = stream.getId();
        if (idt != 76) {
          if (stream) {
            stream.stop();
            this.remoteCalls = [];
            this.endCall();
          }
        } else if (idt == 76) {
          stream.stop();
          stream.close();
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
          this.remoteCalls = this.remoteCalls.filter(
            (call) => call !== `${this.getRemoteId(stream)}`
          );
        }
      });
    }
    // screen client Handlers
    private assignScreenClientHandlers(): void {
      this.screenClient.on(ClientEvent.LocalStreamPublished, (evt) => {});
    }
    private getRemoteId(stream: Stream): string {
      return `agora_remote-${stream.getId()}`;
    }
    //----------------------------------------------------------------------------------------------------------
    //--------------------------------------stream Handlers----------------------------------------------------
    private assignLocalStreamHandlers(): void {
      this.localStream.on(StreamEvent.MediaAccessAllowed, () => {});
  
      // The user has denied access to the camera and mic.
      this.localStream.on(StreamEvent.MediaAccessDenied, () => {});
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
  
    join(
      onSuccess?: (uid: number | string) => void,
      onFailure?: (error: Error) => void
    ): void {
      this.client.join(
        null,
        this.meetingService.getMeeting().roomName,
        this.uid,
        onSuccess,
        onFailure
      );
    }
  
    publish(): void {
      this.client.publish(this.localStream, (err) => {});
    }
  
    screenJoin(
      onSuccess?: (sid: number | string) => void,
      onFailure?: (error: Error) => void
    ): void {
      this.localStreams.push(this.sid.toString());
      this.screenClient.join(
        null,
        this.meetingService.getMeeting().roomName,
        this.sid,
        onSuccess,
        onFailure
      );
    }
  
    screenPublish(): void {
      this.screenClient.publish(this.screenStream, (err) => {});
    }
    // ------------------------------------------------------------------------------------------------------------------
    //--------------------------------------------- control button functions --------------------------------------------
    stopStream() {
      if (confirm('Are you sure you want to cancel !')) {
        this.endCall();
      }
    }
  
    muteVideo() {
      if (this.muteHostVideoStatus == 'mute host video') {
        // this.localStream.muteVideo();
        this.localStream.stop();
        this.localStream.close();
        this.muteHostVideoStatus = 'unmute host video';
        (document.querySelector('.pre-meeting-video') as HTMLElement).style.backgroundColor = '#d93025';
        (document.querySelector('.pre-meeting-video') as HTMLElement).style.borderColor = '#d93025';
      } else if (this.muteHostVideoStatus == 'unmute host video') {
        this.assignLocalStreamHandlers();
        this.initLocalStream(() =>
          this.join(
            (uid) => this.publish(),
            (error) => console.error(error)
          )
        );
        (document.querySelector('.pre-meeting-video') as HTMLElement).style.backgroundColor = '';
        (document.querySelector('.pre-meeting-video') as HTMLElement).style.borderColor = '';
        this.muteHostVideoStatus = 'mute host video';
      }
    }
  
    muteAudio() {
      this.micTriggered=true;
      
      if (this.muteHostAudioStatus == 'mute host mic') {
        this.localStream.muteAudio();
        (document.querySelector('.pre-meeting-mic') as HTMLElement).style.backgroundColor = '#d93025';
        (document.querySelector('.pre-meeting-mic') as HTMLElement).style.borderColor = '#d93025';
        this.muteHostAudioStatus = 'unmute host mic';

      } else {
        this.localStream.unmuteAudio();
        (document.querySelector('.pre-meeting-mic') as HTMLElement).style.backgroundColor = '';
        (document.querySelector('.pre-meeting-mic') as HTMLElement).style.borderColor = '';
        this.muteHostAudioStatus = 'mute host mic';
      }
      setTimeout(()=>{
        this.micTriggered=false;
      },4000);
    } 
    shareScreen() {
      if (this.meetingService.getMeeting().role == 'host') {
        this.screenClient = this.ngxAgoraService.createClient({
          mode: 'rtc',
          codec: 'h264',
        });
        this.assignScreenClientHandlers();
        this.screenStream = this.ngxAgoraService.createStream({
          streamID: this.uid,
          audio: false,
          video: false,
          screen: true,
        });
        this.initScreenStream(() =>
          this.screenJoin(
            (sid) => this.screenPublish(),
            (error) => console.error(error)
          )
        );
      }
    }
    endCall() {
      if (this.meeting.role == 'host') {
        if (this.screenStream != null) {
          this.screenStream.stop();
          this.screenClient.leave();
          this.screenStream.close();
        }
      }
      this.client.unpublish(this.localStream, (err) => {});
      this.client.leave();
      this.localStream.stop();
      this.localStream.close();
  
      if (this.meeting.role == 'host') {
        this.router.navigate(['home/tutorDashboard']);
      } else if (this.meeting.role == 'student') {
        this.router.navigate(['home/studentDashboard']);
      }
      // this.router.navigate([ 'home' ]);
    }
    limitStream() {
      this.remoteJoined = true;
      var before10Minutes = this.timelimit - 10 * 60;
      this.subscription = numbers.subscribe((x) => {
        this.timeLeft = this.timelimit - x;
        if (x == before10Minutes) {
          if (this.router.url === '/meeting') {
            this.snackbar.open(
              '10 Minutes Left ! Hurry up',
              'close',
              this.config
            );
          }
        }
        if (x == this.timelimit) {
          this.httpService
            .updateBookingStatus(this.bookingDetails.bid, 'Successful')
            .subscribe((res) => {
              this.localStream.stop();
              this.subscription.unsubscribe();
              this.endCall();
            });
        }
      });
    }
}
