import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../service/http.service';

@Component({
  selector: 'app-delete-meeting',
  templateUrl: './delete-meeting.component.html',
  styleUrls: ['./delete-meeting.component.css']
})
export class DeleteMeetingComponent implements OnInit {

  constructor(
    private activatedRoute:ActivatedRoute,
    private httpService:HttpService,
    private router:Router
    ) { }
  token:string;
  bid:any;
  isLoading=false;
  isDeleted=false;
  cancelledStatus=false;
  errorText='';
  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.token = params['token'];
      this.bid = params['bid'];
    });
  }

  close() {
    this.router.navigate(['']);
	}

	deleteBooking() {
    this.isDeleted=true;
    this.cancelledStatus=true;
    this.isLoading=true;
    this.httpService.fetchBookingStatus(this.bid).subscribe((res:any)=>{
      console.log(res.status);
      if(res.status=='Pending'){
      this.httpService.deleteBookingFromUrl(this.token,this.bid).subscribe((response:any) => {
      if(response.response=='booking deleted successfully'){
        this.isLoading=false;
        this.cancelledStatus=true;
      }else if(response.response=="booking can't be cancelled"){
        this.isLoading=false;
        this.cancelledStatus=false;
        this.errorText="Booking can't be cancelled !";
      }else if(response.response=="delete time has been exceeded"){
        this.isLoading=false
        this.cancelledStatus=true;
        this.errorText="Cancelling time has been exceeded !";
      }
      });
    }else{
        this.isLoading=false;
        this.cancelledStatus=false;
        this.errorText="Booking can't be cancelled !";
      }
    })
	}
  toLoginPage(){
    this.router.navigate(['']);
  }

}
