import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FacultyService } from '../faculty.service';
import { FairService } from '../../fair/fair.service';
import { Faculty } from 'src/app/model/Faculty.model';
import { CustomRequest } from 'src/app/model/Request.model';
import { Status } from 'src/app/model/Request.model';
import { RequestService } from '../../request/request.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-send-request',
  templateUrl: './send-request.component.html',
  styleUrls: ['./send-request.component.css']
})
export class SendRequestComponent implements OnInit {
  facultyId: number | undefined;
  selectedFaculty: Faculty | undefined;
  eventForm: FormGroup;
  today: string;

  constructor(
    private route: ActivatedRoute,
    private facultyService: FacultyService,
    private fairService: FairService,
    private requestService: RequestService,
    private fb: FormBuilder,
    private router: Router
  ) {

    const today = new Date();
    this.today = today.toISOString().split('T')[0];

    this.eventForm = this.fb.group({
      name: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      description: [''],
      status: ['']
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

  updateEndDateMin(): void {
    const startDate = this.eventForm.value.startDate;
    if (startDate) {
      this.eventForm.get('endDate')?.setValue(null); // Resetuj endDate kada startDate promeni vrednost
    }
  }

  createRequest(): void {
    if (!this.eventForm.valid) {
      return;
    }

    const request: CustomRequest = {
      name: this.eventForm.value.name,
      startDate: new Date(this.eventForm.value.startDate), // Pretpostavlja se da je this.eventForm.value.startDate string
      endDate: new Date(this.eventForm.value.endDate),
      facultyId: this.selectedFaculty?.id,
      description: this.eventForm.value.description, // Pretpostavlja se da postoji opis u formi
      status: Status.PENDING,
      userId: 3,
      email: 'katarina.medic01@gmail.com'
    };
    

    this.requestService.createRequest(request).subscribe({
      next: () => {
        console.log("Request created successfully");
        this.router.navigate(['/all_requests']);
      },
      error: (error) => {
        console.error("Error creating request:", error);
      },
      complete: () => {
        console.log("Request creation request completed.");
      }
    });
  }
}
