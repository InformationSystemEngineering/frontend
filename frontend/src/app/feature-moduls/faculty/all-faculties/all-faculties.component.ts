import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FacultyService } from '../faculty.service';
import { Faculty } from 'src/app/model/Faculty.model';

@Component({
  selector: 'app-all-faculties',
  templateUrl: './all-faculties.component.html',
  styleUrls: ['./all-faculties.component.css']
})
export class AllFacultiesComponent implements OnInit {
  faculties: Faculty[] = [];
  filteredFaculties: Faculty[] = [];
  searchTerm: string = '';

  constructor(
    private facultyService: FacultyService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.facultyService.getAllFaculties().subscribe({
      next: (result: Faculty[]) => {
        this.faculties = result;
        this.filteredFaculties = result;
        console.log(this.faculties);
      },
    });
  }

  selectedCompany(faculty: Faculty): void {
    this.router.navigate(['/send_request', faculty.id]);
  }

  filterFaculties(): void {
    this.filteredFaculties = this.faculties.filter(faculty =>
      faculty.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  sortFaculties(order: 'asc' | 'desc'): void {
    this.filteredFaculties.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      if (order === 'asc') {
        return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
      } else {
        return nameA > nameB ? -1 : nameA < nameB ? 1 : 0;
      }
    });
  }
}
