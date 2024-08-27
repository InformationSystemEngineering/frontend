import { Component } from '@angular/core';
import { RequestService } from '../request.service';
import { PsychologistWithTopicsDto } from 'src/app/model/PsychologistWithTopicsDto.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TopicDetails } from 'src/app/model/TopicDetails.model';
import { ClassroomDateDto } from 'src/app/model/ClassroomDateDto.model';

@Component({
  selector: 'app-notifications-manager',
  templateUrl: './notifications-manager.component.html',
  styleUrls: ['./notifications-manager.component.css']
})
export class NotificationsManagerComponent {
  psychologists: PsychologistWithTopicsDto[] = [];
  filteredPsychologists: PsychologistWithTopicsDto[] = [];
  acceptedTopics: { startTime: string; endTime: string; date: string }[] = [];
  searchQuery: string = '';

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
          topics: psychologist.topics.map((topic: any) => ({
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
            disabled: false,
            facultyName: topic.facultyName,
            requestName: topic.requestName
          }))
        }));

        this.filteredPsychologists = [...this.psychologists]; // Initialize filtered list

        this.psychologists.forEach(psychologist => {
          psychologist.topics.forEach(topic => {
            if (topic.id) {
              this.getClassroomDate(topic); // Setting the date directly into topic
            } else {
              console.warn("Topic ID is undefined for topic:", topic);
            }
          });
        });
      },
      error: (err: any) => {
        console.error("Error fetching psychologists with topics:", err);
      }
    });
  }

  getClassroomDate(topic: TopicDetails): void {
    if (topic.id) {
      this.requestService.getClassroomDateByTopicId(topic.id).subscribe({
        next: (classroomDateDto: ClassroomDateDto) => {
          topic.date = new Date(classroomDateDto.date); // Set date directly in topic
          console.log(`Date set for topic ID ${topic.id}:`, topic.date);
          this.filterPsychologists(); // Filter after date is set
        },
        error: (err) => {
          console.error(`Error fetching classroom date for topic ID ${topic.id}:`, err);
        }
      });
    } else {
      console.error("Topic ID is undefined:", topic);
    }
  }

  acceptTopic(topic: TopicDetails): void {
    console.log(`Accepted topic: ${topic.name}`);
    this.snackBar.open(`Successfully accepted psychologist on topic ${topic.name}`, 'Close', {
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
    this.psychologists.forEach(psychologist => {
      psychologist.topics.forEach(topic => {
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
    });
  }

  declineTopic(topic: TopicDetails): void {
    console.log(`Declined topic: ${topic.name}`);
  }

  // Search function
  filterPsychologists(): void {
    this.filteredPsychologists = this.psychologists.filter(psychologist =>
      psychologist.psychologistName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      psychologist.psychologistLastName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      psychologist.topics.some(topic => 
        topic.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        topic.facultyName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        topic.requestName.toLowerCase().includes(this.searchQuery.toLowerCase())
      )
    );
  }

  // Sort function
  sortPsychologists(order: string): void {
    this.filteredPsychologists.sort((a, b) => {
      const nameA = a.psychologistName.toLowerCase();
      const nameB = b.psychologistName.toLowerCase();
      if (nameA < nameB) return order === 'asc' ? -1 : 1;
      if (nameA > nameB) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }
}
