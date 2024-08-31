import { Component, OnInit } from '@angular/core';
import { RequestDetailDto } from 'src/app/model/RequestDetailDto.model';
import { RequestService } from '../request.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PsychologistDto } from 'src/app/model/PsychologistDto.model';
import { FacultyService } from '../../faculty/faculty.service';
import { TopicDetails } from 'src/app/model/TopicDetails.model';
import { ClassroomDateDto } from 'src/app/model/ClassroomDateDto.model';
import { ApplicationDto } from 'src/app/model/ApplicationDto.model';

@Component({
  selector: 'app-student-apply',
  templateUrl: './student-apply.component.html',
  styleUrls: ['./student-apply.component.css']
})
export class StudentApplyComponent implements OnInit{
  requests: RequestDetailDto[] = [];
  filteredRequests: RequestDetailDto[] = [];
  searchTerm: string = '';
  psychologistNames: Map<number, string> = new Map();
  topics1: TopicDetails[] = [];
  showJoinForm: boolean = false;
  selectedTopicId: number | null = null;
  applicationData: ApplicationDto = {
    studentId: 4,   // Default value, will be set appropriately
    topicId: 0,     // Default value, set when a topic is selected
    name: '',       // Initialize as empty string
    surname: '',    // Initialize as empty string
    studyYear: '',  // Initialize as empty string
    email: ''       // Initialize as empty string
  };
  selectedTopicName: string = '';
  joinedTopics: Set<number> = new Set<number>();



  constructor(
    private requestService: RequestService,
    private router: Router,
    private facultyService: FacultyService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadFairs();  // Load all fairs on component initialization
  }

  loadFairs(): void {
    this.requestService.getAllPublishedRequestDetails().subscribe({
      next: (result: RequestDetailDto[]) => {
        this.requests = result.map(requestDetail => ({
          ...requestDetail,
          showDetails: false
        }));
        this.filteredRequests = [...this.requests]; // Initialize filtered requests
      },
      error: (err) => {
        console.error("Error fetching request details:", err);
      }
    });
  }

  filterRequests(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredRequests = this.requests.filter(request => 
      request.request.name.toLowerCase().includes(term)
    );
  }

  toggleDetails(requestDetail: RequestDetailDto): void {
    if (requestDetail.showDetails) {
      requestDetail.showDetails = false;
    } else {
      const requestId = requestDetail.request.id;
      this.requestService.getTopicsForPsychologist(requestId || 0).subscribe({
        next: (topics: any[]) => {
          requestDetail.topics = topics.map((topic) => ({
            id: topic.topicId,
            name: topic.topicName,
            duration: topic.duration,
            availableSpots: topic.availableSpots,
            classroom: { name: topic.classroomName },
            startTime: topic.startTime,
            endTime: topic.endTime,
            reservationId: 1,
            psychologistId: topic.psychologistId,
            psychologists: topic.psychologists,
            disabled: false,
            facultyName: topic.facultyName,
            requestName: topic.requestName,
            pdfUrl: ''
          }));

          requestDetail.showDetails = true;
          this.topics1 = requestDetail.topics;
          const topic2 = this.topics1.find(t => t.id === this.selectedTopicId);
          if (topic2) {
            topic2.disabled = true; // Oznaka da je student prijavljen na topic
          }
        
          console.log("Topics:", this.topics1);

          this.topics1.forEach(topic => {
            if (topic.id) {
              this.getClassroomDate(topic);
              this.loadPsychologistForTopic(topic.id);
            } else {
              console.warn("Topic ID is undefined for topic:", topic);
            }
          });

          const topic = this.topics1.find(t => t.id === this.selectedTopicId);
        if (topic) {
          topic.disabled = true; // Oznaka da je student prijavljen na topic
        }
        },
        error: (err) => {
          console.error("Error fetching topics with details:", err);
        }
      });
    }

    const topic = this.topics1.find(t => t.id === this.selectedTopicId);
    if (topic) {
      topic.disabled = true; // Oznaka da je student prijavljen na topic
    }
  }

  getClassroomDate(topic: TopicDetails): void {
    if (topic.id) {
      this.requestService.getClassroomDateByTopicId(topic.id).subscribe({
        next: (classroomDateDto: ClassroomDateDto) => {
          topic.date = new Date(classroomDateDto.date);
          console.log(`Date set for topic ID ${topic.id}:`, topic.date);
        },
        error: (err) => {
          console.error(`Error fetching classroom date for topic ID ${topic.id}:`, err);
        }
      });
    } else {
      console.error("Topic ID is undefined:", topic);
    }

    const topic2 = this.topics1.find(t => t.id === this.selectedTopicId);
    if (topic2) {
      topic2.disabled = true; // Oznaka da je student prijavljen na topic
    }
  }

  loadPsychologistForTopic(topicId: number): void {
    if (!this.psychologistNames.has(topicId)) {
      this.requestService.getPsychologistByTopicId(topicId).subscribe({
        next: (psychologist: PsychologistDto) => {
          const fullName = `${psychologist.name} ${psychologist.lastName}`;
          this.psychologistNames.set(topicId, fullName);
        },
        error: (err) => {
          console.error(`Error fetching psychologist for topic ID ${topicId}:`, err);
        }
      });
    }

    const topic2 = this.topics1.find(t => t.id === this.selectedTopicId);
    if (topic2) {
      topic2.disabled = true; // Oznaka da je student prijavljen na topic
    }
  }

  getPsychologistFullName(topicId: number): string {
    const fullName = this.psychologistNames.get(topicId);
    if (!fullName) {
      this.loadPsychologistForTopic(topicId);
    }
    return fullName || '';

    
  }

  scrollLeft(): void {
    const fairsList = document.querySelector('.fairs-list');
    if (fairsList) {
        fairsList.scrollBy({
            left: -400, // Increased scroll distance for wider items
            behavior: 'smooth'
        });
    }
}

scrollRight(): void {
    const fairsList = document.querySelector('.fairs-list');
    if (fairsList) {
        fairsList.scrollBy({
            left: 400, // Increased scroll distance for wider items
            behavior: 'smooth'
        });
    }
}

openJoinForm(topic: TopicDetails): void {
  if (!this.joinedTopics.has(topic.id) && !topic.disabled) {
    this.showJoinForm = true;
    this.selectedTopicId = topic.id;
    this.selectedTopicName = topic.name;
  } else {
    this.snackBar.open('You have already joined this topic', 'Close', { duration: 3000 });
  }
}



submitApplication(): void {
  if (this.selectedTopicId) {
    this.applicationData.topicId = this.selectedTopicId;

    // Poziv backend API-ja za prijavu
    this.requestService.applyForTopic(this.applicationData).subscribe({
      next: (response) => {
        console.log('Application submitted successfully:', response);
        this.snackBar.open('Application submitted successfully', 'Close', { duration: 3000 });

        // Resetuj formu
        this.showJoinForm = false;
        this.applicationData = {
          studentId: 4,
          topicId: 0,
          name: '',
          surname: '',
          studyYear: '',
          email: ''
        };

        // Dodaj ID topica u `joinedTopics` set
        if (this.selectedTopicId) {
          this.joinedTopics.add(this.selectedTopicId);
        }

        this.selectedTopicId = null;
        this.selectedTopicName = '';

        // Ažuriraj liste sajmova
        this.loadFairs();
      },
      error: (error) => {
        console.error('Error submitting application:', error);
      }
    });
  }
}




updateTopicSpots(topicId: number): void {
  const topic = this.topics1.find(t => t.id === topicId);
  if (topic) {
    topic.availableSpots -= 1; // Smanji broj slobodnih mesta
    if (topic.availableSpots <= 0) {
      topic.disabled = true; // Disable tema ako nema više slobodnih mesta
    }
  }
}

}
