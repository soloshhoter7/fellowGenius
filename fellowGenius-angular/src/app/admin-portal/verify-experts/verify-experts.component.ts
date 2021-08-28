import { Component, OnInit } from '@angular/core';
import { tutorProfileDetails } from 'src/app/model/tutorProfileDetails';
import { HttpService } from 'src/app/service/http.service';

@Component({
  selector: 'app-verify-experts',
  templateUrl: './verify-experts.component.html',
  styleUrls: ['./verify-experts.component.css']
})
export class VerifyExpertsComponent implements OnInit {

  constructor(private httpService:HttpService) { }
  pendingExperts:tutorProfileDetails[]=[];
  ngOnInit(): void {
    this.fetchPendingExperts();
  }
  fetchPendingExperts(){
    this.httpService.fetchPendingExperts().subscribe((res)=>{
      console.log(res);
      this.pendingExperts=res;
      console.log(this.pendingExperts);
    });
  }
  verifyExpert(el,index){
    console.log(el.id);
    console.log(index);
    this.httpService.verifyExpert(el.id).subscribe((res)=>{
      console.log('expert verified');
      this.pendingExperts.splice(index,1);
    })
  }
}
