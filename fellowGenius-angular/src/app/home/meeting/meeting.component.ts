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
    private loginService: LoginDetailsService,
    private httpService: HttpService,
    private cookieService: CookieService
  ) {
    this.uid = Math.floor(Math.random() * 100);
    this.sid = 76;
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

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
  }

  ngAfterViewInit() {
    this.canvasEl = this.canvas.nativeElement;
    this.cx = this.canvasEl.getContext('2d');

    this.canvasEl.width = this.width;
    this.canvasEl.height = this.height;

    this.cx.lineWidth = 5;
    this.cx.lineCap = 'round';
    this.cx.strokeStyle = '#000';
    this.connectToMeetingWebSocket(this.meeting.roomName);
    this.captureEvents(this.canvasEl);
    this.getMousePosition(this.canvasEl);
  }

  ngOnInit() {
    if (this.meetingService.getMeeting().roomId == null) {
      this.handleRefresh();
    }
    this.preventBackButton();
    this.width = (window.screen.width / 100) * 97;
    this.height = (window.screen.height / 100) * 80;
    this.screenWidth = window.screen.width;
    this.screenHeight = window.screen.height;
    this.meeting = this.meetingService.getMeeting();

    this.senderName = this.meeting.userName;
    this.senderId = this.meeting.userId;
    this.bookingDetails = this.meetingService.getBooking();
    this.timelimit = this.calculateRemainingTime() * 60;
    this.shortName();
    //---------------------------------------------- normal camera stream ----------------------------------
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

  handleRefresh() {
    if (jwt_decode(this.cookieService.get('token'))['ROLE'] == 'Learner') {
      this.router.navigate(['home/studentDashboard']);
    } else if (
      jwt_decode(this.cookieService.get('token'))['ROLE'] == 'Expert'
    ) {
      this.router.navigate(['home/tutorDashboard']);
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
      this.screenStream.stop();
      this.screenClient.unpublish(this.screenStream, (err) => {});
      this.screenClient.leave();
      this.screenStream.close();
    }
  }
  expandScreen() {
    this.expandedScreen = !this.expandedScreen;
  }

  openWhiteBoard() {
    if (this.openWhiteBoardStatus == false) {
      this.openWhiteBoardStatus = true;
      this.myClass = '';
      this.expandEnabled = false;
      this.myScreenShareClass = 'hideBlock';
      this.initiateWhiteBoardForStudent();
      // this.router.navigate([ '/meeting/whiteBoard' ]);
    } else {
      this.openWhiteBoardStatus = !this.openWhiteBoardStatus;
      this.myClass = 'hideBlock';
      this.expandEnabled = true;
      this.closeWhiteBoardForStudent();
      // this.router.navigate([ 'meeting' ]);
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
      this.chatWindow.nativeElement.scrollTop = this.chatWindow.nativeElement.scrollHeight;
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
  //-------------------------------------------------------------------------------------------------------------------
  captureEvents(canvasEl: HTMLCanvasElement) {
    // this will capture all mousedown events from the canvas element
    fromEvent(canvasEl, 'mousedown')
      .pipe(
        switchMap((e) => {
          // this.getMousePosition(canvasEl);
          // after a mouse down, we'll record all mouse moves
          return fromEvent(canvasEl, 'mousemove').pipe(
            // we'll stop (and unsubscribe) once the user releases the mouse
            // this will trigger a 'mouseup' event
            takeUntil(fromEvent(canvasEl, 'mouseup')),
            // we'll also stop (and unsubscribe) once the mouse leaves the canvas (mouseleave event)
            takeUntil(fromEvent(canvasEl, 'mouseleave')),
            // pairwise lets us get the previous value to draw a line from
            // the previous point to the current point
            pairwise()
          );
        })
      )
      .subscribe((res: [MouseEvent, MouseEvent]) => {
        const rect = canvasEl.getBoundingClientRect();

        // previous and current position with the offset
        const prevPos = {
          x: res[0].clientX - rect.left,
          y: res[0].clientY - rect.top,
        };

        const currentPos = {
          x: res[1].clientX - rect.left,
          y: res[1].clientY - rect.top,
        };
        this.sendCoordinates(
          'drawing',
          null,
          this.cx.strokeStyle,
          this.cx.lineWidth,
          prevPos,
          currentPos
        );
        let coordinates = {
          prevX: prevPos.x,
          prevY: prevPos.y,
          currX: currentPos.x,
          currY: currentPos.y,
        };
        // this.pushCoordinates(coordinates);
        this.drawOnCanvas(prevPos, currentPos);
      });
  }

  getMousePosition(canvas) {
    canvas.addEventListener('mouseup', () => {
      var src = canvas.toDataURL('image/png');
      this.list.push(src);
      this.undoStack.push(src);
    });
  }
  private drawOnCanvas(
    prevPos: { x: number; y: number },
    currentPos: { x: number; y: number }
  ) {
    if (!this.cx) {
      return;
    }
    this.cx.beginPath();
    if (prevPos) {
      this.cx.moveTo(prevPos.x, prevPos.y); // from
      this.cx.lineTo(currentPos.x, currentPos.y);
      this.cx.stroke();
    }
  }

  erase() {
    this.cx.lineWidth = 50;
    this.cx.lineCap = 'round';
    this.cx.strokeStyle = '#fff';
  }
  pencil(event, item) {
    if (item == 'black') {
      this.cx.lineWidth = 5;
      this.cx.lineCap = 'round';
      this.cx.strokeStyle = '#000';
    } else if (item == 'red') {
      this.cx.lineWidth = 5;
      this.cx.lineCap = 'round';
      this.cx.strokeStyle = '#FF0000';
    } else if (item == 'blue') {
      this.cx.lineWidth = 5;
      this.cx.lineCap = 'round';
      this.cx.strokeStyle = '#0000FF';
    }
  }

  reset() {
    this.sendCoordinates('reset', null, null, null, null, null);
    this.cx.clearRect(0, 0, this.cx.canvas.width, this.cx.canvas.height);
  }
  undo() {
    if (this.undoStack.length == 0) {
      this.cx.clearRect(0, 0, this.width, this.height);
    } else {
      var src = this.undoStack.pop();
      this.redoStack.push(this.list.pop());
      var img: HTMLImageElement = document.createElement('img');
      img.src = src.toString();
      img.setAttribute('width', '1000');
      img.setAttribute('height', '480');
      this.sendCoordinates('undo', img.src, null, null, null, null);
      img.onload = (event) => {
        this.cx.clearRect(0, 0, this.width, this.height);
        this.cx.drawImage(img, 0, 0);
      };
    }
  }

  redo() {
    var src = this.redoStack.pop();
    this.list.push(src);
    this.undoStack.push(src);
    var img: HTMLImageElement = document.createElement('img');
    img.src = src.toString();
    img.setAttribute('width', '1000');
    img.setAttribute('height', '480');
    this.sendCoordinates('redo', img.src, null, null, null, null);
    img.onload = (event) => {
      this.cx.clearRect(0, 0, this.width, this.height);
      this.cx.drawImage(img, 0, 0);
    };
  }

  connectToMeetingWebSocket(bookingId) {

    let socket = new SockJS(this.backendURL+'/fellowGenius');
    this.ws = Stomp.over(socket);
    let that = this;
    this.ws.connect(
      {},
      (frame) => {
        that.ws.subscribe('/errors', (message) => {
          alert('Error ' + message.body);
        });
        that.ws.subscribe('/inbox/whiteBoard/' + bookingId, (message) => {
          var res = JSON.parse(message.body);

          if (res.action == 'initiateWhiteBoard') {
            if (this.meetingService.getMeeting().role == 'student') {
              this.expandEnabled = false;
              this.myClass = '';
            }
          } else if (res.action == 'drawing') {
            if (this.meetingService.getMeeting().role == 'student') {
              this.cx.strokeStyle = res.color;
              this.cx.lineWidth = res.lineWidth;
              if (res.color == '#ffffff') {
                this.cx.lineCap = 'round';
              }
              this.drawOnCanvas(res.prevPos, res.currentPos);
            }
          } else if (res.action == 'closeWhiteBoard') {
            if (this.meetingService.getMeeting().role == 'student') {
              this.expandEnabled = true;
              this.myClass = 'hideBlock';
            }
          } else if (res.action == 'reset') {
            if (this.meetingService.getMeeting().role == 'student') {
              this.cx.clearRect(
                0,
                0,
                this.cx.canvas.width,
                this.cx.canvas.height
              );
            }
          } else if (res.action == 'undo' || res.action == 'redo') {
            if (this.meetingService.getMeeting().role == 'student') {
              var img: HTMLImageElement = document.createElement('img');
              img.src = res.dataSource.toString();
              img.setAttribute('width', '1000');
              img.setAttribute('height', '480');
              img.onload = (event) => {
                this.cx.clearRect(0, 0, this.width, this.height);
                this.cx.drawImage(img, 0, 0);
              };
            }
          }
        });

        that.ws.subscribe('/inbox/MeetingChat/' + bookingId, function (
          message
        ) {
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
        });
      },
      (error) => {
        // alert('STOMP error ' + error);
        console.log('re initiating the connection !');
        setTimeout(() => {
          this.connectToMeetingWebSocket(this.meeting.roomName);
        }, 5000);
      }
    );
  }

  sendCoordinates(action, dataSource, color, lineWidth, prevPos, currentPos) {
    let data = JSON.stringify({
      action: action,
      dataSource: dataSource,
      color: color,
      lineWidth: lineWidth,
      prevPos: prevPos,
      currentPos: currentPos,
    });
    this.ws.send('/sendData/' + this.meeting.roomName, {}, data);
  }

  initiateWhiteBoardForStudent() {
    this.sendCoordinates('initiateWhiteBoard', null, null, null, null, null);
  }

  closeWhiteBoardForStudent() {
    this.sendCoordinates('closeWhiteBoard', null, null, null, null, null);
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
  //--------------------------------------------------------------------------------------------------------------
  //--------------------------------- for short Name ------------------------------------------------------------------
  shortName() {
    var str = this.meeting.userName.split(' ');
    if (str[1] != undefined) {
      var fn = str[0];
      var ln = str[1];
    } else {
      var fn = str[0];
    }

    if (ln == undefined) {
      var shortName = fn[0].toString();
      this.meeting.userName = shortName;
    } else {
      var shortName = fn[0].toString().concat(ln[0].toString());

      this.meeting.userName = shortName;
    }
  }
}
