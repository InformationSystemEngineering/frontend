import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllRequestsComponent } from './all-requests/all-requests.component';
import { PickRequestComponent } from './pick-request/pick-request.component';
import { ChatComponent } from './chat/chat.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { PsychologistApplyComponent } from './psychologist-apply/psychologist-apply.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { NotificationsManagerComponent } from './notifications-manager/notifications-manager.component';
import { PublishComponent } from './publish/publish.component';



@NgModule({
  declarations: [
    AllRequestsComponent,
    PickRequestComponent,
    ChatComponent,
    ConfirmationDialogComponent,
    PsychologistApplyComponent,
    NotificationsComponent,
    NotificationsManagerComponent,
    PublishComponent
  ],
  imports: [
    CommonModule
  ]
})
export class RequestModule { }
