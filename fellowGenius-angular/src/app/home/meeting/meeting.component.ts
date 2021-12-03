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
  MediaDeviceInfo,
} from 'ngx-agora';
import * as SockJS from 'sockjs-client';
import { timer, Subscription, interval } from 'rxjs';
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
import * as moment from 'moment';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MediaAccessDialogComponent } from './media-access-dialog/media-access-dialog.component';
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
    private authService: AuthService,
    public dialog: MatDialog
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
  isLoading = false;
  isMobile = false;
  mediaAccessPopUpDialogRef;
  mediaAccessAllowed = false;
  camAccessAllowed = false;
  micAccessAllowed = false;
  isLocalStreamPlaying = false;
  isLocalMicStreamPlaying = false;
  isLocalCamStreamPublished = false;
  isLocalMicStreamPublished = false;
  fiveMinuteAlertShown: boolean = false;
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
  localCallMicId = 'agora_local_mic';
  screenCallId = 'agora_screen';
  localScreenCallId = 'agora_screen_local';
  remoteCalls: string[] = [];
  micRemoteCalls: string[] = [];
  screenRemoteCalls: string[] = [];
  localStreams: string[] = [];
  localMicStreams: string[] = [];
  localScreenStreams: string[] = [];
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
  private micClient: AgoraClient;
  private screenClient: AgoraClient;
  private localStream: Stream;
  private localMicStream: Stream;
  private screenStream: Stream;
  private preLocalStream: Stream;
  private preLocalMicStream: Stream;
  private micStream: Stream;
  private uid: number;
  private sid: number;
  private mid: number;
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
  preMeetingLocalCallMicId = 'agora_local_mic';
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
  activeAudioOutputDeviceId;
  activeAudioOutputDeviceName = 'Not Defined';
  activeAudioInputDeviceId;
  activeAudioInputDeviceName = 'Not Defined';
  activeVideoDeviceId;
  activeVideoDeviceName = 'Not Defined';
  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
  }
  audioLevel = 0;
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

  ngOnInit() {
    this.width = (window.screen.width / 100) * 97;
    this.height = (window.screen.height / 100) * 80;
    this.screenWidth = window.screen.width;
    this.screenHeight = window.screen.height;
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      this.isMobile = true;
    }
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
  private subscription1: Subscription;
  private endDate: Date;
  public dateNow = new Date();
  public dDay = new Date('Jan 01 2022 00:00:00');
  milliSecondsInASecond = 1000;
  hoursInADay = 24;
  minutesInAnHour = 60;
  SecondsInAMinute = 60;

  public timeDifference = 0;
  public secondsToDday = '00';
  public minutesToDday = '00';
  public hoursToDday = '00';
  // public daysToDday;

  ngOnDestroy() {
    this.endCall();
  }

  initiateAfterLogin(res) {
    this.meetingService.setBooking(res);
    this.bookingDetails = res;
    this.bookingDetails = this.meetingService.getBooking();
    this.domain = this.bookingDetails.domain;
    this.topic = this.bookingDetails.subject;
    let timeLeft = this.calculateRemainingTime();
    console.log(timeLeft);
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
        this.remoteUserId = this.bookingDetails.tutorId;
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

      if (
        (this.loginService.getLoginType() == 'Expert' &&
          this.bookingDetails.approvalStatus == 'Accepted') ||
        this.bookingDetails.approvalStatus == 'Pending'
      ) {
        console.log(
          'increasing duration for expert',
          this.bookingDetails.duration
        );
        this.bookingDetails.duration += 10;
        console.log(this.bookingDetails.duration);
      }
      console.log('time left =>', timeLeft);
      console.log('booking duration =>', this.bookingDetails.duration);
      if (
        timeLeft > this.bookingDetails.duration &&
        (this.bookingDetails.approvalStatus == 'Accepted' ||
          this.bookingDetails.approvalStatus == 'Pending')
      ) {
        this.meetingTimeInvalid = true;
        this.meetingTimeError = 'Meeting is not started yet!';
      }

      if (this.loginService.getLoginType() != null) {
        // creating user client
        this.client = this.ngxAgoraService.createClient({
          mode: 'rtc',
          codec: 'h264',
        });
        this.micClient = this.ngxAgoraService.createClient({
          mode: 'rtc',
          codec: 'h264',
        });
        //assigning client handlers
        this.assignClientHandlers(this);
        this.assignMicClientHandlers(this);
        //getting user devices info

        if (this.mediaAccessAllowed == true) {
          this.getDevicesInfo();
        }
        //initialising premeeting streams
        this.initialisePreMeetingStreams();
      }
    }
  }
  initialisePreMeetingStreams() {
    //creating pre local stream(cam) and pre local mic stream
    this.preLocalStream = this.ngxAgoraService.createStream({
      streamID: this.uid + 3,
      audio: false,
      video: true,
      screen: false,
    });

    this.preLocalMicStream = this.ngxAgoraService.createStream({
      streamID: this.uid + 4,
      audio: true,
      video: false,
      screen: false,
    });

    //initiating and playing pre meeting streams
    this.initPreMeetingLocalStream(() => {
      console.log('PRE MEETING CAM STREAM PLAYING');
    });
    this.initPreMeetingMicLocalStream(() => {
      console.log('PRE MEETING MIC STREAM PLAYING');
    });
    //assigning pre meeting stream handlers
    this.assignLocalStreamHandlers(this.preLocalStream);
    this.assignPreLocalMicStreamHandlers(this.preLocalMicStream);
    this.checkIfNoDevicesAllowed();
    if (this.mediaAccessAllowed == true) {
      this.getDevicesInfo();
      this.checkBluetoothDevices();
    }
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
        this.isLoading = true;
        this.isInMeeting = true;
        this.preLocalStream.stop();
        this.preLocalStream.close();
        this.preLocalMicStream.stop();
        this.preLocalMicStream.close();
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

  initialiseInMeeting() {
    if (
      !document.getElementById('meeting-body').classList.contains('no-remote')
    ) {
      document.getElementById('meeting-body').classList.add('no-remote');
    }
    // this.limitStream();
    this.subscription1 = interval(1000).subscribe((x) => {
      this.limitStream2();
    });
    this.isLoading = true;
    this.mid = this.uid + 10;
    this.getDevicesInfo();

    this.join(() => {
      console.log('CAMERA_CLIENT_JOINED');
      this.micClientJoin(() => {
        console.log('MIC_CLIENT_JOINED');
        this.initialiseStreams();
      });
    });
  }
  initialiseStreams() {
    // case 1 mic on video on
    if (this.localVideoOn && this.localMicOn) {
      this.startLocalStream();
      this.startMicStream();
    }
    //case 2 mic on video off
    else if (this.localMicOn && !this.localVideoOn) {
      this.startMicStream();
    }
    //case 3 mic off video on
    else if (!this.localMicOn && this.localVideoOn) {
      this.startLocalStream();
      // this.localStream.unmuteAudio();
    }
    //case 4 mic off video off
    else {
      this.startMicStream();
    }
  }

  startLocalStream() {
    console.log('starting local stream!');
    if (this.localStreams.length > 0) {
      this.removeLocalStream();
    }
    this.localStream = this.ngxAgoraService.createStream({
      streamID: this.uid,
      audio: false,
      video: true,
      screen: false,
    });
    this.localStream.setVideoProfile('720p_2');
    this.assignLocalStreamHandlers(this.localStream);
    let localStreamId: string = this.localStream.getId().toString();
    this.initLocalStream(() => {
      this.publish(this.localStream);
      this.localStreams.push(localStreamId);
    });
  }

  startMicStream() {
    if (this.localMicStreams.length > 0) {
      this.removeLocalMicStream();
    }
    console.log('device id:' + this.activeAudioInputDeviceId);
    this.localMicStream = this.ngxAgoraService.createStream({
      streamID: this.mid,
      audio: true,
      video: false,
      screen: false,
    });
    this.localMicStream.setAudioProfile('speech_standard');
    this.assignLocalMicStreamHandlers(this.localMicStream);
    let localStreamId: string = this.localMicStream.getId().toString();

    this.initLocalMicStream(() => {
      this.localMicStreams.push(localStreamId);
      if (!this.localMicOn) {
        this.localMicStream.muteAudio();
      }
      this.micPublish(this.localMicStream);
    });
  }

  meetingMemberLeft(meetingId, userId) {
    this.httpService.meetingMemberLeft(meetingId, userId).subscribe((res) => {
      console.log('meeting member left!');
    });
  }
  removeLocalStream() {
    this.unPublish(this.localStream);
    this.localStreams = [];
    this.localStream.muteVideo();
    this.localStream.stop();
    this.localStream.close();
  }
  removeLocalMicStream() {
    if (this.localMicStream != null) {
      this.unPublishMicStream(this.localMicStream);
      this.localMicStreams = [];
      this.localMicStream.stop();
      this.localMicStream.close();
    }
  }
  muteVideo() {
    if (this.muteHostVideoStatus == 'mute host video') {
      this.localVideoOn = false;
      this.removeLocalStream();
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
      this.localMicStream.muteAudio();
      this.muteHostAudioStatus = 'unmute host mic';
    } else {
      this.localMicOn = true;
      this.localMicStream.unmuteAudio();
      this.muteHostAudioStatus = 'mute host mic';
    }
  }

  unPublish(stream: Stream): void {
    this.client.unpublish(stream, (err) => {});
    this.isLocalCamStreamPublished = false;
  }
  unPublishMicStream(stream: Stream): void {
    this.micClient.unpublish(stream, (err) => {});
    this.isLocalMicStreamPublished = false;
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
          this.isLocalStreamPlaying = true;
        }
      },
      (err) => {
        // this.dialog.open(MediaAccessDialogComponent);
        this.mediaAccessAllowed = false;
        console.error('getUserMedia failed', err);
      }
    );
  }
  private initPreMeetingMicLocalStream(onSuccess?: () => any): void {
    this.preLocalMicStream.init(
      () => {
        this.preLocalMicStream.play(this.localCallId2);
        if (onSuccess) {
          this.isLocalMicStreamPlaying = true;
          setInterval(() => {
            if (this.preLocalMicStream.isPlaying) {
              this.audioLevel = this.preLocalMicStream.getAudioLevel();
              // console.log(this.audioLevel);
            }
          }, 100);
        }
      },
      (err) => {
        this.mediaAccessAllowed = false;
        console.error('getUserMedia failed', err);
      }
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
    let bookingDate: Date = moment(
      this.bookingDetails.dateOfMeeting,
      'DD/MM/YYYY'
    ).toDate();
    bookingDate.setHours(this.bookingDetails.endTimeHour);
    bookingDate.setMinutes(this.bookingDetails.endTimeMinute);
    if (this.endDate == null) {
      this.endDate = bookingDate;
    }

    console.log('booking date :', bookingDate);
    var date: Date = new Date();
    date.setSeconds(0);
    // var currentTime = date.getHours() * 60 + date.getMinutes();
    // var endTime =
    // this.bookingDetails.endTimeHour * 60 + this.bookingDetails.endTimeMinute;
    var currentTime = Math.floor(date.getTime() / 60000);
    var endTime = Math.floor(bookingDate.getTime() / 60000);
    console.log('endddd timeeee====>>>', endTime, currentTime);
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
    this.sid = this.userId + 2;
    console.log(this.userId, this.sid);
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
    //closing all screen sharing streams if any

    if (this.screenStream != null) {
      this.localScreenStreams = [];
      this.screenStream.stop();
      this.screenClient.leave();
      this.screenStream.close();
    }
    //unpublishing the cam stream
    if (this.preLocalStream != null) {
      this.preLocalStream.stop();
      this.preLocalStream.close();
    }
    if (this.preLocalMicStream != null) {
      this.preLocalMicStream.stop();
      this.preLocalMicStream.close();
    }
    if (this.localStream != null) {
      this.client.unpublish(this.localStream, (err) => {});
    }

    //unpublishing the mic stream
    if (this.localMicStream != null) {
      this.micClient.unpublish(this.localMicStream, (err) => {});
    }

    //leaving client from channel
    if (this.client != null) {
      this.client.leave();
    }
    if (this.micClient != null) {
      this.micClient.leave();
    }
    if (this.screenClient != null) {
      this.screenClient.leave();
    }
    //closing all cam streams
    if (this.localStream != null) {
      this.localStream.stop();
      this.localStream.close();
    }
    //closing all mic streams
    if (this.localMicStream != null) {
      this.localMicStream.stop();
      this.localMicStream.close();
    }
    //updating member check out in db
    this.meetingMemberLeft(this.meetingId, this.userId);
    //unsubscribing the timer
    if (this.subscription1 != null) {
      this.subscription1.unsubscribe();
    }
    //disconnecting from web socket
    if (this.ws != null) {
      this.ws.disconnect();
    }

    //routing to dashboard
    if (this.meeting.role == 'Expert') {
      this.router.navigate(['home/tutor-dashboard']);
    } else if (this.meeting.role == 'Learner') {
      this.router.navigate(['home/student-dashboard']);
    }
  }

  limitStream2() {
    this.timeDifference = this.endDate.getTime() - new Date().getTime();
    let minutesLeft = Math.floor(this.timeDifference / 60000);
    // console.log('time difference : '+Math.floor(this.timeDifference/60000));
    this.allocateTimeUnits(this.timeDifference);
    if (this.timeDifference <= 0) {
      this.httpService
        .updateBookingStatus(this.bookingDetails.bid, 'Successful')
        .subscribe((res) => {
          this.localStream.stop();
          this.subscription1.unsubscribe();
          this.endCall();
        });
    }
    let meetingUrl: string = '/meeting/' + this.bookingDetails.meetingId;
    if (minutesLeft < 5) {
      if (this.router.url === meetingUrl) {
        if (!this.fiveMinuteAlertShown) {
          this.snackbar.open(
            'less than 5 Minutes Left ! Hurry up',
            'close',
            this.config
          );
          this.fiveMinuteAlertShown = true;
        }
      }
    }
  }
  private allocateTimeUnits(timeDifference) {
    this.secondsToDday = Math.floor(
      (timeDifference / this.milliSecondsInASecond) % this.SecondsInAMinute
    ).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
    this.minutesToDday = Math.floor(
      (timeDifference / (this.milliSecondsInASecond * this.minutesInAnHour)) %
        this.SecondsInAMinute
    ).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
    this.hoursToDday = Math.floor(
      (timeDifference /
        (this.milliSecondsInASecond *
          this.minutesInAnHour *
          this.SecondsInAMinute)) %
        this.hoursInADay
    ).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
  }
  enableScreenShareView() {
    if (
      !document
        .getElementById('meeting-body')
        .classList.contains('screen-shared')
    ) {
      console.log('callledd hereee');
      document.getElementById('meeting-body').classList.add('screen-shared');
    }
  }
  disableScreenShareView() {
    if (
      document
        .getElementById('meeting-body')
        .classList.contains('screen-shared')
    ) {
      console.log('callledd disableddd screen shareee');
      this.localScreenStreams = [];
      document.getElementById('meeting-body').classList.remove('screen-shared');
    }
    console.log('disable screen share viewww', this.peerOnline);
    if (this.peerOnline == true) {
      this.enableRemoteJoinedView();
    }
    this.hostScreenShareStatus = false;
  }
  enableRemoteJoinedView() {
    if (
      document.getElementById('meeting-body').classList.contains('no-remote')
    ) {
      console.log('REMOTE VIEWWW ENABLLEDDDD');
      document.getElementById('meeting-body').classList.remove('no-remote');
    }
  }
  enableNoRemoteView() {
    if (
      !document.getElementById('meeting-body').classList.contains('no-remote')
    ) {
      console.log('callledd hereee');
      document.getElementById('meeting-body').classList.add('no-remote');
    }
  }
  //---------------------------------------------- client Handlers -------------------------------------------------------------
  // normal client handler
  private assignClientHandlers(that): void {
    this.client.on(ClientEvent.LocalStreamPublished, (evt) => {
      console.log('local stream published @');
      this.isLocalCamStreamPublished = true;
      // if(this.isLocalCamStreamPublished&&this.isLocalMicStreamPublished){
      //   this.isLoading=false;
      // }
      this.isLoading = false;
    });

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
      console.log('remote stream added');
      const stream = evt.stream as Stream;
      var id = stream.getId();
      if (
        !this.localStreams.includes(id.toString()) &&
        !this.localMicStreams.includes(id.toString())
      ) {
        console.log('remote stream is not local stream');
        this.client.subscribe(
          stream,
          { audio: true, video: true },
          (err) => {}
        );
      }
    });

    this.client.on(ClientEvent.RemoteStreamSubscribed, (evt) => {
      console.log('remote stream subscribed');
      const stream = evt.stream as Stream;
      const id = this.getRemoteId(stream);
      const idt = stream.getId();
      if (idt == this.remoteUserId + 2) {
        console.log('remote stream is screen share and subscribed!');
        this.screenRemoteCalls.push(id);
        this.enableScreenShareView();
        setTimeout(() => stream.play(id), 1000);
      } else if (idt == this.remoteUserId + 10) {
        if (!this.micRemoteCalls.length) {
          console.log('remote stream is mic stream and subscribed!');
          this.micRemoteCalls.push(id);
          setTimeout(() => stream.play(id), 1000);
        }
      } else {
        if (!this.remoteCalls.length) {
          console.log('remote stream is camera stream and subscribed!');
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
          console.log('remote camera stream is removed ');
        }
      } else if (idt == this.remoteUserId + 10) {
        if (stream) {
          stream.stop();
          this.micRemoteCalls = [];
          // this.remoteCalls = this.remoteCalls.filter(e => e !== idt.toString());
          console.log('remote mic stream is removed ');
          // this.endCall();
        }
      } else if (idt == this.remoteUserId + 2) {
        this.disableScreenShareView();
        console.log('remote stream is screen share and remvoed!');
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
        console.log('peeeerrr leftttt !!!', evt);
        stream.stop();
        this.peerOnline = false;
        this.enableNoRemoteView();
        if (this.localScreenStreams.length == 0) {
          this.screenRemoteCalls = [];
          this.disableScreenShareView();
        }
        // this.endCall();
        this.remoteCalls = this.remoteCalls.filter(
          (call) => call !== `${this.getRemoteId(stream)}`
        );
      } else {
        console.log('peeeerrr leftt?');
        console.log(evt);
        if (
          evt.uid != this.remoteUserId + 2 &&
          evt.uid != this.userId &&
          evt.uid != this.userId + 2
        ) {
          this.peerOnline = false;
          console.log('screen stream', this.localScreenStreams.length);
          if (this.localScreenStreams.length == 0) {
            this.screenRemoteCalls = [];
            this.disableScreenShareView();
          }
          this.enableNoRemoteView();
        }
      }
      // this.endCall();
    });

    this.client.on(ClientEvent.PeerOnline, (evt) => {
      console.log('peer is onlineeeee', evt);
      console.log(parseInt(this.remoteUserId) + 2);
      // console.log(remoteScreenId)
      if (
        evt.uid != this.userId &&
        evt.uid != this.userId + 2 &&
        evt.uid != this.userId + 10
      ) {
        this.peerOnline = true;
        this.enableRemoteJoinedView();
      }
    });
  }
  private assignMicClientHandlers(that): void {
    this.micClient.on(ClientEvent.LocalStreamPublished, (evt) => {
      console.log('mic stream published @');
      this.isLocalMicStreamPublished = true;
      this.isLoading = false;
    });
    this.micClient.on(ClientEvent.RecordingDeviceChanged, function (evt) {
      console.log('THE DEVICE HAS BEEN CHANGED !');
      that.checkBluetoothDevices();
    });
  }
  // screen client Handlers
  private assignScreenClientHandlers(): void {
    this.screenClient.on(ClientEvent.LocalStreamPublished, (evt) => {});
    this.screenClient.on(ClientEvent.RemoteStreamRemoved, (evt) => {
      console.log('screen share removed');
    });
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
    stream.on(StreamEvent.MediaAccessAllowed, () => {
      console.log('Media access allowed !');
      this.mediaAccessAllowed = true;
      this.camAccessAllowed = true;
      if (this.mediaAccessPopUpDialogRef != null) {
        this.dialog.closeAll();
      }
      this.getDevicesInfo();
    });

    // The user has denied access to the camera and mic.
    stream.on(StreamEvent.MediaAccessDenied, () => {
      this.mediaAccessAllowed = false;
      this.camAccessAllowed = false;
      // let dialogRef = this.dialog.open(MediaAccessDialogComponent);
      console.log('media access denied !');
    });
  }

  //Local Mic stream Handlers
  private assignLocalMicStreamHandlers(stream: Stream): void {
    stream.on(StreamEvent.MediaAccessAllowed, () => {
      console.log('Media access allowed !');
      this.getDevicesInfo();
    });

    stream.on(StreamEvent.MediaAccessDenied, () => {
      this.mediaAccessAllowed = false;
      this.micAccessAllowed = false;
      console.log('media access denied !');
    });

    stream.on(StreamEvent.AudioTrackEnded, () => {
      // this.startMicStream();
    });
  }

  private assignPreLocalMicStreamHandlers(stream: Stream): void {
    stream.on(StreamEvent.MediaAccessAllowed, () => {
      console.log('Media access allowed !');
      this.mediaAccessAllowed = true;
      this.micAccessAllowed = true;
      if (this.mediaAccessPopUpDialogRef != null) {
        this.dialog.closeAll();
      }
      this.getDevicesInfo();
    });

    // The user has denied access to the camera and mic.
    stream.on(StreamEvent.MediaAccessDenied, () => {
      this.mediaAccessAllowed = false;
      this.micAccessAllowed = false;
      // let dialogRef = this.dialog.open(MediaAccessDialogComponent);
      console.log('media access denied !');
    });
    stream.on(StreamEvent.AudioTrackEnded, () => {
      console.log('mic changed !');
    });
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
          this.isLocalStreamPlaying = true;
          onSuccess();
        }
      },
      (err) => {
        console.error('getUserMedia failed', err);
        this.mediaAccessAllowed = false;
      }
    );
  }
  private initLocalMicStream(onSuccess?: () => any): void {
    this.localMicStream.init(
      () => {
        this.localMicStream.play(this.localCallMicId);
        if (onSuccess) {
          this.isLocalMicStreamPlaying = true;
          onSuccess();
        }
      },
      (err) => {
        console.error('getUserMedia failed', err);
        this.mediaAccessAllowed = false;
      }
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
      (err) => {
        console.error('getUserMedia  failed', err);
        this.disableScreenShareView();
        this.localScreenStreams = [];
        this.hostScreenShareStatus = false;
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

  micClientJoin(
    onSuccess?: (mid: number | string) => void,
    onFailure?: (error: Error) => void
  ): void {
    this.micClient.join(
      null,
      this.meetingService.getMeeting().roomName,
      this.mid,
      onSuccess,
      onFailure
    );
  }
  micPublish(stream: Stream) {
    console.log('TRYING TO PUBLISH LOCAL MIC STREAM');
    this.micClient.publish(stream, (err) => {
      console.log('ERR OCCURRED WHILE PUBLISHING THE STREAM');
      console.log(err);
    });
  }

  publish(stream: Stream): void {
    console.log('TRYING TO PUBLISH LOCAL STREAM');
    console.log(stream.getId().toString());
    this.client.publish(stream, (err) => {
      console.log('ERR OCCURRED WHILE PUBLISHING THE STREAM');
      console.log(err);
    });
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
      this.preLocalMicStream.muteAudio();
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
      this.preLocalMicStream.unmuteAudio();
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
  checkBluetoothDevices() {
    let isBluetooth: boolean = false;
    this.client.getPlayoutDevices((devices: MediaDeviceInfo[]) => {
      console.log('audio output devices : ', devices);
      for (let device of devices) {
        console.log('ITERATION OUTPUT :', device);
        if (
          device.deviceId != 'default' &&
          device.deviceId != 'communications' &&
          (device.label.includes('(Bluetooth)') ||
            device.label.includes('bluetooth'))
        ) {
          isBluetooth = true;
          console.log('BlUETOOTH OUTPUT FOUND');
          this.setDeviceForStream(
            device.deviceId,
            'audio_output',
            device.label
          );
          break;
        }
      }
    });
    this.client.getRecordingDevices((devices: MediaDeviceInfo[]) => {
      console.log('audio input devices : ', devices);

      for (let device of devices) {
        console.log('ITERATION INPUT :', device);
        if (
          device.deviceId != 'default' &&
          device.deviceId != 'communications' &&
          (device.label.includes('(Bluetooth)') ||
            device.label.includes('bluetooth'))
        ) {
          isBluetooth = true;
          console.log('BlUETOOTH INPUT FOUND');
          this.setDeviceForStream(device.deviceId, 'audio_input', device.label);
          break;
        }
      }
    });

    if (isBluetooth == false) {
      console.log('BLUETOOTH IS OFF !');
      this.getDevicesInfo();
      setTimeout(() => {
        console.log(
          'DEFAULT AUDIO INPUT ->',
          this.activeAudioInputDeviceName,
          this.activeAudioInputDeviceId
        );
        console.log(
          'DEFAULT AUDIO OUTPUT ->',
          this.activeAudioOutputDeviceName,
          this.activeAudioOutputDeviceId
        );
        if (isBluetooth == false) {
          this.startMicStream();
        }
      }, 2000);
    }
  }
  doesDeviceExist(type, deviceId) {
    if (deviceId == null) {
      return false;
    }
    if (type == 'audio_input') {
      this.client.getRecordingDevices((devices: MediaDeviceInfo[]) => {
        for (let device of devices) {
          if (device.deviceId == deviceId) {
            return true;
          }
        }
      });
    } else if (type == 'audio_output') {
      this.client.getPlayoutDevices((devices: MediaDeviceInfo[]) => {
        console.log('audio output devices : ', devices);
        for (let device of devices) {
          if (device.deviceId == deviceId) {
            return true;
          }
        }
      });
    }
  }
  setDeviceForStream(deviceId, type, name) {
    console.log('TRYING TO SET DEVICE :', deviceId, name, type);

    if (this.doesDeviceExist(type, deviceId) == true) {
      console.log('DEVICE IS VALID !');
    } else {
      console.log("'DEVICE NOT VALID");
    }
    if (this.meetingState == 'pre-meeting') {
      if (this.preLocalMicStream != null) {
        if (this.preLocalMicStream.isPlaying) {
          if (type == 'audio_input') {
            this.preLocalMicStream.switchDevice('audio', deviceId);
            this.activeAudioInputDeviceId = deviceId;
            this.activeAudioInputDeviceName = name;
            console.log(
              'recording device switched for mic stream !',
              this.activeAudioInputDeviceId,
              this.activeAudioInputDeviceName
            );
          } else if (type == 'audio_output') {
            this.preLocalMicStream.setAudioOutput(deviceId);
            this.activeAudioInputDeviceId = deviceId;
            this.activeAudioInputDeviceName = name;
            console.log(
              'output device switched for premeeting stream !',
              this.activeAudioOutputDeviceName,
              this.activeAudioOutputDeviceId
            );
          }
        }
      }
    } else if (this.meetingState == 'in-meeting') {
      if (this.localMicStream != null) {
        if (this.localMicStream.isPlaying) {
          if (type == 'audio_input') {
            this.localMicStream.switchDevice('audio', deviceId);
            this.activeAudioInputDeviceId = deviceId;
            this.activeAudioInputDeviceName = name;
            console.log(
              'recording device switched for mic stream !',
              this.activeAudioInputDeviceId,
              this.activeAudioInputDeviceName
            );
          } else if (type == 'audio_output') {
            this.localMicStream.setAudioOutput(deviceId);
            this.activeAudioInputDeviceId = deviceId;
            this.activeAudioInputDeviceName = name;
            console.log(
              'output device switched for mic stream !',
              this.activeAudioOutputDeviceName,
              this.activeAudioOutputDeviceId
            );
          }
        }
      }
    }
  }

  //get devices info
  getDevicesInfo() {
    this.client.getCameras((devices: MediaDeviceInfo[]) => {
      console.log('camera devices : ', devices);
      this.activeVideoDeviceName = devices[0].label;
    });
    this.client.getPlayoutDevices((devices: MediaDeviceInfo[]) => {
      console.log('audio output devices : ', devices);
      let defaultAudioOutputDevice: string = this.getDefaultDeviceName(devices);
      let defaultAudioOutputDeviceId: string = this.getDefaultDeviceId(devices);
      if (
        defaultAudioOutputDevice &&
        defaultAudioOutputDevice != '' &&
        defaultAudioOutputDeviceId &&
        defaultAudioOutputDeviceId != ''
      ) {
        this.activeAudioOutputDeviceId = defaultAudioOutputDeviceId;
        this.activeAudioOutputDeviceName = defaultAudioOutputDevice;
      }
    });
    this.client.getRecordingDevices((devices: MediaDeviceInfo[]) => {
      console.log('audio input devices : ', devices);
      let defaultAudioInputDevice: string = this.getDefaultDeviceName(devices);
      let defaultAudioInputDeviceId: string = this.getDefaultDeviceId(devices);
      if (
        defaultAudioInputDevice &&
        defaultAudioInputDevice != '' &&
        defaultAudioInputDeviceId &&
        defaultAudioInputDeviceId != ''
      ) {
        this.activeAudioInputDeviceId = defaultAudioInputDeviceId;
        this.activeAudioInputDeviceName = defaultAudioInputDevice;
      }
    });
  }
  //getting default device name out of list of connected devices
  getDefaultDeviceName(devices) {
    let deviceGroupId: string = '';
    if (devices.length > 0) {
      for (let device of devices) {
        if (device.deviceId == 'default') {
          deviceGroupId = device.groupId;
          break;
        }
      }
      if (deviceGroupId != '') {
        for (let device of devices) {
          if (
            device.deviceId != 'default' &&
            device.deviceId != 'communications' &&
            device.groupId == deviceGroupId
          ) {
            return device.label;
          }
        }
      }
    }
  }
  //getting default device id out of list of connected devices
  getDefaultDeviceId(devices) {
    let deviceGroupId: string = '';
    if (devices.length > 0) {
      for (let device of devices) {
        if (device.deviceId == 'default') {
          deviceGroupId = device.groupId;
          break;
        }
      }
      if (deviceGroupId != '') {
        for (let device of devices) {
          if (
            device.deviceId != 'default' &&
            device.deviceId != 'communications' &&
            device.groupId == deviceGroupId
          ) {
            return device.deviceId;
          }
        }
      }
    }
  }

  checkIfNoDevicesAllowed() {
    if (navigator.mediaDevices.enumerateDevices()) {
      navigator.mediaDevices.enumerateDevices().then((devices) => {
        console.log('devices are :', devices);
        let mediaNotAllowed = true;
        if (devices.length > 0) {
          for (let device of devices) {
            if (device.deviceId != '') {
              mediaNotAllowed = false;
            }
          }
        }
        if (mediaNotAllowed == true) {
          if (this.isMobile == true) {
            this.mediaAccessPopUpDialogRef = this.dialog.open(
              MediaAccessDialogComponent,
              {
                height: 'auto',
                width: 'auto',
              }
            );
          } else {
            this.mediaAccessPopUpDialogRef = this.dialog.open(
              MediaAccessDialogComponent,
              {
                height: 'auto',
                width: '600px',
              }
            );
          }
        }
      });
    }
  }
}
