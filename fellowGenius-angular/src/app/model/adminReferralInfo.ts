import {ReferrerInfo} from '../../app/model/ReferrerInfo'
import {UserReferralsInfo} from '../../app/model/userReferralsInfo'
import {bookingDetails } from '../../app/model/bookingDetails'
export class adminReferralInfo{

    public referrerInfo:ReferrerInfo;

    public userReferralInfo:UserReferralsInfo[];

    public referralMeetingsSetupInfo:bookingDetails[];

    public referrerPaymentDue:Number;

}