import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FacultyService } from '../faculty.service';
import { FairService } from '../../fair/fair.service';
import { Faculty } from 'src/app/model/Faculty.model';
import { Fair } from 'src/app/model/Fair.model';

@Component({
  selector: 'app-send-request',
  templateUrl: './send-request.component.html',
  styleUrls: ['./send-request.component.css']
})
export class SendRequestComponent implements OnInit {
  facultyId: number | undefined;
  selectedFaculty: Faculty | undefined;
  eventForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private facultyService: FacultyService,
    private fairService: FairService,
    private fb: FormBuilder
  ) {
    this.eventForm = this.fb.group({
      name: ['', Validators.required],
      selectedDate: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.facultyId = +params.get('facultyId')!;
      this.loadFaculty();
    });
  }

  loadFaculty(): void {
    if (this.facultyId) {
      this.facultyService.getFacultyById(this.facultyId).subscribe({
        next: (faculty: Faculty) => {
          this.selectedFaculty = faculty;
        },
        error: (error) => {
          console.error('Error loading faculty:', error);
        }
      });
    }
  }

  createFair(): void {
    if (!this.eventForm.valid) {
      return;
    }

    const fair: Fair = {
      name: this.eventForm.value.name,
      description: this.eventForm.value.description,
      startTime: this.eventForm.value.startTime,
      endTime: this.eventForm.value.endTime,
      date: this.eventForm.value.selectedDate,
      facultyId: this.selectedFaculty?.id,
      publish: false,
    };

    this.fairService.createFair(fair).subscribe({
      next: () => {
        console.log("Fair created successfully");
      },
      error: (error) => {
        console.error("Error creating fair:", error);
      },
      complete: () => {
        console.log("Fair creation request completed.");
      }
    });
  }
}
