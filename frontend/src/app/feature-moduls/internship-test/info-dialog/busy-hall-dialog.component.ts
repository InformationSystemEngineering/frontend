import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-busy-hall-dialog',
  templateUrl: './busy-hall-dialog.component.html',
  styleUrls: ['./busy-hall-dialog.component.css']
})
export class InfoDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<InfoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public errorMessage: string
  ) {}
}
