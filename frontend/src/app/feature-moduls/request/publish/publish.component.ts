import { Component } from '@angular/core';
import { RequestDetailDto } from 'src/app/model/RequestDetailDto.model';
import { TopicDetails } from 'src/app/model/TopicDetails.model';
import { RequestService } from '../request.service';
import { Router } from '@angular/router';
import { FacultyService } from '../../faculty/faculty.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Faculty } from 'src/app/model/Faculty.model';
import { ClassroomDateDto } from 'src/app/model/ClassroomDateDto.model';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { PsychologistDto } from 'src/app/model/PsychologistDto.model';

@Component({
  selector: 'app-publish',
  templateUrl: './publish.component.html',
  styleUrls: ['./publish.component.css']
})
export class PublishComponent {
  requests: RequestDetailDto[] = [];
  filteredUnpublishedRequests: RequestDetailDto[] = [];
  filteredPublishedRequests: RequestDetailDto[] = [];
  searchTerm: string = '';
  topics1: TopicDetails[] = [];
  psychologists: PsychologistDto[] = [];
  psychologistNames: Map<number, string> = new Map();

  constructor(
    private requestService: RequestService,
    private router: Router,
    private facultyService: FacultyService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadFairs();  // Call loadFairs on component initialization
  }

  loadFairs(): void {
    this.requestService.getAllRequestDetails().subscribe({
      next: (result: RequestDetailDto[]) => {
        this.requests = result.map(requestDetail => ({
          ...requestDetail,
          showDetails: false
        }));

        // Separate published and unpublished requests
        this.filteredUnpublishedRequests = this.requests.filter(request => !request.fair.isPublish);
        this.filteredPublishedRequests = this.requests.filter(request => request.fair.isPublish);
      },
      error: (err) => {
        console.error("Error fetching request details:", err);
      }
    });
  }

  // Search functionality
  filterRequests(): void {
    const term = this.searchTerm.toLowerCase();

    // Filter both unpublished and published lists based on the search term
    this.filteredUnpublishedRequests = this.requests.filter(request => 
      !request.fair.isPublish && request.request.name.toLowerCase().includes(term)
    );
    this.filteredPublishedRequests = this.requests.filter(request => 
      request.fair.isPublish && request.request.name.toLowerCase().includes(term)
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
      this.filteredUnpublishedRequests.sort(compareFn);
      this.filteredPublishedRequests.sort(compareFn);
    } else {
      this.filteredUnpublishedRequests.sort((a, b) => compareFn(b, a));
      this.filteredPublishedRequests.sort((a, b) => compareFn(b, a));
    }
  }

  updateFairPublishStatus(requestDetail: RequestDetailDto, publish: boolean) {
    requestDetail.fair.isPublish = publish;
    this.requestService.updateFairPublishStatus(requestDetail.fair.id || 0, publish).subscribe({
      next: () => {
        // Remove the fair from the current list and add it to the appropriate list based on its new publish status
        if (publish) {
          // Fair is published, move from unpublished to published
          this.filteredUnpublishedRequests = this.filteredUnpublishedRequests.filter(req => req.request.id !== requestDetail.request.id);
          this.filteredPublishedRequests.push(requestDetail);
        } else {
          // Fair is unpublished, move from published to unpublished
          this.filteredPublishedRequests = this.filteredPublishedRequests.filter(req => req.request.id !== requestDetail.request.id);
          this.filteredUnpublishedRequests.push(requestDetail);
        }
      },
      error: (err: any) => {
        console.error('Error updating fair publish status:', err);
      }
    });
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
            pdfUrl: '',
            
          }));

          requestDetail.showDetails = true;
          this.topics1 = requestDetail.topics;
          console.log("Topics:", this.topics1);

          this.topics1.forEach(topic => {
            if (topic.id) {
              this.getClassroomDate(topic);
              this.loadPsychologistForTopic(topic.id);
            } else {
              console.warn("Topic ID is undefined for topic:", topic);
            }
          });
        },
        error: (err) => {
          console.error("Error fetching topics with details:", err);
        }
      });
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

  dragging = false;

  onDragStart(event: DragEvent, requestDetail: RequestDetailDto) {
    event.dataTransfer?.setData('text/plain', JSON.stringify(requestDetail));
  }

  onDrop(event: DragEvent, publish: boolean) {
    event.preventDefault();
    const requestData = event.dataTransfer?.getData('text/plain');
    if (requestData) {
      const requestDetail: RequestDetailDto = JSON.parse(requestData);
      this.updateFairPublishStatus(requestDetail, publish);
    }
    this.dragging = false;
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();  // Necessary to allow a drop
    this.dragging = true;
  }
}
