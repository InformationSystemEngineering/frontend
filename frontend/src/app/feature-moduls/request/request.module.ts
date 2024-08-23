import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllRequestsComponent } from './all-requests/all-requests.component';
import { PickRequestComponent } from './pick-request/pick-request.component';
import { ChatComponent } from './chat/chat.component';



@NgModule({
  declarations: [
    AllRequestsComponent,
    PickRequestComponent,
    ChatComponent
  ],
  imports: [
    CommonModule
  ]
})
export class RequestModule { }
