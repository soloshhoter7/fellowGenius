import { Component, OnInit } from '@angular/core';
import { adminReferralInfo } from 'src/app/model/adminReferralInfo';
import { HttpService } from 'src/app/service/http.service';

@Component({
  selector: 'app-referrals-info',
  templateUrl: './referrals-info.component.html',
  styleUrls: ['./referrals-info.component.css']
})
export class ReferralsInfoComponent implements OnInit {
  adminReferralInfoList:adminReferralInfo[];
  constructor(private httpService:HttpService) { }

  ngOnInit(): void {
    this.getAdminReferralInfo();
  }

  getAdminReferralInfo(){
    this.httpService.fetchAdminReferralInfo().subscribe(
      (res)=>{
        console.log(res);
        this.adminReferralInfoList=res;
        console.log(this.adminReferralInfoList);
        console.log('backend called');
      }
    )
  }

  showReferralInfo(id:string){

    console.log("Inside the view detail click "+ id);
    const targetDiv=document.getElementById(id);
    const targetButton=document.getElementById(id+"3");
    console.log("Target Div is "+ targetDiv);
    if (targetDiv.style.display !== "none") {
      targetDiv.style.display = "none";
      targetButton.innerHTML="View Details";
    } else {
      targetDiv.style.display = "block";
      targetButton.innerHTML="Hide Details";
    }
  }

}
