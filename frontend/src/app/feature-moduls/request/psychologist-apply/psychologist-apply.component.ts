import { Component } from '@angular/core';
import { RequestDetailDto } from 'src/app/model/RequestDetailDto.model';
import { RequestService } from '../request.service';
import { FacultyService } from '../../faculty/faculty.service';
import { Router } from '@angular/router';
import { Faculty } from 'src/app/model/Faculty.model';
import { CustomRequest } from 'src/app/model/Request.model';
import { Classroom } from 'src/app/model/Classroom.model';
import { TopicDetails } from 'src/app/model/TopicDetails.model';
import { ClassroomDateDto } from 'src/app/model/ClassroomDateDto.model';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-psychologist-apply',
  templateUrl: './psychologist-apply.component.html',
  styleUrls: ['./psychologist-apply.component.css']
})
export class PsychologistApplyComponent {
  requests: RequestDetailDto[] = [];
  filteredRequests: RequestDetailDto[] = [];
  searchTerm: string = '';
  topics1: TopicDetails[] = [];

  constructor(
    private requestService: RequestService,
    private router: Router,
    private facultyService: FacultyService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.requestService.getAllRequestDetails().subscribe({
      next: (result: RequestDetailDto[]) => {
        this.requests = result.map(requestDetail => ({
          ...requestDetail,
          showDetails: false // Initialize the dropdown state for each request
        }));
        this.filteredRequests = this.requests;

        this.requests.forEach(requestDetail => {
          if (!requestDetail.faculty) {
            requestDetail.faculty = {} as Faculty;
          }

          if (requestDetail.request.facultyId) {
            this.facultyService.getFacultyById(requestDetail.request.facultyId).subscribe(faculty => {
              requestDetail.faculty.name = faculty.name;
            });
          }
        });
      },
      error: (err) => {
        console.error("Error fetching request details:", err);
      }
    });
  }

  filterRequests(): void {
    this.filteredRequests = this.requests.filter(request =>
      request.request.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  sortRequests(order: 'asc' | 'desc'): void {
    this.filteredRequests.sort((a, b) => {
      const nameA = a.request.name.toLowerCase();
      const nameB = b.request.name.toLowerCase();
      return order === 'asc' ? (nameA < nameB ? -1 : 1) : (nameA > nameB ? -1 : 1);
    });
  }

  toggleDetails(requestDetail: RequestDetailDto): void {
    if (requestDetail.showDetails) {
        requestDetail.showDetails = false; // Hide details if already shown
    } else {
        const requestId = requestDetail.request.id;
        this.requestService.getTopicsWithDetailsNoPsychologist(requestId || 0).subscribe({
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
                    psychologists: topic.psychologists
                }));
                requestDetail.showDetails = true; // Show details after fetching
                this.topics1 = requestDetail.topics;

                this.topics1.forEach(topic => {
                  if (topic.id) {
                      this.getClassroomDate(topic); // Setovanje datuma direktno u topic
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

getClassroomDate(topic: TopicDetails): void {
  if (topic.id) {
      this.requestService.getClassroomDateByTopicId(topic.id).subscribe({
          next: (classroomDateDto: ClassroomDateDto) => {
              topic.date = new Date(classroomDateDto.date); // Postavi datum direktno u topic
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


confirmPsychologist(topicId: number, psychologistId: number, topicName: string, psychologistName: string): void {
  const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
    width: '400px',
    data: {
      message: `Do you want to assign psychologist ${psychologistName} to topic ${topicName}?`,
      yesButtonText: 'Yes',
      noButtonText: 'No'
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result === true) {
      // Call the backend API to update the topic with the psychologist
      this.requestService.updateTopicWithPsychologist(topicName, 2).subscribe({
        next: (response) => {
          console.log("Psychologist assigned successfully:", response);

          this.snackBar.open(`Successfully sent invitation to ${topicName}`, 'Close', {
            duration: 3000
          });

          // Find the request detail that contains this topic
          this.filteredRequests.forEach(requestDetail => {
            if (requestDetail.topics) {
              // Remove the assigned topic from the requestDetail.topics list immediately
              requestDetail.topics = requestDetail.topics.filter(topic => topic.id !== topicId);
            }
          });
          
          // Log message to confirm removal
          console.log(`Topic with ID ${topicId} has been removed from the list.`);
        },
        error: (error) => {
          console.error("Error assigning psychologist:", error);
        }
      });
    }
  });
}

}
