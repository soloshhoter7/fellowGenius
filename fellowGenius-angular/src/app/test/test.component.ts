import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { map, startWith } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AppInfo } from 'src/app/model/AppInfo';
import { Category } from 'src/app/model/category';
import { tutorProfile } from 'src/app/model/tutorProfile';
import * as bcrypt from 'bcryptjs';
import {
  expertise,
  tutorProfileDetails,
} from 'src/app/model/tutorProfileDetails';
import { HttpService } from 'src/app/service/http.service';
import { TutorService } from 'src/app/service/tutor.service';
import { togglePassword, initiateSelect2 } from '../../assets/js/custom';
import { UploadProfilePictureComponent } from '../facade/sign-up/upload-profile-picture/upload-profile-picture.component';
import { NgZone } from '@angular/core';
import { loginModel } from 'src/app/model/login';
import { AuthService } from 'src/app/service/auth.service';
import { LoginDetailsService } from 'src/app/service/login-details.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';

// import * as moment from 'moment';
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment, Moment } from 'moment';
import AgoraRTC from 'agora-rtc-sdk-ng';
// const moment = _rollupMoment || _moment;
const moment = _rollupMoment || _moment;
// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
declare let $: any;
declare const window: any;
@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css'],
})
export class TestComponent implements OnInit {
  channelName: string = 'FG@123456';
  appId: string = '45f3ee50e0fd491aa46bd17c05fc7073';
  uid = '12345';
  clientJoined: boolean = false;
  // create Agora client
client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
localTracks = {
  videoTrack: null,
  audioTrack: null
};
remoteUsers = {};
// Agora client options
options = {
  appid: '',
  channel: '',
  uid: '',
  token: ''
};

  mics = []; // all microphones devices you can use
  cams = []; // all cameras devices you can use
  currentMic; // the microphone you are using
  currentCam; // the camera you are using

  volumeAnimation;
  localTrackAudioLevel = '0';
  ngOnInit(): void {
    console.log('options :', this.options);
    $('#media-device-test').modal('show');
    var urlParams = new URL(location.href).searchParams;
    this.options.appid = this.appId;
    this.options.channel = this.channelName;
    this.options.token = urlParams.get('token');
    this.options.uid = urlParams.get('uid');
    this.mediaDeviceTest();
    setInterval(() => {
      this.localTrackAudioLevel = (
        this.localTracks.audioTrack.getVolumeLevel() * 100
      ).toFixed(2);
    }, 100);
    // this.volumeAnimation = requestAnimationFrame(this.setVolumeWave);
  }

  async formJoinSubmit(){
   console.log(this.options);
    $("#join").attr("disabled", true);
    $("#device-wrapper").css("display", "flex");
    try {
      this.options.appid = this.appId;
      this.options.token = 'hello';
      this.options.channel = this.channelName;
      
      await this.join();
      if (this.options.token) {
        $('#success-alert-with-token').css('display', 'block');
      } else {
        $('#success-alert a').attr(
          'href',
          `index.html?appid=${this.options.appid}&channel=${this.options.channel}&token=${this.options.token}`
        );
        $('#success-alert').css('display', 'block');
      }
    } catch (error) {
      console.error(error);
    } finally {
      $('#leave').attr('disabled', false);
    }
  }

  async join() {
    // add event listener to play remote tracks when remote user publishs.
    console.log('Inside the join method');
    this.client.on('user-published', this.handleUserPublished);
    this.client.on('user-unpublished', this.handleUserUnpublished);

    // join a channel.
    await this.client.join(this.options.appid, this.options.channel, 
      this.options.token || null, this.options.uid || null);
  
    if (!this.localTracks.audioTrack || !this.localTracks.videoTrack) {
      [this.localTracks.audioTrack, this.localTracks.videoTrack] =
        await Promise.all([
          // create local tracks, using microphone and camera
          AgoraRTC.createMicrophoneAudioTrack({
            microphoneId: this.currentMic.deviceId,
          }),
          AgoraRTC.createCameraVideoTrack({
            cameraId: this.currentCam.deviceId,
          }),
        ]);
    }

    // play local video track
    this.localTracks.videoTrack.play('local-player');
    $('#local-player-name').text(`localVideo(${this.options.uid})`);

    // publish local tracks to channel
    await this.client.publish(Object.values(this.localTracks));
    console.log('publish success');
  }

  async mediaDeviceTest() {
    // create local tracks
    [this.localTracks.audioTrack, this.localTracks.videoTrack] =
      await Promise.all([
        // create local tracks, using microphone and camera
        AgoraRTC.createMicrophoneAudioTrack(),
        AgoraRTC.createCameraVideoTrack(),
      ]);

    // play local track on device detect dialog
    this.localTracks.videoTrack.play('pre-local-player');
    // localTracks.audioTrack.play();

    // get mics
    this.mics = await AgoraRTC.getMicrophones();
    this.currentMic = this.mics[0];
    $('.mic-input').val(this.currentMic.label);
    // this.mics.forEach((mic) => {
    //   $('.mic-list').append(
    //     `<a class="dropdown-item" href="#">${mic.label}</a>`
    //   );
    // });

    // get cameras
    this.cams = await AgoraRTC.getCameras();
    this.currentCam = this.cams[0];
    $('.cam-input').val(this.currentCam.label);
    // this.cams.forEach((cam) => {
    //   $('.cam-list').append(
    //     `<a class="dropdown-item" (click)="">${cam.label}</a>`
    //   );
    // });
  }

  async leave() {
    for (let trackName in this.localTracks) {
      var track = this.localTracks[trackName];
      if (track) {
        track.stop();
        track.close();
        this.localTracks[trackName] = undefined;
      }
    }

    this.localTracks = { videoTrack: '', audioTrack: '' };

    // remove remote users and player views
    this.remoteUsers = {};
    $('#remote-playerlist').html('');

    // leave the channel
    await this.client.leave();

    $('#local-player-name').text('');
    $('#join').attr('disabled', false);
    $('#leave').attr('disabled', true);
    $('#device-wrapper').css('display', 'none');
    console.log('client leaves channel success');
  }

  async subscribe(user, mediaType) {
    console.log('SUBSCRIBING');
    const uid = user.uid;
    // subscribe to a remote user
    await this.client.subscribe(user, mediaType);
    console.log('subscribe success');
    if (mediaType === 'video') {
      const player = $(`
        <div id="player-wrapper-${uid}">
          <p class="player-name">remoteUser(${uid})</p>
          <div id="player-${uid}" class="player"></div>
        </div>
      `);
      $('#remote-playerlist').append(player);
      user.videoTrack.play(`player-${uid}`);
    }
    if (mediaType === 'audio') {
      user.audioTrack.play();
    }
  }

  handleUserPublished(user, mediaType) {
    console.log('USER HAS PUBLISHED !');
    const id = user.uid;
    this.remoteUsers[id] = user;
    this.subscribe(user, mediaType);
  }

  handleUserUnpublished(user, mediaType) {
    if (mediaType === 'video') {
      const id = user.uid;
      delete this.remoteUsers[id];
      $(`#player-wrapper-${id}`).remove();
    }
  }

  async switchCamera(label) {
    console.log(label);
    this.currentCam = this.cams.find((cam) => cam.label === label);
    $('.cam-input').val(this.currentCam.label);
    // switch device of local video track.
    await this.localTracks.videoTrack.setDevice(this.currentCam.deviceId);
  }

  async switchMicrophone(label) {
    console.log(label);
    this.currentMic = this.mics.find((mic) => mic.label === label);
    $('.mic-input').val(this.currentMic.label);
    // switch device of local audio track.
    await this.localTracks.audioTrack.setDevice(this.currentMic.deviceId);
  }

  // show real-time volume while adjusting device.
  setVolumeWave() {
    this.volumeAnimation = requestAnimationFrame(this.setVolumeWave);
    $('.progress-bar').css(
      'width',
      this.localTracks.audioTrack.getVolumeLevel() * 100 + '%'
    );
    $('.progress-bar').attr(
      'aria-valuenow',
      this.localTracks.audioTrack.getVolumeLevel() * 100
    );
  }
}
