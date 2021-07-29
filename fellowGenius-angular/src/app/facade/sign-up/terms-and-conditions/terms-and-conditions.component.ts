import { ElementRef, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: ['./terms-and-conditions.component.css']
})
export class TermsAndConditionsComponent implements OnInit {

  constructor(private activatedRoute:ActivatedRoute) { }

  @ViewChild('termsAndConditions') termsAndConditionPos: ElementRef;
  @ViewChild('contactUs') contactUsPos: ElementRef;
  @ViewChild('privacyPolicy') privacyPolicyPos: ElementRef;

  selectedSection;
  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.selectedSection = params['section'];
    });
   
    if(this.selectedSection&&this.selectedSection!='privacyPolicy'){
      document.getElementById(this.selectedSection).scrollIntoView();
    }else{
      document.body.scrollTop=0;
      document.documentElement.scrollTop = 0;
    }
    
  }


}
