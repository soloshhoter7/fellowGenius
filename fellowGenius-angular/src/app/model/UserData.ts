export class UserData{
    userId:string;
    fullName:string;
    role:string;
    email:string;
    expertises:string;
    expertCode:string;
    upiID:string;
}
export class ActivityTimeDetails{
    userId:string;
    fullName:string;
    role:string;
    loginTime:string;
    signUpTime:string;
    referralCode:string;
}

export class ReferralActivityDetails{
    userId:string;
    fullName:string;
    referredUser:string;
    expertCode:string;
    signUpTime:string;
    platformType:string;
}