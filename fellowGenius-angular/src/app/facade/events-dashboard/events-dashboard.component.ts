import { Component, OnInit } from '@angular/core';
import { Event } from 'src/app/model/Event';
import { HttpService } from 'src/app/service/http.service';

@Component({
  selector: 'app-events-dashboard',
  templateUrl: './events-dashboard.component.html',
  styleUrls: ['./events-dashboard.component.css']
})
export class EventsDashboardComponent implements OnInit {

  upcomingEvents:Event[];
  constructor(private httpClient: HttpService) { }

  ngOnInit(): void {

    this.httpClient.getUpcomingEvents().subscribe(
      (res)=>{

        console.log('Upcoming Events');
        
        console.log(res);
        this.upcomingEvents=res;

        console.log('Banner url of all');
    
    for(let events of this.upcomingEvents){
      console.log(events.bannerUrl);
      
    }
      }
    )

    
    
  }

}
