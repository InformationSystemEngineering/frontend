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
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

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
  pdfUrl: SafeResourceUrl | null = null;
  showApplyButton: boolean = false;
  showOpenFileButton: boolean = true;

  constructor(
    private requestService: RequestService,
    private router: Router,
    private facultyService: FacultyService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private sanitizer: DomSanitizer
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
                    psychologists: topic.psychologists,
                    disabled: false,
                    facultyName: topic.facultyName,
                    requestName: topic.requestName,
                    pdfUrl: '',
                    showApplyButton: false, // Initialize for each topic
                    showOpenFileButton: true // Initialize for each topic
                }));
                requestDetail.showDetails = true; // Show details after fetching
                this.topics1 = requestDetail.topics;

                this.topics1.forEach(topic => {
                  if (topic.id) {
                      this.getClassroomDate(topic);
                      // this.openFilePicker(topic); // Setovanje datuma direktno u topic
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

openFilePicker(task: TopicDetails) {
  const inputElement: HTMLInputElement = document.createElement('input');
  inputElement.type = 'file';
  inputElement.accept = 'application/pdf'; 
  inputElement.addEventListener('change', (event) => this.handleFileSelected(event, task));
  inputElement.click();
  task.showOpenFileButton = false; // Postavi za trenutni topic
}

uploadPdf(topic: TopicDetails): void {
       window.alert('PDF successfully uploaded');
       topic.pdfUrl = '';
       topic.showApplyButton = true; // Postavi za trenutni topic
}


handleFileSelected(event: Event, task: any) {
  const inputElement = event.target as HTMLInputElement;
  const file = inputElement.files?.[0];
  if (file) {
    this.readPdf(file, task);
  }
}

readPdf(file: File, task: any) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const fileUrl = e.target?.result as string;
    task.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(fileUrl);
  };
  reader.readAsDataURL(file);
}

// uploadPdf(task: any): void {
//        window.alert('PDF successfully uploaded');
//        task.pdfUrl = null;
//        this.showApplyButton = true;

//  }

dataURLtoBlob(dataURL: any): Blob {
  const byteString = atob(dataURL.split(',')[1]);
  const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
}


}
