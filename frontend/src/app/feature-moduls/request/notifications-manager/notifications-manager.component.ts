import { ChangeDetectorRef, Component } from '@angular/core';
import { RequestService } from '../request.service';
import { PsychologistWithTopicsDto } from 'src/app/model/PsychologistWithTopicsDto.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TopicDetails } from 'src/app/model/TopicDetails.model';
import { ClassroomDateDto } from 'src/app/model/ClassroomDateDto.model';
import { RequestDetailDto } from 'src/app/model/RequestDetailDto.model';
import { PsychologistDto } from 'src/app/model/PsychologistDto.model';

@Component({
  selector: 'app-notifications-manager',
  templateUrl: './notifications-manager.component.html',
  styleUrls: ['./notifications-manager.component.css']
})
export class NotificationsManagerComponent {
  requests: RequestDetailDto[] = [];
  filteredRequests: RequestDetailDto[] = [];
  psychologists: PsychologistWithTopicsDto[] = [];
  filteredPsychologists: PsychologistWithTopicsDto[] = [];
  searchTerm: string = '';
  psychologistNames: Map<number, string> = new Map();
  acceptedTopics: { startTime: string; endTime: string; date: string }[] = [];
  showDeletedTopic: boolean = true;

  constructor(
    private requestService: RequestService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadRequests();  // Load all requests on component initialization
  }

  loadRequests(): void {
    this.requestService.getAllRequestDetails().subscribe({
        next: (result: RequestDetailDto[]) => {
            this.requests = result.map(requestDetail => ({
                ...requestDetail,
                topics: requestDetail.topics || [],  // Initialize topics as an empty array if not defined
                showDetails: true  // Set to true to always show details initially
            }));

            this.filteredRequests = [...this.requests];  // Initialize filtered list
            console.log("Loaded Requests with Topics:", this.requests); // Debugging log

            // Additional logic to fetch topics
            this.requests.forEach(requestDetail => {
                const requestId = requestDetail.request.id;

                // Fetch topics for this request
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
                            pdfUrl: '',
                        }));

                        console.log(`Topics loaded for request ID ${requestId}:`, requestDetail.topics);

                        requestDetail.topics.forEach(topic => {
                            if (topic.id) {
                                this.getClassroomDate(topic);  // Set date for each topic
                                this.loadPsychologistForTopic(topic.id);  // Load psychologist name for each topic
                            } else {
                                console.warn("Topic ID is undefined for topic:", topic);
                            }
                        });
                    },
                    error: (err) => {
                        console.error(`Error fetching topics for request ID ${requestId}:`, err);
                    }
                });
            });
        },
        error: (err) => {
            console.error("Error fetching request details:", err);
        }
    });
}

  

  // Search functionality
  filterRequests(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredRequests = this.requests.filter(request => 
      request.request.name.toLowerCase().includes(term)
    );
  }

  // Sort functionality
  sortRequests(order: 'asc' | 'desc'): void {
    const compareFn = (a: RequestDetailDto, b: RequestDetailDto) => {
      const nameA = a.request.name.toLowerCase();
      const nameB = b.request.name.toLowerCase();
      return nameA.localeCompare(nameB);
    };

    if (order === 'asc') {
      this.filteredRequests.sort(compareFn);
    } else {
      this.filteredRequests.sort((a, b) => compareFn(b, a));
    }
  }

  acceptTopic(topic: TopicDetails): void {
    console.log(`Accepted topic: ${topic.name}`);
    this.snackBar.open(`Successfully accepted topic: ${topic.name}`, 'Close', {
        duration: 3000,
        verticalPosition: 'bottom',
        horizontalPosition: 'center',
    });

    
    topic.disabled = true;  // Directly disable the accepted topic
        
}



disableConflictingTopics(acceptedTopic: TopicDetails): void {
  console.log('Checking for conflicting topics with:', acceptedTopic.name);

  this.requests.forEach(requestDetail => {
      (requestDetail.topics ?? []).forEach(topic => {
          if (topic.date && acceptedTopic.date) {
              // if (topic.psychologistId === acceptedTopic.psychologistId) {
                  const acceptedDate = acceptedTopic.date.toISOString().split('T')[0];
                  const topicDate = topic.date.toISOString().split('T')[0];

                  // if (acceptedDate === topicDate) {
                      const acceptedStartTime = `${acceptedDate}T${acceptedTopic.startTime}`;
                      const acceptedEndTime = `${acceptedDate}T${acceptedTopic.endTime}`;
                      const topicStartTime = `${topicDate}T${topic.startTime}`;
                      const topicEndTime = `${topicDate}T${topic.endTime}`;

                      const acceptedStart = new Date(acceptedStartTime);
                      const acceptedEnd = new Date(acceptedEndTime);
                      const start = new Date(topicStartTime);
                      const end = new Date(topicEndTime);

                      console.log(`Comparing ${topic.name}: ${start} - ${end} with accepted: ${acceptedStart} - ${acceptedEnd}`);

                      // if ((start < acceptedEnd && start >= acceptedStart) ||
                          // (end > acceptedStart && end <= acceptedEnd)) {
                          topic.disabled = true; // Disable conflicting topic
                          console.log(`Disabling conflicting topic: ${topic.name}`);
                      // }
                  // }
              // }
          }
      });
  });

  // Optional: Force UI update to reflect changes
  this.cdr.detectChanges();
}




  declineTopic(topic: TopicDetails): void {
    console.log(`Declined topic: ${topic.name}`);
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
  }

  getPsychologistFullName(topicId: number): string {
    const fullName = this.psychologistNames.get(topicId);
    if (!fullName) {
      this.loadPsychologistForTopic(topicId);
    }
    return fullName || '';
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
  }

  deleteTopic(requestDetail: RequestDetailDto, topic: TopicDetails): void {
    // Check if topics is defined and contains the topic
    if (requestDetail.topics && requestDetail.topics.includes(topic)) {
        const index = requestDetail.topics.indexOf(topic);
        if (index > -1) {
            requestDetail.topics.splice(index, 1);  // Remove the topic from the array
            this.snackBar.open('Topic deleted successfully', 'Close', {
                duration: 3000,
                verticalPosition: 'bottom',
                horizontalPosition: 'center',
            });
            this.cdr.detectChanges();  // Update the view
        }
    } else {
        console.warn('Topics are undefined or the topic does not exist.');
    }

    this.showDeletedTopic = false;
}

}