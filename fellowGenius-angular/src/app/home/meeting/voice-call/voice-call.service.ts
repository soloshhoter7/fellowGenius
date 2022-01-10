import { Injectable } from '@angular/core';
import AgoraRTC, {
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
  IMicrophoneAudioTrack,
} from 'agora-rtc-sdk-ng';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class VoiceCallService {
  constructor() {
    this.getMediaDevicesInfo();
  }
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
  remoteUsers = {};
  mics = [];
  cams = [];
  currentMic;
  currentCam;
  localTracks = {
    videoTrack: null,
    audioTrack: null,
  };
  audioSubscription: Subscription;
  connectionState = 'NOT INITIALIZED';
  AppId = environment.agora.appId;
  async getMediaDevicesInfo() {
    this.mics = await AgoraRTC.getMicrophones();
    this.currentMic = this.mics[0];
    this.cams = await AgoraRTC.getCameras();
    this.currentCam = this.cams[0];
  }

  async startBasicCall(channelName, Uid) {
    channelName = channelName + '_voice';
    await this.getMediaDevicesInfo();
    console.log('STARTING BASIC CALL !');
    this.rtc.client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
    console.log('CLIENT CREATED !');
    console.log('APP ID :' + this.AppId);
    this.assignClientHandlers();
    await this.rtc.client.join(this.AppId, channelName, null, Uid).then(() => {
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
  }

  async leaveCall() {
    if (this.rtc.client != null) {
      await this.rtc.client.leave().then(() => {
        console.log('LOCAL CLIENT LEFT THE CHANNEL');
        this.rtc.client = null;
      });
    }
  }
  async muteAudioTrack() {
    let audioTrack: IMicrophoneAudioTrack = this.localTracks.audioTrack;
    audioTrack.setEnabled(false);
  }
  async unmuteAudioTrack() {
    let audioTrack: IMicrophoneAudioTrack = this.localTracks.audioTrack;
    audioTrack.setEnabled(true);
  }
  async switchCamera(label) {
    console.log(label);
    this.currentCam = this.cams.find((cam) => cam.label === label);
    // switch device of local video track.
    await this.localTracks.videoTrack.setDevice(this.currentCam.deviceId);
  }

  async switchMicrophone(label) {
    console.log(label);
    this.currentMic = this.mics.find((mic) => mic.label === label);
    // switch device of local audio track.
    await this.localTracks.audioTrack.setDevice(this.currentMic.deviceId);
  }

  async subscribe(user, mediaType) {
    const uid = user.uid;
    // subscribe to a remote user
    await this.rtc.client.subscribe(user, mediaType);
    console.log('subscribe success');
    if (mediaType === 'audio') {
      console.log('SUBSCRIBED SOUND IS PLAYING !');
      user.audioTrack.play();
    }
  }

  assignClientHandlers() {
    let micClient: IAgoraRTCClient = this.rtc.client;
    micClient.on('user-published', async (user, mediaType) => {
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
