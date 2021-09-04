import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-portal',
  templateUrl: './admin-portal.component.html',
  styleUrls: ['./admin-portal.component.css']
})
export class AdminPortalComponent implements OnInit {

  constructor(private router:Router) { }
  profilePictureUrl = '../../../assets/images/default-user-image.png';
  ngOnInit(): void {
    // this.router.navigate(['admin/verify-expert']);
  }
  onSignOut(){

  }

}
