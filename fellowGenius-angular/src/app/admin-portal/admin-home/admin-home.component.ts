import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent implements OnInit {

  constructor(private authService:AuthService) { }
  profilePictureUrl = '../../../assets/images/default-user-image.png';
  ngOnInit(): void {
  }
  onSignOut(){
    this.authService.onSignOut();
  }
}
