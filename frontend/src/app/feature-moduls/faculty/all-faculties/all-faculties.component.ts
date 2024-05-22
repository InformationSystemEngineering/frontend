import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FacultyService } from '../faculty.service';
import { FairService } from '../../fair/fair.service';
import { Faculty } from 'src/app/model/Faculty.model';
import { Fair } from 'src/app/model/Fair.model';

@Component({
  selector: 'app-all-faculties',
  templateUrl: './all-faculties.component.html',
  styleUrls: ['./all-faculties.component.css']
})
export class AllFacultiesComponent implements OnInit {
  faculties: Faculty[] = [];
  renderselectFaculty: boolean = false;
  selectedFaculty: Faculty | undefined;
  eventForm: FormGroup; // Declare eventForm property

  constructor(private facultyService: FacultyService, private fairService: FairService, private fb: FormBuilder) {
    // Create form in constructor
    this.eventForm = this.fb.group({
      name: [''],
      selectedDate: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.facultyService.getAllFaculties().subscribe({
      next: (result: Faculty[]) => {
        this.faculties = result;
        console.log(this.faculties);
        console.log("DONE WITH THIS")
      },
    });
  }

  selectedCompany(faculty: Faculty): void {
    this.renderselectFaculty = true;
    this.selectedFaculty = faculty;
  }

  createFair(): void {
    this.renderselectFaculty = false;
    const fair: Fair = {
      name: this.eventForm.value.name || '',
      description: this.eventForm.value.description || '',
      startTime: this.eventForm.value.startTime || '',
      endTime: this.eventForm.value.endTime || '',
      date: this.eventForm.value.selectedDate || '' ,
      facultyId: this.selectedFaculty?.id,
      publish: false,
    };
   
    if (!this.eventForm.valid) {
      return;
    }

    this.fairService.createFair(fair).subscribe({
      next: () => {
        console.log("JEL DODJES?");
        console.log(fair);
      },
      error: (error) => {
        console.error("Greška prilikom kreiranja sajma:", error);
      },
      complete: () => {
        console.log("Pretplata na kreiranje sajma je završena.");
      }
    });
    
  }
}
