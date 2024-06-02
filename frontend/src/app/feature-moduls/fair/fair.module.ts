import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllFairsComponent } from './all-fairs/all-fairs.component';
import { CalendarFairsComponent } from './calendar-fairs/calendar-fairs.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { AllFacultiesComponent } from '../faculty/all-faculties/all-faculties.component';
import { PublishFairsComponent } from './publish-fairs/publish-fairs.component';
import { VisitFairsComponent } from './visit-fairs/visit-fairs.component';
import { FairsByUserComponent } from './fairs-by-user/fairs-by-user.component';
import { StarComponentComponent } from './star-component/star-component.component';
import { FeedbackJournalingDialogComponent } from '../feedback-journaling-dialog/feedback-journaling-dialog.component';



@NgModule({
  declarations: [
    AllFairsComponent,
    CalendarFairsComponent,
    AllFacultiesComponent,
    PublishFairsComponent,
    VisitFairsComponent,
    FairsByUserComponent,
    StarComponentComponent,
    FeedbackJournalingDialogComponent,
  ],
  imports: [
    CommonModule,
    FullCalendarModule
  ]
})
export class FairModule { }
