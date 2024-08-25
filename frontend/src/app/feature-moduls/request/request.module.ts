import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllRequestsComponent } from './all-requests/all-requests.component';
import { PickRequestComponent } from './pick-request/pick-request.component';
import { ChatComponent } from './chat/chat.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { PsychologistApplyComponent } from './psychologist-apply/psychologist-apply.component';



@NgModule({
  declarations: [
    AllRequestsComponent,
    PickRequestComponent,
    ChatComponent,
    ConfirmationDialogComponent,
    PsychologistApplyComponent
  ],
  imports: [
    CommonModule
  ]
})
export class RequestModule { }
