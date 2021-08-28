import { Component, OnInit } from '@angular/core';
import { WindowRefService } from 'src/app/service/window-ref.service';

@Component({
  selector: 'app-resource-videos',
  templateUrl: './resource-videos.component.html',
  styleUrls: ['./resource-videos.component.css']
})
export class ResourceVideosComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    window.scroll(0,0);
  }

}
