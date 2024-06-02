import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FeedbackJournaling } from 'src/app/model/FeedbackJournaling.model';

@Component({
  selector: 'app-feedback-journaling-dialog',
  templateUrl: './feedback-journaling-dialog.component.html',
  styleUrls: ['./feedback-journaling-dialog.component.css']
})
export class FeedbackJournalingDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: FeedbackJournaling) {}
}
