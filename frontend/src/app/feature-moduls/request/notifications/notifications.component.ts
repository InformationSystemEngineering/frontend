import { Component, OnInit } from '@angular/core';
import { TopicDetails } from 'src/app/model/TopicDetails.model';
import { RequestService } from '../request.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  topics: TopicDetails[] = [];

  constructor(private requestService: RequestService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    const psychologistId = this.getPsychologistIdFromSession(); // Pretpostavimo da ID dolazi iz sesije nakon logovanja
    this.requestService.getTopicsForPsychologist(psychologistId).subscribe({
      next: (topics: any[]) => {
        this.topics = topics.map((topic) => ({
          id: topic.topicId,
          name: topic.topicName,
          duration: topic.duration,
          availableSpots: topic.availableSpots,
          classroom: { name: topic.classroomName },
          startTime: topic.startTime,
          endTime: topic.endTime,
          reservationId: topic.reservationId,
          psychologistId: topic.psychologistId,
          psychologists: topic.psychologists
        }));
      },
      error: (err) => {
        console.error("Error fetching topics for psychologist:", err);
      }
    });
}

  getPsychologistIdFromSession(): number {
    // Implementirajte logiku za dobijanje psychologistId iz trenutne sesije
    return 1; // Dummy ID za testiranje
  }

  acceptInvitation(topic: TopicDetails): void {
    // Logika za prihvatanje poziva
    console.log(`Accepted invitation for topic: ${topic.name}`);
    this.snackBar.open(`Successfully became part of the topic: ${topic.name}`, 'Close', {
      duration: 3000, // Duration of the snackbar visibility
      verticalPosition: 'bottom', // Position on the screen
      horizontalPosition: 'center', // Centered horizontally
    });
  }

  declineInvitation(topic: TopicDetails): void {
    // Logika za odbijanje poziva
    console.log(`Declined invitation for topic: ${topic.name}`);
  }
}
