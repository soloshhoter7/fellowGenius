import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery'
import AgoraRTC, {
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
  IMicrophoneAudioTrack,
} from 'agora-rtc-sdk-ng';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css'],
  providers: [],
})
export class TestComponent implements OnInit {

  constructor(
    public activatedRoute: ActivatedRoute
  ) { 
    this.getMediaDevicesInfo();
  }

  userId: number;
  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      let id = params['bookingId'];
      this.userId = id;
    });
    this.StartBasicCall();
  }


  title = 'agora-basic-video-call';

  rtc = {
    client: null,
    localAudioTrack: null,
    remoteUser: null,
    remoteAudioTrack: null,
  };
  localTrackAudioLevel: string = '0';
  selectedMicrophoneId;
  options = {
    appid: '45f3ee50e0fd491aa46bd17c05fc7073',
    channel: 'FG@123456',
    uid: null,
    token: null,
  };
  AppId = environment.agora.appId;
  remoteUsers = {};
  mics = [];
  cams = [];
  currentMic;
  currentCam;
  localTracks = {
    videoTrack: null,
    audioTrack: null,
  };
  connectionState = 'NOT INITIALIZED';
  async StartBasicCall(){
    //create a basic video stream 
    console.log('STARTING BASIC CALL !');
    this.rtc.client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
    console.log('CLIENT CREATED !');
    console.log('APP ID :' + this.AppId);
    this.assignClientHandlers();
    await this.rtc.client.join(this.AppId,'meetingId', null,this.userId).then(() => {
      console.log('CLIENT JOINED !');
    });

    if (!this.localTracks.audioTrack) {
      [this.localTracks.audioTrack] = await Promise.all([
        // create local tracks, using microphone and camera
        AgoraRTC.createMicrophoneAudioTrack({
          microphoneId: this.currentMic.deviceId,
        }),
      ]);
      setInterval(() => {
        let audioTrack: IMicrophoneAudioTrack = this.localTracks.audioTrack;
        this.localTrackAudioLevel = audioTrack
          .getVolumeLevel()
          .toFixed(2)
          .toString();
      }, 100);
    }

    if(!this.localTracks.videoTrack){
      //create camera video track
      [this.localTracks.videoTrack]= await Promise.all([
        AgoraRTC.createCameraVideoTrack({
          cameraId: this.currentCam.deviceId,
        }),
      ]);
    }

    this.localTracks.videoTrack.play("local-player")
    $("#local-player-name").text(`localVideo(${this.userId})`);
    await this.publish();
  }

  async publish() {
    if (this.localTracks != null && this.localTracks.audioTrack != null) {
      await this.rtc.client
        .publish(this.localTracks.audioTrack)
        .then(() => {
          console.log('MICROPHONE TRACK PUBLISHED SUCCESSFULLY');
        })
        .catch((e) => {
          console.log('MICROPHONE TRACK PUBLISHING FAILED !');
          console.log(e);
          setTimeout(() => {
            this.publish();
          }, 500);
        });
    }

    if(this.localTracks !=null && this.localTracks.videoTrack!=null){
      await this.rtc.client
      .publish(this.localTracks.videoTrack)
      .then(()=>{
        console.log('CAMERA TRACK PUBLISHED SUCCESSFULLY');
      })
      .catch((e)=>{
        console.log('CAMERA TRACK PUBLISHING FAILED');
        console.log(e);
          setTimeout(() => {
            this.publish();
          }, 500);
      })
    }
  }

  async subscribe(user, mediaType) {
    const uid = user.uid;
    // subscribe to a remote user
    await this.rtc.client.subscribe(user, mediaType);
    console.log('subscribe success');
    if (mediaType === 'audio') {
      console.log('SUBSCRIBED SOUND IS PLAYING !');
      user.audioTrack.play();
    }else if(mediaType === 'video'){
      console.log('SUBSCRIBED VIDEO IS PLAYING !');
    //   const player = $(`
    //   <div id="player-wrapper-${uid}">
    //     <p class="player-name">remoteUser(${uid})</p>
    //     <div id="player-${uid}" class="player"></div>
    //   </div>
    // `);
    // $("#remote-playerlist").append(player);
    user.videoTrack.play("remote-playerlist");   
    console.log('Remote user id is '+ user.uid);
    $("#remote-player-name").text(`Remote Video(${user.uid})`);   
    }
  }

  async getMediaDevicesInfo() {
    this.mics = await AgoraRTC.getMicrophones();
    this.currentMic = this.mics[0];
    this.cams = await AgoraRTC.getCameras();
    this.currentCam = this.cams[0];
  }

  assignClientHandlers() {
    let micClient: IAgoraRTCClient = this.rtc.client;
    micClient.on('user-published', async (user, mediaType) => {
      console.log('MEDIA TYPE IS '+ mediaType);
      const id = user.uid;
      // this.rtc.remoteUser = user;
      this.remoteUsers[id] = user;
      this.subscribe(user, mediaType);
    });
    micClient.on('user-unpublished', (user, mediaType) => {
      if (mediaType === 'video') {
        const id = user.uid;
        // this.rtc.remoteUser=null;
        delete this.remoteUsers[id];
        // $(`#player-wrapper-${id}`).remove();
      }
    });
    micClient.on('connection-state-change', (curState, revState, reason) => {
      this.connectionState = curState;
      console.log('CONNECTION STATE CHANGED :', curState, revState, reason);
      // if (this.connectionState == 'DISCONNECTED') {
      //   this.meetingComponent.endCall();
      // }
    });
    AgoraRTC.onMicrophoneChanged = async (changedDevice) => {
      await this.getMediaDevicesInfo();
    };
  }
  }
