import { Component, OnInit } from '@angular/core';
import { UserActivityAnalytics } from 'src/app/model/userActivityAnalytics';
import { UserData } from 'src/app/model/UserData';
import { HttpService } from 'src/app/service/http.service';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnInit {

  constructor(private httpService:HttpService) { }
  userAnalytics:UserActivityAnalytics;
  userData:UserData[]=[];
  options = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: false,
    headers: ["User Id","Full Name","Role","Email","Expert Code","Expertises"],
    showTitle: true,
    title: 'user data',
    useBom: false,
    removeNewLines: true,
    keys: ['userId','fullName','role','email','expertCode','expertises' ]
  };

  ngOnInit(): void {
    this.downloadUserData();
    this.fetchAnalytics();
  }

  fetchAnalytics(){
    this.httpService.fetchUserAnalytics().subscribe((res)=>{
      this.userAnalytics=res;
      console.log(this.userAnalytics);
    })
  }
  downloadUserData(){
    this.httpService.fetchAllUserData().subscribe((res:any)=>{
      this.userData = res;
      console.log(this.userData);
    })
  }

}
