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


    LoginComponent,
      HomeComponent,
      NavbarComponent,
      FooterComponent,
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
