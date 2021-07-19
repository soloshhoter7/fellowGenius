import { Component, OnInit } from '@angular/core';
import { UserActivityAnalytics } from 'src/app/model/userActivityAnalytics';
import { HttpService } from 'src/app/service/http.service';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnInit {

  constructor(private httpService:HttpService) { }
  userAnalytics:UserActivityAnalytics;
  ngOnInit(): void {
    this.fetchAnalytics();
  }

  fetchAnalytics(){
    this.httpService.fetchUserAnalytics().subscribe((res)=>{
      this.userAnalytics=res;
      console.log(this.userAnalytics);
    })
  }

}
