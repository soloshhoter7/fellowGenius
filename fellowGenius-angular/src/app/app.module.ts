import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import { NgxAgoraModule } from 'ngx-agora';
import { FormatTimePipe } from 'src/app/pipes/formatTime';
import { HomeComponent } from './home/home.component';
import { MeetingComponent } from './home/meeting/meeting.component';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { FindTutorComponent } from './home/find-tutor/find-tutor.component';
import { BookingsComponent } from './home/bookings/bookings.component';
import { BookingComponent } from './home/bookings/booking/booking.component';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { TutorProfileComponent } from './home/find-tutor/tutor-profile/tutor-profile.component';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { FacadeComponent } from './facade/facade.component';
import { LoginComponent } from './facade/login/login.component';
import { SignUpComponent } from './facade/sign-up/sign-up.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { LayoutModule } from '@angular/cdk/layout';
import { StudentDashboardComponent } from '../app/home/student-dashboard/student-dashboard.component';
import { TutorDashboardComponent } from './home/dashboard/tutor-dashboard.component';
import { ProfileComponent } from './home/profile/profile.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SignUpTutorComponent } from './facade/sign-up/sign-up-tutor/sign-up-tutor.component';
import { SignUpStudentComponent } from './facade/sign-up/sign-up-student/sign-up-student.component';
import { UpdateboxComponent } from './home/profile/updatebox/updatebox.component';
import { WelcomeComponent } from './home/welcome/welcome.component';
import { StudentProfileComponent } from './home/student-profile/student-profile.component';
import { tutorScheduleComponent } from './home/schedule/schedule.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {
	ScheduleModule,
	RecurrenceEditorModule,
	DayService,
	WeekService,
	WorkWeekService,
	MonthService,
	MonthAgendaService
} from '@syncfusion/ej2-angular-schedule';
import { StudentBookingComponent } from './home/student-booking/student-booking.component';
import { zeroDigit } from '../app/pipes/zeroDigit.pipe';
import { UpdateboxstudentComponent } from './home/student-profile/updateboxstudent/updateboxstudent.component';
import { LoadingComponent } from './facade/sign-up/LoadingSpinner/loading/loading.component';
import { DeletePopupComponent } from './home/student-dashboard/delete-popup/delete-popup.component';
import { TermsAndConditionsComponent } from './facade/sign-up/terms-and-conditions/terms-and-conditions.component';
import { UploadProfilePictureComponent } from './facade/sign-up/upload-profile-picture/upload-profile-picture.component';
import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import { GoogleLoginProvider, FacebookLoginProvider, AmazonLoginProvider } from 'angularx-social-login';
import { LoaderComponent } from './home/loader/loader.component';
import { BasicAuthHttpInterceptorService } from './service/basic-auth-http-interceptor.service';
import { CookieService } from 'ngx-cookie-service';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { TestComponent } from './test/test.component';
import { Ng2OwlCarouselComponent } from 'ng2-owl-carousel2';
import { SearchResultsComponent } from './search-results/search-results.component';
import { ThankYouComponent } from './facade/thank-you/thank-you.component';
export const appRoutes: Routes = [
	{
		path: 'home',
		component: HomeComponent,
		children: [
			{ path: 'profile', component: ProfileComponent },
			{ path: 'studentDashboard', component: StudentDashboardComponent },
			{ path: 'tutorDashboard', component: TutorDashboardComponent },
			{ path: 'studentProfile', component: StudentProfileComponent },
			{ path: 'bookings', component: BookingsComponent },
			{ path: 'studentBookings', component: StudentBookingComponent },
			{ path: 'findTutor', component: FindTutorComponent },
			{ path: 'tutorSchedule', component: tutorScheduleComponent }
		]
	},
	{ path: 'facade', component: FacadeComponent },
	{ path: 'searchResults', component: SearchResultsComponent },
	{ path: 'login', component: LoginComponent },
	{ path: 'signUp', component: SignUpComponent },
	{ path: 'signUpTutor', component: SignUpTutorComponent },
	{ path: 'signUpStudent', component: SignUpStudentComponent },
	{ path: 'meeting', component: MeetingComponent },
	{ path: 'test', component: TestComponent },
	{ path: '', redirectTo: '/facade', pathMatch: 'full' }
];

@NgModule({
	declarations: [
		FormatTimePipe,
		AppComponent,
		HomeComponent,
		MeetingComponent,
		FindTutorComponent,
		BookingsComponent,
		BookingComponent,
		TutorProfileComponent,
		FacadeComponent,
		LoginComponent,
		SignUpComponent,
		TutorDashboardComponent,
		StudentDashboardComponent,
		ProfileComponent,
		SignUpTutorComponent,
		SignUpStudentComponent,
		UpdateboxComponent,
		WelcomeComponent,
		StudentProfileComponent,
		tutorScheduleComponent,
		StudentBookingComponent,
		zeroDigit,
		UpdateboxstudentComponent,
		LoadingComponent,
		DeletePopupComponent,
		TermsAndConditionsComponent,
		UploadProfilePictureComponent,
		LoaderComponent,
		TestComponent,
		Ng2OwlCarouselComponent,
		SearchResultsComponent,
		ThankYouComponent
	],
	imports: [
		NgxMaterialTimepickerModule,
		MatInputModule,
		BrowserModule,
		AppRoutingModule,
		NgxAgoraModule.forRoot({ AppID: environment.agora.appId }),
		RouterModule.forRoot(appRoutes, { useHash: true }),
		FormsModule,
		MatDialogModule,
		HttpClientModule,
		BrowserAnimationsModule,
		CalendarModule.forRoot({
			provide: DateAdapter,
			useFactory: adapterFactory
		}),
		NgbModule,
		MatChipsModule,
		ReactiveFormsModule,
		MatAutocompleteModule,
		MatIconModule,
		AngularFireModule.initializeApp(environment.firebaseConfig),
		AngularFireStorageModule,
		MatSnackBarModule,
		ScheduleModule,
		RecurrenceEditorModule,
		MatSlideToggleModule,
		LayoutModule,
		SocialLoginModule,
		CarouselModule,
		MatInputModule
	],
	entryComponents: [ WelcomeComponent ],
	providers: [
		CookieService,
		BasicAuthHttpInterceptorService,
		{
			provide: HTTP_INTERCEPTORS,
			useClass: BasicAuthHttpInterceptorService,
			multi: true
		},
		DayService,
		WeekService,
		WorkWeekService,
		MonthService,
		MonthAgendaService,
		{
			provide: 'SocialAuthServiceConfig',
			useValue: {
				autoLogin: false,
				providers: [
					{
						id: GoogleLoginProvider.PROVIDER_ID,
						provider: new GoogleLoginProvider(
							'254899928533-k6lru4oe7sbmpe22ns0m11rvtbokk3qk.apps.googleusercontent.com'
						)
					},
					{
						id: FacebookLoginProvider.PROVIDER_ID,
						provider: new FacebookLoginProvider('561602290896109')
					}
				]
			} as SocialAuthServiceConfig
		}
	],
	bootstrap: [ AppComponent ]
})
export class AppModule {}
