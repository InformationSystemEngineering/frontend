import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule, DatePipe } from '@angular/common';
import { MaterialModule } from './angular-material/angular-material.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './infrastructure/router/app-routing.module';
import { RegisterComponent } from './infrastructure/auth/register/register.component';
import { JwtModule } from '@auth0/angular-jwt';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { MatInput, MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButton, MatButtonModule } from '@angular/material/button';

import { FailRegistrationComponent } from './infrastructure/auth/register/fail-registration/fail-registration.component';
import { SuccessfullRegistrationComponent } from './infrastructure/auth/register/successfull-registration/successfull-registration.component';
import { LoginComponent } from './infrastructure/auth/login/login.component';
import { TokenInterceptor } from './interceptor/TokenInterceptor';
import { HomeComponent } from './feature-moduls/layout/home/home.component';
import { NavbarComponent } from './feature-moduls/layout/navbar/navbar.component';
import { FooterComponent } from './feature-moduls/layout/footer/footer.component';
import { RegisterPsychologistComponent } from './feature-moduls/sysem-admin/register-psychologist/register-psychologist.component';
import { UserProfileComponent } from './feature-moduls/user-profile/user-profile/user-profile.component';
import { AllFacultiesComponent } from './feature-moduls/faculty/all-faculties/all-faculties.component';
import { AllFairsComponent } from './feature-moduls/fair/all-fairs/all-fairs.component';
import { CalendarFairsComponent } from './feature-moduls/fair/calendar-fairs/calendar-fairs.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { PublishFairsComponent } from './feature-moduls/fair/publish-fairs/publish-fairs.component';
import { VisitFairsComponent } from './feature-moduls/fair/visit-fairs/visit-fairs.component';
import { InternshipTestModule } from './feature-moduls/internship-test/internship-test.module';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { CurrentInternshipModule } from './feature-moduls/current-internship/current-internship.module';
import { ApplyStudentForTestComponent } from './feature-moduls/internship-test/apply-student-for-test/apply-student-for-test.component';
import { FeedbackComponent } from './feature-moduls/fair/feedback/feedback.component';
import { FairsByUserComponent } from './feature-moduls/fair/fairs-by-user/fairs-by-user.component';
import { StarComponentComponent } from './feature-moduls/fair/star-component/star-component.component';
import { FeedbackJournalingDialogComponent } from './feature-moduls/feedback-journaling-dialog/feedback-journaling-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SendRequestComponent } from './feature-moduls/faculty/send-request/send-request.component';
import { AllRequestsComponent } from './feature-moduls/request/all-requests/all-requests.component';
import { PickRequestComponent } from './feature-moduls/request/pick-request/pick-request.component';
import { ChatComponent } from './feature-moduls/request/chat/chat.component';
import { ConfirmationDialogComponent } from './feature-moduls/request/confirmation-dialog/confirmation-dialog.component';
import { PsychologistApplyComponent } from './feature-moduls/request/psychologist-apply/psychologist-apply.component';
import { NotificationsComponent } from './feature-moduls/request/notifications/notifications.component';
import { NotificationsManagerComponent } from './feature-moduls/request/notifications-manager/notifications-manager.component';
import { PublishComponent } from './feature-moduls/request/publish/publish.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    FailRegistrationComponent,
    SuccessfullRegistrationComponent,
    RegisterPsychologistComponent,
    UserProfileComponent,
    AllFacultiesComponent,
    AllFairsComponent,
    CalendarFairsComponent,
    PublishFairsComponent,
    VisitFairsComponent,
    ApplyStudentForTestComponent,
    FairsByUserComponent,
    StarComponentComponent,
    SendRequestComponent,
    AllRequestsComponent,
    PickRequestComponent,
    ChatComponent,
    ConfirmationDialogComponent,
    PsychologistApplyComponent,
    NotificationsComponent,
    NotificationsManagerComponent,
    PublishComponent,

    LoginComponent,
      HomeComponent,
      NavbarComponent,
      FooterComponent,
      FeedbackComponent,
      FeedbackJournalingDialogComponent,
  ],

  imports: [
    BrowserModule,
    InternshipTestModule,
    AppRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    SimpleNotificationsModule.forRoot(),
    BrowserAnimationsModule,
    HttpClientModule,
    CommonModule,
    FullCalendarModule,
    CurrentInternshipModule,
    MatDialogModule,
    MatListModule,
    MatButtonModule,
    DragDropModule,
    BrowserModule,

    JwtModule.forRoot({
      config: {
        tokenGetter: () => localStorage.getItem('token'),
      },
    }),

    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
  ],

  bootstrap: [AppComponent],
})
export class AppModule {}
