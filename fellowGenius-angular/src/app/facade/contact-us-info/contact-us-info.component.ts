import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contact-us-info',
  templateUrl: './contact-us-info.component.html',
  styleUrls: ['./contact-us-info.component.css']
})
export class ContactUsInfoComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    window.scroll(0,0);
  }

}
