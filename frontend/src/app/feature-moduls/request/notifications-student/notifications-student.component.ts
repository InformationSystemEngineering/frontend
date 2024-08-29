import { Component } from '@angular/core';
import { TopicDetails } from 'src/app/model/TopicDetails.model';
import { RequestService } from '../request.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClassroomDateDto } from 'src/app/model/ClassroomDateDto.model';

@Component({
  selector: 'app-notifications-student',
  templateUrl: './notifications-student.component.html',
  styleUrls: ['./notifications-student.component.css']
})
export class NotificationsStudentComponent {
  topics: TopicDetails[] = [];
  acceptedTopics: { startTime: string; endTime: string; date: string }[] = [];

  constructor(private requestService: RequestService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    const psychologistId = this.getPsychologistIdFromSession(); // Assume ID comes from session after logging in
    this.requestService.getTopicsByStudentId(4).subscribe({
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
          psychologists: topic.psychologists,
          date: undefined,  // Initially undefined
          disabled: false ,
          facultyName: topic.facultyName,
          requestName: topic.requestName ,
          psychologistName: topic.psychologistName, // Include psychologist's name
        }));

        this.topics.forEach(topic => {
          if (topic.id) {
            this.getClassroomDate(topic); // Setting date directly in topic
          } else {
            console.warn("Topic ID is undefined for topic:", topic);
          }
        });
      },
      error: (err) => {
        console.error("Error fetching topics for psychologist:", err);
      }
    });
  }

  getClassroomDate(topic: TopicDetails): void {
    if (topic.id) {
      this.requestService.getClassroomDateByTopicId(topic.id).subscribe({
        next: (classroomDateDto: ClassroomDateDto) => {
          topic.date = new Date(classroomDateDto.date); // Set date directly in topic
          console.log(`Date set for topic ID ${topic.id}:`, topic.date);
        },
        error: (err) => {
          console.error(`Error fetching classroom date for topic ID ${topic.id}:`, err);
        }
      });
    } else {
      console.error("Topic ID is undefined:", topic);
    }
  }

  getPsychologistIdFromSession(): number {
    // Implement logic to get psychologistId from current session
    return 1; // Dummy ID for testing
  }

  acceptInvitation(topic: TopicDetails): void {
    console.log(`Accepted invitation for topic: ${topic.name}`);
    this.snackBar.open(`Successfully became part of the topic: ${topic.name}`, 'Close', {
      duration: 3000,
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
    });

    if (topic.date) {
      this.acceptedTopics.push({
        startTime: topic.startTime,
        endTime: topic.endTime,
        date: topic.date.toISOString().split('T')[0]  // Format date to string
      });
      this.disableConflictingTopics(topic);
    } else {
      console.warn(`Topic date is undefined for topic: ${topic.name}`);
    }
  }

  disableConflictingTopics(acceptedTopic: TopicDetails): void {
    this.topics.forEach(topic => {
      if (topic.date && acceptedTopic.date) {
        const acceptedStartTime = new Date(`${acceptedTopic.date.toISOString().split('T')[0]}T${acceptedTopic.startTime}`);
        const acceptedEndTime = new Date(`${acceptedTopic.date.toISOString().split('T')[0]}T${acceptedTopic.endTime}`);
        const topicStartTime = new Date(`${topic.date.toISOString().split('T')[0]}T${topic.startTime}`);
        const topicEndTime = new Date(`${topic.date.toISOString().split('T')[0]}T${topic.endTime}`);
        
        if ((topicStartTime < acceptedEndTime && topicStartTime >= acceptedStartTime) ||
            (topicEndTime > acceptedStartTime && topicEndTime <= acceptedEndTime)) {
          topic.disabled = true; // Disable conflicting topic
        }
      }
    });
  }

  declineInvitation(topic: TopicDetails): void {
    console.log(`Declined invitation for topic: ${topic.name}`);
  }

  isTimeConflict(topic: TopicDetails): boolean {
    return topic.disabled; // Use the disabled property to determine conflict
  }
}
