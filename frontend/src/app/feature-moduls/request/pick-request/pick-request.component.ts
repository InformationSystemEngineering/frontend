import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RequestDetailDto } from 'src/app/model/RequestDetailDto.model';
import { RequestService } from '../request.service';
import { Classroom } from 'src/app/model/Classroom.model';
import { CustomRequest } from 'src/app/model/Request.model';

@Component({
  selector: 'app-pick-request',
  templateUrl: './pick-request.component.html',
  styleUrls: ['./pick-request.component.css']
})
export class PickRequestComponent implements OnInit{
  errorMessage: string;
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

  constructor(
    private route: ActivatedRoute,
    private requestService: RequestService
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


                    // Proveri da li je preostalo vreme manje od 30 minuta ili 0
                    //OVO CE ICI TEK TAMO ISPOD 
                    // if (this.maxDuration < 30) {
                    //     if (this.selectedClassroom) {
                    //         this.selectedClassroom.disabled = true; // Označi učionicu kao onemogućenu
                    //     }
                    //     this.selectedClassroom = undefined;
                    //     this.showError = true;
                    //     this.errorMessage = 'No more topics can be organized in this classroom.';
                    //  }
                    //  else {
                    //     console.log("USLA SAMMMM");
                    //     this.calculateSuggestedTimes(); // Prikazivanje predloženih vremena
                        
                    // }
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
            classroomId: this.selectedClassroom.id  // Prilagođavanje formata
        };

        // Poziv servisa za kreiranje rezervacije
        this.requestService.createReservation(reservationData).subscribe({
            next: (reservation) => {
                console.log(`Reservation created for topic: ${this.newTopic} from ${time.start} to ${time.end}`);
                
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





  

  nextStep(): void {
    if (this.topics.length > 0) {
      this.currentStep++;
    }
  }

  getUniqueDates(classrooms: Classroom[]): Date[] {
    const dates = classrooms.map(classroom => classroom.date);
    return Array.from(new Set(dates));
  }

  getClassroomsByDate(classrooms: Classroom[], date: Date): Classroom[] {
    return classrooms.filter(classroom => classroom.date === date);
  }

  
}
