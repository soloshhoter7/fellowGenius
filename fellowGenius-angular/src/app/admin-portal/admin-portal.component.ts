import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginDetailsService } from '../service/login-details.service';

@Component({
  selector: 'app-admin-portal',
  templateUrl: './admin-portal.component.html',
  styleUrls: ['./admin-portal.component.css']
})
export class AdminPortalComponent implements OnInit {

  constructor(private router:Router,private loginService:LoginDetailsService,private route: ActivatedRoute) { }
  ngOnInit(): void {
    if(this.loginService.getLoginType()!='Admin'){
      console.log('user is not authenticated !')
      this.router.navigate(['admin-login']);
    }else{
      this.router.navigate(['/admin/home'])
      console.log('user is authenticated')
      
    }
  }

}
