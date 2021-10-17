import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { bookingDetails } from 'src/app/model/bookingDetails';
import { tutorProfileDetails } from 'src/app/model/tutorProfileDetails';
import { HttpService } from 'src/app/service/http.service';

@Component({
  selector: 'app-pending-expert-profile',
  templateUrl: './pending-expert-profile.component.html',
  styleUrls: ['./pending-expert-profile.component.css']
})
export class PendingExpertProfileComponent implements OnInit {
  teacherProfile = new tutorProfileDetails();
  constructor(private activatedRoute:ActivatedRoute,private httpService:HttpService) { }
  reviewList:bookingDetails[] = [];
  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      let pendingId = params['pendingId'];
      let expertId = params['expertId']
      
      if(pendingId){
        console.log(' id : '+pendingId);
        this.httpService.findPendingExpertById(pendingId).subscribe((res)=>{
          console.log(res);
          this.teacherProfile=res;
          if(this.teacherProfile.description!=null&&this.teacherProfile.description!=''){
            console.log('here')
            this.makeTabActive("about_nav","TAb_1");
          }else{
            document.getElementById("about_li").style.display="none";
            document.getElementById("education_li").classList.add("two-items");
            document.getElementById("work_li").classList.add("two-items");
            this.makeTabActive("education_nav","TAb_2");
          }
        })
      }else if(expertId){
        console.log(' id : '+expertId);
        this.httpService.getAdminTutorProfileDetails(expertId).subscribe((res)=>{
          console.log(res);
          this.teacherProfile=res;
          if(this.teacherProfile.description!=null&&this.teacherProfile.description!=''){
            console.log('here')
            this.makeTabActive("about_nav","TAb_1");
          }else{
            document.getElementById("about_li").style.display="none";
            document.getElementById("education_li").classList.add("two-items");
            document.getElementById("work_li").classList.add("two-items");
            this.makeTabActive("education_nav","TAb_2");
          }
        })
      }
      
    });
  }
  makeTabActive(tabId,detailId){
    document.getElementById(tabId).classList.add("active");
    document.getElementById(detailId).classList.add("active") ;
  }
}
