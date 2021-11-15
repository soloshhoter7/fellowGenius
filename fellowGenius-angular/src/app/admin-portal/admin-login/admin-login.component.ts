import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { loginModel } from 'src/app/model/login';
import { HttpService } from 'src/app/service/http.service';
import { LoginDetailsService } from 'src/app/service/login-details.service';
import * as JwtDecode from 'jwt-decode';
@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {
  showPassword:boolean=false;
  constructor(private loginService:LoginDetailsService,private httpService:HttpService,private router:Router,private cookieService:CookieService) { }
  errorText;
  isLoading=false;
  hideContainer;
  incorrectLoginDetails;
  loginModel= new loginModel();
  ngOnInit(): void {
  }
  togglePassword(){
    this.showPassword=!this.showPassword;
  }
  onAdminLogin(form:any){
    this.isLoading=true;
    console.log(form.value);
    this.loginModel.email=form.value.userName;
    this.loginModel.password = form.value.password;
    this.httpService.validateAdmin(this.loginModel).subscribe((res:any)=>{
      console.log(res.response);
      if(res.response=='false'){
        this.incorrectLoginDetails=true;
        this.errorText="Invalid username or password !";
        this.isLoading=false;
      }else{
        this.cookieService.set('token', res['response']);
        this.cookieService.set('userId', JwtDecode(res['response'])['sub']);
        this.incorrectLoginDetails=false;
        this.errorText='';
        this.loginService.setLoginType('Admin');
        this.router.navigate(['admin/home']);
        this.isLoading=false;
      }
    })
  }
}
