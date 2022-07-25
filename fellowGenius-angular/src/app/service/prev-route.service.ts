import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class PrevRouteService {

  constructor(private cookieService: CookieService,
    private snackBar: MatSnackBar,
    private router: Router
    ) { }

    config: MatSnackBarConfig = {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    };

  goToPreviousUrl(prev_route : string,expert_userId: string,expert_domain: string,event_id: string) {
    if (prev_route != '') {
      this.snackBar.open(
        'You have successfully signed up',
        'close',
        this.config
      );
      console.log(prev_route);
      if (prev_route == 'view-tutors') {
        this.cookieService.delete('prev');
        this.cookieService.delete('expert_userId');
        this.cookieService.delete('expert_domain');
        this.router.navigate(['view-tutors'], {
          queryParams: {
            page: expert_userId,
            subject: expert_domain,
          },
        });
      } else if(prev_route == 'view-event'){
        this.cookieService.delete('prev');
        this.cookieService.delete('event_id');
        this.router.navigate(['view-event'],
        {
          queryParams: { eventId: event_id},
        })
      } 
       else if (prev_route == 'home') {
        this.cookieService.delete('prev');
        this.router.navigate(['home']);
      } else {
        this.cookieService.delete('prev');
        this.router.navigate([prev_route]);
      }
    }
  }

}
