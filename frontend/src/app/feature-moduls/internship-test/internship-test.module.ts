import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentsOverviewComponent } from './students-overview/students-overview.component';
import { FormsModule } from '@angular/forms';
import { IntershipsOverviewComponent } from './interships-overview/interships-overview.component';
import { BusyHallDialogComponent } from './busy-hall-dialog/busy-hall-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    StudentsOverviewComponent,
    IntershipsOverviewComponent,
    BusyHallDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule
  ]
})
export class InternshipTestModule { }
