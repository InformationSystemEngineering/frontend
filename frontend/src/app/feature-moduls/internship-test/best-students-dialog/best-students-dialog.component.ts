import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Student } from 'src/app/model/student.model';
import { StudentTest } from 'src/app/model/studentTest.model';

@Component({
  selector: 'app-best-students-dialog',
  templateUrl: './best-students-dialog.component.html',
  styleUrls: ['./best-students-dialog.component.css']
})
export class BestStudentsDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<BestStudentsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public students: StudentTest[]
  ) {}
}
