import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { UserReferralsInfo } from '../model/userReferralInfo';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class ReferralService {
  constructor(private httpService: HttpService) {}
  private referralDetailsList: UserReferralsInfo[] = [];
  referralDetailsChanged = new Subject<UserReferralsInfo[]>();

  getUserReferrralInfo() {
    return this.referralDetailsList.slice();
  }

  setReferralDetailsList(refInfo: UserReferralsInfo[]) {
    this.referralDetailsList = refInfo;
    this.referralDetailsChanged.next(this.referralDetailsList.slice());
  }

  fetchUserReferralDetailsInfo(userId: string) {
    this.httpService.getUserReferralInfo(userId).subscribe((res) => {
      this.setReferralDetailsList(res);
    });
  }
}
