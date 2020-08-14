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
		// 'https://backend.fellowgenius.com/fellowGenius/registerStudent',
		// 'https://backend.fellowgenius.com/fellowGenius/registerTutor',
		'https://backend.fellowgenius.com/fellowGenius/registerUser',
		'https://backend.fellowgenius.com/fellowGenius/registerSocialLogin',
		// 'https://backend.fellowgenius.com/authenticateStudent',
		// 'https://backend.fellowgenius.com/authenticateTutor',
		'https://backend.fellowgenius.com/authenticate'

		// 'http://localhost:5000/fellowGenius/meeting/sendEmail',
		// // 'http://localhost:5000/fellowGenius/registerStudent',
		// // 'http://localhost:5000/fellowGenius/registerTutor',
		// 'http://localhost:5000/fellowGenius/registerUser',
		// 'http://localhost:5000/fellowGenius/registerSocialLogin',
		// // 'http://localhost:5000/authenticateStudent',
		// // 'http://localhost:5000/authenticateTutor',
		// 'http://localhost:5000/authenticate'
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
