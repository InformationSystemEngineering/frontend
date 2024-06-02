import { Component } from '@angular/core';
import { FeedbackFair } from 'src/app/model/FeedbackFair.model';
import { FairService } from '../fair.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthServiceService } from 'src/app/infrastructure/auth/register/auth-service.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FeedbackJournaling } from 'src/app/model/FeedbackJournaling.model';
import { MatDialog } from '@angular/material/dialog';
import { FeedbackJournalingDialogComponent } from '../../feedback-journaling-dialog/feedback-journaling-dialog.component';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent {
  loggedInUser: number = 0;
  feedbacks: FeedbackFair[] = [];
  extraActivityId: number = 0;
  feedback: FeedbackFair = {
    contentGrade: 0,
    name: '',
    fairPsychologyFairName: '',
    psychologistGrade: 0,
    finalGrade: 0,
    organizationGrade: 0,
    comment: '',
    userId: 0,
    extraActivityId: 0
  };
  userId: number = 0;
  journaling: FeedbackJournaling | undefined; 

  constructor(
    private fairService: FairService, 
    private router: Router, 
    private activedRoute: ActivatedRoute,
    private authService: AuthServiceService,
    private jwtHelper: JwtHelperService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.extraActivityId = +this.activedRoute.snapshot.params['extraActivityId'];
    console.log('Extra activity ID:', this.extraActivityId);
    console.log('I am here');

    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      this.userId = decodedToken.id;
    }

    this.loadFeedbacks();
  }

  loadFeedbacks() {
    this.fairService.getFeedbacksByExtraActivity(this.extraActivityId).subscribe({
      next: (feedbacks) => {
        this.feedbacks = feedbacks;
        console.log('feedbacks su' + this.feedbacks);
      },
      error: (error) => console.error('Error fetching feedbacks:', error)
    });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,  // 5000 milliseconds = 5 seconds
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  submitFeedback() {
    console.log('Submitting feedback:', this.feedback);
    this.feedback.userId = this.userId;
    this.feedback.extraActivityId = this.extraActivityId;
    this.fairService.createFeedback(this.feedback).subscribe({
      next: (response) => {
        this.fairService.getJournalById(1).subscribe({
          next: (feedbackJournaling: FeedbackJournaling ) => {
            this.journaling = feedbackJournaling;
            this.openDialog(feedbackJournaling);
          }
        });
        console.log('Feedback submitted successfully', response);
        this.openSnackBar("Feedback submitted successfully!", "OK");
        //window.location.reload();
      },
      error: (error) => {
        console.error('Failed to submit feedback', error);
      }
    });
  }

  openDialog(feedbackJournaling: FeedbackJournaling): void {
    this.dialog.open(FeedbackJournalingDialogComponent, {
      width: '400px',
      data: feedbackJournaling
    });
  }
}
