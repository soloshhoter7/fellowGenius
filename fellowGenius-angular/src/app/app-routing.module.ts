import { NgModule } from '@angular/core';
import { Routes, RouterModule, ExtraOptions } from '@angular/router';
import { AdminPortalComponent } from './admin-portal/admin-portal.component';
import { AnalyticsComponent } from './admin-portal/admin-home/analytics/analytics.component';
import { CategoriesComponent } from './admin-portal/admin-home/categories/categories.component';
import { DeleteMeetingComponent } from './delete-meeting/delete-meeting.component';
import { ExpertProfileComponent } from './expert-profile/expert-profile.component';
import { AboutUsComponent } from './facade/about-us/about-us.component';
import { FacadeComponent } from './facade/facade.component';
import { FaqComponent } from './facade/faq/faq.component';
import { HowItWorksComponent } from './facade/how-it-works/how-it-works.component';
import { LoginComponent } from './facade/login/login.component';
import { ContactUsInfoComponent } from './facade/contact-us-info/contact-us-info.component';
import { SignUpComponent } from './facade/sign-up/sign-up.component';

import { BookingsComponent } from './home/bookings/bookings.component';
import { TutorDashboardComponent } from './home/dashboard/tutor-dashboard.component';
import { HomeComponent } from './home/home.component';
import { KnowledgeBaseComponent } from './home/knowledge-base/knowledge-base.component';
import { MeetingComponent } from './home/meeting/meeting.component';
import { ProfileComponent } from './home/profile/profile.component';
import { RecordingsComponent } from './home/recordings/recordings.component';
import { tutorScheduleComponent } from './home/schedule/schedule.component';
import { SessionNotesComponent } from './home/session-notes/session-notes.component';
import { StudentBookingComponent } from './home/student-booking/student-booking.component';
import { StudentDashboardComponent } from './home/student-dashboard/student-dashboard.component';
import { StudentProfileComponent } from './home/student-profile/student-profile.component';
import { RescheduleMeetingComponent } from './reschedule-meeting/reschedule-meeting.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { TestComponent } from './test/test.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { BlogsComponent } from './facade/blogs/blogs.component';
import { ResourceVideosComponent } from './facade/resource-videos/resource-videos.component';
import { ResourceEventsComponent } from './facade/resource-events/resource-events.component';
import { PrivacyPolicyComponent } from './facade/privacy-policy/privacy-policy.component';
import { TermsAndConditionsComponent } from './facade/terms-and-conditions/terms-and-conditions.component';
import { RefundPolicyComponent } from './facade/refund-policy/refund-policy.component';
import { SignUpExpertComponent } from './facade/sign-up/sign-up-expert/sign-up-expert.component';
import { VerifyExpertsComponent } from './admin-portal/admin-home/verify-experts/verify-experts.component';
import { LearnerSessionsComponent } from './home/learner-sessions/learner-sessions.component';
import { ExpertSessionsComponent } from './home/expert-sessions/expert-sessions.component';
import { AdminLoginComponent } from './admin-portal/admin-login/admin-login.component';
import { AdminHomeComponent } from './admin-portal/admin-home/admin-home.component';
import { ExpertsComponent } from './admin-portal/admin-home/experts/experts.component';
import { PendingExpertProfileComponent } from './admin-portal/admin-home/pending-expert-profile/pending-expert-profile.component';
import { ReferAndEarnComponent } from './home/refer-and-earn/refer-and-earn.component';
import { VoiceCallComponent } from './voice-call/voice-call.component';
// const routes:Routes=[];
export const routerOptions: ExtraOptions = {
  anchorScrolling: 'enabled',
  useHash: true,
};
export const appRoutes: Routes = [
  //post login
  {
    path: 'home',
    component: HomeComponent,
    children: [
      { path: 'profile', component: ProfileComponent },
      { path: 'student-dashboard', component: StudentDashboardComponent },
      { path: 'tutor-dashboard', component: TutorDashboardComponent },
      { path: 'student-profile', component: StudentProfileComponent },
      { path: 'bookings', component: BookingsComponent },
      { path: 'student-bookings', component: StudentBookingComponent },
      { path: 'tutor-schedule', component: tutorScheduleComponent },
      { path: 'session-notes', component: SessionNotesComponent },
      { path: 'recordings', component: RecordingsComponent },
      { path: 'knowledge-base', component: KnowledgeBaseComponent },
      { path: 'sessions-learner', component: LearnerSessionsComponent },
      { path: 'sessions-expert', component: ExpertSessionsComponent },
      { path: 'refer', component: ReferAndEarnComponent },
    ],
  },
  //pre login routes
  { path: '', component: FacadeComponent },
  { path: 'how-it-works', component: HowItWorksComponent },
  { path: 'search-results', component: SearchResultsComponent },
  { path: 'view-tutors', component: ExpertProfileComponent },
  { path: 'login', component: LoginComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'sign-up-expert', component: SignUpExpertComponent },
  { path: 'meeting/:id', component: MeetingComponent },
  { path: 'test', component: TestComponent },
  { path: 'voice-call', component: VoiceCallComponent },
  { path: 'feedback', component: FeedbackComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'cancel-booking', component: DeleteMeetingComponent },
  { path: 'reschedule-booking', component: RescheduleMeetingComponent },

  //admin routes
  {
    path: 'admin',
    component: AdminPortalComponent,
    children: [
      {
        path: 'home',
        component: AdminHomeComponent,
        children: [
          { path: '', redirectTo: 'experts', pathMatch: 'full' },
          { path: 'categories', component: CategoriesComponent },
          { path: 'analytics', component: AnalyticsComponent },
          { path: 'verify-expert', component: VerifyExpertsComponent },
          { path: 'experts', component: ExpertsComponent },
          { path: 'expert-profile', component: PendingExpertProfileComponent },
        ],
      },
    ],
  },
  { path: 'admin-login', component: AdminLoginComponent },

  { path: 'faq', component: FaqComponent },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'contact-us', component: ContactUsInfoComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'terms-and-conditions', component: TermsAndConditionsComponent },
  { path: 'refund-policy', component: RefundPolicyComponent },
  { path: 'blogs', component: BlogsComponent },
  { path: 'resource-videos', component: ResourceVideosComponent },
  { path: 'resource-events', component: ResourceEventsComponent },
  // { path: '', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, routerOptions)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
