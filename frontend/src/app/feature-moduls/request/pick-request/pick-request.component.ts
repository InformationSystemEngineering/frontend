import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RequestDetailDto } from 'src/app/model/RequestDetailDto.model';
import { RequestService } from '../request.service';
import { Classroom } from 'src/app/model/Classroom.model';
import { CustomRequest } from 'src/app/model/Request.model';
import { TopicDetails } from 'src/app/model/TopicDetails.model';
import { MatDialog } from '@angular/material/dialog';
import { ChatComponent } from '../chat/chat.component';
import { Reservation } from 'src/app/model/Reservation.model';
import { ClassroomDateDto } from 'src/app/model/ClassroomDateDto.model';
import { catchError, map, Observable, of } from 'rxjs';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-pick-request',
  templateUrl: './pick-request.component.html',
  styleUrls: ['./pick-request.component.css']
})
export class PickRequestComponent implements OnInit{
  errorMessage: string;
  selectedPsychologistId: number | undefined;
  selectedTopicId!: number;
organizeFair(arg0: CustomRequest) {
throw new Error('Method not implemented.');
}
requestDetail: RequestDetailDto | undefined;
  newTopic: string = '';
  topics: string[] = [];
  currentStep: number = 1;
  selectedClassroom: Classroom | undefined;
  topicDuration: number | undefined;
  maxDuration: number = 0;
  suggestedTimes: {start: string, end: string}[] = [];
  showError: boolean = false;
  psychologists: any[] = [];
  topics1: TopicDetails[] = [];
  groupedTopics: Map<string, TopicDetails[]> = new Map(); // To store topics grouped by date
  classroomDates: Map<number, string> = new Map(); // Use a map to store classroom dates by topic ID
  searchQuery: string = '';
  filteredTopics: TopicDetails[] = [];
  stepDisabled: number | null = null;


  constructor(
    private route: ActivatedRoute,
    private requestService: RequestService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { { 
    this.errorMessage = ''; // Inicijalizacija u konstruktoru
  }}


  ngOnInit(): void {
    const requestId = Number(this.route.snapshot.paramMap.get('requestId'));
    if (requestId) {
      this.requestService.getRequestDetails(requestId).subscribe({
        next: (result: RequestDetailDto) => {
          this.requestDetail = result;
          console.log("Request Details: ", this.requestDetail);
        },
        error: (err: any) => {
          console.error("Error fetching request details:", err);
        }
      });
    }

    this.requestService.getAllPsychologists().subscribe({
      next: (psychologists: any[]) => {
        this.psychologists = psychologists;
      },
      error: (err: any) => {
        console.error("Error fetching psychologists:", err);
      }
    });

    this.requestService.getTopicsWithDetails(requestId).subscribe({
      next: (topics: any[]) => {
        this.topics1 = topics.map((topic) => ({
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
          requestName: topic.requestName
        }));
        this.filteredTopics = this.topics1; // Inicijalno popunjava filteredTopics sa svim topicima
        this.updateFilteredTopics(); // Pozovite metodu za ažuriranje

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

  updateFilteredTopics(): void {
    const searchLower = this.searchQuery.toLowerCase();
    
    this.filteredTopics = this.topics1.filter(topic => {
        const topicNameMatches = topic.name.toLowerCase().includes(searchLower);

        // Osigurajte se da je `topic.date` definisan i da je u formatu datuma
        const topicDate = topic.date ? new Date(topic.date).toDateString().toLowerCase() : '';
        const topicDateMatches = topicDate.includes(searchLower);

        return topicNameMatches || topicDateMatches;
    });
}



sortTopics(order: 'asc' | 'desc'): void {
    this.filteredTopics.sort((a, b) => {
        const dateA = new Date(a.date || '');
        const dateB = new Date(b.date || '');
        return order === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
    });
}


  nextStep(): void {
    if (this.currentStep === 1 && this.requestDetail) {
        this.requestService.getTopicsWithDetails(this.requestDetail.request.id || 0).subscribe({
            next: (topics: any[]) => {
                this.topics1 = topics.map((topic) => ({
                    id: topic.topicId,  // Dodeljuje redni ID počevši od 1
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
                    requestName: topic.requestName
                }));

                console.log("Topics with assigned IDs:", this.topics1);

                // Pozovi getClassroomDate za svaki topic i setuj datum
                this.topics1.forEach(topic => {
                    if (topic.id) {
                        this.getClassroomDate(topic); // Setovanje datuma direktno u topic
                    } else {
                        console.warn("Topic ID is undefined for topic:", topic);
                    }
                });

                this.currentStep++;
            },
            error: (err) => {
                console.error("Error fetching topics with details:", err);
            }
        });
    }
    // this.groupedTopics = this.getGroupedTopicsByDate(this.topics1);
      this.disableStep(this.currentStep); // Disable the current step
      this.currentStep++; // Move to the next step

}


  

openChat(topicId: number, psychologistId: number): void {
  const dialogRef = this.dialog.open(ChatComponent, {
    width: '400px',
    data: {
      selectedTopicId: topicId,
      selectedPsychologistId: psychologistId
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log('Chat dialog was closed');
    // Ako je potrebno, osvežite ili ažurirajte podatke
  });
}

  addTopic(): void {
    if (this.newTopic && this.requestDetail && this.requestDetail.request.id !== undefined) {
        if (this.topicDuration && this.topicDuration <= this.maxDuration) {
            const requestId = this.requestDetail.request.id;
            const duration = this.topicDuration; // Trajanje koje će biti prosleđeno

            // Poziv servisa za dodavanje teme
            this.requestService.addTopic(requestId, this.newTopic, duration).subscribe({
                next: (topic) => {
                    this.topics.push(this.newTopic); // Dodaj novi topic u lokalni niz

                    this.calculateSuggestedTimes();
                    
                    // Oduzimanje trajanja novog topica od maxDuration
                    this.maxDuration -= this.topicDuration || 0;
                    
                    // Resetuje input polja
                    // this.newTopic = ''; 
                    // this.topicDuration = undefined;

                    console.log("Topic added successfully:", topic);

                },
                error: (error) => {
                    console.error("Error adding topic:", error);
                }
            });
        } else {
            this.showError = true; // Prikazuje poruku o grešci ako je trajanje veće od maksimalnog
            this.suggestedTimes = []; // Resetuje predložena vremena
            this.errorMessage = 'Duration exceeds available time in the classroom.';
        }
    } else {
        console.error("Request ID is undefined or topic name is empty.");
    }
}


selectClassroom(classroom: Classroom): void {
  if (!classroom.disabled) { // Proveri da li je učionica onemogućena
      this.selectedClassroom = classroom;
      const startTime = new Date(`1970-01-01T${classroom.startTime}`);
      const endTime = new Date(`1970-01-01T${classroom.endTime}`);
      this.maxDuration = (endTime.getTime() - startTime.getTime()) / 60000; // Max duration in minutes
      this.suggestedTimes = [];
      this.showError = false;
  }
}


  calculateSuggestedTimes(): void {
    this.suggestedTimes = [];
    if (this.selectedClassroom && this.topicDuration && this.topicDuration <= this.maxDuration) {
        const startTime = new Date(`1970-01-01T${this.selectedClassroom.startTime}`);
        const endTime = new Date(`1970-01-01T${this.selectedClassroom.endTime}`);
        const maxIterations = this.maxDuration - this.topicDuration;
        
        console.log("Calculating suggested times...");
        console.log(`Start Time: ${startTime}`);
        console.log(`End Time: ${endTime}`);
        console.log(`Max Duration: ${this.maxDuration} minutes`);
        console.log(`Topic Duration: ${this.topicDuration} minutes`);
        console.log(`Max Iterations: ${maxIterations}`);
        
        for (let i = 0; i <= maxIterations; i += 30) {
            const start = new Date(startTime.getTime() + i * 60000);
            const end = new Date(start.getTime() + this.topicDuration * 60000);
            console.log(`Checking time slot from ${start.toTimeString().substring(0, 5)} to ${end.toTimeString().substring(0, 5)}`);
            
            if (end <= endTime) {
                this.suggestedTimes.push({
                    start: start.toTimeString().substring(0, 5),
                    end: end.toTimeString().substring(0, 5)
                });
            }
        }

        if (this.suggestedTimes.length === 0) {
            console.log("No suggested times available.");
        }

        this.showError = false;
    } else {
        this.showError = true;
        console.log("Error: Topic duration exceeds available time or invalid input.");
    }
}

setTopic(time: { start: string, end: string }): void {
  if (this.selectedClassroom && this.selectedClassroom.id !== undefined) {
      const reservationData = {
          startTime: time.start,
          endTime: time.end,
          classroomId: this.selectedClassroom.id
      };

      // Poziv servisa za kreiranje rezervacije
      this.requestService.createReservation(reservationData).subscribe({
          next: (reservation) => {
              console.log(`Reservation created with ID: ${reservation.id} for topic: ${this.newTopic} from ${time.start} to ${time.end}`);
              
              // Nakon što je rezervacija kreirana, ažuriraj temu s ID-em rezervacije
              this.requestService.updateTopicWithReservation(this.newTopic, reservation.id || 0).subscribe({
                  next: (updatedTopic) => {
                      console.log("Topic updated successfully with reservation ID:", updatedTopic);
                      this.reloadTopics(); // Ponovo učitavanje tema nakon uspešnog ažuriranja
                  },
                  error: (error) => {
                      console.error("Error updating topic with reservation ID:", error);
                  }
              });

              this.newTopic = ''; 
              this.topicDuration = undefined;

              if (this.maxDuration < 30) {
                if (this.selectedClassroom) {
                    this.selectedClassroom.disabled = true;
                }
                this.selectedClassroom = undefined;
                this.showError = true;
                this.errorMessage = 'No more topics can be organized in this classroom.';
            } else {
                this.calculateSuggestedTimes();
            }
          },
          error: (error) => {
              console.error("Error creating reservation:", error);
          }
      });

      this.showError = false;
  } else {
      this.showError = true;
      this.errorMessage = 'Duration exceeds available time in the classroom.';
  }
}

reloadTopics(): void {
  const requestId = this.requestDetail?.request.id || 0;
  this.requestService.getTopicsWithDetails(requestId).subscribe({
    next: (topics: any[]) => {
      this.topics1 = topics.map((topic) => ({
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
        disabled: false,
        facultyName: topic.facultyName,
        requestName: topic.requestName
      }));
      this.filteredTopics = this.topics1; // Ažuriranje prikaza filtriranih tema
      this.updateFilteredTopics(); // Osvežavanje filtrirane liste tema
      console.log("Topics reloaded successfully:", this.topics1);

      this.topics1.forEach(topic => {
        if (topic.id) {
            this.getClassroomDate(topic); // Setovanje datuma direktno u topic
        } else {
            console.warn("Topic ID is undefined for topic:", topic);
        }
    });

  
    },
    error: (err) => {
      console.error("Error reloading topics:", err);
    }
  });
}



  getUniqueDates(classrooms: Classroom[]): Date[] {
    const dates = classrooms.map(classroom => classroom.date);
    return Array.from(new Set(dates));
  }

  getClassroomsByDate(classrooms: Classroom[], date: Date): Classroom[] {
    return classrooms.filter(classroom => classroom.date === date);
  }



  getUniqueDatesFromTopics(topics: TopicDetails[]): Date[] {
    const dates = topics.map(topic => {
        const dateString = topic.startTime.split('T')[0]; // Extracting the date part
        return new Date(dateString);
    });
    return Array.from(new Set(dates));
}

getTopicsByDate(topics: TopicDetails[], date: Date): TopicDetails[] {
    return topics.filter(topic => {
        const topicDate = new Date(topic.startTime.split('T')[0]); // Extracting the date part
        return topicDate.getTime() === date.getTime();
    });
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

getGroupedTopicsByDate(topics: TopicDetails[]): Map<string, TopicDetails[]> {
  const groupedTopics = new Map<string, TopicDetails[]>();
  topics.forEach(topic => {
      const date = new Date(topic.startTime).toDateString(); // Extract date in a simple format
      if (!groupedTopics.has(date)) {
          groupedTopics.set(date, []);
      }
      groupedTopics.get(date)?.push(topic);
  });
  return groupedTopics;
}

goToStep(step: number): void {
  if (this.stepDisabled !== step) {
    this.currentStep = step;
  }
}

disableStep(step: number): void {
  this.stepDisabled = step;
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
          
          // Remove the assigned topic from the filteredTopics list immediately
          this.filteredTopics = this.filteredTopics.filter(topic => topic.id !== topicId);
          
          // Log message to confirm removal
          console.log(`Topic with ID ${topicId} has been removed from the list.`);
          this.removePsychologistFromConflictingTopics(topicName, psychologistId);
        },
        error: (error) => {
          console.error("Error assigning psychologist:", error);
        }
      });
    }
  });
}
removePsychologistFromConflictingTopics(topicName: string, psychologistId: number): void {
  const updatedTopic = this.topics1.find(topic => topic.name === topicName);
  if (updatedTopic) {
    const topicDate = new Date(updatedTopic.startTime).toDateString();
    const topicStartTime = new Date(updatedTopic.startTime).getTime();
    const topicEndTime = new Date(updatedTopic.endTime).getTime();

    this.filteredTopics.forEach(topic => {
      const otherDate = new Date(topic.startTime).toDateString();
      const otherStartTime = new Date(topic.startTime).getTime();
      const otherEndTime = new Date(topic.endTime).getTime();

      const isOverlapping = (topicDate === otherDate) &&
        ((topicStartTime >= otherStartTime && topicStartTime < otherEndTime) ||
         (topicEndTime > otherStartTime && topicEndTime <= otherEndTime) ||
         (topicStartTime <= otherStartTime && topicEndTime >= otherEndTime));

      if (isOverlapping) {
        // topic.psychologists = topic.psychologists.filter((psych) => psych.id !== psychologistId);
      }
    });
  }
}

}
