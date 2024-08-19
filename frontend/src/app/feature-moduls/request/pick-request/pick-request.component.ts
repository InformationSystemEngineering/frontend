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
organizeFair(arg0: CustomRequest) {
throw new Error('Method not implemented.');
}
requestDetail: RequestDetailDto | undefined;
  newTopic: string = '';
  topics: string[] = [];
  currentStep: number = 1;

  constructor(
    private route: ActivatedRoute,
    private requestService: RequestService
  ) { }

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
      const requestId = this.requestDetail.request.id;
      this.requestService.addTopic(requestId, this.newTopic).subscribe({
        next: (topic) => {
          this.topics.push(this.newTopic); // Dodaj novi topic u lokalni niz
          this.newTopic = ''; // Resetuje input polje
          console.log("Topic added successfully:", topic);
        },
        error: (error) => {
          console.error("Error adding topic:", error);
        }
      });
    } else {
      console.error("Request ID is undefined or topic name is empty.");
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
