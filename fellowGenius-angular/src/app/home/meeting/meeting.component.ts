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
import { ActivatedRoute, Router } from '@angular/router';
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
import { StudentService } from 'src/app/service/student.service';
import { TutorService } from 'src/app/service/tutor.service';
import { environment } from 'src/environments/environment';
import { stringify } from '@angular/compiler/src/util';
import { AuthService } from 'src/app/service/auth.service';
import { isThisISOWeek } from 'date-fns';
const numbers = timer(3000, 1000);

@Component({
  selector: 'app-meeting',
  templateUrl: './meeting.component.html',
  styleUrls: ['./meeting.component.css'],
})
export class MeetingComponent implements OnInit {
  constructor(
    private ngxAgoraService: NgxAgoraService,
    private meetingService: MeetingService,
    private router: Router,
    private snackbar: MatSnackBar,
    private sanitizer: DomSanitizer,
    private locationStrategy: LocationStrategy,
    private activatedRoute: ActivatedRoute,
    private loginService: LoginDetailsService,
    private studentService: StudentService,
    private tutorService: TutorService,
    private httpService: HttpService,
    private cookieService: CookieService,
    private authService: AuthService
  ) {
    this.uid = Math.floor(Math.random() * 100);
    this.sid = 174;
  }
  //   ---------------------
  @ViewChild('canvas') public canvas: ElementRef;
  @ViewChild('canvasScreenShare') public canvasScreenShare: ElementRef;
  @ViewChild('chatWindow') private chatWindow: ElementRef;
  @Input() public width = 1175;
  @Input() public height = 650;

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
  meetingTimeInvalid;
  meetingTimeError;
  expandedScreen: boolean = false;
  expandEnabled: boolean = true;
  remoteJoined: boolean = false;
  meeting = new meetingDetails();
  localCallId = 'agora_local';
  screenCallId = 'agora_screen';
  localScreenCallId = 'agora_screen_local';
  remoteCalls: string[] = [];
  screenRemoteCalls: string[] = [];
  localStreams: string[] = [];
  localScreenStreams:string[]=[];
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
  private preLocalStream: Stream;
  private blankStream: Stream;
  private micStream: Stream;
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
  meetingState = 'pre-meeting';
  micTriggered: boolean = false;
  localVideoOn: boolean = true;
  localMicOn: boolean = true;
  isPreMeeting = true;
  isInMeeting = false;
  localCallId1 = 'agora_local_1';
  localCallId2 = 'agora_local_2';
  peerOnline = false;
  userName;
  peerName;
  profilePictureUrl = '../../../assets/images/default-user-image.png';
  backendUrl = environment.BACKEND_URL;
  userEmail;
  meetingId;
  userId;
  invalidUser = false;
  domain;
  topic;
  remoteUserId;
  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    if (this.meetingState == 'pre-meeting') {
      this.preLocalStream.stop();
      this.preLocalStream.close();
      if (this.meeting.role == 'host') {
        this.router.navigate(['home/tutor-dashboard']);
      } else if (this.meeting.role == 'student') {
        this.router.navigate(['home/student-dashboard']);
      }
    }
  }
  ngAfterViewInit() {
    // this.canvasEl = this.canvas.nativeElement;
    // this.cx = this.canvasEl.getContext('2d');

    // this.canvasEl.width = this.width;
    // this.canvasEl.height = this.height;

    // this.cx.lineWidth = 5;
    // this.cx.lineCap = 'round';
    // this.cx.strokeStyle = '#000';
    
    // this.captureEvents(this.canvasEl);
    // this.getMousePosition(this.canvasEl);
  }

  ngOnInit() {
    this.width = (window.screen.width / 100) * 97;
    this.height = (window.screen.height / 100) * 80;
    this.screenWidth = window.screen.width;
    this.screenHeight = window.screen.height;

    this.activatedRoute.params.subscribe((params) => {
      let id = params['id'];
      this.meetingId = id;
      if (this.meetingId != '' || this.meetingId != null) {
        console.log('meeting is not null');
        this.httpService
          .fetchBookingDetailsWithMeetingId(id)
          .subscribe((res) => {
            if (res != null) {
              console.log(res);
              if (this.authService.getIsAuth() == false) {
                console.log('user is not signed in');
                console.log(this.router.url);
                if (this.router.url != null) {
                  this.cookieService.set('prev', this.router.url);
                }
                this.redirectUser();
              } else {
                if (this.authService.getIsAuth() == true) {
                  console.log('user is authenticated !');
                  this.initiateAfterLogin(res);
                } else {
                  this.authService
                    .getAuthStatusListener()
                    .subscribe((authRes) => {
                      if (authRes == false) {
                        console.log('user is not authenticated');
                        this.redirectUser();
                      } else if (authRes == true) {
                        console.log('user is authenticated !');
                        this.initiateAfterLogin(res);
                      }
                    });
                }
              }
            } else {
              this.redirectUser();
            }
          });
      } else {
        this.redirectUser();
      }
    });
  }
  initiateAfterLogin(res) {
    this.meetingService.setBooking(res);
    this.bookingDetails = res;
    this.bookingDetails = this.meetingService.getBooking();
    let timeLeft = this.calculateRemainingTime();
    
    if (timeLeft == null) {
      this.meetingTimeInvalid = true;
      this.meetingTimeError = 'Meeting has expired !';
    } else {
      if (this.loginService.getLoginType() == 'Learner') {
        console.log('its learnerrrrrrrrrrrrrrrr');
        if (
          this.studentService.getStudentProfileDetails().profilePictureUrl !=
          null
        ) {
          this.profilePictureUrl =
            this.studentService.getStudentProfileDetails().profilePictureUrl;
          console.log(this.profilePictureUrl);
        }
        this.userName = this.studentService.getStudentProfileDetails().fullName;
        this.userEmail = this.studentService.getStudentProfileDetails().email;
        this.userId = this.studentService.getStudentProfileDetails().sid;
        this.remoteUserId=this.bookingDetails.tutorId;
        this.meetingMemberLeft(this.meetingId, this.userId);
      } else if (this.loginService.getLoginType() == 'Expert') {
        console.log('its experttttttttttttttttttt');
        if (this.tutorService.getTutorDetials().profilePictureUrl != null) {
          this.profilePictureUrl =
            this.tutorService.getTutorDetials().profilePictureUrl;
        }
        this.userName = this.tutorService.getTutorDetials().fullName;
        this.userEmail = this.tutorService.getTutorDetials().email;
        this.userId = this.tutorService.getTutorDetials().bookingId;
        this.remoteUserId = this.bookingDetails.studentId;
        this.meetingMemberLeft(this.meetingId, this.userId);
      }
      console.log(this.userName, this.userEmail, this.userId);
      if(this.loginService.getLoginType()=='Learner'){
        if (
          timeLeft > this.bookingDetails.duration&&(this.bookingDetails.approvalStatus=='Accepted'||this.bookingDetails.approvalStatus=='Pending')
        ) {
          this.meetingTimeInvalid = true;
          this.meetingTimeError = 'Meeting is not started yet!';
        }
      }
      if (this.loginService.getLoginType() != null) {
        //---------------------------------------------- normal camera stream ----------------------------------
        this.client = this.ngxAgoraService.createClient({
          mode: 'rtc',
          codec: 'h264',
        });
        this.assignClientHandlers();

        this.preLocalStream = this.ngxAgoraService.createStream({
          streamID: this.uid + 3,
          audio: true,
          video: true,
          screen: false,
        });

        this.blankStream = this.ngxAgoraService.createStream({
          streamID: this.uid + 7,
          audio: false,
          video: false,
          screen: false,
        });
        this.assignLocalStreamHandlers(this.preLocalStream);
        // this.initLocalStream();
        this.initPreMeetingLocalStream(() => {});
      }
    }
  }
  meetingMemberLeft(meetingId, userId) {
    this.httpService.meetingMemberLeft(meetingId, userId).subscribe((res) => {
      console.log('meeting member left!');
    });
  }
  preMeetingJoin() {
    console.log('user id=>', this.userId);
    if (this.userId != null) {
      if (
        this.bookingDetails.studentId == this.userId ||
        this.bookingDetails.tutorId == this.userId
      ) {
        this.invalidUser = false;
        console.log('valid user');
        this.uid = this.userId;
        console.log('uid==>' + this.uid);
        this.senderName = this.userName;
        this.senderId = this.userId;
        this.meeting.role = this.loginService.getLoginType();
        this.meeting.roomId = 123;
        this.meeting.roomName = this.meetingId;
        this.meeting.userId = this.userId;
        this.meeting.userName = this.userName;
        this.meetingService.setMeeting(this.meeting);
        if (this.meeting.role == 'Expert') {
          this.peerName = this.bookingDetails.studentName;
        } else {
          this.peerName = this.bookingDetails.tutorName;
        }
        this.meetingState = 'in-meeting';
        this.connectToMeetingWebSocket(this.meeting.roomName);
        this.isPreMeeting = false;
        this.isInMeeting = true;
        this.preLocalStream.stop();
        this.preLocalStream.close();
        this.meeting = this.meetingService.getMeeting();
        console.log('meeting', this.meeting);
        this.httpService
          .meetingMemberJoined(this.meetingId, this.userId)
          .subscribe((res) => {
            console.log('user activity saved !');
          });
        this.timelimit = this.calculateRemainingTime() * 60;
        // this.shortName();

        this.preventBackButton();
        this.initialiseInMeeting();
      } else {
        this.invalidUser = true;
      }
    } else {
      this.invalidUser = true;
    }
  }
  startLocalStream() {
    console.log('starting local stream!');
    this.localStream = this.ngxAgoraService.createStream({
      streamID: this.uid,
      audio: true,
      video: true,
      screen: false,
    });
    this.localStream.setVideoProfile('720p_2');
    this.assignLocalStreamHandlers(this.localStream);
    let localStreamId: string = this.localStream.getId().toString();
    this.initLocalStream(() => {
      if (!this.localMicOn) {
        this.localStream.muteAudio();
      }
      this.publish(this.localStream);
      this.localStreams.push(localStreamId);
    });
    // else{
    //   this.localStream.stop();
    //   this.localStream.close();
    // }
  }

  startMicStream() {
    this.localStream = this.ngxAgoraService.createStream({
      streamID: this.uid,
      audio: true,
      video: false,
      screen: false,
    });
    this.localStream.setVideoProfile('720p_2');
    this.assignLocalStreamHandlers(this.localStream);
    let localStreamId: string = this.localStream.getId().toString();
    this.initLocalStream(() => {
      this.localStreams.push(localStreamId);
      if (!this.localMicOn) {
        this.localStream.muteAudio();
      }
      this.publish(this.localStream);
    });
  }
  initialiseInMeeting() {
    if(!document.getElementById('meeting-body').classList.contains('no-remote')){
      document.getElementById('meeting-body').classList.add('no-remote');
    }
    this.limitStream();
    this.domain=this.bookingDetails.domain;
    this.topic = this.bookingDetails.subject;
    this.join(() => {
      // case 1 mic on video on
      if (this.localVideoOn && this.localMicOn) {
        this.startLocalStream();
      }
      //case 2 mic on video off
      else if (this.localMicOn && !this.localVideoOn) {
        this.startMicStream();
      }
      //case 3 mic off video on
      else if (!this.localMicOn && this.localVideoOn) {
        this.startLocalStream();
        this.localStream.unmuteAudio();
      }
      //case 4 mic off video off
      else {
        this.startMicStream();
      }
    });
  }
  removeLocalStream() {
    this.unPublish(this.localStream);
    this.localStreams = this.localStreams.filter(
      (e) => e !== this.localStream.getId().toString()
    );
    this.localStream.muteVideo();
    this.localStream.stop();
    this.localStream.close();
  }
  muteVideo() {
    if (this.muteHostVideoStatus == 'mute host video') {
      this.localVideoOn = false;
      this.removeLocalStream();
      this.startMicStream();
      if (!this.localMicOn) {
        this.localStream.muteAudio();
      }
      this.muteHostVideoStatus = 'unmute host video';
    } else if (this.muteHostVideoStatus == 'unmute host video') {
      this.localVideoOn = true;

      let localStreamId: string = this.localStream.getId().toString();
      if (!this.localStreams.includes(localStreamId)) {
        this.startLocalStream();
      } else {
        this.removeLocalStream();
        this.startLocalStream();
      }
      this.muteHostVideoStatus = 'mute host video';
    }
  }

  muteAudio() {
    if (this.muteHostAudioStatus == 'mute host mic') {
      this.localMicOn = false;
      this.localStream.muteAudio();
      this.muteHostAudioStatus = 'unmute host mic';
    } else {
      this.localMicOn = true;
      this.localStream.unmuteAudio();
      this.muteHostAudioStatus = 'mute host mic';
    }
  }

  unPublish(stream: Stream): void {
    this.client.unpublish(stream, (err) => {});
  }

  closeLocalVideo(stream: Stream) {
    stream.stop();
    stream.close();
  }
  private initPreMeetingLocalStream(onSuccess?: () => any): void {
    this.preLocalStream.init(
      () => {
        this.preLocalStream.play(this.localCallId1);
        if (onSuccess) {
          onSuccess();
        }
      },
      (err) => console.error('getUserMedia failed', err)
    );
  }
  redirectUser() {
    if (this.meetingId == null) {
      if (this.authService.isTokenValid()) {
        if (jwt_decode(this.cookieService.get('token'))['ROLE'] == 'Learner') {
          this.router.navigate(['home/student-dashboard']);
        } else if (
          jwt_decode(this.cookieService.get('token'))['ROLE'] == 'Expert'
        ) {
          this.router.navigate(['home/tutor-dashboard']);
        }
      } else {
        this.router.navigate(['login']);
      }
    } else {
      if (this.authService.isTokenValid()) {
        if (jwt_decode(this.cookieService.get('token'))['ROLE'] == 'Learner') {
          this.router.navigate(['home/student-dashboard']);
        } else if (
          jwt_decode(this.cookieService.get('token'))['ROLE'] == 'Expert'
        ) {
          this.router.navigate(['home/tutor-dashboard']);
        }
      } else {
        this.router.navigate(['login']);
      }
    }
  }
  calculateRemainingTime() {
    var endTime =
      this.bookingDetails.endTimeHour * 60 + this.bookingDetails.endTimeMinute;
    var date: Date = new Date();
    var currentTime = date.getHours() * 60 + date.getMinutes();
    if (endTime > currentTime) {
      return endTime - currentTime;
    } else {
      return null;
    }
  }
  preventBackButton() {
    history.pushState(null, null, location.href);
    this.locationStrategy.onPopState(() => {
      history.pushState(null, null, location.href);
    });
  }

  shareScreen() {
    // if (this.meetingService.getMeeting().role == 'host') {
    this.enableScreenShareView();
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
    this.sid = this.userId+2;
    console.log(this.userId,this.sid);
    this.assignScreenStreamHandlers(this.screenStream);
    let localScreenStreamId: string = this.screenStream.getId().toString();
    this.localScreenStreams.push(localScreenStreamId);
    this.initScreenStream(() => {
      this.screenJoin(
        (sid) => this.screenPublish(),
        (error) => console.error(error)
      );
    });
  }
  endCall() {
      if (this.screenStream != null) {
        this.localScreenStreams=[];
        this.screenStream.stop();
        this.screenClient.leave();
        this.screenStream.close();
      }
    this.client.unpublish(this.localStream, (err) => {});
    this.client.leave();
    if (this.localStream) {
      this.localStream.stop();
      this.localStream.close();
    }
    this.meetingMemberLeft(this.meetingId, this.userId);
    if (this.meeting.role == 'Expert') {
      this.router.navigate(['home/tutor-dashboard']);
    } else if (this.meeting.role == 'Learner') {
      this.router.navigate(['home/student-dashboard']);
    }
    // this.router.navigate([ 'home' ]);
  }
  limitStream() {
    this.remoteJoined = true;
    var before10Minutes = this.timelimit - 10 * 60;
    if (this.subscription != null) {
      this.subscription.unsubscribe();
    }
    this.subscription = numbers.subscribe((x) => {
      this.timeLeft = this.timelimit - x;
      // console.log(x,this.timeLeft);
      let meetingUrl:string = '/meeting/'+this.bookingDetails.meetingId;
      if (x == before10Minutes) {
        if (this.router.url === meetingUrl) {
          this.snackbar.open(
            '10 Minutes Left ! Hurry up',
            'close',
            this.config
          );
        }
      }
      console.log(x,this.timeLeft);
      console.log(this.bookingDetails)
      if (this.timeLeft<=0) {
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
  enableScreenShareView(){
    if(!document.getElementById('meeting-body').classList.contains('screen-shared')){
      console.log('callledd hereee')
      document.getElementById('meeting-body').classList.add('screen-shared');
    }
  }
  disableScreenShareView(){
    
    if(document.getElementById('meeting-body').classList.contains('screen-shared')){
      console.log('callledd disableddd screen shareee');
      this.localScreenStreams=[];
      document.getElementById('meeting-body').classList.remove('screen-shared');
    }
    console.log('disable screen share viewww',this.peerOnline)
    if(this.peerOnline==true){
      this.enableRemoteJoinedView();
    }
    this.hostScreenShareStatus=false;
  }
  enableRemoteJoinedView(){
    if(document.getElementById('meeting-body').classList.contains('no-remote')){
      console.log('REMOTE VIEWWW ENABLLEDDDD')
      document.getElementById('meeting-body').classList.remove('no-remote');
    }
  }
  enableNoRemoteView(){
    if(!document.getElementById('meeting-body').classList.contains('no-remote')){
      console.log('callledd hereee')
      document.getElementById('meeting-body').classList.add('no-remote');
    }
  }
  //---------------------------------------------- client Handlers -------------------------------------------------------------
  // normal client handler
  private assignClientHandlers(): void {
    this.client.on(ClientEvent.LocalStreamPublished, (evt) => {});

    this.client.on(ClientEvent.Error, (error) => {
      if (error.reason === 'DYNAMIC_KEY_TIMEOUT') {
        this.client.renewChannelKey(
          '',
          () => (renewError) =>
            console.error('Renew channel key failed: ', renewError)
        );
      }
    });

    this.client.on(ClientEvent.RemoteStreamAdded, (evt) => {
      console.log('remote stream added')
      const stream = evt.stream as Stream;
      var id = stream.getId();
      if (!this.localStreams.includes(id.toString())) {
        // if(id==174)
        console.log('remote stream is not local stream')
        this.client.subscribe(
          stream,
          { audio: true, video: true },
          (err) => {}
        );
      }
    });

    this.client.on(ClientEvent.RemoteStreamSubscribed, (evt) => {
      console.log('remote stream subscribed')
      const stream = evt.stream as Stream;
      const id = this.getRemoteId(stream);
      const idt = stream.getId();
      if (idt == this.remoteUserId+2) {
        console.log('remote stream is screen share and subscribed!')
        this.screenRemoteCalls.push(id);
        this.enableScreenShareView();
        setTimeout(() => stream.play(id), 1000);
      } else {
        if (!this.remoteCalls.length) {
          console.log('remote stream is cam video and subscribed!')
          this.remoteCalls.push(id);
          setTimeout(() => stream.play(id), 1000);
    
        }
      }
    });

    this.client.on(ClientEvent.RemoteStreamRemoved, (evt) => {
      console.log('stream removed ', evt);
      const stream = evt.stream as Stream;
      const id = this.getRemoteId(stream);
      const idt = stream.getId();
      if (idt == this.remoteUserId) {
        if (stream) {
          stream.stop();
          this.remoteCalls = [];
          console.log('remote stream is removed ')
          // this.endCall();
        }
      } else if (idt == this.remoteUserId+2) {
        this.disableScreenShareView();
        console.log('remote stream is screen share and remvoed!')
        this.screenRemoteCalls = [];
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
      // this.peerOnline=false;
      const stream = evt.stream as Stream;
      if (stream) {
        console.log('peeeerrr leftttt !!!',evt)
        stream.stop();
        this.peerOnline = false;
        this.enableNoRemoteView();
        if(this.localScreenStreams.length==0){
          this.screenRemoteCalls=[];
          this.disableScreenShareView();
        }
        // this.endCall();
        this.remoteCalls = this.remoteCalls.filter(
          (call) => call !== `${this.getRemoteId(stream)}`
        );
      } else {
        console.log('peeeerrr leftt?');
        console.log(evt);
        if(evt.uid!=(this.remoteUserId+2)&&evt.uid!=this.userId&&evt.uid!=this.userId+2){
          this.peerOnline = false;
          console.log('screen stream',this.localScreenStreams.length)
        if(this.localScreenStreams.length==0){
          this.screenRemoteCalls=[];
          this.disableScreenShareView();
        }
          this.enableNoRemoteView();          
        }

      }
      // this.endCall();
    });

    this.client.on(ClientEvent.PeerOnline, (evt) => {
      console.log('peer is onlineeeee',evt)
      console.log(parseInt(this.remoteUserId)+2);
      // console.log(remoteScreenId)
      if(evt.uid!=this.userId&&evt.uid!=(this.userId+2)){
        this.peerOnline = true;
        this.enableRemoteJoinedView();
      }
      
    });
  }
  // screen client Handlers
  private assignScreenClientHandlers(): void {
    this.screenClient.on(ClientEvent.LocalStreamPublished, (evt) => {});
    this.screenClient.on(ClientEvent.RemoteStreamRemoved,(evt)=>{
      console.log('screen share removed')
    })
  }
  private getRemoteId(stream: Stream): string {
    return `agora_remote-${stream.getId()}`;
  }
  //----------------------------------------------------------------------------------------------------------
  //--------------------------------------stream Handlers----------------------------------------------------
  // private assignLocalStreamHandlers(): void {
  //   this.localStream.on(StreamEvent.MediaAccessAllowed, () => {});

  //   // The user has denied access to the camera and mic.
  //   this.localStream.on(StreamEvent.MediaAccessDenied, () => {});
  // }
  private assignLocalStreamHandlers(stream: Stream): void {
    stream.on(StreamEvent.MediaAccessAllowed, () => {});

    // The user has denied access to the camera and mic.
    stream.on(StreamEvent.MediaAccessDenied, () => {});
  }
  private assignScreenStreamHandlers(stream: Stream): void {
    stream.on(StreamEvent.ScreenSharingStopped, () => {
      console.log('screen streammm is stopppeeddddd !!!!');
      this.screenShare();
    });

    // The user has denied access to the camera and mic.
    stream.on(StreamEvent.MediaAccessDenied, () => {});
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
        this.screenStream.play(this.localScreenCallId);
        if (onSuccess) {
          onSuccess();
        }
      },
      (err) =>{ console.error('getUserMedia  failed', err);
      this.disableScreenShareView();
      this.localScreenStreams=[];
      this.hostScreenShareStatus=false;    
    }
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
      this.meeting.userId,
      onSuccess,
      onFailure
    );
  }

  publish(stream: Stream): void {
    this.client.publish(stream, (err) => {});
  }
  // publish(): void {
  //   this.client.publish(this.localStream, (err) => {});
  // }

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
  preMeetingMuteVideo() {
    if (this.muteHostVideoStatus == 'mute host video') {
      this.localVideoOn = false;
      if (this.meetingState == 'pre-meeting') {
        this.preLocalStream.stop();
        this.closeLocalVideo(this.preLocalStream);
        (
          document.querySelector('.pre-meeting-video') as HTMLElement
        ).style.backgroundColor = '#d93025';
        (
          document.querySelector('.pre-meeting-video') as HTMLElement
        ).style.borderColor = '#d93025';
      }
      this.muteHostVideoStatus = 'unmute host video';
    } else if (this.muteHostVideoStatus == 'unmute host video') {
      this.localVideoOn = true;
      if (this.meetingState == 'pre-meeting') {
        (
          document.querySelector('.pre-meeting-video') as HTMLElement
        ).style.backgroundColor = '';
        (
          document.querySelector('.pre-meeting-video') as HTMLElement
        ).style.borderColor = '';
        this.assignLocalStreamHandlers(this.preLocalStream);
        this.initPreMeetingLocalStream(() => {
          if (this.meetingState == 'pre-meeting') {
          }
        });
      }
      this.muteHostVideoStatus = 'mute host video';
    }
  }

  preMeetingMuteAudio() {
    this.micTriggered = true;
    if (this.muteHostAudioStatus == 'mute host mic') {
      this.localMicOn = false;
      this.muteHostAudioStatus = 'unmute host mic';
      if (this.meetingState == 'pre-meeting') {
        (
          document.querySelector('.pre-meeting-mic') as HTMLElement
        ).style.backgroundColor = '#d93025';
        (
          document.querySelector('.pre-meeting-mic') as HTMLElement
        ).style.borderColor = '#d93025';
      }
    } else {
      this.localMicOn = true;
      this.muteHostAudioStatus = 'mute host mic';
      if (this.meetingState == 'pre-meeting') {
        (
          document.querySelector('.pre-meeting-mic') as HTMLElement
        ).style.backgroundColor = '';
        (
          document.querySelector('.pre-meeting-mic') as HTMLElement
        ).style.borderColor = '';
      }
    }
    if (this.meetingState == 'pre-meeting') {
      setTimeout(() => {
        this.micTriggered = false;
      }, 4000);
    }
  }

  screenShare() {
    if (this.hostScreenShareStatus == false) {
      this.hostScreenShareStatus = true;
      // this.hostVideo = false;
      this.shareScreen();
    } else {
      this.disableScreenShareView();
      this.hostScreenShareStatus = false;
      this.screenStream.stop();
      this.screenClient.unpublish(this.screenStream, (err) => {});
      this.screenClient.leave();
      this.screenStream.close();
      this.localStreams = [];
    }
  }
 

  openChatWindow() {
    if (this.chatOpen == false) {
      this.openSideNav();
      this.chatOpen = true;
      this.newMessageNotification = false;
      // this.scrollToBottom;
    } else {
      this.chatOpen = false;
      this.closeSideNav();
    }
  }
  scrollToBottom(): void {
    try {
      console.log('called scrollto bottom');
      this.chatWindow.nativeElement.scrollTop =
        this.chatWindow.nativeElement.scrollHeight;
    } catch (err) {}
  }
  openSideNav() {
    if (this.screenWidth <= 500) {
      document.getElementById('mySidenav').style.width = '100%';
    } else {
      document.getElementById('mySidenav').style.width = '400px';
    }
  }
  closeSideNav() {
    document.getElementById('mySidenav').style.width = '0';
    this.chatOpen = false;
    this.newMessageNotification = false;
  }

  connectToMeetingWebSocket(bookingId) {
    // let socket = new WebSocket('ws://backend.fellowgenius.com/fellowGenius');
    let socket = new SockJS(this.backendUrl + '/fellowGenius');
    this.ws = Stomp.over(socket);
    let that = this;
    this.ws.connect(
      {},
      (frame) => {
        that.ws.subscribe('/errors', (message) => {
          alert('Error ' + message.body);
        });
        that.ws.subscribe(
          '/inbox/MeetingChat/' + bookingId,
          function (message) {
            var res: any = JSON.parse(message.body);
            var msg: MessageModel = new MessageModel();
            msg.messageText = res.message.messageText;
            msg.senderName = res.message.senderName;
            msg.senderId = res.message.senderId;
            msg.dataSource = res.message.dataSource;
            msg.fileName = res.message.fileName;
            msg.fileType = res.message.fileType;
            that.scrollToBottom();
            // if(msg.senderId!=this.senderId && this.openChat==false){
            //   this.newMessageNotification=true;
            // }
            // console.log('message ->' + msg);
            // console.log(msg.senderId);
            if (msg.senderId != that.meeting.userId && that.chatOpen == false) {
              that.newMessageNotification = true;
            }
            if (msg.messageText == null) {
              that.openBlob(msg);
            }
            that.meetingChat.push(msg);
          }
        );
      },
      (error) => {
        // alert('STOMP error ' + error);
        console.log('re initiating the connection !');
        setTimeout(() => {
          this.connectToMeetingWebSocket(this.meeting.roomName);
        }, 100);
      }
    );
  }


  //--------------------------------------------- chat functions--------------------------------------------------
  sendChatMessage() {
    var senderId: number;
    if (this.messageText != '') {
      this.message.messageText = this.messageText;
      this.message.senderId = this.senderId;
      this.message.senderName = this.senderName;
      this.message.sentTime = new Date().toTimeString();
      this.message.date = new Date().toLocaleString();
      this.message.senderProfilePicUrl = this.profilePictureUrl;
      // this.scrollToBottom();
      this.sendMessageToMeeting(this.message, this.meeting.roomName);
      this.messageText = '';
    }

    // this.scrollToBottom();
  }

  //for sending message to the booking
  sendMessageToMeeting(message: MessageModel, bookingId: string) {
    let data = JSON.stringify({
      message: message,
    });
    this.ws.send('/sendChat/' + bookingId, {}, data);
  }
  // for handling the enter submit event
  handleSubmit(event) {
    if (event.keyCode === 13) {
      this.sendChatMessage();
    }
  }

  handleFileInput(files: FileList) {
    var file: File = files.item(0);
    this.uploadedFile = file;

    this.fileUploadedBox = true;
    this.fileName = file.name;
    if (file.size <= 100 * 1024 * 1024) {
      if (file.size > 1024 * 1024) {
        this.fileSize =
          (file.size / (1024 * 1024)).toFixed(2).toString() + ' MB';
      } else {
        this.fileSize = (file.size / 1024).toFixed(2).toString() + ' KB';
      }
      // this.getBase64(file);
    } else {
      this.fileSizeExceeded = true;
    }
  }
  getBase64() {
    var url;
    var reader = new FileReader();
    reader.readAsDataURL(this.uploadedFile);
    reader.onload = () => {
      var fileData = reader.result as string;
      var message = new MessageModel();
      message.senderName = this.senderName;
      message.dataSource = fileData;
      message.fileName = this.uploadedFile.name;
      message.fileType = this.uploadedFile.type;
      this.fileType = message.fileType;
      message.senderId = this.senderId;
      this.sendFile(message, this.meeting.roomName);
    };
    reader.onerror = function (error) {};
  }

  openBlob(message: MessageModel) {
    var file: Blob = this.b64toBlob(message.dataSource, message.fileType);

    message.dataSource = this.sanitizer.bypassSecurityTrustUrl(
      URL.createObjectURL(file)
    );
  }

  b64toBlob(dataURI, fileType) {
    var byteString = atob(dataURI.split(',')[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);

    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: fileType });
  }

  sendFile(message: MessageModel, bookingId: string) {
    let data = JSON.stringify({
      message: message,
    });
    this.ws.send('/sendChat/' + bookingId, {}, data);
    // this.ws.send()
    this.closeFileUploadedBox();
  }
  closeFileUploadedBox() {
    this.uploadedFile = null;
    this.fileUploadedBox = false;
    this.fileSizeExceeded = false;
  }
}
