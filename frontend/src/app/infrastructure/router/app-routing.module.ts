import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from '../auth/register/register.component';
// import { DisplayProfile } from 'src/app/feature-moduls/registeredUser/displayProfile/displayProfile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FailRegistrationComponent } from '../auth/register/fail-registration/fail-registration.component';
import { SuccessfullRegistrationComponent } from '../auth/register/successfull-registration/successfull-registration.component';
import { LoginComponent } from '../auth/login/login.component';

const routes: Routes = [
  { path: 'register', component: RegisterComponent },

  { path: 'login', component: LoginComponent },
  { path: 'failRegistration', component: FailRegistrationComponent },
  {
    path: 'successfullyRegistration',
    component: SuccessfullRegistrationComponent,
  },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes),
    FormsModule,
    CommonModule,
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
