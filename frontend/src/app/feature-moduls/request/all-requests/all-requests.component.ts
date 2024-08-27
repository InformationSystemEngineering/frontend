import { Component, OnInit } from '@angular/core';
import { RequestDetailDto } from 'src/app/model/RequestDetailDto.model';
import { RequestService } from '../request.service';
import { FacultyService } from '../../faculty/faculty.service';
import { Router } from '@angular/router';
import { CustomRequest } from 'src/app/model/Request.model';
import { Classroom } from 'src/app/model/Classroom.model';
import { Time } from '@angular/common';
import { Faculty } from 'src/app/model/Faculty.model';

@Component({
  selector: 'app-all-requests',
  templateUrl: './all-requests.component.html',
  styleUrls: ['./all-requests.component.css']
})
export class AllRequestsComponent implements OnInit{
  requests: RequestDetailDto[] = [];
  filteredRequests: RequestDetailDto[] = [];
  searchTerm: string = '';

  constructor(
    private requestService: RequestService,
    private router: Router,
    private facultyService: FacultyService
  ) { }

  ngOnInit(): void {
    this.requestService.getAllRequestDetails().subscribe({
      next: (result: RequestDetailDto[]) => {
        this.requests = result;
        this.filteredRequests = this.requests; // Inicijalizujte filteredRequests

        console.log("PRIKAZI SVE", this.requests);

        this.requests.forEach(requestDetail => {
          if (!requestDetail.faculty) {
            requestDetail.faculty = {} as Faculty;
          }

          if (requestDetail.request.facultyId) {
            console.log(requestDetail.request.facultyId);
            this.facultyService.getFacultyById(requestDetail.request.facultyId).subscribe(faculty => {
                requestDetail.faculty.name = faculty.name;
                requestDetail.faculty.photo = faculty.photo;
            });
          }
        });

        console.log(this.requests);
      },
      error: (err) => {
        console.error("Error fetching request details:", err);
      }
    });
}



  selectedRequest(request: CustomRequest): void {
    this.router.navigate(['/pick_request', request.id]);
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
      if (order === 'asc') {
        return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
      } else {
        return nameA > nameB ? -1 : nameA < nameB ? 1 : 0;
      }
    });
  }

  getUniqueDates(classrooms: Classroom[]): Date[] {
    const dates = classrooms.map(classroom => classroom.date);
    return Array.from(new Set(dates)); // Vrati jedinstvene datume
}

getClassroomsByDate(classrooms: Classroom[], date: Date): Classroom[] {
    return classrooms.filter(classroom => classroom.date === date);
}


}
