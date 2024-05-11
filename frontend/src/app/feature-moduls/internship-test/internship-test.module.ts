import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentsOverviewComponent } from './students-overview/students-overview.component';
import { FormsModule } from '@angular/forms';
import { IntershipsOverviewComponent } from './interships-overview/interships-overview.component';
import { MatDialogModule } from '@angular/material/dialog';
import { TestHistoryComponent } from './test-history/test-history.component';
import { TestResultsComponent } from './test-results/test-results.component';
import { InfoDialogComponent } from './info-dialog/busy-hall-dialog.component';
import { BestStudentsDialogComponent } from './best-students-dialog/best-students-dialog.component';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [
    StudentsOverviewComponent,
    IntershipsOverviewComponent,
    InfoDialogComponent,
    TestHistoryComponent,
    TestResultsComponent,
    BestStudentsDialogComponent
  ],
  imports: [
    MatCardModule,
    CommonModule,
    FormsModule,
    MatDialogModule
  ]
})
export class InternshipTestModule { }
