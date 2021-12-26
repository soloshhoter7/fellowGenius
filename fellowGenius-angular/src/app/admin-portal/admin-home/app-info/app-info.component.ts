import { Component, OnInit } from '@angular/core';
import { AppInfo } from 'src/app/model/AppInfo';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { HttpService } from 'src/app/service/http.service';

@Component({
  selector: 'app-app-info',
  templateUrl: './app-info.component.html',
  styleUrls: ['./app-info.component.css']
})
export class AppInfoComponent implements OnInit {
  appInfo:AppInfo[]=[];
  
  constructor(private httpService:HttpService,
              private snackBar:MatSnackBar) { }

  config: MatSnackBarConfig = {
    duration: 5000,
    horizontalPosition: 'center',
    verticalPosition: 'top',
    panelClass: ['snackbar'],
  };

  ngOnInit(): void {
    this.fetchAllAppInfo();
   
  }

  fetchAllAppInfo(){
    this.httpService.fetchAllAppInfo().subscribe(
      (res:AppInfo[])=>{
        console.log(res);
        this.appInfo=res;
        console.log(this.appInfo);
        
      },
      
    )
  }

  
  updateAppInfo(appInfo:AppInfo){
    console.log(appInfo);
    this.httpService.updateAppInfo(appInfo).subscribe(
      (res)=>{
        console.log(res);
        console.log("Update Successfull");
      }
    )
    this.snackBar.open(
      `${appInfo.key} updated Successfully!` ,
      'close',
      this.config
    );
  }

}
