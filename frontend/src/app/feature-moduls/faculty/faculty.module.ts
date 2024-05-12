import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllFacultiesComponent } from './all-faculties/all-faculties.component';
import { FairModule } from '../fair/fair.module';



@NgModule({
  declarations: [
    AllFacultiesComponent,
    FairModule 
  ],
  imports: [
    CommonModule
  ]
})
export class FacultyModule { }
