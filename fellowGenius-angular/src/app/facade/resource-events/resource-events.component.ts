import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-resource-events',
  templateUrl: './resource-events.component.html',
  styleUrls: ['./resource-events.component.css']
})
export class ResourceEventsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    scroll(0,0);
  }

}
