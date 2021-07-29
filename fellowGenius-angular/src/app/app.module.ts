import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { appRoutes, AppRoutingModule } from './app-routing.module';
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

import { BookingsComponent } from './home/bookings/bookings.component';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from '@angular/platform-browser/animations';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { FacadeComponent } from './facade/facade.component';
import { LoginComponent } from './facade/login/login.component';
import { SignUpComponent } from './facade/sign-up/sign-up.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LayoutModule } from '@angular/cdk/layout';
import { StudentDashboardComponent } from '../app/home/student-dashboard/student-dashboard.component';
import { TutorDashboardComponent } from './home/dashboard/tutor-dashboard.component';
import { ProfileComponent } from './home/profile/profile.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { MatSnackBarModule } from '@angular/material/snack-bar';
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
  MonthAgendaService,
} from '@syncfusion/ej2-angular-schedule';
import { StudentBookingComponent } from './home/student-booking/student-booking.component';
import { zeroDigit } from '../app/pipes/zeroDigit.pipe';
import { LoadingComponent } from './facade/sign-up/LoadingSpinner/loading/loading.component';
import { DeletePopupComponent } from './home/student-dashboard/delete-popup/delete-popup.component';
import { TermsAndConditionsComponent } from './facade/sign-up/terms-and-conditions/terms-and-conditions.component';
import { UploadProfilePictureComponent } from './facade/sign-up/upload-profile-picture/upload-profile-picture.component';
import { LoaderComponent } from './home/loader/loader.component';
import { BasicAuthHttpInterceptorService } from './service/basic-auth-http-interceptor.service';
import { CookieService } from 'ngx-cookie-service';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { TestComponent } from './test/test.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { KnowledgeBaseComponent } from './home/knowledge-base/knowledge-base.component';
import { SessionNotesComponent } from './home/session-notes/session-notes.component';
import { RecordingsComponent } from './home/recordings/recordings.component';
import { dobValidator } from './custom-directives/dobValidator.directive';
import { ImagePreloadDirective } from './custom-directives/ImagePreload.directive';
import { MatRadioModule } from '@angular/material/radio';
import { GoogleChartsModule } from 'angular-google-charts';
import { ExpertProfileComponent } from './expert-profile/expert-profile.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { ConnectComponent } from './expert-profile/connect/connect.component';
import { ShortenLength } from './pipes/shortenLength.pipe';
import { LoginDialogComponent } from './expert-profile/login-dialog/login-dialog.component';
import { ExpertsComponent } from './home/experts/experts.component';
import { AdvertisementBannerComponent } from './advertisement-banner/advertisement-banner.component';
import { FiltersDialogComponent } from './search-results/filters-dialog/filters-dialog.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { MatSelectModule} from '@angular/material/select';
import { TimeMedian } from './pipes/timeMedian';
import { TimeConverter} from './pipes/timeConverter';
import { AboutUsComponent } from './facade/about-us/about-us.component';
import { FaqComponent } from './facade/faq/faq.component';
import { HowItWorksComponent } from './facade/how-it-works/how-it-works.component';
import { CategoriesComponent } from './admin-portal/categories/categories.component';
import { ContactUsInfoComponent } from './facade/sign-up/contact-us-info/contact-us-info.component';
import { AnalyticsComponent } from './admin-portal/analytics/analytics.component';
import { AdminPortalComponent } from './admin-portal/admin-portal.component';
import { DeleteMeetingComponent } from './delete-meeting/delete-meeting.component';
import { RescheduleMeetingComponent } from './reschedule-meeting/reschedule-meeting.component';


@NgModule({
  declarations: [
    ShortenLength,
    FormatTimePipe,
    AppComponent,
    HomeComponent,
    MeetingComponent,
    TimeMedian,
    TimeConverter,
    BookingsComponent,
    FacadeComponent,
    LoginComponent,
    SignUpComponent,
    TutorDashboardComponent,
    StudentDashboardComponent,
    ProfileComponent,

    WelcomeComponent,
    StudentProfileComponent,
    tutorScheduleComponent,
    StudentBookingComponent,
    zeroDigit,

    LoadingComponent,
    DeletePopupComponent,
    TermsAndConditionsComponent,
    UploadProfilePictureComponent,
    LoaderComponent,
    TestComponent,
    SearchResultsComponent,
    KnowledgeBaseComponent,
    SessionNotesComponent,
    RecordingsComponent,
    dobValidator,
    ImagePreloadDirective,
    ExpertProfileComponent,
    NavBarComponent,
    ConnectComponent,
    LoginDialogComponent,
    ExpertsComponent,
    AdvertisementBannerComponent,
    FiltersDialogComponent,
    ResetPasswordComponent,
    AboutUsComponent,
    FaqComponent,
    HowItWorksComponent,
    CategoriesComponent,
    ContactUsInfoComponent,
    AnalyticsComponent,
    AdminPortalComponent,
    DeleteMeetingComponent,
    RescheduleMeetingComponent,
  ],
  imports: [
    NoopAnimationsModule,
    MatInputModule,
    MatRadioModule,
    BrowserModule,
    AppRoutingModule,
    NgxAgoraModule.forRoot({ AppID: environment.agora.appId }),
    
    FormsModule,
    MatDialogModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatChipsModule,
    MatSelectModule,
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
    CarouselModule,
    MatInputModule,
    GoogleChartsModule,
    RouterModule.forRoot(appRoutes,{useHash:true}),
  ],
  entryComponents: [WelcomeComponent],
  providers: [
    CookieService,
    BasicAuthHttpInterceptorService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BasicAuthHttpInterceptorService,
      multi: true,
    },
    DayService,
    WeekService,
    WorkWeekService,
    MonthService,
    MonthAgendaService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
