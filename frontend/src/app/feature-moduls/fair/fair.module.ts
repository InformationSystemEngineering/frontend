import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllFairsComponent } from './all-fairs/all-fairs.component';
import { CalendarFairsComponent } from './calendar-fairs/calendar-fairs.component';
import { FullCalendarModule } from '@fullcalendar/angular';



@NgModule({
  declarations: [
    AllFairsComponent,
    CalendarFairsComponent
  ],
  imports: [
    CommonModule,
    FullCalendarModule
  ]
})
export class FairModule { }
