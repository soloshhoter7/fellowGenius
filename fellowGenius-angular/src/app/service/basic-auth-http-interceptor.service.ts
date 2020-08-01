import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { stringify } from 'querystring';

@Injectable({
	providedIn: 'root'
})
export class BasicAuthHttpInterceptorService implements HttpInterceptor {
	constructor(private cookieService: CookieService) {}
	invalidUrls: string[] = [
		'https://backend.fellowgenius.com/fellowGenius/meeting/sendEmail',
		'https://backend.fellowgenius.com/fellowGenius/registerStudent',
		'https://backend.fellowgenius.com/fellowGenius/registerTutor',
		'https://backend.fellowgenius.com/fellowGenius/registerSocialLogin',
		'https://backend.fellowgenius.com/authenticateStudent',
		'https://backend.fellowgenius.com/authenticateTutor'
	];
	intercept(req: HttpRequest<any>, next: HttpHandler) {
		var token = this.cookieService.get('token');
		// console.log('interceptor  called !');
		// console.log(req.url);
		// if (sessionStorage.getItem('username') && sessionStorage.getItem('token')) {
		if (this.isUrlValid(req.url)) {
			if (token != '') {
				req = req.clone({
					setHeaders: {
						Authorization: 'Bearer ' + token
					}
				});
			}
			return next.handle(req);
		} else {
			return next.handle(req);
		}
	}

	isUrlValid(url: string) {
		if (this.invalidUrls.includes(url)) {
			return false;
		} else {
			return true;
		}
	}
}
