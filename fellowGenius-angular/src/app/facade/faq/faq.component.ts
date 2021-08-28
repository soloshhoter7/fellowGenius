import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {
  panelExpanded=true;

  constructor() { }

  ngOnInit(): void {
    window.scroll(0,0);
  }
  // scrollToElement($element){
  //   console.log($element);
  //   $element.scrollIntoView
  // }
  toggleExpanded(event){
    console.log('clicked');
    this.panelExpanded=!this.panelExpanded;

  }
  public handleClick(event:Event){
    event.preventDefault();
  }
}
