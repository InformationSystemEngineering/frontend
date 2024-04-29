import { Component, OnInit } from '@angular/core';
import { Faculty } from '../../model/Faculty.model';
import { FacultyService } from '../faculty.service';

@Component({
  selector: 'app-all-faculties',
  templateUrl: './all-faculties.component.html',
  styleUrls: ['./all-faculties.component.css']
})
export class AllFacultiesComponent implements OnInit {
  faculties: Faculty[] = [];

  constructor(private facultyService: FacultyService) {}

  ngOnInit(): void {
    this.facultyService.getAllFaculties().subscribe({
      next: (result: Faculty[]) => {
        this.faculties = result;
        console.log(this.faculties);
        console.log("DONE WITH THIS")
      },
    });
  }
}
