import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllRequestsComponent } from './all-requests/all-requests.component';
import { PickRequestComponent } from './pick-request/pick-request.component';



@NgModule({
  declarations: [
    AllRequestsComponent,
    PickRequestComponent
  ],
  imports: [
    CommonModule
  ]
})
export class RequestModule { }
