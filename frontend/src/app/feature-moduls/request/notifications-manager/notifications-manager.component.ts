import { Component } from '@angular/core';
import { RequestService } from '../request.service';
import { PsychologistWithTopicsDto } from 'src/app/model/PsychologistWithTopicsDto.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-notifications-manager',
  templateUrl: './notifications-manager.component.html',
  styleUrls: ['./notifications-manager.component.css']
})
export class NotificationsManagerComponent {
  psychologists: PsychologistWithTopicsDto[] = [];

  constructor(private requestService: RequestService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getAllPsychologistsWithTopics();
  }

  getAllPsychologistsWithTopics(): void {
    this.requestService.getAllPsychologistsWithTopics().subscribe({
      next: (psychologists: any[]) => {
        this.psychologists = psychologists.map(psychologist => ({
          psychologistId: psychologist.psychologistId,
          psychologistName: psychologist.psychologistName,
          psychologistLastName: psychologist.psychologistLastName,
          topics: psychologist.topics.map((topic: { topicId: any; topicName: any; duration: any; availableSpots: any; classroomName: any; startTime: any; endTime: any; reservationId: any; psychologistId: any; psychologists: any; }) => ({
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
          }))
        }));
      },
      error: (err: any) => {
        console.error("Error fetching psychologists with topics:", err);
      }
    });
  }


  acceptTopic(topic: any): void {

    // Logika za prihvatanje teme (API poziv za ažuriranje statusa)
    this.snackBar.open(`Successfully accept psychologist on topic`, 'Close', {
      duration: 3000, // Duration of the snackbar visibility
      verticalPosition: 'bottom', // Position on the screen
      horizontalPosition: 'center', // Centered horizontally
    });
  }

  declineTopic(topic: any): void {
    console.log(`Declined topic: ${topic.topicName}`);
    // Logika za odbijanje teme (API poziv za ažuriranje statusa)
  }
}
