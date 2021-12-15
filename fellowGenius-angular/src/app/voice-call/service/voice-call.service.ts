import { Injectable } from '@angular/core';
import AgoraRTC, {
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
  IMicrophoneAudioTrack,
} from 'agora-rtc-sdk-ng';
@Injectable({
  providedIn: 'root',
})
export class VoiceCallService {
  constructor() {}
  rtc = {
    client: null,
    localAudioTrack: null,
    remoteUser: null,
    remoteAudioTrack: null,
  };
  localTrackAudioLevel: string = '0';
  selectedMicrophoneId;
  async startBasicCall(channelName, Uid, AppId) {
    console.log('STARTING BASIC CALL !');
    this.rtc.client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
    console.log('CLIENT CREATED !');
    console.log('APP ID :' + AppId);
    await this.rtc.client.join(AppId, channelName, null, Uid).then(() => {
      console.log('CLIENT JOINED !');
      this.assignClientHandlers();
    });

    AgoraRTC.getDevices().then((devices) => {
      const audioDevices = devices.filter(function (device) {
        return device.kind === 'audioinput';
      });
      console.log('AUDIO DEVICES :', audioDevices);
      let bluetoothDevice: MediaDeviceInfo = null;
      for (let device of audioDevices) {
        if (device.label.includes('Bluetooth')) {
          bluetoothDevice = device;
        }
      }
      if (bluetoothDevice != null) {
        console.log('MICROPHONE LABEL :', bluetoothDevice.label);
        this.selectedMicrophoneId = bluetoothDevice.deviceId;
      } else if (bluetoothDevice == null) {
        console.log('MICROPHONE LABEL :', audioDevices[0].label);
        this.selectedMicrophoneId = audioDevices[0].deviceId;
      }

      AgoraRTC.createMicrophoneAudioTrack({
        microphoneId: this.selectedMicrophoneId,
      }).then((audioTrack: IMicrophoneAudioTrack) => {
        console.log('AUDIO TRACK CREATED !');
        this.rtc.localAudioTrack = audioTrack;
        this.rtc.client.publish(this.rtc.localAudioTrack).then(() => {
          console.log('AUDIO STREAM PUBLISHED !');
        });
        setInterval(() => {
          this.localTrackAudioLevel = audioTrack.getVolumeLevel().toFixed(1);
        });
      });
    });
  }
  async leaveCall() {
    if (this.rtc.client != null) {
      await this.rtc.client.leave().then(() => {
        console.log('LOCAL CLIENT LEFT THE CHANNEL');
        this.rtc.client = null;
      });
    }
  }
  assignClientHandlers() {
    let micClient: IAgoraRTCClient = this.rtc.client;
    micClient.on('user-joined', (user: IAgoraRTCRemoteUser) => {
      console.log('REMOTE USER JOINED WITH USER ID :', user.uid);
      this.rtc.remoteUser = user;
    });
    micClient.on('user-left', (user, reason) => {
      console.log('REMOTE USER LEFT WITH UID :', user.uid);
      if (this.rtc.remoteUser.uid == user.uid) {
        console.log('RECOGNISED REMOTE USER HAS LEFT !');
        this.rtc.remoteUser = null;
      }
    });
    micClient.on('user-published', async (user, mediaType) => {
      await this.rtc.client.subscribe(user, mediaType).then(() => {
        console.log('REMOTE USER PUBLISHED A STREAM');
        if (mediaType === 'audio') {
          this.rtc.remoteAudioTrack = user.audioTrack;
          this.rtc.remoteAudioTrack.play();
        }
      });
    });
    AgoraRTC.onMicrophoneChanged = async (changedDevice) => {
      console.log('RECORDING DEVICE CHANGED !');
      console.log('CHANGED DEVICE :', changedDevice);
      // When plugging in a device, switch to a device that is newly plugged in.
      if (changedDevice.state === 'ACTIVE') {
        this.rtc.localAudioTrack.setDevice(changedDevice.device.deviceId);
        // Switch to an existing device when the current device is unplugged.
      } else if (
        changedDevice.device.label === this.rtc.localAudioTrack.getTrackLabel()
      ) {
        const oldMicrophones = await AgoraRTC.getMicrophones();
        oldMicrophones[0] &&
          this.rtc.localAudioTrack.setDevice(oldMicrophones[0].deviceId);
      }
    };
  }
}
