import { Component, OnInit } from '@angular/core';
import { UID } from 'agora-rtc-sdk-ng';
import { app } from 'firebase';
import { VoiceCallService } from './service/voice-call.service';

@Component({
  selector: 'app-voice-call',
  templateUrl: './voice-call.component.html',
  styleUrls: ['./voice-call.component.css'],
})
export class VoiceCallComponent implements OnInit {
  constructor(public voiceCallService: VoiceCallService) {}
  channelName: string = 'FG@123456';
  appId: string = '45f3ee50e0fd491aa46bd17c05fc7073';
  uid: UID = '12345';
  ngOnInit(): void {}

  joinCall() {
    console.log(this.channelName, this.uid, this.appId);
    this.voiceCallService.startBasicCall(
      this.channelName,
      this.uid,
      this.appId
    );
  }
  leaveCall() {
    this.voiceCallService.leaveCall();
  }
}
